const scrapUser = require('./scrapUser')
const request = require('request-promise-native')
const queryid = require('../queryids').profile

// "https://www.instagram.com/graphql/query/?query_id=...&variables={"tag_name":"break2191k","first":8,"after":"J0HWiZv5gAAAF0HWiTOnwAAAFiYA"}"

/**
 * @typedef {Object} Post
 * @property {string} postid
 * @property {string} image
 * @property {number} likes
 * @property {number} comments
 * @property {string} caption
 * @property {boolean} isVideo
 * @property {string} ownerId
 * @property {string} shortcode
 * @property {number} timestamp
 * @property {number} views
 *
 * @param {string} userid Instagram user id.
 * @param {string} cursor Last cursor to scrape from.
 * @returns {Post}
 */
const scrap = async (userid, cursor) => {
  const data = {
    id: userid,
    first: 100
  }

  if (cursor) {
    data.after = cursor
  }

  const dataString = JSON.stringify(data)

  const url = `https://www.instagram.com/graphql/query/?query_id=${queryid}&variables=${encodeURIComponent(dataString)}`

  const result = await request({
    url,
    json: true
  })

  const pageInfo = result.data.user.edge_owner_to_timeline_media.page_info

  const posts = result.data.user.edge_owner_to_timeline_media.edges.map(item => {
    return {
      postid: item.node.id,
      image: item.node.display_url,
      likes: item.node.edge_media_preview_like.count,
      comments: item.node.edge_media_to_comment.count,
      caption: item.node.edge_media_to_caption.edges.length
        ? item.node.edge_media_to_caption.edges[0].node.text
        : '',
      isVideo: item.node.is_video,
      ownerId: item.node.owner.id,
      shortcode: item.node.shortcode,
      timestamp: item.node.taken_at_timestamp,
      views: item.node.video_view_count || 0
    }
  })

  return {
    pageInfo,
    posts
  }
}

/**
 * @param {string} username Instagram username.
 * @param {number} max Maximum number of posts to pull
 * @returns {Post[]}
 */
module.exports = async (username, max = 1000) => {
  let stop = false
  let cursor

  const posts = []

  const user = await scrapUser(username)

  do {
    const result = await scrap(user.id, cursor)

    posts.push(...result.posts)

    if ((max && posts.length >= max) || !result.pageInfo.has_next_page) {
      stop = true
    }

    cursor = result.pageInfo.end_cursor
  } while (!stop)

  return posts
}

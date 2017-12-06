const request = require('request-promise-native')
const queryid = require('../queryids').tags

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
 * @param {string} link Instagram post URL to scrape the data.
 * @param {string} cursor Last cursor to scrape from.
 * @returns {Post}
 */
const scrap = async (tag, cursor) => {
  const data = {
    tag_name: tag,
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

  const pageInfo = result.data.hashtag.edge_hashtag_to_media.page_info

  const uniqueid = {}

  const posts = result.data.hashtag.edge_hashtag_to_media.edges.map(item => {
    uniqueid[item.node.id] = item
    return {
      postid: item.node.id,
      image: item.node.display_url,
      likes: item.node.edge_liked_by.count,
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
 * @param {string} tag
 * @param {number} max
 * @returns {Post[]}
 */
module.exports = async (tag, max = 1000) => {
  let stop = false
  let cursor

  const posts = []

  do {
    const result = await scrap(tag, cursor)

    posts.push(...result.posts)

    if ((max && posts.length >= max) || !result.pageInfo.has_next_page) {
      stop = true
    }

    cursor = result.pageInfo.end_cursor
  } while (!stop)

  return posts
}

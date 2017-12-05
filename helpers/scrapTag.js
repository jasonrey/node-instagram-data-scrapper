const request = require('request-promise-native')
const queryid = require('../queryids').tags

// "https://www.instagram.com/graphql/query/?query_id=...&variables={"tag_name":"break2191k","first":8,"after":"J0HWiZv5gAAAF0HWiTOnwAAAFiYA"}"

const getPosts = async (tag, cursor) => {
  const data = {
    tag_name: tag,
    first: 10
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

  const posts = result.data.hashtag.edge_hashtag_to_media.edges.map(item => {
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

  if (pageInfo.has_next_page) {
    const subposts = await getPosts(tag, pageInfo.end_cursor)

    posts.push(...subposts)
  }

  return posts
}

module.exports = getPosts

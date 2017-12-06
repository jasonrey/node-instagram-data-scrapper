const scrapPage = require('./scrapPage')

module.exports = async link => {
  const data = await scrapPage(link)

  const post = data.entry_data.PostPage[0].graphql.shortcode_media

  return {
    postid: post.id,
    image: post.display_url,
    likes: post.edge_media_preview_like.count,
    comments: post.edge_media_to_comment.count,
    caption: post.edge_media_to_caption.edges.length
      ? post.edge_media_to_caption.edges[0].node.text
      : '',
    isVideo: post.is_video,
    ownerId: post.owner.id,
    username: post.owner.username,
    shortcode: post.shortcode,
    timestamp: post.taken_at_timestamp,
    views: post.video_view_count || 0
  }
}

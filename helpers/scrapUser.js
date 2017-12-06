const scrapPage = require('./scrapPage')

/**
 * @typedef {Object} User
 * @property {number} followers
 * @property {number} follows
 * @property {string} id
 * @property {string} image
 *
 * @param {string} username Instagram username.
 * @returns {User}
 */
module.exports = async username => {
  const data = await scrapPage(`https://www.instagram.com/${username}/`)

  const user = data.entry_data.ProfilePage[0].user

  return {
    followers: user.followed_by.count,
    follows: user.follows.count,
    id: user.id,
    image: user.profile_pic_url_hd
  }
}

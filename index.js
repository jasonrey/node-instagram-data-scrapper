module.exports = {
  get scrapTag () {
    return require('./helpers/scrapTag')
  },

  get scrapPage () {
    return require('./helpers/scrapPage')
  },

  get scrapPost () {
    return require('./helpers/scrapPost')
  },

  get scrapUser () {
    return require('./helpers/scrapUser')
  },

  get scrapUserPosts () {
    return require('./helpers/scrapUserPosts')
  },

  get scrapper () {
    return require('./helpers/scrapper')
  }
}

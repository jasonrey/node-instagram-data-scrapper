module.exports = {
  get scrapTag () {
    return require('./helpers/scrapTag')
  },

  get scrapPage () {
    return require('./helpers/scrapPage')
  },

  get scrapPost() {
    return require('./helpers/scrapPost')
  },

  get scrapper () {
    return require('./helpers/scrapper')
  }
}

const request = require('request-promise-native')
const cheerio = require('cheerio')

/**
 * @param {string} page Url to scrape from.
 */
module.exports = async page => {
  const html = await request(page)

  return cheerio.load(html)
}

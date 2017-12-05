const request = require('request-promise-native')
const cheerio = require('cheerio')

module.exports = async page => {
  const html = await request(page)

  return cheerio.load(html)
}

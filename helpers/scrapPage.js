const scrapper = require('./scrapper')

/**
 * @param {string} link Instagram URL to scrape from.
 */
module.exports = async link => {
  let $

  try {
    $ = await scrapper(link)
  } catch (err) {
    throw new Error(`Unable to scrape: ${link}`)
  }

  const scripts = $('script[type="text/javascript"]')

  let data

  for (let i = 0; i < scripts.length; i++) {
    const content = $(scripts[i]).html()

    if (content.indexOf('window._sharedData = ') < 0) {
      continue
    }

    data = JSON.parse(content.replace('window._sharedData = ', '').slice(0, -1))

    break
  }

  if (!data) {
    throw new Error(`No data found for: ${link}`)
  }

  return data
}

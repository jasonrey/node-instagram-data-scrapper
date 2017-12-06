#!/usr/bin/env node

const { version } = require('../package.json')
const program = require('commander')

let link

program
  .version(version)
  .arguments('<link|shortcode>')
  .action(value => {
    link = value
  })
  .parse(process.argv)

  ; (async () => {
    try {
      if (!link) {
        throw new Error('Link (https://www.instagram.com/...) or shortcode is required.')
      }

      if (link.indexOf('https://www.instagram.com') < 0) {
        link = `https://www.instagram.com/p/${link}/`
      }

      const { scrapPost } = require('../')

      const result = await scrapPost(link)

      console.log(JSON.stringify(result))
    } catch (err) {
      console.error(err.message)
    }
  })()

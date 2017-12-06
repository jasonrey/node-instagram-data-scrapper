#!/usr/bin/env node

const { version } = require('../package.json')
const program = require('commander')

let link

program
  .version(version)
  .arguments('<link>')
  .action(value => {
    link = value
  })
  .parse(process.argv)

  ; (async () => {
    try {
      if (!link) {
        throw new Error('Link (https://www.instagram.com/...) is required.')
      }

      const { scrapPage } = require('../')

      const result = await scrapPage(link)

      console.log(JSON.stringify(result))
    } catch (err) {
      console.error(err.message)
    }
  })()

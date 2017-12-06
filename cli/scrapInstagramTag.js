#!/usr/bin/env node

const { version } = require('../package.json')
const program = require('commander')

let tag

program
  .version(version)
  .arguments('<tag>')
  .action(value => {
    tag = value
  })
  .parse(process.argv)

;(async () => {
  try {
    if (!tag) {
      throw new Error('Tag is required.')
    }

    const { scrapTag } = require('../')

    const result = scrapTag(tag)

    console.log(JSON.stringify(result))
  } catch (err) {
    console.error(err.message)
  }
})()

#!/usr/bin/env node

const {version} = require('../package.json')
const program = require('commander')

let tag

program
  .version(version)
  .arguments('<tag>')
  .action(value => {
    tag = value
  })
  .parse(process.argv)

try {
  if (!tag) {
    throw new Error('Tag is required.')
  }

  const {scrapTag} = require('../')

  scrapTag(tag).then(res => console.log(JSON.stringify(res)))
} catch (err) {
  console.error(err.message)
}

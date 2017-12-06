#!/usr/bin/env node

const { version } = require('../package.json')
const program = require('commander')

let username

program
  .version(version)
  .arguments('<username>')
  .action(value => {
    username = value
  })
  .parse(process.argv)

;(async () => {
  try {
    if (!username) {
      throw new Error('Username is required.')
    }

    const { scrapUser } = require('../')

    const result = await scrapUser(username)

    console.log(JSON.stringify(result))
  } catch (err) {
    console.error(err.message)
  }
})()

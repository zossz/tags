const { readdirSync } = require('fs')
const { basename, join } = require('path')

const file = basename(__filename)

const locals = {}

readdirSync(__dirname)
  .filter(x => {
    return (x.indexOf('.') !== 0) && (x !== file) && (x.slice(-3) === '.js')
  })
  .forEach(file => {
    locals[file.split('.').unshift()] = require(join(__dirname, file))
  })

module.exports = locals

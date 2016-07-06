/**
 * Proxy server for client dev
 */
const Bundler = require('parcel-bundler')
const express = require('express')
const ActionRunner = require('./runner')
const path = require('path')
/**
 * Generate Config
 */
require('./generate.config')

const outDir = path.join(__dirname, '../dist/local')

const bundler = new Bundler('web-src/index.html', {
  cache: false,
  outDir: outDir,
  contentHash: false
})

const app = express()

app.use(express.json())

/**
 * Actions as API
 */
app.all(
  '/actions/*',
  ActionRunner
)

app.use(bundler.middleware())
const port = Number(process.env.PORT || 9000)
app.listen(port)

console.log('Serving on port', port)

const Bundler = require('parcel-bundler')
const fs = require('fs-extra')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../', '.env') })

const inDir = path.join(__dirname, '../web-src/')
const outDirS3 = path.join(__dirname, '../dist/remote/s3-public')
const actionDir = path.join(__dirname, '../dist/remote/action-html')

const publicUrl = 'https://s3.amazonaws.com/' + process.env['S3_BUCKET_NAME']

const actionCode = `
const fs = require('fs')
const path = require('path')
exports.main = (request) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
      if (err) {
        reject(err)
      }
      resolve({
        headers: { 'Content-Type': 'text/html' },
        body: data
      })
    })
  })
}`

/**
 * Generate Config
 */
require('./generate.config')

/**
 * Create needed dir structure + make sure those are clean
 */
fs.emptyDirSync(actionDir)
fs.emptyDirSync(outDirS3)

/**
 * Build UI to S3 dir
 */
const bundler = new Bundler(path.join(inDir, 'index.html'), {
  cache: false,
  outDir: outDirS3,
  publicUrl: publicUrl,
  watch: false,
  detailedReport: true
})

bundler.bundle().then(() => {
  /**
  * Build action dir
  */
  fs.writeFileSync(path.join(actionDir, 'index.js'), actionCode)
  fs.moveSync(path.join(outDirS3, 'index.html'), path.join(actionDir, 'index.html'))
})

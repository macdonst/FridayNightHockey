const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../', '.env') })

const serverlessConfig = yaml.safeLoad(
  fs.readFileSync(path.join(__dirname, '../serverless.yml'), 'utf8')
)

const { REMOTE_ACTIONS, OW_APIHOST, OW_APIVERSION, OW_PACKAGE, OW_NAMESPACE } = process.env

/**
 * Generate Config Service Urls
 */
function generateConfig () {
  const ACTIONS = {}

  Object.keys(serverlessConfig['functions']).map((id) => {
    const action = serverlessConfig['functions'][id]
    const webstr = (action['annotations'] && action['annotations']['web-export']) ? 'web/' : ''

    ACTIONS[id] = ((REMOTE_ACTIONS === 'true')
      ? `${OW_APIHOST}/api/${OW_APIVERSION || 'v1'}/${webstr}${OW_NAMESPACE}/${OW_PACKAGE}/${id}`
      : `/actions/${id}`)
  })

  fs.writeFileSync(
    path.join(__dirname, '../web-src/src/config.json'),
    JSON.stringify(ACTIONS), { encoding: 'utf-8' }
  )
}

generateConfig()

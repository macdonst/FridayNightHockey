const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2
const data = require('../../data.json')

async function main (args) {
  const oauth2Client = new OAuth2(
    data.clientId,
    data.clientSecret,
    'https://developers.google.com/oauthplayground'
  )

  oauth2Client.setCredentials({
    refresh_token: data.refresh_token
  })
  const tokens = await oauth2Client.refreshAccessToken()
  const accessToken = tokens.credentials.access_token

  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: data.user,
      clientId: data.clientId,
      clientSecret: data.clientSecret,
      refreshToken: data.refresh_token,
      accessToken: accessToken
    }
  })

  return smtpTransport
    .sendMail(args)
    .then(response => {
      smtpTransport.close()
      return {
        headers: {
          'content-type': 'application/json'
        },
        statusCode: 200,
        body: {
          response
        }
      }
    })
    .catch(error => {
      smtpTransport.close()
      return {
        headers: {
          'content-type': 'application/json'
        },
        statusCode: 500,
        body: {
          error
        }
      }
    })
}

exports.main = main

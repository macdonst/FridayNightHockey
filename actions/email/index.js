const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const OAuth2 = google.auth.OAuth2

async function main (args) {
  const oauth2Client = new OAuth2(
    args.clientId,
    args.clientSecret,
    'https://developers.google.com/oauthplayground'
  )

  oauth2Client.setCredentials({
    refresh_token: args.refresh_token
  })

  const tokens = await oauth2Client.refreshAccessToken()
  const accessToken = tokens.credentials.access_token

  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: args.user,
      clientId: args.clientId,
      clientSecret: args.clientSecret,
      refreshToken: args.refresh_token,
      accessToken: accessToken
    }
  })

  return smtpTransport
    .sendMail({
      from: args.from,
      to: args.to,
      subject: args.subject,
      generateTextFromHTML: true,
      html: args.html
    })
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

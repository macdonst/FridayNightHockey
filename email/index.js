const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

module.exports = async function(context, template) {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const refresh_token = process.env.REFRESH_TOKEN;
  const mailUser = process.env.MAIL_USER;

  context.log(
    'JavaScript HTTP trigger function processed a request using environment vars.'
  );
  const oauth2Client = new OAuth2(
    clientId,
    clientSecret,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({ refresh_token });

  const tokens = await oauth2Client.refreshAccessToken();
  const accessToken = tokens.credentials.access_token;

  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: mailUser,
      clientId,
      clientSecret,
      refreshToken: refresh_token,
      accessToken: accessToken
    }
  });

  // @TODO: add error checking for the body
  return smtpTransport
    .sendMail(template)
    .then(response => {
      smtpTransport.close();
      context.done(null, response);
    })
    .catch(error => {
      smtpTransport.close();
      context.done(null, error);
    });
};

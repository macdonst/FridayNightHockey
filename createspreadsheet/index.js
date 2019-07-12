const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const dayjs = require('dayjs');

// read what database class we want from runtime vars
const Database = require('../utils/' + process.env.DB_ID);

module.exports = async function(context, req) {
  const clientId = process.env.SHEETS_CLIENT_ID;
  const clientSecret = process.env.SHEETS_CLIENT_SECRET;
  const refresh_token = process.env.SHEETS_REFRESH_TOKEN;

  const oauth2Client = new OAuth2(
    clientId,
    clientSecret,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({ refresh_token });

  const tokens = await oauth2Client.refreshAccessToken();
  const accessToken = tokens.credentials.access_token;
  oauth2Client.credentials = {
    access_token: accessToken
  };

  const client = new Database();
  const players = context.bindings.playersDocument;
  const { date: gameDate } = await client.getNextGame();
  const allSpares = context.bindings.sparesDocument;
  const spares = allSpares.filter(spare => spare.playing.includes(gameDate));
  const playing = generateAvailable(players, spares, gameDate);

  const resource = {
    properties: {
      title: `Roster for ${dayjs(gameDate).format('MMMM D')}`
    }
  };
  const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
  const spreadsheetId = await createSpreadsheet(resource, sheets);
  const appendResult = await appendValues(spreadsheetId, playing, sheets);
  const formattingResult = await conditionalFormatting(spreadsheetId, sheets);
  console.log('we have success');

  return {
    body: formattingResult
  };
};

function generateAvailable(players, spares, gameDate) {
  let playing = [];
  for (let player of players) {
    if (!player.goalie) {
      if (!player.away) {
        playing.push(player.name);
      } else if (!player.away.includes(gameDate)) {
        playing.push(player.name);
      }
    }
  }
  for (let spare of spares) {
    playing.push(spare.name);
  }

  return playing;
}

async function createSpreadsheet(resource, sheets) {
  return new Promise(function(resolve, reject) {
    sheets.spreadsheets.create(
      {
        resource,
        fields: 'spreadsheetId'
      },
      (err, spreadsheet) => {
        if (err) {
          console.log('createSpreadsheet: rejecting');
          reject(err);
        } else {
          console.log('createSpreadsheet: resolving');
          resolve(spreadsheet.data.spreadsheetId);
        }
      }
    );
  });
}

async function appendValues(spreadsheetId, players, sheets) {
  const valueInputOption = 'USER_ENTERED';
  const range = 'Sheet1!A1';
  return new Promise((resolve, reject) => {
    let values = players.map((player, i) => {
      if (i !== 0) {
        return ['', '', '', player];
      } else {
        return ['White', 'Dark', '', player];
      }
    });
    let resource = {
      values
    };
    sheets.spreadsheets.values.append(
      {
        spreadsheetId,
        range,
        valueInputOption,
        resource
      },
      (err, result) => {
        if (err) {
          console.log('appendValues: error');
          console.log(err);
          reject(err);
        } else {
          console.log('appendValues: success');
          resolve(result);
        }
      }
    );
  });
}

async function conditionalFormatting(spreadsheetId, sheets) {
  return new Promise((resolve, reject) => {
    const requests = [
      {
        updateBorders: {
          range: {
            sheetId: 0,
            startRowIndex: 0,
            endRowIndex: 11,
            startColumnIndex: 0,
            endColumnIndex: 2
          },
          top: {
            style: 'SOLID',
            width: 1
          },
          bottom: {
            style: 'SOLID',
            width: 1
          },
          left: {
            style: 'SOLID',
            width: 1
          },
          right: {
            style: 'SOLID',
            width: 1
          },
          innerHorizontal: {
            style: 'SOLID',
            width: 1
          },
          innerVertical: {
            style: 'SOLID',
            width: 1
          }
        }
      },
      {
        repeatCell: {
          range: {
            sheetId: 0,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: 2
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: {
                red: 0.0,
                green: 0.0,
                blue: 0.0
              },
              horizontalAlignment: 'CENTER',
              textFormat: {
                foregroundColor: {
                  red: 1.0,
                  green: 1.0,
                  blue: 1.0
                },
                fontSize: 24,
                bold: true
              }
            }
          },
          fields:
            'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
        }
      }
    ];
    const resource = {
      requests
    };
    sheets.spreadsheets.batchUpdate(
      {
        spreadsheetId,
        resource
      },
      (err, response) => {
        if (err) {
          console.log('conditionalFormatting: failure');
          console.log(err);
          reject(err);
        } else {
          console.log('conditionalFormatting: success');
          resolve(response);
        }
      }
    );
  });
}

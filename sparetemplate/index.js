const dayjs = require('dayjs');
const converter = require('number-to-words');
const Database = require('../utils/db');

module.exports = async function(context, req) {
  const client = new Database();
  const players = await client.getPlayers();
  const {
    facility: facility,
    date: gameDate,
    time: gameTime
  } = await client.getNextGame();

  const sparesEmails = await client.getSpares();

  let totalPlayers = countSkaters(players);
  let totalCancellations = countCancellations(players, gameDate);
  let totalSpares = countSparesPlaying(sparesEmails, gameDate);
  let totalSkaters = totalPlayers - totalCancellations + totalSpares;
  let sparesNeeded = 20 - totalSkaters;

  const email = {
    from: 'simon.macdonald@gmail.com',
    to: 'simon.macdonald@gmail.com',
    bcc: generateEmailList(sparesEmails),
    subject: `Spares Needed Summer Hockey: Friday ${dayjs(gameDate).format(
      'MMMM D'
    )} ${gameTime} ${facility}`,
    html: generateBody(facility, gameTime, sparesNeeded),
    generateTextFromHTML: true,
    sparesNeeded: sparesNeeded
  };

  context.res = {
    body: email
  };
};

function generateEmailList(players) {
  return players.map(player => player.email).join(', ');
}

function generateBody(facility, gameTime, sparesNeeded) {
  let body = `<p>Hey all,</p>

<p>I'm looking for ${converter.toWords(sparesNeeded)} ${
    sparesNeeded > 1 ? 'spares' : 'spare'
  } for our game on Friday at the ${facility} with a start time of ${gameTime}.</p>

<p>Let me know if you'd like to spare for $15. If I can't immediately fit you in
I'll get back to you as I get other cancellations.</p>

<p>Simon Mac Donald<br/>
http://simonmacdonald.com</p>`;

  return body;
}

function countSkaters(players) {
  let skaters = players.filter(player => !player.goalie);
  return skaters.length;
}

function countSparesPlaying(spares, gameDate) {
  return spares.filter(spare => spare.playing.includes(gameDate)).length;
}

function countCancellations(players, gameDate) {
  let cancellations = players.filter(
    player => player.away && player.away.includes(gameDate) && !player.goalie
  );

  return cancellations.length;
}

const dayjs = require('dayjs');
const Database = require('../utils/db');

module.exports = async function(context, req) {
  const client = new Database();

  /**
   * change this code so it gets the entire players database
   * add an "away" array for each player. Use this to generate cancellations
   */
  const players = await client.getPlayers();
  const {
    facility: facility,
    date: gameDate,
    time: gameTime
  } = await client.getNextGame();

  const email = {
    from: 'simon.macdonald@gmail.com',
    to: generateToField(players),
    subject: `Summer Hockey: Friday ${dayjs(gameDate).format(
      'MMMM D'
    )} ${gameTime} ${facility}`,
    html: generateBody(players, facility, gameDate, gameTime),
    generateTextFromHTML: true
  };
  context.log(email);

  context.res = {
    body: email
  };
};

function generateToField(players) {
  return players.map(player => player.email).join(', ');
}

function generateCancellations(players, gameDate) {
  let cancellations = players
    .filter(player => player.away && player.away.includes(gameDate))
    .reduce((acc, player) => ' ' + acc + player.name + ', ', '');

  return cancellations.trim().slice(0, -1);
}

function generateBody(players, facility, gameDate, gameTime) {
  let body = `<p>Hey all,</p>

<p>Our game is at the ${facility} with a start time of ${gameTime}.</p>

<p>Lemme know if you can't make it.</p>

<p><b>Cancellations:</b> ${generateCancellations(players, gameDate)}<br/>
<b>Spares:</b> n/a<br/>
<b>Goalies:</b> ?</p>

<p>Simon Mac Donald<br/>
http://simonmacdonald.com</p>`;

  return body;
}

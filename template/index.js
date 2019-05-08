const dayjs = require('dayjs');
const Database = require('../utils/db');

module.exports = async function(context, req) {
  const client = new Database();
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

function generateSpares() {
  return 'n/a';
}

function generateGoalies(players, gameDate) {
  let goalies = players
    .filter(player => player.goalie === true)
    .filter(goalie => !goalie.away.includes(gameDate));

  if (goalies.length === 0) {
    return '? and ?';
  } else if (goalies.length === 1) {
    return `${goalies[0].name} and ?`;
  } else {
    return `${goalies[0].name} and ${goalies[1].name}`;
  }
}

function generateBody(players, facility, gameDate, gameTime) {
  let body = `<p>Hey all,</p>

<p>Our game is at the ${facility} with a start time of ${gameTime}.</p>

<p>Lemme know if you can't make it.</p>

<p><b>Cancellations:</b> ${generateCancellations(players, gameDate)}<br/>
<b>Spares:</b> ${generateSpares()}<br/>
<b>Goalies:</b> ${generateGoalies(players, gameDate)}</p>

<p>Simon Mac Donald<br/>
http://simonmacdonald.com</p>`;

  return body;
}

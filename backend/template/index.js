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
  const allSpares = await client.getSpares();
  const spares = allSpares.filter(spare => spare.playing.includes(gameDate));

  const email = {
    from: 'simon.macdonald@gmail.com',
    to: generateEmailList(players),
    cc: generateEmailList(spares),
    subject: `Summer Hockey: Friday ${dayjs(gameDate).format(
      'MMMM D'
    )} ${gameTime} ${facility}`,
    html: generateBody(players, facility, gameDate, gameTime, spares),
    generateTextFromHTML: true
  };
  context.log(email);

  context.done(null, email);
};

function generateEmailList(players) {
  return players.map(player => player.email).join(', ');
}

function generateCancellations(players, gameDate) {
  let cancellations = players
    .filter(player => player.away && player.away.includes(gameDate))
    .reduce((acc, player) => ' ' + acc + player.name + ', ', '');

  return cancellations.trim().slice(0, -1);
}

function generateSpares(players, gameDate) {
  let spares = players.reduce(
    (acc, player) => ' ' + acc + player.name + ', ',
    ''
  );

  return spares.trim().slice(0, -1);
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

function generateBody(players, facility, gameDate, gameTime, spares) {
  let body = `<p>Hey all,</p>

<p>Our game is at the ${facility} with a start time of ${gameTime}.</p>

<p>Lemme know if you can't make it.</p>

<p><b>Cancellations:</b> ${generateCancellations(players, gameDate)}<br/>
<b>Spares:</b> ${generateSpares(spares)}<br/>
<b>Goalies:</b> ${generateGoalies(players, gameDate)}</p>

<p>Simon Mac Donald<br/>
http://simonmacdonald.com</p>`;

  return body;
}

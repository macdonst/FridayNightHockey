const dayjs = require('dayjs');

class Database {
  // Create DB client
  constructor() {}

  getNextDay(date, dayOfWeek) {
    date = new Date(date.getTime());
    date.setDate(date.getDate() + ((dayOfWeek + 7 - date.getDay()) % 7));
    return date;
  }

  async getNextGame(games) {
    const nextFriday = dayjs(this.getNextDay(new Date(), 5));
    for (let game of games) {
      let gameDate = dayjs(game.date);
      if (gameDate.diff(nextFriday, 'day') === 0) {
        return game;
      }
    }
    return null;
  }
}

module.exports = Database;

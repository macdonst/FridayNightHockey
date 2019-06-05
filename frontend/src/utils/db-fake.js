const dayjs = require('dayjs');
const players = require('../database/players.json');
const games = require('../database/games.json');
const spares = require('../database/spares.json');

class Database {
  // Create DB client
  constructor() {}

  async getPlayers() {
    return players;
  }

  async getPlayer(email) {
    for (let player of players) {
      if (player.email === email) {
        return player;
      }
    }
  }

  async getSpares() {
    return spares;
  }

  async updateAwayStatus(player, date) {}

  async getNextGame() {
    for (let game of games) {
      if (game.date === '2019-05-24') {
        return game;
      }
    }
  }

  async getGames() {
    return games;
  }
}

module.exports = Database;

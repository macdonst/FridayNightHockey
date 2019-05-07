const CosmosClient = require('@azure/cosmos').CosmosClient;
const dayjs = require('dayjs');

class Database {
  // Create DB client
  constructor() {
    this.client = new CosmosClient({
      endpoint: process.env.DB_URI,
      auth: { masterKey: process.env.PRIMARY_KEY }
    });
  }

  async getPlayers() {
    const { result: results } = await this.client
      .database('Players')
      .container('Items')
      .items.readAll()
      .toArray();

    return results;
  }

  async getPlayer(email) {
    const querySpec = {
      query: 'SELECT * FROM Players p WHERE p.email = @email',
      parameters: [
        {
          name: '@email',
          value: email
        }
      ]
    };

    const { result: results } = await this.client
      .database('Players')
      .container('Items')
      .items.query(querySpec, { enableCrossPartitionQuery: true })
      .toArray();

    return results[0];
  }

  async updateAwayStatus(player, date) {
    console.log(`Replacing item:\n${player.id}\n`);
    if (player.away) {
      player.away.push(date);
    } else {
      player.away = [date];
    }
    const { item } = await this.client
      .database('Players')
      .container('Items')
      .item(player.id)
      .replace(player);
  }

  async getNextGame() {
    const querySpec = {
      query: 'SELECT * FROM Games g WHERE g.date >= @date ORDER BY g.date ASC',
      parameters: [
        {
          name: '@date',
          value: dayjs().format('YYYY-MM-DD')
        }
      ]
    };

    const { result: results } = await this.client
      .database('Games')
      .container('Items')
      .items.query(querySpec, { enableCrossPartitionQuery: true })
      .toArray();

    return results[0];
  }
}

module.exports = Database;

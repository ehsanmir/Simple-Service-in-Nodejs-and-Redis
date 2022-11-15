const redis = require('redis');
const dbHost = '127.0.0.1';
const dbPort = 6379;
const dbPass = process.env.REDIS_PASS;

/**
 * Handles database creation and connection.
 * @param {string} dbNumber The database number.
 * @return {object} The Database Client.
 */
function create(dbNumber) {
  let client = redis.createClient({
    socket: {
      host: dbHost,
      port: dbPort
    },
    password: dbPass,
  });
  client.connect();
  client.select(dbNumber);
  return client;
}

exports.create = create;

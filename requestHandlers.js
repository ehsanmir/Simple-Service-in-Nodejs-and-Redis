var security = require('./lib/security');
var redis = require('redis');
var dotenv = require('dotenv');
dotenv.config();
var redisClient = redis.createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379
  },
  password: process.env.REDIS_PASS
});
/**
 * Handles / and start path requests.
 * @param {string} response The respone to be sent.
 * @param {string} data The data from the request.
 * @param {string} method The http request method.
 */
function start(response, data, method) {
  if (method == 'GET') {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write('[*] Welcome to EmployeeService... ');
    response.write('Send something to /dataservice.');
  }
  else {
    response.writeHead(405, { 'Content-Type': 'text/plain' });
    response.write('[!] Method not allowed in this path.');
  }
  response.end();
}

/**
 * Handles dataService path requests.
 * @param {string} response The respone to be sent.
 * @param {string} data Complete data from the request.
 * @param {string} method The http request method.
 */
async function dataService(response, data, method) {
  /**
 * Handles dataService path requests.
 * @param {string} code The http response code.
 * @param {string} text The text that we want to show to the client.
 */
  function sendResponse(code, text) {
    response.writeHead(code, { 'Content-Type': 'text/plain' });
    response.write(text);
    response.end();
  }
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
    }
    catch (e) {
      sendResponse(400, '[!] Error in connection with the Data base.');
      return;
    }
  }
  // for part 1
  if (method == 'POST') {
    if (!security.validateRequest1(data)) {
      sendResponse(400, '[!] Please send a valid request.');
      return;
    }
    var obj1 = JSON.parse(data);
    try {
      await redisClient.select(0);
      var result1 = await redisClient.get(obj1['id']);
      if (result1 == null) {
        var result2 = await redisClient.get(obj1['parent']);
        if (result2 != null) {
          var result3 = await redisClient.set(obj1['id'], JSON.stringify(obj1['data']));
          if (result3 == 'OK') {
            await redisClient.select(1);
            var result4 = await redisClient.set(obj1['id'], obj1['parent']);
            if (result4 == 'OK') {
              sendResponse(200, '[*] Data successfully added.');
              return;
            }
            else {
              await redisClient.del(obj1['id']);
              sendResponse(400, '[!] Error while inserting the parent.');
              return;
            }
          }
          else {
            sendResponse(400, '[!] Error while inserting the id.');
            return;
          }
        }
        else {
          sendResponse(400, '[!] Parent id is not in the data base.');
          return;
        }
      }
      else {
        sendResponse(400, '[!] Duplicate id.');
        return;
      }
    }
    catch (e) {
      sendResponse(400, '[!] Error while processing the request.');
      return;
    }
  }
  // for part 2
  else if (method == 'GET') {
    if (!security.validateRequest2(data)) {
      sendResponse(400, '[!] Please send a valid request.');
      return;
    }
    var id = data.split('=')[1];
    try {
      await redisClient.select(0);
      var result5 = await redisClient.get(id);
      if (result5 != null) {
        await redisClient.select(1);
        var result6 = await redisClient.get(id);
        if (result6 != null) {
          sendResponse(200, JSON.stringify({
            data: result5,
            parent: result6,
          }));
          return;
        }
        else {
          sendResponse(400, '[!] id not found.');
          return;
        }
      }
      else {
        sendResponse(400, '[!] id not found.');
        return;
      }
    }
    catch (e) {
      sendResponse(400, '[!] Error while processing the request.');
      return;
    }
  }
  // for part 3
  else if (method == 'PUT') {
    if (!security.validateRequest1(data)) {
      sendResponse(400, '[!] Please send a valid request.');
      return;
    }
    var obj2 = JSON.parse(data);
    try {
      await redisClient.select(0);
      var result7 = await redisClient.get(obj2['id']);
      if (result7 != null) {
        var result8 = await redisClient.get(obj2['parent']);
        if (result8 != null) {
          await redisClient.select(1);
          var result9 = await redisClient.get(obj2['id']);
          if (result9 != null) {
            var result10 = await redisClient.set(obj2['id'], obj2['parent']);
            if (result10 == 'OK') {
              await redisClient.select(0);
              var result11 = await redisClient.set(obj2['id'], JSON.stringify(obj2['data']));
              if (result11 == 'OK') {
                sendResponse(200, '[*] Data successfully updated.');
                return;
              }
              else {
                await redisClient.del(obj2['id']);
                sendResponse(400, '[!] Error while updating data.');
                return;
              }
            }
            else {
              sendResponse(400, '[!] Error while updating parent.');
              return;
            }
          }
          else {
            sendResponse(400, '[!] Person\'s parent not found.');
            return;
          }
        }
        else {
          sendResponse(400, '[!] Parent\'s id not found.');
          return;
        }
      }
      else {
        sendResponse(400, '[!] Id not found.');
        return;
      }
    }
    catch (e) {
      sendResponse(400, '[!] Error while processing the request.');
      return;
    }
  }
  else {
    sendResponse(405, '[!] Method not allowed in this pathname.');
    return;
  }
}

exports.start = start;
exports.dataService = dataService;

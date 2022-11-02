var security = require('./lib/security');
var redis = require('redis');
var redisClient = redis.createClient();
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
    var obj = JSON.parse(data);
    try {
      await redisClient.select(0);
      var result1 = await redisClient.get(obj['id']);
      if (result1 == null) {
        var result2 = await redisClient.get(obj['parent']);
        if (result2 != null) {
          var result3 = await redisClient.set(obj['id'], obj['data']);
          if (result3 == 'OK') {
            await redisClient.select(1);
            var result4 = await redisClient.set(obj['id'], obj['parent']);
            if (result4 == 'OK') {
              sendResponse(200, '[*] Data successfully added.');
              return;
            }
            else {
              await redisClient.del(obj['id']);
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
  else {
    sendResponse(405, '[!] Method not allowed in this pathname.');
    return;
  }
}

exports.start = start;
exports.dataService = dataService;

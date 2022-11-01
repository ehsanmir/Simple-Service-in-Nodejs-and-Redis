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
  if (!security.validateRequest(data)) {
    sendResponse(400, '[!] Please send a valid request.');
    return;
  }
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
    }
    catch (e) {
      sendResponse(400, '[!] Error in connection with Data base.');
      return;
    }
  }
  var obj = JSON.parse(data);
  if (method == 'POST') {
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
              sendResponse(200, '[*] Successfully added.');
              return;
            }
          }
        }
        else {
          sendResponse(400, '[!] Parent id is not in data base.');
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
  else {
    sendResponse(405, '[!] Method not allowed in this pathname.');
    return;
  }
  sendResponse(400, '[!] Some thing is wrong.');
  return;
}

exports.start = start;
exports.dataService = dataService;

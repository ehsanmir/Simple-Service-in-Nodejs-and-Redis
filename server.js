const handleResponse = require('./lib/send').handleResponse;
const http = require('http');
const url = require('url');

/**
 * Function to start the web server.
 * @param {Function} route The function for routing.
 * @param {Function} handle The function for handling the request.
 * @param {object} db The Database Client.
 */
function start(route, handle, db) {
  var db0Status = '';
  db[0].on('error', () => {
    if (db0Status != 'error') {
      db0Status = 'error';
    }
  });
  db[0].on('ready', () => {
    if (db0Status != 'ok') {
      db0Status = 'ok';
    }
  });
  var db1Status = '';
  db[1].on('error', () => {
    if (db1Status != 'error') {
      db1Status = 'error';
    }
  });
  db[1].on('ready', () => {
    if (db1Status != 'ok') {
      db1Status = 'ok';
    }
  });
  /**
   * Function to recieve requests.
   * @param {string} request The request from client.
   * @param {string} response The respone to be sent.
   */
  function onRequest(request, response) {
    request.setEncoding('utf8');
    let pathname = url.parse(request.url).pathname;
    let method = request.method;
    if (db0Status != 'ok' || db1Status != 'ok') {
      handleResponse(response, 503, '[!] Database Connection Error.');
    }
    else if (method == 'GET') {
      let queryData = url.parse(request.url).query;
      route(handle, pathname, response, queryData, method, db);
    }
    else if (method == 'POST' || method == 'PUT') {
      let postData = '';
      request.addListener('data', function (postDataChunk) {
        postData += postDataChunk;
      });
      request.addListener('end', function () {
        route(handle, pathname, response, postData, method, db);
      });
    }
    else {
      handleResponse(response, 405, '[!] Method not allowed.');
    }

  }
  http.createServer(onRequest).listen(8181);
}
exports.start = start;

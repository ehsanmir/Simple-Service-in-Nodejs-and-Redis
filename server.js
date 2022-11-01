var http = require('http');
var url = require('url');
/**
 * Function to start the web server.
 * @param {Function} route The function for routing.
 * @param {Function} handle The function for handling the request.
 */
function start(route, handle) {
  /**
 * Function to recieve requests.
 * @param {string} request The request from client.
 * @param {string} response The respone to be sent.
 */
  function onRequest(request, response) {
    request.setEncoding('utf8');
    var pathname = url.parse(request.url).pathname;
    var method = request.method;
    if (method == 'GET') {
      var queryData = url.parse(request.url).query;
      route(handle, pathname, response, queryData, method);
    }
    else if (method == 'POST' || method == 'PUT') {
      var postData = '';
      request.addListener('data', function (postDataChunk) {
        postData += postDataChunk;
      });
      request.addListener('end', function () {
        route(handle, pathname, response, postData, method);
      });
    }
    else {
      response.writeHead(405, { 'Content-Type': 'text/plain' });
      response.write('[!] Method not allowed.');
      response.end();
    }

  }
  http.createServer(onRequest).listen(8181);
}
exports.start = start;

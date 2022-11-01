/**
 * Function to route requests.
 * @param {Function} handle The function for handling the request.
 * @param {string} pathname Speaks for itself!
 * @param {string} response The respone to be sent.
 * @param {string} data Complete data from the request.
 * @param {string} method The request method.
 */
function route(handle, pathname, response, data, method) {
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, data, method);
  }
  else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('404 Not found');
    response.end();
  }
}
exports.route = route;
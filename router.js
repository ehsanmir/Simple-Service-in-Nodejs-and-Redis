const handleResponse = require('./lib/send').handleResponse;

/**
 * Function to route requests.
 * @param {Function} handle The function for handling the request.
 * @param {string} pathname Speaks for itself!
 * @param {string} response The respone to be sent.
 * @param {string} data Complete data from the request.
 * @param {string} method The request method.
 * @param {string} db The Database Client.
 */
function route(handle, pathname, response, data, method, db) {
  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, data, method, db);
  }
  else {
    handleResponse(response, 404, '[!] path not found');
  }
}
exports.route = route;
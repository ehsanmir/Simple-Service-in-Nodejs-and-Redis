const security = require('./lib/security');
const handleResponse = require('./lib/send').handleResponse;
const handleInsert = require('./lib/insert').handleInsert;
const handleQuery = require('./lib/query').handleQuery;
const handleUpdate = require('./lib/update').handleUpdate;

/**
 * Handles / and start path requests.
 * @param {string} response The respone to be sent.
 * @param {string} data The data from the request.
 * @param {string} method The http request method.
 */
function start(response, data, method) {
  if (method == 'GET') {
    handleResponse(response, 200, '[*] Welcome to EmployeeService, Send something to /dataService');
  }
  else {
    handleResponse(response, 405, '[!] Method not allowed in this path.');
  }
  response.end();
}

/**
 * Handles dataService path requests.
 * @param {string} response The respone to be sent.
 * @param {string} data Complete data from the request.
 * @param {string} method The http request method.
 */
async function dataService(response, data, method, db) {
  if (method == 'GET') {
    if (!security.validateId(data)) {
      handleResponse(response, 422, '[!] Please send a valid query with id.');
      return;
    }
    await handleQuery(response, data, db);
  }
  else {
    let validate = security.validateJson(data);
    if (!validate.isValid) {
      handleResponse(response, 422, validate.reason);
      return;
    }
    if (method == 'POST') {
      await handleInsert(response, data, db);
    }
    else if (method == 'PUT') {
      await handleUpdate(response, data, db);
    }
  }
}

exports.start = start;
exports.dataService = dataService;

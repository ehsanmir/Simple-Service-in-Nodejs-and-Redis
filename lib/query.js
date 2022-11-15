const handleResponse = require('./send').handleResponse;

/**
 * Handles query after a get request.
 * @param {string} response The respone to be sent.
 * @param {string} data The data from the request.
 * @param {string} db The Database Client.
 */
async function handleQuery(response, data, db) {
  let id = data.split('=')[1];
  try {
    let getData = await db[0].get(id);
    let getParent = await db[1].get(id);
    if (getData != null && getParent != null) {
      handleResponse(response, 200, {
        data: getData,
        parent: getParent,
      });
      return;
    }
    else {
      handleResponse(response, 404, '[!] id not found.');
      return;
    }
  }
  catch (e) {
    handleResponse(response, 422, '[!] Error while processing the request.');
    return;
  }
}


exports.handleQuery = handleQuery;
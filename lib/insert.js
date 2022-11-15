const handleResponse = require('./send').handleResponse;

/**
 * Handles insert after a post request.
 * @param {string} response The respone to be sent.
 * @param {string} data The data from the request.
 * @param {string} db The Database Client.
 */
async function handleInsert(response, data, db) {
  let obj = JSON.parse(data);
  try {
    let getData = await db[0].get(obj['id']);
    if (getData != null) {
      handleResponse(response, 409, '[!] Duplicate id.');
      return;
    }
    let getParent = await db[0].get(obj['parent']);
    if (getParent == null) {
      handleResponse(response, 404, '[!] Parent id is not in the database.');
      return;
    }
    let setData = await db[0].set(obj['id'], JSON.stringify(obj['data']));
    let setParent = await db[1].set(obj['id'], obj['parent']);
    if (setData == 'OK' && setParent == 'OK') {
      handleResponse(response, 201, '[*] Data successfully added.');
      return;
    }
    else {
      throw new Error('Error while inserting');
    }
  }
  catch (e) {
    handleResponse(response, 422, '[!] Error while processing the request.');
    return;
  }
}


exports.handleInsert = handleInsert;
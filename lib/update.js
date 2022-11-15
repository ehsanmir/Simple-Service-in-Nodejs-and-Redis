const handleResponse = require('./send').handleResponse;

/**
 * Handles update after a put request.
 * @param {string} response The respone to be sent.
 * @param {string} data The data from the request.
 * @param {string} db The Database Client.
 */
async function handleUpdate(response, data, db) {
  let obj = JSON.parse(data);
  try {
    let getData = await db[0].get(obj['id']);
    if (getData == null) {
      handleResponse(response, 404, '[!] Id not found.');
      return;
    }
    let getParent = await db[1].get(obj['id']);
    let getDataParent = await db[0].get(obj['parent']);
    if (getParent == null || getDataParent == null) {
      handleResponse(response, 404, '[!] Please check the parent.');
      return;
    }
    let setData = await db[0].set(obj['id'], JSON.stringify(obj['data']));
    let setParent = await db[1].set(obj['id'], obj['parent']);
    if (setData == 'OK' && setParent == 'OK') {
      handleResponse(response, 200, '[*] Data successfully updated.');
      return;
    }
    else {
      throw new Error('Error while updating');
    }
  }
  catch (e) {
    handleResponse(response, 422, '[!] Error while processing the request.');
    return;
  }
}


exports.handleUpdate = handleUpdate;
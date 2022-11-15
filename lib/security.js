/**
 * Function for Request1 and Request3 validation.
 * @param {string} data The data from the request1.
 * @return {boolean} The request is valid or not?
 */
function validateJson(data) {
  let response = {
    isValid: false,
    reason: ''
  };
  try {
    // check the json
    let obj = JSON.parse(data);
    if (Object.keys(obj).length != 3) {
      response.reason = '[!] Please send a valid json with 3 keys.';
      return response;
    }
    // check id
    if (!obj.id || obj.id.length == 0 || obj.id.length > 20 || !(/^\d+$/.test(obj['id']))) {
      response.reason = '[!] Please check the id';
      return response;
    }
    // check data
    if (!obj.data || obj.data.length == 0 || obj.data.length > 200) {
      response.reason = '[!] Please check the data';
      return response;
    }
    // check parent
    if (!obj.parent || obj.parent.length == 0 || obj.parent.length > 20 || !(/^\d+$/.test(obj['parent']))) {
      response.reason = '[!] Please check the parent';
      return response;
    }
    // ok
    else {
      response.isValid = true;
      return response;
    }
  }
  catch (e) {
    response.reason = '[!] Please send a valid json with id, data and parent keys.';
  }
  return response;
}

/**
 * Function for Request2 validation.
 * @param {string} data The data from the request2.
 * @return {boolean} The request is valid or not?
 */
function validateId(data) {
  let isValid = false;
  try {
    // check for length and logic
    if (data.length < 4 || data.length > 25 || data.split('&').length != 1) {
      isValid = false;
    }
    // check for characters
    else if ((data.split('=')[0] == 'id') && (/^\d+$/.test(data.split('=')[1]))) {
      isValid = true;
    }
    else {
      isValid = false;
    }
  }
  catch (e) {
    isValid = false;
  }
  return isValid;
}

exports.validateJson = validateJson;
exports.validateId = validateId;

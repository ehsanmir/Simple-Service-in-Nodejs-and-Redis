/**
 * Function for Request1 validation.
 * @param {string} data The data from the request1.
 * @return {boolean} The request is valid or not?
 */
function validateRequest1(data) {
  var isValid = false;
  try {
    // check for logic
    var obj = JSON.parse(data);
    if (Object.keys(obj).length != 3) {
      isValid = false;
    }
    else if ('id' in obj && 'data' in obj && 'parent' in obj) {
      // check for length
      if ((obj['id'].length > 0 && obj['id'].length < 20) &&
        (obj['data'].length > 0 && obj['data'].length < 200) &&
        (obj['parent'].length > 0 && obj['parent'].length < 20)) {
        // check for characters (TODO: We don't know anything about the data field!)
        if ((/^\d+$/.test(obj['id'])) && (/^\d+$/.test(obj['parent']))) {
          isValid = true;
        }
      }
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

/**
 * Function for Request2 validation.
 * @param {string} data The data from the request2.
 * @return {boolean} The request is valid or not?
 */
function validateRequest2(data) {
  var isValid = false;
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

exports.validateRequest1 = validateRequest1;
exports.validateRequest2 = validateRequest2;
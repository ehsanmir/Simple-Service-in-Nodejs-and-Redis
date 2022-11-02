/**
 * Function for Request validation.
 * @param {string} data The data from the request.
 * @return {boolean} Is the request valid or not?
 */
function validateRequest(data) {
  var isValid = false;
  try {
    var obj = JSON.parse(data);
    if (Object.keys(obj).length != 3) {
      isValid = false;
    }
    else if ('id' in obj && 'data' in obj && 'parent' in obj) {
      // TODO: We can do other security checks like white lists and Regular expressions in here
      if ((obj['id'].length > 0 && obj['id'].length < 20) &&
        (obj['data'].length > 0 && obj['data'].length < 200) &&
        (obj['parent'].length > 0 && obj['parent'].length < 20)) {
        isValid = true;
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

exports.validateRequest = validateRequest;
/**
* Function for sending responses.
* @param {string} response The respone to be sent.
* @param {string} code The http response code.
* @param {string} text The text that we want to show to the client.
*/
function handleResponse(response, code, text) {
  response.writeHead(code, { 'Content-Type': 'application/json' });
  let obj = {
    statusCode: code,
    message: text
  };
  response.write(JSON.stringify(obj));
  response.end();
}

exports.handleResponse = handleResponse;
/**
 * Build a standard API Gateway response with CORS headers.
 */
function respond(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-User-Id',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
    },
    body: JSON.stringify(body),
  };
}

function success(data) {
  return respond(200, data);
}

function badRequest(message) {
  return respond(400, { error: message });
}

function serverError(message) {
  return respond(500, { error: message || 'Internal server error' });
}

module.exports = { respond, success, badRequest, serverError };

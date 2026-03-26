const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../shared/dynamodb');
const { success, badRequest, serverError } = require('../../shared/response');

/**
 * GET /api/avatar?userId=xxx
 * or GET /api/avatar with X-User-Id header
 *
 * Returns the avatar profile for the given user.
 */
exports.handler = async (event) => {
  try {
    const userId =
      event.queryStringParameters?.userId || event.headers?.['x-user-id'];

    if (!userId) {
      return badRequest('userId is required (query param or X-User-Id header)');
    }

    const result = await docClient.send(
      new GetCommand({
        TableName: process.env.AVATARS_TABLE,
        Key: { userId },
      })
    );

    if (!result.Item) {
      return success({ avatar: null });
    }

    return success({ avatar: result.Item });
  } catch (err) {
    console.error('getAvatar error:', err);
    return serverError('Failed to get avatar: ' + err.message);
  }
};

const { QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../shared/dynamodb');
const { success, badRequest, serverError } = require('../../shared/response');

/**
 * GET /api/memories?userId=xxx
 * or GET /api/memories with X-User-Id header
 *
 * Returns all memory nodes for the given user.
 */
exports.handler = async (event) => {
  try {
    const userId =
      event.queryStringParameters?.userId || event.headers?.['x-user-id'];

    if (!userId) {
      return badRequest('userId is required (query param or X-User-Id header)');
    }

    const result = await docClient.send(
      new QueryCommand({
        TableName: process.env.MEMORIES_TABLE,
        KeyConditionExpression: 'userId = :uid',
        ExpressionAttributeValues: { ':uid': userId },
      })
    );

    return success({ memories: result.Items || [] });
  } catch (err) {
    console.error('getMemories error:', err);
    return serverError('Failed to get memories: ' + err.message);
  }
};

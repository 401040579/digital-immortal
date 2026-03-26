const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../shared/dynamodb');
const { success, badRequest, serverError } = require('../../shared/response');

/**
 * POST /api/avatar
 * Body: { userId, name, bigFive, communicationStyle, values, catchphrases, ... }
 *
 * Saves or updates the avatar profile in DynamoDB.
 * Also creates/updates a minimal user record.
 */
exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const userId = body.userId || event.headers?.['x-user-id'];

    if (!userId) {
      return badRequest('userId is required');
    }

    const now = new Date().toISOString();

    // Save avatar data
    const avatarItem = {
      userId,
      name: body.name || '未命名',
      bigFive: body.bigFive || {
        openness: 0.5,
        conscientiousness: 0.5,
        extraversion: 0.5,
        agreeableness: 0.5,
        neuroticism: 0.5,
      },
      communicationStyle: body.communicationStyle || {
        formality: 0.5,
        humor: 0.5,
        verbosity: 0.5,
        emotionality: 0.5,
      },
      values: body.values || [],
      catchphrases: body.catchphrases || [],
      redLines: body.redLines || '',
      similarity: body.similarity || 35,
      updatedAt: now,
      createdAt: body.createdAt || now,
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.AVATARS_TABLE,
        Item: avatarItem,
      })
    );

    // Also ensure a user record exists
    await docClient.send(
      new PutCommand({
        TableName: process.env.USERS_TABLE,
        Item: {
          userId,
          avatarName: avatarItem.name,
          updatedAt: now,
          createdAt: now,
        },
        ConditionExpression: 'attribute_not_exists(userId)',
      })
    ).catch(() => {
      // User already exists -- that's fine, just update timestamp
      return docClient.send(
        new PutCommand({
          TableName: process.env.USERS_TABLE,
          Item: {
            userId,
            avatarName: avatarItem.name,
            updatedAt: now,
          },
        })
      );
    });

    return success({ message: 'Avatar saved', avatar: avatarItem });
  } catch (err) {
    console.error('saveAvatar error:', err);
    return serverError('Failed to save avatar: ' + err.message);
  }
};

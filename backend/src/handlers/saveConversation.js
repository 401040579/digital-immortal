const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../shared/dynamodb');
const { success, badRequest, serverError } = require('../../shared/response');

/**
 * POST /api/conversations
 * Body: { userId, conversationId?, messages, summary? }
 *
 * Saves a conversation record.
 */
exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const userId = body.userId || event.headers?.['x-user-id'];

    if (!userId) {
      return badRequest('userId is required');
    }

    const now = new Date().toISOString();
    const conversationId =
      body.conversationId || `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const item = {
      userId,
      conversationId,
      messages: body.messages || [],
      summary: body.summary || '',
      messageCount: (body.messages || []).length,
      createdAt: body.createdAt || now,
      updatedAt: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.CONVERSATIONS_TABLE,
        Item: item,
      })
    );

    return success({ message: 'Conversation saved', conversation: item });
  } catch (err) {
    console.error('saveConversation error:', err);
    return serverError('Failed to save conversation: ' + err.message);
  }
};

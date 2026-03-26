const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../shared/dynamodb');
const { success, badRequest, serverError } = require('../../shared/response');

/**
 * POST /api/memories
 * Body: { userId, memoryId?, label, type, content, importance, emotionalValence, connections, ... }
 *
 * Adds a memory node to the user's memory graph.
 */
exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const userId = body.userId || event.headers?.['x-user-id'];

    if (!userId) {
      return badRequest('userId is required');
    }

    const now = new Date().toISOString();
    const memoryId = body.memoryId || `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const memoryItem = {
      userId,
      memoryId,
      label: body.label || '',
      type: body.type || 'experience',
      content: body.content || '',
      importance: body.importance ?? 50,
      emotionalValence: body.emotionalValence ?? 0,
      connections: body.connections || [],
      timestamp: body.timestamp || now,
      isCore: body.isCore || false,
      emotionTags: body.emotionTags || [],
      relatedDialogs: body.relatedDialogs || [],
      createdAt: now,
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.MEMORIES_TABLE,
        Item: memoryItem,
      })
    );

    return success({ message: 'Memory saved', memory: memoryItem });
  } catch (err) {
    console.error('saveMemory error:', err);
    return serverError('Failed to save memory: ' + err.message);
  }
};

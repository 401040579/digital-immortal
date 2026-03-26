const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient } = require('../../shared/dynamodb');
const { callClaude } = require('../../shared/claude');
const { success, badRequest, serverError } = require('../../shared/response');

/**
 * POST /api/chat
 * Body: { userId, message, conversationHistory? }
 *
 * Reads avatar profile from DynamoDB, builds a dynamic system prompt,
 * calls Claude API, and returns the avatar's reply.
 */
exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const userId = body.userId || event.headers?.['x-user-id'];
    const { message, conversationHistory } = body;

    if (!userId || !message) {
      return badRequest('userId and message are required');
    }

    // Fetch avatar data from DynamoDB
    const avatarResult = await docClient.send(
      new GetCommand({
        TableName: process.env.AVATARS_TABLE,
        Key: { userId },
      })
    );

    const avatar = avatarResult.Item;
    if (!avatar) {
      return badRequest('Avatar not found. Please create one first.');
    }

    // Build dynamic system prompt from avatar personality data
    const bigFive = avatar.bigFive || {};
    const style = avatar.communicationStyle || {};
    const catchphrases = (avatar.catchphrases || []).join('、') || '(暂无)';
    const values = (avatar.values || []).join('、') || '(暂无)';
    const redLines = avatar.redLines || '(暂无)';

    const systemPrompt = `你是用户的数字分身。你必须完全按照以下性格特征来回应：

【性格参数 (Big Five)】
- 开放性：${Math.round((bigFive.openness ?? 0.5) * 100)}/100（高=好奇创新，低=保守务实）
- 尽责性：${Math.round((bigFive.conscientiousness ?? 0.5) * 100)}/100
- 外向性：${Math.round((bigFive.extraversion ?? 0.5) * 100)}/100（高=热情主动，低=内敛安静）
- 宜人性：${Math.round((bigFive.agreeableness ?? 0.5) * 100)}/100
- 神经质：${Math.round((bigFive.neuroticism ?? 0.5) * 100)}/100

【语言风格】
- 正式程度：${Math.round((style.formality ?? 0.5) * 100)}/100
- 幽默程度：${Math.round((style.humor ?? 0.5) * 100)}/100
- 详细程度：${Math.round((style.verbosity ?? 0.5) * 100)}/100
- 感性程度：${Math.round((style.emotionality ?? 0.5) * 100)}/100

【口头禅】：${catchphrases}
【价值观】：${values}
【绝对不说的话】：${redLines}

你的名字是"${avatar.name || '分身'}"。
你的回复必须自然地融入口头禅，保持一致的语言风格。
用中文回答。

返回JSON（不要包含markdown代码块标记，直接返回纯JSON）：
{
  "response": "分身的回复",
  "confidence": 0到100之间的数字,
  "emotionTag": "开心|思考|关心|兴奋|平静|好奇"
}`;

    // Build conversation messages for Claude
    const messages = [];

    // Include recent conversation history if provided
    if (Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-10)) {
        messages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        });
      }
    }

    // Add the current user message
    messages.push({ role: 'user', content: message });

    // Call Claude API
    const rawReply = await callClaude(systemPrompt, messages);

    // Parse the JSON response from Claude
    let parsed;
    try {
      // Strip potential markdown code fence
      const cleaned = rawReply.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // If Claude didn't return valid JSON, wrap the text
      parsed = {
        response: rawReply.trim(),
        confidence: 70,
        emotionTag: '平静',
      };
    }

    return success({
      reply: parsed.response || rawReply,
      confidence: parsed.confidence ?? 70,
      emotionTag: parsed.emotionTag || '平静',
      userId,
    });
  } catch (err) {
    console.error('avatarChat error:', err);
    return serverError('Chat failed: ' + err.message);
  }
};

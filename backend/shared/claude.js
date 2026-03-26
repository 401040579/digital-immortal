const https = require('https');
const { getAnthropicApiKey } = require('./ssm');

/**
 * Call the Anthropic Messages API.
 * @param {string} systemPrompt - system-level instruction
 * @param {Array<{role:string,content:string}>} messages - conversation turns
 * @returns {Promise<string>} - assistant reply text
 */
async function callClaude(systemPrompt, messages) {
  const apiKey = await getAnthropicApiKey();

  const body = JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode !== 200) {
              reject(new Error(`Claude API error ${res.statusCode}: ${data}`));
              return;
            }
            const text = parsed.content?.[0]?.text || '';
            resolve(text);
          } catch (err) {
            reject(new Error(`Failed to parse Claude response: ${err.message}`));
          }
        });
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

module.exports = { callClaude };

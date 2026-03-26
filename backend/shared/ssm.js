const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm');

const ssm = new SSMClient({ region: 'us-east-1' });

let cachedApiKey = null;

/**
 * Retrieve the Anthropic API key from SSM Parameter Store.
 * Caches the value for the lifetime of the Lambda container.
 */
async function getAnthropicApiKey() {
  if (cachedApiKey) return cachedApiKey;

  const paramName = process.env.ANTHROPIC_API_KEY_PARAM || '/app/anthropic-api-key';
  const { Parameter } = await ssm.send(
    new GetParameterCommand({ Name: paramName, WithDecryption: true })
  );
  cachedApiKey = Parameter.Value;
  return cachedApiKey;
}

module.exports = { getAnthropicApiKey };

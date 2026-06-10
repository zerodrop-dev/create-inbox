const core = require('@actions/core');

const FREE_DOMAIN = 'zerodrop-sandbox.online';

function generateInboxName() {
  const adjectives = [
    'swift', 'dark', 'cold', 'null', 'void',
    'zero', 'dead', 'raw', 'base', 'core'
  ];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const id = Math.random().toString(36).substring(2, 9);
  return `${adj}-${id}`;
}

async function run() {
  try {
    const apiKey = core.getInput('api_key');

    // Generate inbox locally — no network request needed
    const inboxName = generateInboxName();
    const inbox = `${inboxName}@${FREE_DOMAIN}`;

    // Set outputs
    core.setOutput('inbox', inbox);
    core.setOutput('inbox_name', inboxName);

    // Mask the inbox name so it doesn't leak in logs
    core.setSecret(inbox);

    if (apiKey) {
      core.info(`[ZeroDrop] Workspace mode — inbox: ${inboxName}@...`);
    } else {
      core.info(`[ZeroDrop] Sandbox mode — inbox ready (30-min TTL, AI-filtered)`);
      core.info(`[ZeroDrop] Upgrade to Workspaces for custom domains + API keys: https://zerodrop.dev`);
    }

    core.info(`[ZeroDrop] ✓ Inbox generated successfully`);

  } catch (error) {
    core.setFailed(`ZeroDrop Action failed: ${error.message}`);
  }
}

run();

const { describe, it } = require('node:test');
const assert = require('node:assert');

// Extract the inbox generation logic for unit testing
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

function generateInbox() {
  return `${generateInboxName()}@${FREE_DOMAIN}`;
}

describe('generateInboxName', () => {
  it('returns a string', () => {
    const name = generateInboxName();
    assert.strictEqual(typeof name, 'string');
  });

  it('follows adj-id format', () => {
    const name = generateInboxName();
    assert.match(name, /^[a-z]+-[a-z0-9]+$/);
  });

  it('uses a valid adjective prefix', () => {
    const adjectives = ['swift', 'dark', 'cold', 'null', 'void', 'zero', 'dead', 'raw', 'base', 'core'];
    const name = generateInboxName();
    const prefix = name.split('-')[0];
    assert.ok(adjectives.includes(prefix), `Unknown adjective: ${prefix}`);
  });

  it('generates unique names', () => {
    const names = new Set();
    for (let i = 0; i < 100; i++) {
      names.add(generateInboxName());
    }
    assert.ok(names.size > 90, 'Too many collisions in 100 generated names');
  });
});

describe('generateInbox', () => {
  it('returns a valid email address', () => {
    const inbox = generateInbox();
    assert.match(inbox, /^[a-z]+-[a-z0-9]+@zerodrop-sandbox\.online$/);
  });

  it('uses the correct domain', () => {
    const inbox = generateInbox();
    assert.ok(inbox.endsWith('@zerodrop-sandbox.online'));
  });

  it('generates 100 valid inboxes without error', () => {
    for (let i = 0; i < 100; i++) {
      const inbox = generateInbox();
      assert.match(inbox, /^[a-z]+-[a-z0-9]+@zerodrop-sandbox\.online$/);
    }
  });
});

# zerodrop/create-inbox

> GitHub Action — generate a disposable email inbox for CI testing

No Docker. No SMTP config. No signup required.

[![GitHub Marketplace](https://img.shields.io/badge/Marketplace-ZeroDrop%20Create%20Inbox-green?logo=github)](https://github.com/marketplace/actions/zerodrop-create-inbox)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## What it does

Generates a disposable `@zerodrop-sandbox.online` inbox as a CI step and exposes it as an output variable. Your tests use the inbox to catch real emails — password resets, magic links, verification codes — without any infrastructure.

```yaml
- name: Generate test inbox
  id: inbox
  uses: zerodrop-dev/create-inbox@v1

- name: Run tests
  run: npx playwright test
  env:
    TEST_INBOX: ${{ steps.inbox.outputs.inbox }}
```

---

## Usage

### Basic (free sandbox)

```yaml
steps:
  - uses: zerodrop-dev/create-inbox@v1
    id: inbox

  - run: npx playwright test
    env:
      TEST_INBOX: ${{ steps.inbox.outputs.inbox }}
```

### With Workspace API key

```yaml
steps:
  - uses: zerodrop-dev/create-inbox@v1
    id: inbox
    with:
      api_key: ${{ secrets.ZERODROP_API_KEY }}

  - run: npx playwright test
    env:
      TEST_INBOX: ${{ steps.inbox.outputs.inbox }}
```

---

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `api_key` | No | `''` | ZeroDrop Workspace API key. Omit for free sandbox mode. |

## Outputs

| Output | Description | Example |
|--------|-------------|---------|
| `inbox` | Full email address | `swift-x7k2m@zerodrop-sandbox.online` |
| `inbox_name` | Inbox name without domain | `swift-x7k2m` |

---

## In your test

```typescript
import { ZeroDrop } from 'zerodrop-client';

const mail = new ZeroDrop();

// Use the inbox injected by the Action, or generate one locally
const inbox = process.env.TEST_INBOX ?? mail.generateInbox();

// Register with the inbox, then wait for the verification email
const email = await mail.waitForLatest(inbox, { timeout: 15000 });
const link = email.body.match(/https?:\/\/\S+verify\S+/)?.[0];
await page.goto(link);
```

---

## Free tier limits

- Shared domain (`zerodrop-sandbox.online`)
- AI spam filtering
- 30-minute email TTL
- No signup required

## Workspaces

For teams who need custom domains, longer retention, and API keys:
→ [zerodrop.dev](https://zerodrop.dev)

---

## License

MIT

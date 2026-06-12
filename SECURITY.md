# Security Policy

## Overview

ZeroDrop is a disposable email inbox service built for CI/CD pipelines. This document describes the security architecture, data handling practices, and how to report vulnerabilities.

---

## Data Handling

### What gets stored
- **Inbox name** (e.g. `swift-x7k2m`) — derived from the recipient address
- **Raw email payload** — MIME message including headers, subject, and body
- **Received timestamp** — UTC time of receipt

### What never gets stored
- Sender IP addresses
- Authentication tokens or cookies
- Any data outside the email payload itself

### Retention
All inbox data is stored in Upstash Redis with a **30-minute TTL**. After 30 minutes, the key is automatically deleted by Redis — no manual cleanup required, no data persists.

### Edge parsing
Email parsing happens entirely inside the Cloudflare Worker at the edge — before any data reaches Redis. The worker:
1. Extracts from, to, subject, message-id, and raw body from the MIME payload
2. Runs a Llama 3.1 spam classification (SPAM / LEGITIMATE)
3. Silently drops spam — it never reaches Redis
4. Stores only legitimate emails under `inbox:{name}` with a 1800s TTL

The worker source code is fully auditable:
→ https://github.com/zerodrop-dev/zerodrop-worker

### OTP and verification codes
OTPs and verification links are stored as part of the raw email body. They expire along with the inbox after 30 minutes. ZeroDrop does not parse, extract, or log OTP values separately.

---

## GitHub Action Security

The `zerodrop-dev/create-inbox` Action generates inbox names **locally on the runner** — no network request is made during the generation step. The inbox address is a random string; it does not contact ZeroDrop servers until your tests begin polling.

### Supply chain hardening

Pin to a specific commit SHA rather than a floating tag:

```yaml
# Recommended for production
uses: zerodrop-dev/create-inbox@8706a59  # v1.0.0
```

### Action permissions
The Action requires no special GitHub permissions. It does not access `GITHUB_TOKEN`, repository contents, secrets, or any runner environment variables.

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| v1.x    | ✅ Yes    |

---

## Reporting a Vulnerability

If you discover a security vulnerability in ZeroDrop, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Email: **security@zerodrop.dev**

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested mitigations

We will acknowledge receipt within 48 hours and aim to resolve critical issues within 7 days.

---

## Threat Model

| Threat | Mitigation |
|--------|-----------|
| Inbox enumeration | Inbox names are random 9-character strings — brute force is impractical within the 30-min window |
| Data persistence | Hard Redis TTL — data cannot persist beyond 30 minutes regardless of application logic |
| Supply chain attack via Action | SHA pinning documented; worker source is auditable |
| OTP theft | 30-min TTL limits exposure window; OTPs are only accessible to whoever knows the inbox name |
| Spam flooding | Llama 3.1 spam filter drops automated spam at the edge before Redis writes |

---

## Contact

- Security disclosures: security@zerodrop.dev
- General: zerodrop.dev

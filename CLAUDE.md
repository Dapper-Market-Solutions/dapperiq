# n8n to App — Project Context

## Purpose
This project converts n8n workflows into web apps. Each workflow becomes a frontend app:
users interact with the app → data goes to n8n → n8n responds → result is displayed.

## Repo Structure (Monorepo)
- `apps/<app-name>/` — one folder per app (React + Vite + Tailwind)
- `packages/ui/` — shared components (planned, not yet created)

## Tech Stack
- **Frontend**: React 18, Vite 5, Tailwind CSS 3
- **Deployment**: Vercel (auto-synced to GitHub)
- **Version control**: GitHub (`Dapper-Market-Solutions/dapperiq`)
- **Backend**: n8n workflows (webhook-triggered)
- **Payments**: QuickBooks Online (invoicing + card/eCheck)
- **Data**: AudienceLab API (audience segments), Google Sheets (delivery tracking)

## Workflow for Each New App
1. Use **n8n-mcp** to inspect the target workflow — confirm webhook URL, input schema, output format
2. Optimize the workflow in n8n if needed (correct data intake/response shape)
3. Scaffold the app under `apps/<app-name>/` (Vite + React + Tailwind)
4. Build and test locally — confirm data flows correctly to/from n8n
5. Push to GitHub via **GitHub MCP**
6. Vercel auto-deploys — live URL is always up to date

## Available Tools
- `n8n-mcp` — inspect, create, edit n8n workflows and nodes
- `GitHub MCP` — push code, manage repos
- **Skill: n8n** — n8n patterns and best practices
- **Skill: frontend-design** — React/Tailwind UI patterns

---

## Infrastructure

### n8n Instance
- **URL**: `https://n8n.srv1379431.hstgr.cloud/`
- **Webhook base**: `https://n8n.srv1379431.hstgr.cloud/webhook/`
- **Webhook nodes**: Must include `webhookId` (UUID) property on the node for production webhook registration to work via API
- **Error handler workflow**: `u0EjrFBh2oPy2bcc` (sends Slack alerts on failure)

### Slack
- **Bot name**: DapperIQ Bot
- **Credential ID**: `sih4esi5sFPImV1Z` ("DMS Slack General")
- **Channel**: `C0AJ8QGSCMP`
- For private channels, the bot must be invited first (`/invite @DapperIQ Bot`)

### QuickBooks Online
- **OAuth2 Credential**: `c1hETSrYjcrv7BId` ("QB Online Account") — for invoicing
- **Payments API Credential**: `ESGcln9xRl13km5s` ("QBO Credential") — for card/eCheck charges
- **Item ID**: `55` (standard line item for all invoices)

### Google Sheets
- **OAuth2 Credential**: `abMj6JensW6XorTr`
- Used for delivery tracking (dedup by UUID)

### AudienceLab
- **Base URL**: `https://api.audiencelab.io`
- **Auth**: `X-Api-Key` header
- **API Key**: see `.claude-secrets.md`
- **Endpoints**:
  - `GET /audiences` — list all audiences
  - `GET /audiences/{id}` — records + count
  - `GET /segments/{id}` — segment records (no list endpoint — must know ID)
- **Note**: `total_records` from segment API may be inaccurate (reflects base audience size)

### TransferNow (deprecated — no longer used)
- **API Key**: see `.claude-secrets.md`
- Replaced by direct Google Sheet delivery for all clients

## Environment Variables
- Never hardcode n8n webhook URLs or API keys
- Use `.env.local` locally
- Set matching env vars in Vercel for production

## Key Principles
- Keep each app minimal and focused on its workflow's purpose
- Validate n8n data shapes before building the frontend
- Test locally before pushing to GitHub

---

## App 1: `apps/audiencelab-browser/`

Internal tool for viewing AudienceLab audience record counts.

**What it does:**
- Fetches all audiences from AudienceLab API
- Shows each audience name + record count + today's date
- Simple table, no drill-down, no segments — internal use only

**Key files:**
- `src/App.jsx` — main UI (simple dashboard table)
- `src/api/audiencelab.js` — API client (BASE_URL = `/api` proxy)
- `src/segments.js` — registry of known segments
- `vite.config.js` — proxies `/api` → `https://api.audiencelab.io` (CORS fix)
- `vercel.json` — same proxy rewrite for production

**`.env.local`:**
- `VITE_AUDIENCELAB_API_KEY` — AudienceLab API key

**Known segments (in `segments.js`):**
| Name | ID |
|------|----|
| Indexed Universal Life Insurance | `5a94b978-c83a-429d-b951-83346785e001` |
| WVID DMS | `45cea669-f68d-48f9-b8d6-7ed6c9c40b9c` |
| WVID Central Coast Carts | `3cbec008-93b8-4184-9567-869b8afee4b9` (pixel data, dedupKey: HEM_SHA256) |

---

## App 2: `apps/dapperiq-portal/`

Client-facing portal for ordering audience data. Clients log in with a client ID, see available segments, select quantities, agree to terms, authorize payment, and orders are fulfilled via n8n.

**Live URL**: `diq.dapperms.com`
**GitHub**: `Dapper-Market-Solutions/dapperiq`

**Architecture:**
1. **Login** — client enters client ID → portal calls n8n with `mode: config` → gets segments, pricing, client name
2. **Order Form** — client selects record quantities per segment → terms modal → payment auth modal
3. **Order Progress** — submits each segment order sequentially to n8n → shows live status per order

**Key files:**
- `src/App.jsx` — 3-step flow: login → order form → results
- `src/api/dapperiq.js` — API client: `getClientConfig()`, `submitOrder()`
- `src/components/LoginScreen.jsx` — client ID input
- `src/components/OrderForm.jsx` — segment selection, terms modal, payment auth modal
- `src/components/OrderProgress.jsx` — live order status with spinners/checkmarks
- `src/components/SegmentCard.jsx` — individual segment quantity selector
- `src/components/Header.jsx` — logo + client name
- `src/components/Footer.jsx` — branding footer
- `api/order.js` — Vercel serverless proxy: routes orders to correct n8n webhook per client
- `vite.config.js` — dev proxy to n8n
- `vercel.json` — Vercel config (framework: vite)
- `tailwind.config.js` — extended with navy & gold brand colors

**Serverless routing (`api/order.js`):**
- Reads `CLIENT_ROUTES` env var (JSON map of client_id → {url, secret})
- Falls back to `WEBHOOKURL` + `WEBHOOKSECRET` if client not in routes
- Injects `_webhook_secret` into body for n8n auth

**`.env.local`:** see `.claude-secrets.md` for full values
```
WEBHOOKURL=https://n8n.srv1379431.hstgr.cloud/webhook/lead-fulfillment
WEBHOOKSECRET=<secret>
CLIENT_ROUTES={"dms2026":{"url":"...","secret":"..."},"bdl":{"url":"...","secret":"..."}}
```

---

## n8n Workflows

### Workflow: "Big Daddy Leads - DIQ Fulfillment"
- **ID**: `WwUFfZS9PIz3sylZ`
- **Webhook path**: `bdl-leads`
- **Status**: Active, TEST_MODE = true (set to false for live billing)
- **Client**: Big Daddy Leads (BDL)
- **QB Customer ID**: `301`

**Client credentials:**
- **Portal Secret**: see `.claude-secrets.md`
- **Direct API Key**: see `.claude-secrets.md`
- **client_id**: `bdl`

**Segments:**
| Name | Segment ID | Tab | Rate |
|------|-----------|-----|------|
| BDL \| IUL (Universal Life Insurance) | `3f03d6ae-7cb2-49b0-8e5f-a1b941f0b069` | IUL | $0.10/record |
| BDL \| VET (Veterans Life Insurance) | `8e5553d3-14a8-4681-a2f1-404ac01dd563` | VET | $0.10/record |

**Delivery Google Sheet**: `1pf7YvVpE0Y7h0ywaH4cM4CG-gAfO_T2ctdHn5nIb5IY`
- Two tabs: IUL, VET
- Unified headers (both tabs): `UUID, DIQ_ID, DELIVERY_DATE, FIRST_NAME, LAST_NAME, MOBILE_PHONE, MOBILE_PHONE_DNC, PERSONAL_VERIFIED_EMAILS, STATE, INCOME_RANGE, NET_WORTH, MARRIED, CHILDREN, SKIPTRACE_EXACT_AGE`
- STATE is mapped from `SKIPTRACE_STATE` (IUL) or `PERSONAL_STATE` (VET)
- Dedup: reads UUID column, 30-day window (records >30 days old can be re-delivered)
- DIQ ID format: `DIQ-BDL-{tab}-{YYYYMMDD}-{seq}` (5-digit zero-padded sequence)

**Flow (23 nodes):**
```
Webhook → Validate Request → Is Config?
  → (true) Respond Config (returns segments + pricing)
  → (false) Is Valid?
    → (error) Respond Error
    → (valid) Is Live? (checks TEST_MODE)
      → (live) Create Invoice → Get Cards → Has Card?
        → (yes) Charge Card → Read Sheet → Pull & Dedup → Has Records? → ...
        → (no) Get Bank Accounts → Has Bank?
          → (yes) Charge eCheck → Read Sheet → ...
          → (no) Read Sheet → ...
      → (test) Read Sheet → Pull & Dedup → Has Records?
        → (no records) Respond No Records
        → (has records) Format Append Data → Append to Sheet → Prepare Response → Respond Success → Slack
```

**Test mode:** `TEST_MODE = true` in Validate Request node. When true, skips invoice creation and payment. Slack message shows test mode warning. Set to `false` for production billing.

---

### Workflow: "DMS Demo - DIQ Fulfillment"
- **ID**: `MTlieeUorxEFBF2q`
- **Status**: Active, TEST_MODE = true (set to false for live billing)
- **Nodes**: 30 (was 34 — removed TransferNow nodes)
- **client_id**: `dms2026`
- **CLF Secret**: see `.claude-secrets.md`
- **Delivery**: Google Sheet (roster sheet doubles as client delivery sheet)
- **Config sheet**: `1NlQejk4HEymoeZ_kNQzzkPL4c11Axqpi19_tV1QGDQs` (Sheet1)

**Flow:** Webhook → Read Config → Is Config? → Validate Request → Is Valid? → Has QB Customer? → [payment flow] → Has Roster? → Read Roster → Pull Records → Prepare Post-Delivery → [Append to Roster + Slack] → Update Delivery Stats → Send Email → Success Response

**Test mode:** `TEST_MODE = true` in Validate Request. When true, the "Has QB Customer?" condition also checks `_testMode === false`, so it always routes to the no-invoice path in test mode.

---

### Workflow: Error Handler - Slack Notification
- **ID**: `u0EjrFBh2oPy2bcc`
- **Nodes**: 2, Active
- Referenced in `errorWorkflow` settings of all production workflows
- Sends Slack notification on workflow failure

### Workflow: DapperIQ — M1 Core Pipeline v2
- **ID**: `TGWxLO8d9QYRcMxL`
- **Nodes**: 12, Active
- **Tags**: M1, DapperIQ
- Core pipeline for DapperIQ processing

### Workflow: Pathworks Financial
- **ID**: `G9AEjToEpDXFIT53`
- **Nodes**: 15, Active
- Client fulfillment workflow for Pathworks Financial

### Workflow: Friday Recap
- **ID**: `mfglRAZHNOaP69Uc`
- **Nodes**: 4, Active
- Weekly recap (runs on Fridays) — summarizes orders received + filled

### WVID Workflows (Website Visitor ID)
All active, webhook-triggered workflows for WVID clients:

| Workflow | ID | Nodes |
|----------|----|-------|
| WVID - DMS to GHL | `3SDgvOtQS5cxQ7Ey` | 12 |
| WVID - Aura Health and Spa | `FJFORKy0a1LSmkJF` | 9 |
| WVID - Memory Lane Assisted Living | `GtqozB7i4MMxlaja` | 9 |
| WVID - Central Coast Carts | `XEqnPf47sVuGdZCd` | 11 |
| WVID - ScottsAutoGolf | `ll7BOa5ZtKBmpD6h` | 11 |
| WVID - Golf Cart World | `yq2Q8EErwNsZIte8` | 11 |
| WVID - Get Well Chiropractic | `zfFqcyPKakM0WNQH` | 9 |

### Utility / One-time Workflows (inactive/archived)

| Workflow | ID | Status |
|----------|----|--------|
| TransferNow Upload Test | `ZRUDXbJFqucYj73q` | Active (test) |
| Reset BDL Sheet Headers | `PDewATHqoQVF1F4I` | Inactive |
| ELearning Form Submission | `mCASGMNnpEj44GEB` | Inactive |
| Add Config Columns | `Gak6dWptAilH0RB4` | Archived |
| Backfill Roster | `lTnGokfLjpktLUpL` | Archived |
| Client Config API | `zfBBG5Qvwd8RivKq` | Archived |

---

## Architecture Decisions

1. **Google Sheets for delivery** (not TransferNow/email): Records go directly to a shared Google Sheet. Gives access control (can revoke sharing) vs files stuck in email forever.

2. **Unified STATE column**: Both IUL and VET segments use identical sheet headers. `SKIPTRACE_STATE` (IUL) and `PERSONAL_STATE` (VET) are both mapped to `STATE` at pull time.

3. **Per-client webhook routing**: The portal's serverless function (`api/order.js`) routes each client_id to a different n8n webhook. Each client has their own workflow with their own segments, pricing, and QB customer.

4. **Config mode**: Each workflow supports `mode: config` which returns segment list + pricing without placing an order. The portal uses this for the login/config step.

5. **Dual auth**: Workflows accept both portal secret (`_webhook_secret`) and direct API key (`x-api-key` header) for flexibility — portal users and direct API consumers.

6. **Test mode pattern**: `const TEST_MODE = true/false` at the top of Validate Request node. Outputs `_testMode` flag used by downstream IF nodes to bypass payment flow. Easy to toggle per workflow.

7. **30-day dedup window**: Records delivered more than 30 days ago are eligible for re-delivery. Prevents permanent lockout while avoiding near-term duplicates.

8. **n8n Code node limitations**: `httpRequestWithAuthentication` is NOT supported in Code nodes. Use HTTP Request nodes for authenticated API calls (Google Sheets, etc.).

---

## Common n8n Patterns

- **Node names with special characters** (e.g., "Has New Records?"): Use node IDs in `removeConnection`/`addConnection` operations, not names
- **Node repositioning**: Use `moveNode` operation (not `repositionNode`)
- **Workflow save fails with disconnected nodes**: Always include `addConnection` operations in the same call as `addNode`
- **Google Sheets API in Code nodes**: Cannot use authenticated helpers. Use HTTP Request nodes instead.
- **Webhook response mode**: Set to `responseNode` to respond AFTER processing (allows background tasks like sheet append + Slack to continue after response)

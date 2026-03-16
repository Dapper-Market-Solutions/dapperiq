# Adding a New Client to DapperIQ

Step-by-step guide for onboarding a new client to the DapperIQ portal.

---

## Prerequisites

Before starting, gather the following for the new client:

- [ ] **Client ID** — short lowercase identifier (e.g., `bdl`, `dms2026`)
- [ ] **Client name** — display name (e.g., "Big Daddy Leads")
- [ ] **Segments** — for each segment:
  - Segment display name (e.g., "Universal Life Insurance")
  - AudienceLab audience/segment ID (UUID)
  - Pull type: `audience` or `segment`
  - Short code for sheet tab (e.g., `ULI`, `FE`, max ~8 chars)
  - Rate per record (e.g., `0.10`)
  - Max records per pull (e.g., `10000`)
- [ ] **Slack channel ID** — create a dedicated channel, get the ID from channel details (starts with `C`)
- [ ] **QuickBooks customer ID** — if billing is enabled (optional, can skip for test mode)
- [ ] **Webhook secret** — generate a unique secret for this client (use `openssl rand -hex 32`)

---

## Step 1: Create the Google Sheet

1. Create a new Google Sheet for this client's deliveries
2. Share it with the DapperIQ service account (same Google account used for existing sheets)
3. Add one tab per segment, named using the **short code** (e.g., `ULI`, `FE`, `MTG`)
4. Note the **spreadsheet ID** from the URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

---

## Step 2: Create the n8n Workflow

The easiest approach is to duplicate an existing workflow. Use **"DMS 2026 - DIQ Fulfillment"** (`d1JCl3E2vkClbyiR`) as the template — it has the cleanest architecture.

### Option A: Duplicate in n8n UI
1. Open the DMS 2026 workflow in n8n
2. Select all nodes (Ctrl+A) → Copy (Ctrl+C)
3. Create a new workflow named `{Client Name} - DIQ Fulfillment`
4. Paste all nodes (Ctrl+V)
5. Update the nodes listed below

### Option B: Ask Claude to clone via API
Tell Claude: "Clone the DMS 2026 workflow for {client name} with client_id {id}"

### Nodes to Update

#### 1. Webhook
- **path**: Set a unique path (e.g., `clientname-leads`)
- This becomes the webhook URL: `https://n8n.dmsdata.io/webhook/{path}`

#### 2. Validate Request (Code Node) — THE MAIN NODE TO EDIT
Update these constants at the top of the code:

```javascript
// TEST_MODE: start with true, set false when ready to bill
const TEST_MODE = true;

const SEGMENTS = {
  '{audiencelab-uuid-1}': { name: 'Segment Display Name', displayName: 'Segment Display Name', tab: 'TAB1', short: 'TAB1', rate: 0.10, maxRecords: 10000, pullType: 'audience' },
  '{audiencelab-uuid-2}': { name: 'Another Segment', displayName: 'Another Segment', tab: 'TAB2', short: 'TAB2', rate: 0.10, maxRecords: 10000, pullType: 'audience' },
  // Add one entry per segment...
};

// Generate a unique API key for direct API access (optional)
const CLIENT_API_KEY = '{client}_xxxxxxxxxxxxxxxxxxxx';

// Use the webhook secret generated in prerequisites
const PORTAL_SECRET = '{64-char-hex-secret}';

// AudienceLab credentials (same for all clients)
const AL_KEY = 'sk_Aef0niNE6LUtB2Oa2J1NiGCLjhFCdMUvGF7z6zMWE3M';
const AL_URL = 'https://api.audiencelab.io';

// QuickBooks customer ID (leave empty string if no billing yet)
const QB_CUSTOMER_ID = '{qb_customer_id}';
```

Also update the config response section to return the correct `client_id` and `client_name`:
```javascript
return [{ json: { _isConfig: true, _isError: false, success: true,
  client_id: '{client_id}',
  client_name: '{Client Display Name}',
  segments } }];
```

#### 3. Read Delivered Sheet (HTTP Request)
- **URL**: Replace the spreadsheet ID with the new client's sheet
- `https://sheets.googleapis.com/v4/spreadsheets/{NEW_SPREADSHEET_ID}/values/{{ $json.sheetTab }}!A:C`

#### 4. Append to Sheet (HTTP Request)
- **URL**: Same spreadsheet ID
- `https://sheets.googleapis.com/v4/spreadsheets/{NEW_SPREADSHEET_ID}/values/{{ $json.tabName }}!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`

#### 5. Slack Notification
- **channelId**: Set to the client's dedicated Slack channel ID
- Mode: `id` (not channel name)

#### 6. Get Customer Cards (HTTP Request) — if billing enabled
- **URL**: Update the QB customer ID, or leave as dynamic if using `qb_customer_id` from Validate Request
- DMS 2026 pattern (dynamic): `https://api.intuit.com/quickbooks/v4/customers/{{ $('Validate Request').first().json.qb_customer_id }}/cards`

#### 7. Get Bank Accounts (HTTP Request) — if billing enabled
- Same as above but for bank accounts endpoint

#### 8. Respond Success
- Ensure it references Prepare Response output:
- `respondWith`: json
- `responseBody`: `={{ JSON.stringify($('Prepare Response').first().json) }}`

### Activate the Workflow
Toggle the workflow **Active** in the top-right corner (or via API).

---

## Step 3: Update Vercel Environment Variables

In **Vercel → dapperiq project → Settings → Environment Variables**, update `CLIENT_ROUTES`:

```json
{
  "existing_client": { "url": "https://n8n.dmsdata.io/webhook/existing-path", "secret": "existing-secret" },
  "new_client_id": { "url": "https://n8n.dmsdata.io/webhook/{webhook-path}", "secret": "{64-char-hex-secret}" }
}
```

**Important**: This is a single JSON string containing ALL client routes. Copy the existing value, add the new client entry, and save.

After saving, Vercel functions pick up new env vars on the next cold start (usually within a few minutes, or trigger a redeployment).

---

## Step 4: Update Local `.env.local`

Update `/Users/dappermarketsolutions/Projects/dapperiq/.env.local` with the same CLIENT_ROUTES value so local development (`vercel dev`) also works.

---

## Step 5: Test

### Test config (login):
```bash
curl -s -X POST "https://n8n.dmsdata.io/webhook/{webhook-path}" \
  -H "Content-Type: application/json" \
  -d '{"mode":"config","client_id":"{client_id}","_webhook_secret":"{secret}"}'
```
Should return segment list with active lead counts.

### Test order (small batch):
```bash
curl -s -X POST "https://n8n.dmsdata.io/webhook/{webhook-path}" \
  -H "Content-Type: application/json" \
  -d '{"client_id":"{client_id}","segment_name":"{Segment Name}","record_count":10,"_webhook_secret":"{secret}"}'
```
Should return success with `new_records: 10` and fire Slack notification.

### Test via portal:
Go to `diq.dapperms.com`, enter the client ID, verify segments appear, place a small test order.

---

## Step 6: Go Live

When ready to enable real billing:
1. Set `TEST_MODE = false` in the Validate Request node
2. Ensure `QB_CUSTOMER_ID` is set to the correct QuickBooks customer
3. Verify the customer has a card or bank account on file in QuickBooks

---

## Quick Reference: Current Clients

| Client | client_id | Workflow ID | Webhook Path | Sheet ID | Slack Channel |
|--------|-----------|-------------|--------------|----------|---------------|
| Big Daddy Leads | `bdl` | `WwUFfZS9PIz3sylZ` | `bdl-leads` | `1pf7YvVpE0Y7h0ywaH4cM4CG-gAfO_T2ctdHn5nIb5IY` | `C0AJ8QGSCMP` |
| DMS Demo | `dms2026` | `d1JCl3E2vkClbyiR` | `dms-leads` | `1PaEBR6Ul_4wNvhA6CPSiMicdOBWeZX6VZe2e0RS2SJs` | `C0AG9U68SQ6` |

---

## Shared Resources (Same Across All Clients)

| Resource | ID / Value |
|----------|------------|
| AudienceLab API Key | `sk_Aef0niNE6LUtB2Oa2J1NiGCLjhFCdMUvGF7z6zMWE3M` |
| Google Sheets OAuth | `abMj6JensW6XorTr` (credential ID) |
| Slack Bot Credential | `sih4esi5sFPImV1Z` ("DMS Slack General") |
| QuickBooks OAuth (invoicing) | `c1hETSrYjcrv7BId` |
| QuickBooks Payments | `ESGcln9xRl13km5s` |
| Order Log Sheet | `1_OOCvFVljZlSQtMaLigAfR_26y9HveTp4riqaYpSfTQ` (shared across all clients) |
| Error Handler Workflow | `u0EjrFBh2oPy2bcc` (set in workflow settings → Error Workflow) |

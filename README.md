# TokenSentinel

AI-powered insider fraud detection and SIEM dashboard for prepaid electricity vending systems.

## The Problem
Prepaid electricity vending is vulnerable to insider fraud — vendor staff exploiting weak audit trails to issue unauthorized or fraudulent tokens. This costs utility providers revenue and undermines trust in the vending process.

## The Solution
TokenSentinel gives vendors and utility providers real-time visibility into vending activity through:
- **Vendor Portal** — token request and issuance, with HMAC-secured output
- **SIEM Dashboard** — live fraud scoring per vendor, with anomaly detection
- **Audit Trail** — full transaction log with provenance for investigation

## Setup
\`\`\`
npm install
npm run dev
\`\`\`
Open `http://localhost:5173`

## Demo flow
1. Log in as a vendor
2. Generate tokens via the Vendor Portal
3. Open the SIEM Dashboard and run the fraud simulator to see live scoring
4. Review flagged transactions in the Audit Trail

## Architecture
- `src/App.jsx` — app state and routing
- `src/VendorPortal.jsx` — token issuance
- `src/SIEMDashboard.jsx` — fraud scoring dashboard
- `src/AuditTrail.jsx` — transaction log
- `src/data.js` — mock data (swap for live API)

## Roadmap
- Connect to real backend: `POST /vend`, `GET /audit-trail`, `WS /ws` for live fraud stream
- Deployed pilot with a vending partner

## Built by
[Malebo](https://github.com/codingwithlebo) — Cybersecurity and software development student, Melsoft Academy

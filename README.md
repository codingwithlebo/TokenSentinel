# TokenSentinel — Frontend

ITWeb Security Summit Hackathon 2026 | Secure Innovation Stream

## Setup

```bash
npm install
npm run dev        # development (localhost)
npm run dev --host # expose on Raspberry Pi network
```

Open: http://localhost:5173 (or http://192.168.4.1:5173 on Pi)

## Demo flow

1. Login as VENDOR_007
2. Generate tokens on the Vendor Portal
3. Switch to SIEM Dashboard → click "Run attack simulator"
4. Watch fraud score climb live → lockout fires
5. Switch to Audit Trail → scroll red fraud rows
6. Deliver the closing line

## Files

- src/App.jsx          — root app, state, routing
- src/Nav.jsx          — navigation bar
- src/Login.jsx        — vendor login screen
- src/VendorPortal.jsx — token request + HMAC output
- src/SIEMDashboard.jsx— live fraud chart + vendor scores
- src/AuditTrail.jsx   — transaction log + provenance
- src/data.js          — mock data + helpers
- src/index.css        — full design system

## Connecting to backend

Replace the mock data in data.js with real API calls:
- POST /vend          → token generation
- GET  /audit-trail   → transaction log
- WS   /ws            → live fraud score stream

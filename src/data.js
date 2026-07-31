export const VENDORS = [
  { id:'VENDOR_001', name:'Sipho Dube',     score:0.08, status:'safe',  locked:false, tokens:12 },
  { id:'VENDOR_004', name:'Naledi Mokoena', score:0.52, status:'watch', locked:false, tokens:31 },
  { id:'VENDOR_007', name:'Thabo Nkosi',    score:0.08, status:'safe',  locked:false, tokens:8  },
  { id:'VENDOR_012', name:'Zanele Khumalo', score:0.15, status:'safe',  locked:false, tokens:19 },
  { id:'VENDOR_019', name:'Mpho Sithole',   score:0.68, status:'watch', locked:false, tokens:44 },
];

export const INIT_EVENTS = [
  { time:'10:10:00', type:'ok',    msg:'VENDOR_001 — token generated — score 0.08 — within baseline' },
  { time:'10:10:22', type:'ok',    msg:'VENDOR_012 — token generated — score 0.15 — within baseline' },
  { time:'10:11:05', type:'watch', msg:'VENDOR_019 score elevated — 0.68 — velocity above 30-day baseline' },
  { time:'10:11:44', type:'watch', msg:'VENDOR_004 score 0.52 — added to watchlist' },
  { time:'10:12:00', type:'ok',    msg:'VENDOR_007 — token generated — score 0.08 — normal' },
];

export const INIT_TRAIL = [
  { id:1, time:'10:10:00', vendor:'VENDOR_001', meter:'MTR_4821', amount:'R200', hmac:'f9e8d7c6', device:'dev-001', score:0.08, status:'normal' },
  { id:2, time:'10:10:14', vendor:'VENDOR_012', meter:'MTR_2291', amount:'R100', hmac:'a1b2c3d4', device:'dev-003', score:0.15, status:'normal' },
  { id:3, time:'10:10:55', vendor:'VENDOR_019', meter:'MTR_8843', amount:'R200', hmac:'e2c7a19d', device:'dev-005', score:0.68, status:'watch'  },
  { id:4, time:'10:11:20', vendor:'VENDOR_004', meter:'MTR_1123', amount:'R50',  hmac:'f1d3b28c', device:'dev-002', score:0.52, status:'watch'  },
  { id:5, time:'10:12:00', vendor:'VENDOR_007', meter:'MTR_9921', amount:'R200', hmac:'a3f9c12e', device:'dev-004', score:0.08, status:'normal' },
];

export const CHART_BASE = [
  {t:'10:10',s:0.08},{t:'10:11',s:0.09},{t:'10:12',s:0.08},
  {t:'10:13',s:0.10},{t:'10:14',s:0.08},{t:'10:15',s:0.09},
];

export const scoreColor  = s => s>=0.85?'var(--red)':s>=0.5?'var(--amber)':'var(--g)';
export const scoreStatus = s => s>=0.85?'fraud':s>=0.5?'watch':'safe';
export const scoreBadge  = s => s>=0.85?'b-fraud':s>=0.5?'b-watch':'b-safe';
export const scoreChip   = s => s>=0.85?'sc-fraud':s>=0.5?'sc-watch':'sc-safe';
export const now = () => new Date().toLocaleTimeString('en-ZA',{hour12:false});

let ctr = 6;
export function makeToken(vendor, meter, amount, device) {
  const ts  = Date.now();
  const sig = Math.random().toString(36).slice(2,10);
  return {
    id: ++ctr, time: now(), vendor, meter,
    amount: `R${amount}`, hmac: sig, device,
    score: 0.08, status: 'normal',
    token: `${vendor}:${meter}:${amount}:${ts}:${device}:${sig}`,
  };
}

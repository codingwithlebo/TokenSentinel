import { useState } from 'react';
import { makeToken, scoreColor, scoreChip } from './data';

export default function VendorPortal({ vendorId, isLocked, onToken }) {
  const [meter,  setMeter]  = useState('MTR_4821');
  const [amount, setAmount] = useState('200');
  const [cust,   setCust]   = useState('T. Dlamini');
  const [last,   setLast]   = useState(null);
  const [busy,   setBusy]   = useState(false);
  const score = last ? last.score : 0.08;

  function submit(e) {
    e.preventDefault();
    if (!meter || !amount) return;
    setBusy(true);
    setTimeout(() => {
      const tx = makeToken(vendorId, meter, amount, 'device-known-001');
      setLast(tx); onToken(tx); setBusy(false);
    }, 650);
  }

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <div className="page-title">Vendor <em>Portal</em></div>
          <div className="page-sub">// Generate HMAC-signed prepaid electricity token</div>
        </div>
        <div className={`score-chip ${scoreChip(score)}`}>
          <span style={{width:6,height:6,borderRadius:'50%',background:scoreColor(score),display:'inline-block'}}/>
          Score {score.toFixed(2)}
        </div>
      </div>

      {isLocked ? (
        <div className="lockout">
          <div className="lockout-icon">🔴</div>
          <div className="lockout-title">Account frozen</div>
          <div className="lockout-body">
            Fraud score 0.92 exceeded the security threshold.<br/>
            All token generation has been suspended automatically.<br/>
            Contact your system administrator to unlock.
          </div>
          <div className="lockout-code">ERR: INSIDER_THREAT_DETECTED · VENDOR_007 · AUDIT PRESERVED</div>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'1.1fr 1fr',gap:20}}>
          <div className="card">
            <div className="card-label">Token request</div>
            <form onSubmit={submit}>
              <div className="f2">
                <div className="fgrp">
                  <label className="flbl">Meter number</label>
                  <input className="finp" value={meter} onChange={e=>setMeter(e.target.value)} placeholder="MTR_4821"/>
                </div>
                <div className="fgrp">
                  <label className="flbl">Amount (ZAR)</label>
                  <input className="finp" type="number" value={amount} onChange={e=>setAmount(e.target.value)} min="10"/>
                </div>
              </div>
              <div className="f2">
                <div className="fgrp">
                  <label className="flbl">Customer name</label>
                  <input className="finp" value={cust} onChange={e=>setCust(e.target.value)}/>
                </div>
                <div className="fgrp">
                  <label className="flbl">Token standard</label>
                  <input className="finp ro" value="STS IEC 62055-41" readOnly/>
                </div>
              </div>
              <div className="fsec">Security metadata · auto-populated</div>
              <div className="f2">
                <div className="fgrp">
                  <label className="flbl">Device fingerprint</label>
                  <input className="finp ro" value="device-known-001" readOnly/>
                </div>
                <div className="fgrp">
                  <label className="flbl">Timestamp</label>
                  <input className="finp ro" value={new Date().toLocaleTimeString('en-ZA')} readOnly/>
                </div>
              </div>
              <div className="f2">
                <div className="fgrp">
                  <label className="flbl">Vendor ID</label>
                  <input className="finp ro" value={vendorId} readOnly/>
                </div>
                <div className="fgrp">
                  <label className="flbl">Location</label>
                  <input className="finp ro" value="Johannesburg, GP" readOnly/>
                </div>
              </div>
              <div style={{marginTop:8}}>
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {busy ? 'Signing token...' : 'Generate token →'}
                </button>
              </div>
            </form>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <div className="card">
              <div className="card-label">Session telemetry</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {[
                  ['Vendor',      vendorId,  'var(--g)'],
                  ['Status',      'ACTIVE',  'var(--g)'],
                  ['Tokens today','8',       'var(--t1)'],
                  ['Daily limit', '50',      'var(--t1)'],
                  ['AI score',    '0.08',    'var(--g)'],
                  ['Device',      'KNOWN',   'var(--g)'],
                ].map(([k,v,c])=>(
                  <div key={k} className="metric" style={{padding:'12px 14px'}}>
                    <div className="metric-lbl">{k}</div>
                    <div style={{fontFamily:'var(--display)',fontSize:13,fontWeight:800,color:c,marginTop:4}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {last ? (
              <div className="tok-out">
                <div className="tok-title">Token generated — accepted</div>
                <div className="tok-hash">{last.token}</div>
                <div className="tok-tags">
                  <span className="badge b-safe">HMAC signed</span>
                  <span className="badge b-safe">Audit logged</span>
                  <span className="badge b-safe">Score {last.score.toFixed(2)}</span>
                  <span className="badge b-info">{Math.round(parseInt(amount)/4)} kWh</span>
                  <span className="badge b-info">STS valid</span>
                </div>
              </div>
            ) : (
              <div className="card" style={{background:'var(--ink-1)',border:'1px solid var(--line)',textAlign:'center',padding:'36px 20px'}}>
                <div style={{fontSize:28,marginBottom:10,opacity:.25}}>⚡</div>
                <div style={{fontSize:11,color:'var(--t3)',letterSpacing:'.07em'}}>
                  No token generated yet.<br/>Fill the form and click generate.
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

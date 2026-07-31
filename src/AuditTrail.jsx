import { useState } from 'react';
import { INIT_TRAIL, scoreColor, scoreBadge } from './data';

export default function AuditTrail({ trail }) {
  const [filter, setFilter] = useState('all');
  const [vendor, setVendor] = useState('all');

  const all      = [...INIT_TRAIL, ...trail].sort((a,b)=>b.id-a.id);
  const filtered = all.filter(r => {
    if (filter!=='all' && r.status!==filter) return false;
    if (vendor!=='all' && r.vendor!==vendor) return false;
    return true;
  });
  const fraudN  = all.filter(r=>r.status==='fraud').length;
  const watchN  = all.filter(r=>r.status==='watch').length;
  const normalN = all.filter(r=>r.status==='normal').length;
  const vendors = [...new Set(all.map(r=>r.vendor))];

  const rowClass = r => r.status==='fraud'?'fraud':r.status==='watch'?'watch':'';

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <div className="page-title">Audit <em>Trail</em></div>
          <div className="page-sub">// Immutable transaction log · every token traceable · HMAC signed</div>
        </div>
      </div>

      <div className="metrics" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {[
          {label:'Total tokens', val:all.length,  color:'var(--t1)'},
          {label:'Fraud flagged',val:fraudN,       color:'var(--red)'},
          {label:'Watch flagged',val:watchN,       color:'var(--amber)'},
          {label:'Normal',       val:normalN,      color:'var(--g)'},
        ].map(({label,val,color})=>(
          <div key={label} className="metric">
            <div className="metric-val" style={{color}}>{val}</div>
            <div className="metric-lbl">{label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:10}}>
          <div className="card-label" style={{margin:0}}>Transaction log</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {[
              {val:'all',label:'All'},
              {val:'fraud',label:'Fraud'},
              {val:'watch',label:'Watch'},
              {val:'normal',label:'Normal'},
            ].map(o=>(
              <button key={o.val} onClick={()=>setFilter(o.val)}
                style={{
                  background: filter===o.val?'var(--ink-4)':'transparent',
                  border:`1px solid ${filter===o.val?'var(--line-b)':'var(--line)'}`,
                  borderRadius:'var(--r-sm)', color:filter===o.val?'var(--t1)':'var(--t3)',
                  font:'11px var(--mono)', padding:'5px 12px', cursor:'pointer',
                  transition:'all .15s',
                }}>
                {o.label}
              </button>
            ))}
            <select
              value={vendor} onChange={e=>setVendor(e.target.value)}
              style={{height:30,background:'var(--ink-1)',color:'var(--t2)',border:'1px solid var(--line)',borderRadius:'var(--r-sm)',font:'11px var(--mono)',padding:'0 10px',cursor:'pointer',outline:'none'}}>
              <option value="all">All vendors</option>
              {vendors.map(v=><option key={v} value={v}>{v}</option>)}
            </select>
          </div>
        </div>

        <div style={{overflowX:'auto'}}>
          <table className="tbl">
            <thead>
              <tr>
                <th>Time</th><th>Vendor</th><th>Meter</th>
                <th>Amount</th><th>HMAC</th><th>Device</th>
                <th>Score</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={8} style={{textAlign:'center',color:'var(--t3)',padding:24}}>No transactions match the filter</td></tr>
              ) : filtered.map(r=>(
                <tr key={r.id} className={rowClass(r)}>
                  <td className="mono">{r.time}</td>
                  <td className="mono">{r.vendor}</td>
                  <td className="mono">{r.meter}</td>
                  <td style={{fontWeight:500}}>{r.amount}</td>
                  <td className="mono" style={{opacity:.75}}>
                    {r.hmac}
                    {r.status==='fraud'&&<span style={{color:'var(--red)',fontWeight:600,marginLeft:4}}>:FRAUD</span>}
                  </td>
                  <td className="mono">{r.device}</td>
                  <td style={{fontWeight:600,color:scoreColor(r.score),fontFamily:'var(--mono)',fontSize:12}}>{r.score.toFixed(2)}</td>
                  <td><span className={`badge ${scoreBadge(r.score)}`}>{r.status.charAt(0).toUpperCase()+r.status.slice(1)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="prov">
        <div className="prov-title">Cryptographic provenance — every token traceable</div>
        <div className="prov-hash">
          VENDOR_007 : MTR_9921 : 200 : 1717316047 : device-known-001 : <strong>a3f9c12e</strong>
        </div>
        <div className="prov-note">
          HMAC-SHA256 signed — vendor ID + meter + amount + timestamp + device fingerprint embedded in every signature.<br/>
          Cannot be forged. Cannot be deleted. Cannot be altered.
        </div>
      </div>

      <div className="closing">
        <p>
          "This is the exact record Eskom did not have.<br/>
          This is what <span>R1.1 billion</span> looks like when you can finally trace it."
        </p>
      </div>
    </div>
  );
}

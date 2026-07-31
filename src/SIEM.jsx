import { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, ReferenceLine, Tooltip, ResponsiveContainer } from 'recharts';
import { VENDORS, INIT_EVENTS, CHART_BASE, scoreColor, scoreStatus, now } from './data';

const Tip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const s = payload[0].value;
  return (
    <div style={{background:'var(--ink-2)',border:'1px solid var(--line-b)',borderRadius:4,padding:'8px 12px',fontSize:11}}>
      <div style={{color:scoreColor(s),fontWeight:600}}>Score {s.toFixed(2)}</div>
      <div style={{color:'var(--t3)',fontSize:10,marginTop:2}}>{s>=0.85?'FRAUD DETECTED':s>=0.5?'ELEVATED':'NORMAL'}</div>
    </div>
  );
};

export default function SIEM({ trail, isLocked, onLockout }) {
  const [vendors, setVendors] = useState(VENDORS);
  const [events,  setEvents]  = useState(INIT_EVENTS);
  const [chart,   setChart]   = useState(CHART_BASE);
  const [running, setRunning] = useState(false);
  const timer = useRef(null);
  const STEPS = [0.30,0.55,0.65,0.78,0.85,0.88,0.92];

  function runAttack() {
    if (running) return;
    setRunning(true);
    let i = 0;
    timer.current = setInterval(() => {
      if (i >= STEPS.length) {
        clearInterval(timer.current);
        onLockout();
        setVendors(v => v.map(x => x.id==='VENDOR_007' ? {...x,score:0.92,status:'fraud',locked:true} : x));
        setEvents(ev => [{time:now(),type:'lockout',msg:'VENDOR_007 LOCKED — score 0.92 — 43 tokens in 4 min — auto-lockout triggered'},...ev.slice(0,9)]);
        setRunning(false);
        return;
      }
      const s = STEPS[i];
      const type = s>=0.85 ? 'alert' : s>=0.5 ? 'watch' : 'ok';
      setChart(p => [...p, {t:now(), s}]);
      setVendors(v => v.map(x => x.id==='VENDOR_007' ? {...x,score:s,status:scoreStatus(s)} : x));
      setEvents(ev => [{time:now(),type,msg:`VENDOR_007 fraud score ${s.toFixed(2)} — ${s>=0.85?'THRESHOLD CROSSED — LOCKOUT IMMINENT':s>=0.5?'velocity anomaly detected':'activity elevated'}`},...ev.slice(0,9)]);
      i++;
    }, 900);
  }
  useEffect(() => () => clearInterval(timer.current), []);

  const v007     = vendors.find(v => v.id==='VENDOR_007');
  const locked   = vendors.find(v => v.locked);
  const watching = vendors.filter(v => v.status==='watch').length;
  const total    = trail.length + 5;
  const cur      = v007?.score || 0.08;
  const cc       = cur>=0.85?'#ff4060':cur>=0.5?'#f5a623':'#00ff87';

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <div className="page-title">SIEM <em>Dashboard</em></div>
          <div className="page-sub">// Real-time fraud monitoring · AI anomaly detection · auto-response</div>
        </div>
        <button className="btn btn-attack" onClick={runAttack} disabled={running||!!locked}>
          {running ? '▶ Running...' : locked ? '✓ Complete' : '▶ Run attack simulator'}
        </button>
      </div>

      {locked && (
        <div className="alert">
          <div className="alert-icon">🚨</div>
          <div>
            <div className="alert-title">VENDOR_007 locked out — anomalous volume detected</div>
            <div className="alert-sub">Fraud score 0.92 · 43 tokens in 4 minutes · impossible geolocation · auto-lockout triggered · {now()} SAST</div>
          </div>
        </div>
      )}

      <div className="metrics" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
        {[
          {label:'Tokens today',   val:total,             color:'var(--t1)'},
          {label:'Vendors locked', val:locked?1:0,        color:locked?'var(--red)':'var(--g)'},
          {label:'On watchlist',   val:watching,          color:watching>0?'var(--amber)':'var(--g)'},
          {label:'V007 score',     val:cur.toFixed(2),    color:scoreColor(cur)},
        ].map(({label,val,color})=>(
          <div key={label} className="metric">
            <div className="metric-val" style={{color}}>{val}</div>
            <div className="metric-lbl">{label}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.6fr 1fr',gap:16,marginBottom:16}}>
        <div className="card">
          <div className="card-label">Live fraud score — VENDOR_007</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart} margin={{top:4,right:8,bottom:0,left:-24}}>
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={cc} stopOpacity={0.18}/>
                    <stop offset="95%" stopColor={cc} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{fontSize:9,fill:'var(--t3)',fontFamily:'var(--mono)'}} tickLine={false} axisLine={false}/>
                <YAxis domain={[0,1]} tickCount={5} tick={{fontSize:9,fill:'var(--t3)',fontFamily:'var(--mono)'}} tickLine={false} axisLine={false}/>
                <ReferenceLine y={0.85} stroke="rgba(255,64,96,.4)" strokeDasharray="4 3" strokeWidth={1}/>
                <Tooltip content={<Tip/>}/>
                <Area type="monotone" dataKey="s" stroke={cc} strokeWidth={2} fill="url(#cg)" dot={{r:3,fill:cc,strokeWidth:0}} isAnimationActive={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:'flex',gap:20,marginTop:10,fontSize:10,color:'var(--t3)'}}>
            {[['var(--g)','Normal < 0.5'],['var(--amber)','Watch ≥ 0.5'],['var(--red)','Lockout ≥ 0.85']].map(([c,l])=>(
              <span key={l} style={{display:'flex',alignItems:'center',gap:5}}>
                <span style={{width:12,height:2,background:c,borderRadius:1,display:'inline-block'}}/>
                {l}
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-label">All vendor scores</div>
          {vendors.map(v=>(
            <div key={v.id} className="vrow">
              <span className="vid">{v.id}</span>
              <div className="vtrack">
                <div className="vfill" style={{width:`${v.score*100}%`,background:scoreColor(v.score)}}/>
              </div>
              <span className="vnum" style={{color:scoreColor(v.score)}}>{v.score.toFixed(2)}</span>
              <span className={`badge ${v.locked?'b-fraud':v.status==='watch'?'b-watch':'b-safe'}`}>
                {v.locked?'Locked':v.status==='watch'?'Watch':'Safe'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-label">Live event feed</div>
        {events.slice(0,8).map((ev,i)=>(
          <div key={i} className="erow">
            <span className="etime">{ev.time}</span>
            <span className={`etype ${ev.type}`}>{ev.type.toUpperCase()}</span>
            <span className="emsg">{ev.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

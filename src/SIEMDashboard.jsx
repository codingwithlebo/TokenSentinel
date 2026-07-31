import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, Tooltip, ResponsiveContainer } from 'recharts';
import { VENDORS, INITIAL_EVENTS, CHART_DATA_NORMAL, CHART_DATA_ATTACK, scoreColor, scoreStatus, now } from './data';

export default function SIEMDashboard({ trail, isLocked, onLockout }) {
  const [vendors, setVendors]     = useState(VENDORS);
  const [events, setEvents]       = useState(INITIAL_EVENTS);
  const [chartData, setChartData] = useState(CHART_DATA_NORMAL);
  const [attacking, setAttacking] = useState(false);
  const [step, setStep]           = useState(0);
  const timerRef = useRef(null);

  const attackScores = [0.30, 0.55, 0.65, 0.78, 0.85, 0.88, 0.92];

  function runAttack() {
    if (attacking) return;
    setAttacking(true);
    setChartData(CHART_DATA_NORMAL.slice());
    let s = 0;

    timerRef.current = setInterval(() => {
      if (s >= attackScores.length) {
        clearInterval(timerRef.current);
        onLockout();
        setVendors(v => v.map(x => x.id === 'VENDOR_007' ? { ...x, score: 0.92, status: 'fraud', locked: true } : x));
        setEvents(ev => [{
          time: now(), type: 'lockout',
          msg: 'VENDOR_007 LOCKED — score 0.92 — 43 tokens in 4 minutes'
        }, ...ev]);
        setAttacking(false);
        return;
      }
      const sc = attackScores[s];
      const type = sc >= 0.85 ? 'alert' : sc >= 0.5 ? 'watch' : 'ok';
      setChartData(prev => [
        ...prev,
        { t: now(), score: sc }
      ]);
      setVendors(v => v.map(x => x.id === 'VENDOR_007' ? { ...x, score: sc, status: scoreStatus(sc) } : x));
      setEvents(ev => [{
        time: now(), type,
        msg: `VENDOR_007 score ${sc.toFixed(2)} — ${sc >= 0.85 ? 'threshold crossed!' : sc >= 0.5 ? 'velocity anomaly detected' : 'elevated'}`
      }, ...ev.slice(0, 9)]);
      s++;
    }, 900);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  const locked     = vendors.find(v => v.locked);
  const watchCount = vendors.filter(v => v.status === 'watch').length;
  const totalTokens = trail.length + 5;
  const vendor007 = vendors.find(v => v.id === 'VENDOR_007');

  return (
    <div className="content">
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div className="page-title">SIEM dashboard</div>
          <div className="page-sub">Real-time fraud monitoring — all vendors</div>
        </div>
        <button
          className="btn btn-ghost"
          onClick={runAttack}
          disabled={attacking || !!locked}
          style={{ fontSize: 12, padding: '8px 16px' }}
        >
          {attacking ? 'Attack running...' : locked ? 'Attack complete' : '▶ Run attack simulator'}
        </button>
      </div>

      {locked && (
        <div className="alert-banner">
          <div className="alert-dot" />
          <div>
            <div className="alert-title">VENDOR_007 LOCKED OUT — ANOMALOUS VOLUME DETECTED</div>
            <div className="alert-sub">Fraud score 0.92 exceeded threshold · 43 tokens in 4 minutes · auto-lockout triggered · {now()} SAST</div>
          </div>
        </div>
      )}

      <div className="metrics-row" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        <div className="metric">
          <div className="metric-val">{totalTokens}</div>
          <div className="metric-label">Tokens today</div>
        </div>
        <div className="metric">
          <div className="metric-val" style={{ color: locked ? 'var(--red)' : 'var(--green)' }}>{locked ? 1 : 0}</div>
          <div className="metric-label">Vendors locked</div>
        </div>
        <div className="metric">
          <div className="metric-val" style={{ color: watchCount > 0 ? 'var(--amber)' : 'var(--green)' }}>{watchCount}</div>
          <div className="metric-label">On watchlist</div>
        </div>
        <div className="metric">
          <div className="metric-val" style={{ color: vendor007 ? scoreColor(vendor007.score) : 'var(--green)' }}>
            {vendor007 ? vendor007.score.toFixed(2) : '0.08'}
          </div>
          <div className="metric-label">V007 fraud score</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="card">
          <div className="card-title">Live fraud score — VENDOR_007</div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                <XAxis dataKey="t" tick={{ fontSize: 9, fill: 'var(--text-faint)' }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 1]} tickCount={5} tick={{ fontSize: 9, fill: 'var(--text-faint)' }} tickLine={false} axisLine={false} />
                <ReferenceLine y={0.85} stroke="#E24B4A" strokeDasharray="4 4" strokeWidth={1} />
                <Tooltip
                  contentStyle={{ background: 'var(--surface)', border: '0.5px solid var(--border-md)', borderRadius: 6, fontSize: 11 }}
                  formatter={v => [v.toFixed(2), 'Fraud score']}
                />
                <Line
                  type="monotone" dataKey="score"
                  stroke={vendor007 && vendor007.score >= 0.85 ? '#A32D2D' : vendor007 && vendor007.score >= 0.5 ? '#BA7517' : '#3B6D11'}
                  strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: 'var(--text-faint)' }}>
            {[['#3B6D11','Safe < 0.5'],['#BA7517','Watch ≥ 0.5'],['#A32D2D','Lockout ≥ 0.85'],].map(([c,l]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 10, height: 3, background: c, borderRadius: 2, display: 'inline-block' }} />
                {l}
              </span>
            ))}
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 10, height: 3, background: '#E24B4A', borderRadius: 2, display: 'inline-block', opacity: 0.5 }} />
              Threshold 0.85
            </span>
          </div>
        </div>

        <div className="card">
          <div className="card-title">All vendor scores</div>
          {vendors.map(v => (
            <div className="vendor-row" key={v.id}>
              <span className="vendor-id">{v.id}</span>
              <div className="score-bar-bg">
                <div className="score-bar-fill" style={{ width: `${v.score * 100}%`, background: scoreColor(v.score) }} />
              </div>
              <span className="vendor-score-val" style={{ color: scoreColor(v.score) }}>{v.score.toFixed(2)}</span>
              <span className={`badge badge-${v.locked ? 'locked' : v.status === 'watch' ? 'watch' : 'safe'}`}>
                {v.locked ? 'Locked' : v.status === 'watch' ? 'Watch' : 'Safe'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Recent events — live feed</div>
        {events.slice(0, 8).map((ev, i) => (
          <div className="event-row" key={i}>
            <span className="event-time">{ev.time}</span>
            <span className={`event-type ${ev.type}`}>{ev.type.toUpperCase()}</span>
            <span style={{ color: 'var(--text)', fontSize: 12 }}>{ev.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

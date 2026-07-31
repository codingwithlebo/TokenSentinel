export default function Nav({ page, setPage, vendorId }) {
  const ticker = "TOKEN GENERATED ◆ HMAC VERIFIED ◆ AUDIT LOGGED ◆ SCORE 0.08 ◆ VENDOR_001 NORMAL ◆ VENDOR_004 WATCHLIST ◆ AI MONITORING ACTIVE ◆ SYSTEM SECURE ◆ CRYPTOGRAPHIC INTEGRITY VERIFIED ◆ ";
  return (
    <>
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-mark"><div className="nav-logo-mark-inner"/></div>
          Token<span>Sentinel</span>
        </div>
        {vendorId && (
          <div className="nav-tabs">
            {[['portal','Vendor Portal'],['siem','SIEM Dashboard'],['audit','Audit Trail']].map(([id,label])=>(
              <button key={id} className={`nav-tab ${page===id?'active':''}`} onClick={()=>setPage(id)}>
                {label}
              </button>
            ))}
          </div>
        )}
        <div className="nav-right">
          {vendorId && <span className="nav-vendor">{vendorId}</span>}
          <div className="nav-live"><div className="nav-live-dot"/>LIVE</div>
          {vendorId && <button className="nav-exit" onClick={()=>setPage('login')}>SIGN OUT</button>}
        </div>
      </nav>
      <div className="ticker-bar">
        <div className="ticker-inner">
          {[ticker,ticker].map((t,i)=>(
            <span key={i}>
              {t.split('◆').map((item,j,arr)=>(
                <span key={j} className="ticker-item">
                  {item.trim()}{j<arr.length-2&&<span className="ticker-sep"> ◆ </span>}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

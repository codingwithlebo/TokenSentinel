import { useState } from 'react';
export default function Login({ onLogin }) {
  const [vid,  setVid]  = useState('VENDOR_007');
  const [pass, setPass] = useState('');
  function submit(e) { e.preventDefault(); if (vid.trim()) onLogin(vid.trim()); }
  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-mark">
          <div className="login-mark-sq"><div className="login-mark-sq-in"/></div>
          <div className="login-brand">Token<span>Sentinel</span></div>
        </div>
        <div className="login-card">
          <div className="login-card-title">Vendor authentication</div>
          <div className="login-card-sub">Session monitored · AI scoring active · HMAC enforced</div>
          <form onSubmit={submit}>
            <div className="fgrp">
              <label className="flbl">Vendor ID</label>
              <input className="finp" value={vid} onChange={e=>setVid(e.target.value)} placeholder="VENDOR_007" autoFocus/>
            </div>
            <div className="fgrp">
              <label className="flbl">Password</label>
              <input className="finp" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/>
            </div>
            <div className="fgrp">
              <label className="flbl">Device fingerprint</label>
              <input className="finp ro" value="device-known-001 · auto-detected" readOnly/>
            </div>
            <div style={{marginTop:8}}>
              <button type="submit" className="btn btn-primary">Authenticate →</button>
            </div>
          </form>
        </div>
        <div className="login-footer">
          All sessions are cryptographically logged<br/>
          Unauthorised access will trigger immediate lockout
        </div>
      </div>
    </div>
  );
}

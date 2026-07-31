import { useState } from 'react';
import './index.css';
import Nav from './Nav.jsx';
import Login from './Login.jsx';
import VendorPortal from './VendorPortal.jsx';
import SIEM from './SIEM.jsx';
import AuditTrail from './AuditTrail.jsx';
import { now } from './data.js';

export default function App() {
  const [page,      setPage]     = useState('login');
  const [vendorId,  setVendorId] = useState('');
  const [isLocked,  setLocked]   = useState(false);
  const [trail,     setTrail]    = useState([]);

  function handleLogin(vid)  { setVendorId(vid); setPage('portal'); }
  function handleToken(tx)   { setTrail(p => [tx, ...p]); }

  function handleLockout() {
    setLocked(true);
    const rows = Array.from({length:8}, (_,i) => ({
      id: 100+i, time: now(), vendor:'VENDOR_007',
      meter: `MTR_${Math.floor(Math.random()*9000+1000)}`,
      amount:'R200',
      hmac: Math.random().toString(36).slice(2,10)+':FRAUD',
      device:'device-known-001',
      score: parseFloat((0.85+Math.random()*.1).toFixed(2)),
      status:'fraud',
    }));
    setTrail(p => [...rows, ...p]);
  }

  function handleSetPage(p) {
    if (p==='login') { setVendorId(''); setLocked(false); setTrail([]); }
    setPage(p);
  }

  return (
    <>
      <Nav page={page} setPage={handleSetPage} vendorId={vendorId}/>
      {page==='login'  && <Login onLogin={handleLogin}/>}
      {page==='portal' && vendorId && <VendorPortal vendorId={vendorId} isLocked={isLocked} onToken={handleToken}/>}
      {page==='siem'   && vendorId && <SIEM trail={trail} isLocked={isLocked} onLockout={handleLockout}/>}
      {page==='audit'  && vendorId && <AuditTrail trail={trail}/>}
    </>
  );
}

import React from 'react';
import { useAuth } from '../context/AuthContext';
export default function Home() {
 const { user, logout } = useAuth();
 return (
 <div style={{ minHeight: '100vh', background: '#000', color: '#fff'
}}>
 <header style={{ borderBottom: '1px solid #1f1f1f', padding: 18 }}>
 <div style={{ maxWidth: 980, margin: '0 auto', display: 'flex',
justifyContent: 'space-between', alignItems: 'center' }}>
 <h2>Home</h2>
 <div>
 <span style={{ marginRight: 12, color: '#9ca3af'
}}>@{user?.handle}</span>
 <button onClick={logout} style={{ background: '#fff', color:
'#000', padding: '8px 12px', borderRadius: 10, fontWeight: 700 }}>
 Log out
 </button>
 </div>
 </div>
 </header>
 <main style={{ maxWidth: 980, margin: '24px auto', padding: '0 16px'
}}>
 <p style={{ color: '#9ca3af' }}>Welcome to Anonify — your timeline
will appear here.</p>
 </main>
 </div>
 );
}
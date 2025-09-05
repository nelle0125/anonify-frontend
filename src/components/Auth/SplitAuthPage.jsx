import React, { useEffect, useState } from 'react';
import Splash from './Splash';
import AuthCard from './AuthCard';
import logo from '../../assets/logo.png';
import '../../styles/main.scss';
export default function SplitAuthPage() {
 const [showSplash, setShowSplash] = useState(true);
 useEffect(() => {
 const t = setTimeout(() => setShowSplash(false), 2300);
 return () => clearTimeout(t);
 }, []);
 if (showSplash) return <Splash onFinish={() => setShowSplash(false)} />;
 return (
 <div className="split-root">
 <div className="split-left">
 <div className="left-inner">
 <img
 src={logo}
 alt="Anonify Logo"
 className="left-mark"
 style={{ width: '160px', height: '160px' }}
 />
 <h1 className="left-title">Anonify</h1>
 <p className="left-sub">Share anonymously • Be heard</p>
</div>
 </div>
 <div className="split-right">
 <div className="right-inner">
 <AuthCard />
 </div>
 </div>
 </div>
 );
}
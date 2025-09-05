import React, { useEffect } from 'react';
import '../../styles/main.scss';
import logo from '../../assets/logo.png';
export default function Splash({ onFinish }) {
 useEffect(() => {
 const t = setTimeout(() => onFinish(), 2300);
 return () => clearTimeout(t);
 }, [onFinish]);
 return (
 <div className="anonify-splash">
 <div className="splash-inner">
 <div className="logo-wrap">
 <img
 src={logo}
 alt="Anonify Logo"
 className="anonify-logo"
 style={{ width: '140px', height: '140px' }}
 />
 </div>
 </div>
 </div>
 );
}


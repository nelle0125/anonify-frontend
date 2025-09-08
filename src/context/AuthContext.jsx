import React, { createContext, useContext, useEffect, useState } from
'react';
import { useNavigate } from 'react-router-dom';

const _mockDB = { usersByEmail: {}, idSeq: 1 };
function delay(ms = 450) {
 return new Promise((res) => setTimeout(res, ms));
}
async function mockRegister({ email, password, handle, displayName }) {
 await delay();
 email = (email || '').toLowerCase();
 handle = (handle || '').toLowerCase();
 if (!email || !password || !handle) throw new Error('Missing required fields');
 if (_mockDB.usersByEmail[email]) throw new Error('Email already registered');
 const id = String(_mockDB.idSeq++);
 const user = {
 id,
 email,
 handle,
 displayName: displayName || handle,
 password, 
 createdAt: new Date().toISOString(),
 };
 _mockDB.usersByEmail[email] = user;
 return { user: { id: user.id, email: user.email, handle: user.handle,
displayName: user.displayName }, token: `mock-token-${id}` };
}
async function mockLogin({ email, password }) {
 await delay();
 email = (email || '').toLowerCase();
 const user = _mockDB.usersByEmail[email];
 if (!user || user.password !== password) throw new Error('Invalid email or password');
 return { user: { id: user.id, email: user.email, handle: user.handle,
displayName: user.displayName }, token: `mock-token-${user.id}` };
}
const AuthContext = createContext();
export function useAuth() {
 return useContext(AuthContext);
}
export function AuthProvider({ children }) {
 const [user, setUser] = useState(null);
 const navigate = useNavigate();

 useEffect(() => {
 try {
 const raw = localStorage.getItem('anonify_user');
 if (raw) setUser(JSON.parse(raw));
 } catch (e) {
 console.warn('Failed to read user from localStorage', e);
 }
 }, []);
 async function register(payload) {
 const res = await mockRegister(payload);
 const u = { ...res.user, token: res.token };
 setUser(u);
 localStorage.setItem('anonify_user', JSON.stringify(u));
 return res;
 }
 async function login(payload) {
 const res = await mockLogin(payload);
 const u = { ...res.user, token: res.token };
 setUser(u);
 localStorage.setItem('anonify_user', JSON.stringify(u));
 return res;
 }
 function logout() {
 setUser(null);
 localStorage.removeItem('anonify_user');
 navigate('/auth');
 }
 return <AuthContext.Provider value={{ user, register, login, logout
}}>{children}</AuthContext.Provider>;
}
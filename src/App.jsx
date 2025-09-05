import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import SplitAuthPage from './components/Auth/SplitAuthPage';
import Home from './pages/Home';
function ProtectedRoute({ children }) {
 const { user } = useAuth();
 return user ? children : <Navigate to="/auth" replace />;
}
export default function App() {
 return (
 <AuthProvider>
 <Routes>
 <Route path="/auth" element={<SplitAuthPage />} />
 <Route
 path="/"
 element={
  <ProtectedRoute>
 <Home />
 </ProtectedRoute>
 }
 />
 <Route path="*" element={<Navigate to="/" replace />} />
 </Routes>
 </AuthProvider>
 );
}

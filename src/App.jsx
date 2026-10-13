import React, { useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import NewReceipt from './pages/NewReceipt.jsx';
import History from './pages/History.jsx';
import ReceiptView from './pages/ReceiptView.jsx';

function Protected({ children, pageProps }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <div style={{ padding: 40, textAlign: 'center' }} className="muted">Loading…</div>;
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return <Layout {...(pageProps || {})}>{children}</Layout>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"        element={<Login />} />
          <Route path="/"             element={<Protected><Dashboard /></Protected>} />
          <Route path="/new"          element={<Protected pageProps={window.__xquoteNewProps || {}}><NewReceipt /></Protected>} />
          <Route path="/history"      element={<Protected><History /></Protected>} />
          <Route path="/receipt/:id"  element={<Protected pageProps={window.__xquoteViewProps || {}}><ReceiptView /></Protected>} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

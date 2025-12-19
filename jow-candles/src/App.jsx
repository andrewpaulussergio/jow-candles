import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Login from './page/Login';
import Admin from './page/Admin';
import Home from './page/Home';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession();
    setToken(session);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setToken(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!token ? <Login setToken={setToken} /> : <Navigate to="/admin" />} />
        <Route path="/admin" element={token ? <Admin token={token} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
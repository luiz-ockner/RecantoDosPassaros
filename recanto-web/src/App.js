import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Gallery from './components/Gallery';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import { auth } from './firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Verifica o estado de autenticação do usuário
  useState(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
  }, []);

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <Router>
      <nav style={{ padding: '10px', backgroundColor: '#f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Link to="/" style={{ margin: '0 10px' }}>Home</Link>
          <Link to="/galeria" style={{ margin: '0 10px' }}>Galeria</Link>
          <Link to="/contato" style={{ margin: '0 10px' }}>Contato</Link>
        </div>
        <div>
          {isAdmin ? (
            <>
              <Link to="/admin" style={{ margin: '0 10px' }}>Admin</Link>
              <button onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </nav>

      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/galeria" element={<Gallery />} />
          {/* Adicione outras rotas aqui: /agenda, /contato */}
          <Route
            path="/login"
            element={isAdmin ? <p>Você já está logado.</p> : <Login setIsAdmin={setIsAdmin} />}
          />
          <Route
            path="/admin"
            element={isAdmin ? <AdminDashboard /> : <p>Acesso negado. Por favor, faça login.</p>}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
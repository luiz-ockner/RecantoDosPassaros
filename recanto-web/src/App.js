import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Gallery from './components/Gallery';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';

const App = () => {
  // Inicializa o estado de isAdmin a partir do localStorage
  const [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem('isAdmin')) || false
  );

  // Efeito para salvar o estado de isAdmin no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
  }, [isAdmin]);

  const handleLogout = () => {
    setIsAdmin(false);
    // O localStorage é limpo automaticamente pelo useEffect
  };

  return (
    <Router>
      <nav
        style={{
          padding: '10px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Link to="/" style={{ margin: '0 10px' }}>
            Home
          </Link>
          <Link to="/galeria" style={{ margin: '0 10px' }}>
            Galeria
          </Link>
          <Link to="/contato" style={{ margin: '0 10px' }}>
            Contato
          </Link>
        </div>
        <div>
          {isAdmin ? (
            <>
              <Link to="/admin" style={{ margin: '0 10px' }}>
                Admin
              </Link>
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
            element={
              isAdmin ? (
                <p>Você já está logado.</p>
              ) : (
                <Login setIsAdmin={setIsAdmin} />
              )
            }
          />
          <Route
            path="/admin"
            element={
              isAdmin ? (
                <AdminDashboard />
              ) : (
                <p>Acesso negado. Por favor, faça login.</p>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

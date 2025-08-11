import React, { useState } from 'react';

const Login = ({ setIsAdmin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // URL base da sua API de backend
  const API_BASE_URL = 'http://localhost:3001/api';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer login');
      }

      const data = await response.json();
      if (response.ok) {
        setIsAdmin(true); // Se a resposta for 200, define como admin
      } else {
        setError(data.message || 'Erro no login. Tente novamente.');
      }
    } catch (err) {
      console.error(err);
      setError(
        'Não foi possível conectar ao servidor. Verifique se o backend está rodando.'
      );
    }
  };

  return (
    <div>
      <h2>Login Admin</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;

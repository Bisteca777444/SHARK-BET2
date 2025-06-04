import React, { useState } from 'react';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' ou 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const openModal = (mode) => {
    setMode(mode);
    setShowModal(true);
    setEmail('');
    setPassword('');
    setMessage('');
  };

  const handleSubmit = async () => {
    const url = mode === 'login' ? 'http://localhost:3000/api/login' : 'http://localhost:3000/api/register';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if(data.success){
        if(mode === 'login'){
          setLoggedIn(true);
          setMessage('Login efetuado com sucesso! Entrando no lobby...');
          setShowModal(false);
        } else {
          setMessage('Cadastro realizado com sucesso! Agora faça login.');
          setMode('login');
        }
      } else {
        setMessage(data.message || 'Erro');
      }
    } catch(e) {
      setMessage('Erro na comunicação com o servidor.');
    }
  };

  if(loggedIn){
    return <div><h2>Lobby da Plataforma</h2><p>Bem-vindo, {email}!</p></div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => openModal('login')}>Login</button>
      <button onClick={() => openModal('register')} style={{ marginLeft: 10 }}>Cadastro</button>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left:0, right:0, bottom:0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', padding: 20, borderRadius: 8,
            width: 300, boxShadow: '0 0 10px rgba(0,0,0,0.3)'
          }}>
            <h3>{mode === 'login' ? 'Login' : 'Cadastro'}</h3>
            <input
              type="email" placeholder="Email" value={email}
              onChange={e => setEmail(e.target.value)} style={{width: '100%', marginBottom: 10}}
            />
            <input
              type="password" placeholder="Senha" value={password}
              onChange={e => setPassword(e.target.value)} style={{width: '100%', marginBottom: 10}}
            />
            <button onClick={handleSubmit} style={{width: '100%'}}>
              {mode === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
            <p style={{color: 'red', marginTop: 10}}>{message}</p>
            <button onClick={() => setShowModal(false)} style={{marginTop: 10}}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

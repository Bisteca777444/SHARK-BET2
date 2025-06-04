const apiBaseUrl = 'https://seu-backend-sumup.com/api'; // Troque pela URL real

// Elementos
const loginForm = document.getElementById('login-form');
const btnLoginHeader = document.getElementById('btn-login-header');
const btnCadastrar = document.getElementById('btn-cadastrar');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const btnJogar = document.getElementById('btn-jogar');
const areaApostas = document.getElementById('area-apostas');

btnLoginHeader.addEventListener('click', () => {
  // alterna visibilidade do formulário de login
  if (loginForm.style.display === 'none') {
    loginForm.style.display = 'block';
  } else {
    loginForm.style.display = 'none';
  }
});

btnCadastrar.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  fetch(`${apiBaseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: senha }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Cadastro realizado com sucesso! Faça login agora.');
      } else {
        alert('Erro no cadastro: ' + data.message);
      }
    })
    .catch(err => alert('Erro na requisição: ' + err.message));
});

btnLogin.addEventListener('click', () => {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  fetch(`${apiBaseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: senha }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.token) {
        alert('Login realizado com sucesso!');
        localStorage.setItem('token', data.token);
        loginForm.style.display = 'none';
        atualizarUILogado();
      } else {
        alert('Erro no login: ' + data.message);
      }
    })
    .catch(err => alert('Erro na requisição: ' + err.message));
});

btnLogout.addEventListener('click', () => {
  localStorage.removeItem('token');
  atualizarUIDeslogado();
});

// Funções para mostrar/esconder elementos baseados no login
function atualizarUILogado() {
  btnLogout.style.display = 'inline-block';
  btnLoginHeader.style.display = 'none';
  btnJogar.style.display = 'inline-block';
  areaApostas.style.display = 'block';
}

function atualizarUIDeslogado() {
  btnLogout.style.display = 'none';
  btnLoginHeader.style.display = 'inline-block';
  btnJogar.style.display = 'none';
  areaApostas.style.display = 'none';
  loginForm.style.display = 'none';
}

// Verifica token ao carregar a página
window.addEventListener('load', () => {
  const token = localStorage.getItem('token');
  if (token) {
    // Aqui você pode validar o token no backend se quiser
    atualizarUILogado();
  } else {
    atualizarUIDeslogado();
  }
});

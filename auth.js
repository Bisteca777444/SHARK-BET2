// Inicializa o Supabase com seus dados
const supabaseUrl = 'https://qvxskjtzqjnxipxszrjz.supabase.co'; // substitua aqui
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2eHNranR6cWpueGlweHN6cmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjQzNDAsImV4cCI6MjA2NDY0MDM0MH0.6PB484Bg9TL4As7vLX5iB3mFdO94RlU3zSAOVeLaRww'; // substitua aqui
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Exibe ou esconde o formulário de login/cadastro
const btnToggleLoginForm = document.getElementById('btn-toggle-login-form');
const loginForm = document.getElementById('login-form');
const btnLogout = document.getElementById('btn-logout');
const btnJogar = document.getElementById('btn-jogar');
const areaApostas = document.getElementById('area-apostas');

btnToggleLoginForm.addEventListener('click', () => {
  if (loginForm.style.display === 'none' || loginForm.style.display === '') {
    loginForm.style.display = 'block';
  } else {
    loginForm.style.display = 'none';
  }
});

// Função para atualizar interface após login/logout
function updateUI(user) {
  if (user) {
    loginForm.style.display = 'none';
    btnToggleLoginForm.style.display = 'none';
    btnLogout.style.display = 'inline-block';
    btnJogar.style.display = 'inline-block';
    areaApostas.style.display = 'block';
  } else {
    loginForm.style.display = 'none';
    btnToggleLoginForm.style.display = 'inline-block';
    btnLogout.style.display = 'none';
    btnJogar.style.display = 'none';
    areaApostas.style.display = 'none';
  }
}

// Verifica se já está logado ao carregar a página
async function checkUser() {
  const { data: { user } } = await supabase.auth.getUser();
  updateUI(user);
}
checkUser();

// Login
document.getElementById('btn-entrar').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  });

  if (error) {
    alert('Erro ao entrar: ' + error.message);
  } else {
    alert('Login realizado com sucesso!');
    updateUI(data.user);
  }
});

// Cadastro
document.getElementById('btn-cadastrar').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
  });

  if (error) {
    alert('Erro ao cadastrar: ' + error.message);
  } else {
    alert('Cadastro realizado! Por favor, verifique seu email para confirmar.');
  }
});

// Logout
btnLogout.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert('Erro ao sair: ' + error.message);
  } else {
    alert('Você saiu com sucesso!');
    updateUI(null);
  }
});

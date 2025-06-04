// Substitua pelos seus dados do Supabase:
const SUPABASE_URL = 'https://qvxskjtzqjnxipxszrjz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2eHNranR6cWpueGlweHN6cmp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjQzNDAsImV4cCI6MjA2NDY0MDM0MH0.6PB484Bg9TL4As7vLX5iB3mFdO94RlU3zSAOVeLaRww';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Inicializa Netlify Identity
netlifyIdentity.init();

// Elementos
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const btnJogar = document.getElementById('btn-jogar');
const areaApostas = document.getElementById('area-apostas');
const btnApostar = document.getElementById('btn-apostar');
const listaApostas = document.getElementById('lista-apostas');

function atualizarInterface() {
  const user = netlifyIdentity.currentUser();
  if (user) {
    btnLogin.style.display = 'none';
    btnLogout.style.display = 'inline-block';
    btnJogar.style.display = 'inline-block';
    areaApostas.style.display = 'block';
    carregarApostas();
  } else {
    btnLogin.style.display = 'inline-block';
    btnLogout.style.display = 'none';
    btnJogar.style.display = 'none';
    areaApostas.style.display = 'none';
    listaApostas.innerHTML = '';
  }
}

btnLogin.addEventListener('click', () => {
  netlifyIdentity.open();
});

btnLogout.addEventListener('click', () => {
  netlifyIdentity.logout();
});

netlifyIdentity.on('login', user => {
  atualizarInterface();
  netlifyIdentity.close();
});

netlifyIdentity.on('logout', () => {
  atualizarInterface();
});

btnApostar.addEventListener('click', async () => {
  const user = netlifyIdentity.currentUser();
  if (!user) {
    alert('Faça login para apostar.');
    return;
  }

  const nome = document.getElementById('input-nome').value.trim();
  const aposta = parseFloat(document.getElementById('input-valor').value);

  if (!nome || isNaN(aposta) || aposta <= 0) {
    alert('Preencha o nome e valor da aposta corretamente.');
    return;
  }

  const { data, error } = await supabase
    .from('apostas')
    .insert([{ email: user.email, nome, valor: aposta }]);

  if (error) {
    alert('Erro ao salvar aposta: ' + error.message);
  } else {
    alert('Aposta registrada com sucesso!');
    document.getElementById('input-nome').value = '';
    document.getElementById('input-valor').value = '';
    carregarApostas();
  }
});

async function carregarApostas() {
  const { data, error } = await supabase
    .from('apostas')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    alert('Erro ao carregar apostas: ' + error.message);
    return;
  }

  listaApostas.innerHTML = '';
  data.forEach(aposta => {
    const li = document.createElement('li');
    li.textContent = `${aposta.nome} apostou R$ ${aposta.valor.toFixed(2)}`;
    listaApostas.appendChild(li);
  });
}

window.onload = atualizarInterface;

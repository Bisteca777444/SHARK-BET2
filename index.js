const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3000;
const SECRET = 'segredo-super-secreto'; // troque por algo forte

app.use(cors());
app.use(bodyParser.json());

let users = []; // banco de dados em memória (apenas pra teste)

// Rota para cadastro
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if(users.find(u => u.email === email)){
    return res.json({ success: false, message: 'Email já cadastrado' });
  }

  const hashedPassword = await bcrypt.hash(password, 8);
  users.push({ email, password: hashedPassword });
  res.json({ success: true });
});

// Rota para login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if(!user){
    return res.json({ success: false, message: 'Usuário não encontrado' });
  }
  const passOk = await bcrypt.compare(password, user.password);
  if(!passOk){
    return res.json({ success: false, message: 'Senha incorreta' });
  }
  const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
  res.json({ success: true, token });
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});

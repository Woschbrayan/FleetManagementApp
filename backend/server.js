const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

// Configuração do CORS (para permitir requisições de diferentes origens)
app.use(cors());

// Middleware para fazer o parsing do corpo das requisições JSON
app.use(express.json());

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',    // ou o IP do seu servidor de banco de dados
  user: 'root',         // seu usuário de banco de dados
  password: '',         // sua senha de banco de dados
  database: 'frotas',   // o nome do banco de dados
});

// Conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conectado ao banco de dados');
});

// Rota para login
app.post('/login', (req, res) => {
  const { login, senha } = req.body;

  // Verifica se o login e a senha foram fornecidos
  if (!login || !senha) {
    return res.status(400).json({ error: 'Login e senha são obrigatórios' });
  }

  console.log(`Login recebido: ${login}, Senha recebida: ${senha}`);

  // Consulta para verificar se o login existe na tabela
  const query = 'SELECT * FROM cad_usuario WHERE usu_login = ?';
  db.query(query, [login], (err, result) => {
    if (err) {
      console.error('Erro ao verificar o login:', err);
      return res.status(500).json({ error: 'Erro ao verificar o login' });
    }

    if (result.length === 0) {
      console.log('Usuário não encontrado no banco de dados');
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const user = result[0];
    console.log(`Usuário encontrado no banco: ${JSON.stringify(user)}`);

    // Comparar a senha fornecida com a senha armazenada no banco (comparing plain text)
    if (user.usu_senha !== senha) {
      console.log('Senha incorreta');
      return res.status(400).json({ error: 'Senha incorreta' });
    }

    // Criando o token JWT
    const token = jwt.sign({ id: user.cad_codigo, login: user.usu_login }, 'elo', { expiresIn: '1h' });
    console.log('Token gerado:', token);  // Verifica o token gerado

    // Retorna o token se a autenticação for bem-sucedida
    return res.json({ token });
  });
});

// Definindo a porta do servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// db.js
const mysql = require('mysql2');

// Configura a conexão com o banco de dados
const connection = mysql.createConnection({
  host: 'localhost',        // Endereço do servidor de banco de dados
  user: 'root',             // Usuário do banco de dados
  password: '',        // Senha do banco de dados
  database: 'frotas' // Nome do banco de dados
});

// Testa a conexão
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
    return;
  }
  console.log('Conectado ao banco de dados com sucesso!');
});

// Exporta a conexão para ser usada em outros arquivos
module.exports = connection;

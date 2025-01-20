const express = require('express');
const router = express.Router();
const connection = require('./db');  // Importa a conexão com o banco de dados

// Rota para buscar ordens de serviço
router.get('/ordens', (req, res) => {
  const query = 'SELECT * FROM mov_os'; // Substitua pelo nome correto da tabela e colunas

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar ordens:', err);
      return res.status(500).send('Erro no servidor');
    }
    res.json(results); // Retorna os resultados como JSON
  });
});

module.exports = router;

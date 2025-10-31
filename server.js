const express = require('express');
const path = require('path');
const app = express();

// Define a porta que o Render vai usar
const port = process.env.PORT || 3000;

// 1. Diz ao Express para servir seus arquivos estáticos (css, js, img)
//    da pasta atual (onde o server.js está)
app.use(express.static(__dirname));

// 2. Rota principal
app.get('/', (req, res) => {
  // Envia o seu arquivo index.html como resposta
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
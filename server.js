const express = require("express");
const app = express();
const port = 80; // Porta HTTP padrão

app.get("/", (req, res) => {
  // Lógica para lidar com a rota de redirecionamento
  const code = req.query.code; // Capturar o código de autorização aqui
  res.send(`Código de Autorização: ${code}`);
});

app.listen(port, () => {
  console.log(`Servidor HTTP rodando em http://localhost:${port}`);
});

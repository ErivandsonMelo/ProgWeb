import express from 'express';
import dotenv from 'dotenv';
import validateEnv from './utils/validateEnv';
import path from 'path';

dotenv.config();
validateEnv();

const app = express();
const PORT = process.env.PORT || 3333;

// Servir arquivos estáticos do /public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Página inicial redireciona para index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use((req, res, next) => {
  res.locals.loggedIn = !!req.session.user;
  res.locals.userName = req.session.user?.name || '';
  next();
});
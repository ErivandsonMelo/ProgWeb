// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import validateEnv from './utils/validateEnv';
import path from 'path';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';
import { engine } from 'express-handlebars';
import router from './router/router';

// MUDANÇA CRÍTICA:
// 1. CARREGUE AS VARIÁVEIS DE AMBIENTE PRIMEIRO
dotenv.config();
validateEnv();

// 2. SÓ ENTÃO IMPORTE A INSTÂNCIA DO PRISMA
//    Isso garante que process.env.DATABASE_URL já está disponível
import prisma from './lib/prisma'; // MOVIDO PARA AQUI

const app = express();
const PORT = process.env.PORT || 3333;
// REMOVIDO: const prisma = new PrismaClient(); // Esta linha DEVE ter sido removida.

// Estender a interface SessionData para incluir 'uid'
declare module 'express-session' {
    interface SessionData {
        uid: string;
    }
}

// Configuração do middleware de sessão (primeiro)
app.use(session({
    genid: () => uuidv4(),
    secret: process.env.SESSION_SECRET || 'fallback_secret_key_if_env_is_missing',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Middlewares para analisar corpos de requisição (depois da sessão)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurar Handlebars como o motor de visualização
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '..', 'src', 'views', 'layouts'),
    partialsDir: path.join(__dirname, '..', 'src', 'views', 'partials'),
    helpers: {
        eq: require('./views/helpers/helpers').eq,
        listNodejsTechnologies: require('./views/helpers/helpers').listNodejsTechnologies,
        sum: require('./views/helpers/helpers').sum, // MUDANÇA AQUI: Adicionar o helper 'sum'
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '..', 'src', 'views'));

// Middleware para anexar dados da sessão e informações do usuário a res.locals para Handlebars
app.use(async (req, res, next) => {
    res.locals.loggedIn = !!req.session.uid;
    if (req.session.uid) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.session.uid },
                select: { name: true }
            });
            res.locals.userName = user ? user.name : 'Usuário';
        } catch (error) {
            console.error('Error fetching user for navbar:', error);
            res.locals.userName = 'Usuário';
        }
    }
    next();
});

// Usar o roteador principal para todas as rotas da aplicação
app.use(router);

// Middleware para servir arquivos estáticos do diretório /public (ÚLTIMO)
app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
}).on('error', (err: any) => {
  console.error('Erro no servidor Express:', err.message);
  process.exit(1);
});
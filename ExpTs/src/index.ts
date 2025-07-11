import express from 'express';
import dotenv from 'dotenv';
import validateEnv from './utils/validateEnv';
import path from 'path';
import session from 'express-session'; // Importar express-session
import { v4 as uuidv4 } from 'uuid'; // Importar uuid para gerar IDs de sessão
import { engine } from 'express-handlebars'; // Importar express-handlebars
import router from './router/router'; // Importar seu roteador principal
import { PrismaClient } from '@prisma/client'; // Importar PrismaClient

dotenv.config();
validateEnv(); // Validar variáveis de ambiente

const app = express();
const PORT = process.env.PORT || 3333;
const prisma = new PrismaClient(); // Instanciar o PrismaClient

// Estender a interface SessionData para incluir 'uid'
declare module 'express-session' {
    interface SessionData {
        uid: string; // Adicionar a propriedade 'uid' à SessionData para armazenar o ID do usuário
    }
}

// Configuração do middleware de sessão
app.use(session({
    genid: () => uuidv4(), // Gerar IDs de sessão únicos usando UUID
    secret: process.env.SESSION_SECRET || 'fallback_secret_key_if_env_is_missing', // Usar uma chave secreta do .env
    resave: false, // Não salvar a sessão no "store" se não houver modificações
    saveUninitialized: false, // Não criar uma sessão para um usuário não inicializado
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Cookie expira em 24 horas (opcional, mas boa prática)
    }
}));

// Middleware para analisar corpos de requisição URL-encoded (para formulários HTML)
app.use(express.urlencoded({ extended: false }));
// Middleware para analisar corpos de requisição JSON (para requisições AJAX)
app.use(express.json());

// Configurar Handlebars como o motor de visualização
app.engine('handlebars', engine({
    defaultLayout: 'main', // Define 'main.handlebars' como o layout padrão
    layoutsDir: path.join(__dirname, '..', 'src', 'views', 'layouts'), // Caminho para o diretório de layouts
    partialsDir: path.join(__dirname, '..', 'src', 'views', 'partials'), // Caminho para o diretório de partials (se você os usa)
    helpers: {
        // Carrega helpers do Handlebars, como o 'eq' para comparações
        eq: require('./views/helpers/helpers').eq,
        listNodejsTechnologies: require('./views/helpers/helpers').listNodejsTechnologies, // Exemplo de helper para Task 8
    }
}));
app.set('view engine', 'handlebars'); // Define Handlebars como o motor de visualização
app.set('views', path.join(__dirname, '..', 'src', 'views')); // Define o diretório das views

// Middleware para servir arquivos estáticos do diretório /public
app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware para anexar dados da sessão e informações do usuário a res.locals para Handlebars
app.use(async (req, res, next) => {
    // res.locals.session = req.session; // Esta linha pode ser removida se você usar diretamente loggedIn/userName
    res.locals.loggedIn = !!req.session.uid; // Verifica se 'uid' existe na sessão para determinar se o usuário está logado
    if (req.session.uid) { // Se 'uid' existe, tenta buscar o nome do usuário
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.session.uid },
                select: { name: true } // Seleciona apenas o nome do usuário
            });
            res.locals.userName = user ? user.name : 'Usuário'; // Define o nome do usuário para a view
        } catch (error) {
            console.error('Error fetching user for navbar:', error);
            res.locals.userName = 'Usuário'; // Fallback em caso de erro
        }
    }
    next();
});

// Usar o roteador principal para todas as rotas da aplicação
// Este middleware deve ser o último após todas as configurações de middleware globais
app.use(router); //

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
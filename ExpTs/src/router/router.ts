// src/router/router.ts
import { Router } from 'express';
import mainController from '../controllers/main';
import * as userController from '../controllers/user'; // MUDANÇA AQUI: import * as
import * as majorController from '../controllers/major'; // MUDANÇA AQUI: import * as
import { isAuthenticated } from '../middlewares/authMiddleware';

const router = Router();

// Rotas Públicas
router.get('/about', mainController.about);
router.all('/register', userController.create);
router.all('/login', userController.login);
router.get('/logout', userController.logout);

// Rotas relacionadas ao jogo (podem ser públicas ou protegidas, dependendo da sua escolha para a Task 17)
router.get('/ranking', mainController.ranking); // Corrigido para mainController.ranking
router.get('/lorem/:count', mainController.lorem);

// Exemplos de Handlebars dos slides (podem ser mantidos públicos ou protegidos)
router.get('/hb1', mainController.hb1);
router.get('/hb2', mainController.hb2);
router.get('/hb3', mainController.hb3);
router.get('/hb4', mainController.hb4);

// Rotas Protegidas (requerem autenticação)
router.get('/', isAuthenticated, mainController.index); // Página principal do jogo
router.post('/save-score', isAuthenticated, mainController.saveScore); // Salvar pontuação do jogo
router.all('/profile/edit', isAuthenticated, userController.editProfile); // Editar perfil do usuário
router.all('/profile/change-password', isAuthenticated, userController.changePassword); // Alterar senha do usuário

// CRUD para Majors (exemplo, você pode querer proteger estas com um middleware de admin)
router.get('/major', majorController.index);
router.all('/major/create', majorController.create);
router.get('/major/read/:id', majorController.read);
router.all('/major/update/:id', majorController.update);
router.post('/major/remove/:id', majorController.remove);

// CRUD para Users (exemplo, você pode querer proteger estas com um middleware de admin)
router.get('/user', userController.index);
router.post('/user/remove/:id', userController.remove);

export default router;
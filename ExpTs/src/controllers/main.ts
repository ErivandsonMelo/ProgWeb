// src/controllers/main.ts
import { Request, Response } from 'express';
import { loremIpsum } from 'lorem-ipsum';
import * as gameSessionService from '../services/gameSession';

// You might need to adjust the paths if your views are not directly under `views/main/`
// For example, if you place game/index.handlebars in `views/game/index.handlebars`
// then adjust res.render('game/index', ...)

export const index = async (req: Request, res: Response) => {
    [cite_start]// [cite: 1952]
    if (!req.session.uid) { // Check if user is logged in
        return res.redirect('/login'); [cite_start]// Redirect to login if not authenticated [cite: 1957]
    }
    // If logged in, render the game page
    res.render('game/index', { layout: 'main' }); // Pass layout as 'main'
};

export const about = (req: Request, res: Response) => {
    [cite_start]// [cite: 1817]
    res.render('about/index', {
        title: 'Sobre o Space Shooter',
        message: 'Space Shooter é um jogo clássico de arcade onde você controla uma nave espacial e deve destruir inimigos e asteroides, evitando colisões. O objetivo é alcançar a maior pontuação possível. Prepare-se para uma aventura intergaláctica!',
        imagePath: '/assets/img/game_concept.png', // Assuming you have an image here
        layout: 'main'
    });
};

export const lorem = (req: Request, res: Response) => {
    [cite_start]// [cite: 1831]
    const count = parseInt(req.params.count as string);
    if (isNaN(count) || count <= 0) {
        return res.status(400).send('Número de parágrafos inválido.');
    }
    const paragraphs = loremIpsum({
        count: count,
        units: 'paragraphs',
        format: 'html'
    });
    res.render('lorem/index', { paragraphs, layout: 'main' });
};

export const hb1 = (req: Request, res: Response) => {
    [cite_start]// [cite: 1845, 1846]
    res.render('main/hb1', {
        mensagem: 'Olá, você está aprendendo Express + HBS!',
        layout: 'main' // Use the main layout
    });
};

export const hb2 = (req: Request, res: Response) => {
    [cite_start]// [cite: 1845, 1846]
    res.render('main/hb2', {
        poweredByNodejs: true,
        name: 'Express',
        type: 'Framework',
        layout: 'main' // Use the main layout
    });
};

export const hb3 = (req: Request, res: Response) => {
    [cite_start]// [cite: 1845, 1846]
    const profes = [
        { nome: 'David Fernandes', sala: 1238 },
        { nome: 'Horácio Fernandes', sala: 1233 },
        { nome: 'Edleno Moura', sala: 1236 },
        { nome: 'Elaine Harada', sala: 1231 }
    ];
    res.render('main/hb3', { profes, layout: 'main' });
};

export const hb4 = (req: Request, res: Response) => {
    [cite_start]// [cite: 1864]
    const technologies = [
        { name: 'Express', type: 'Framework', poweredByNodejs: true },
        { name: 'Laravel', type: 'Framework', poweredByNodejs: false },
        { name: 'React', type: 'Library', poweredByNodejs: true },
        { name: 'Handlebars', type: 'Engine View', poweredByNodejs: true },
        { name: 'Django', type: 'Framework', poweredByNodejs: false },
        { name: 'Docker', type: 'Virtualization', poweredByNodejs: false },
        { name: 'Sequelize', type: 'ORM tool', poweredByNodejs: true },
    ];
    res.render('main/hb4', { technologies, layout: 'main' });
};

export const saveScore = async (req: Request, res: Response) => {
    [cite_start]// [cite: 1953]
    if (!req.session.uid) {
        return res.status(401).send('Usuário não autenticado.');
    }
    const { score } = req.body;
    if (typeof score !== 'number') {
        return res.status(400).send('Pontuação inválida.');
    }
    try {
        await gameSessionService.createGameSession(req.session.uid, score);
        res.status(200).send('Pontuação salva com sucesso!');
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).send('Erro ao salvar pontuação.');
    }
};

export const ranking = async (req: Request, res: Response) => {
    [cite_start]// [cite: 1954]
    try {
        const topScores = await gameSessionService.getTopScores(10);
        res.render('ranking/index', { topScores, layout: 'main' });
    } catch (error) {
        console.error('Error fetching ranking:', error);
        res.status(500).send('Erro ao carregar o ranking.');
    }
};

// Removed createCookie and clearCookie as they were just examples in the slides
// You can re-add them if you need them for other purposes
// export const createCookie = function (req: Request, res: Response) { /* ... */ };
// export const clearCookie = function (req: Request, res: Response) { /* ... */ };


export default {
    index,
    about,
    lorem,
    hb1,
    hb2,
    hb3,
    hb4,
    saveScore,
    ranking,
};
// src/controllers/main.ts
import { Request, Response } from 'express';
import { loremIpsum } from 'lorem-ipsum';
import * as gameSessionService from '../services/gameSession';

export const index = async (req: Request, res: Response) => {
    if (!req.session.uid) {
        return res.redirect('/login');
    }
    res.render('game/index', { layout: 'main' });
};

export const about = (req: Request, res: Response) => {
    res.render('about/index', {
        title: 'Sobre o Space Shooter',
        message: 'Space Shooter é um jogo clássico de arcade onde você controla uma nave espacial e deve destruir inimigos e asteroides, evitando colisões. O objetivo é alcançar a maior pontuação possível. Prepare-se para uma aventura intergaláctica!',
        imagePath: '/assets/img/game_concept.png',
        layout: 'main'
    });
};

export const lorem = (req: Request, res: Response) => {
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
    res.render('main/hb1', {
        mensagem: 'Olá, você está aprendendo Express + HBS!',
        layout: 'main'
    });
};

export const hb2 = (req: Request, res: Response) => {
    res.render('main/hb2', {
        poweredByNodejs: true,
        name: 'Express',
        type: 'Framework',
        layout: 'main'
    });
};

export const hb3 = (req: Request, res: Response) => {
    const profes = [
        { nome: 'David Fernandes', sala: 1238 },
        { nome: 'Horácio Fernandes', sala: 1233 },
        { nome: 'Edleno Moura', sala: 1236 },
        { nome: 'Elaine Harada', sala: 1231 }
    ];
    res.render('main/hb3', { profes, layout: 'main' });
};

export const hb4 = (req: Request, res: Response) => {
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
    try {
        const topScores = await gameSessionService.getTopScores(10);
        res.render('ranking/index', { topScores, layout: 'main' });
    } catch (error) {
        console.error('Error fetching ranking:', error);
        res.status(500).send('Erro ao carregar o ranking.');
    }
};

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
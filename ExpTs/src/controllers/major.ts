// src/controllers/major.ts
import { Request, Response } from 'express';
import * as majorService from '../services/major'; // Importa todas as funções do serviço major

// Controller para listar todos os cursos (index da rota /major)
export const index = async (req: Request, res: Response) => {
    try {
        const majors = await majorService.getAllMajors(); // Chama o serviço para obter todos os majors
        res.render('major/index', { majors, layout: 'main' }); // Renderiza a view de listagem de majors
    } catch (error) {
        console.error('Error fetching majors:', error);
        res.status(500).send('Erro ao carregar a lista de cursos.');
    }
};

// Controller para criar um novo curso (rota /major/create)
export const create = async (req: Request, res: Response) => {
    if (req.method === 'GET') {
        // Se a requisição for GET, renderiza o formulário de criação
        res.render('major/create', { layout: 'main' });
    } else {
        // Se a requisição for POST, processa os dados do formulário
        const { name, code, description } = req.body;
        try {
            await majorService.createMajor({ name, code, description }); // Chama o serviço para criar o major
            res.redirect('/major'); // Redireciona de volta para a lista de majors
        } catch (error: any) {
            console.error('Error creating major:', error);
            if (error.code === 'P2002' && error.meta?.target) {
                 // Erro de violação de unique constraint (ex: código ou nome já existem)
                return res.status(400).send(`O curso com este ${error.meta.target} já existe.`);
            }
            res.status(500).send('Erro ao criar o curso.');
        }
    }
};

// Controller para ler os detalhes de um curso específico (rota /major/read/:id)
export const read = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const major = await majorService.getMajorById(id); // Chama o serviço para obter o major pelo ID
        if (!major) {
            return res.status(404).send('Curso não encontrado.');
        }
        res.render('major/details', { major, layout: 'main' }); // Renderiza a view de detalhes do major
    } catch (error) {
        console.error('Error reading major:', error);
        res.status(500).send('Erro ao carregar os detalhes do curso.');
    }
};

// Controller para atualizar um curso existente (rota /major/update/:id)
export const update = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (req.method === 'GET') {
        try {
            const major = await majorService.getMajorById(id);
            if (!major) {
                return res.status(404).send('Curso não encontrado para atualização.');
            }
            res.render('major/update', { major, layout: 'main' }); // Renderiza o formulário de atualização
        } catch (error) {
            console.error('Error fetching major for update:', error);
            res.status(500).send('Erro ao carregar dados do curso para atualização.');
        }
    } else {
        const { name, code, description } = req.body;
        try {
            await majorService.updateMajor(id, { name, code, description }); // Chama o serviço para atualizar o major
            res.redirect('/major'); // Redireciona de volta para a lista de majors
        } catch (error: any) {
            console.error('Error updating major:', error);
             if (error.code === 'P2002' && error.meta?.target) {
                 // Erro de violação de unique constraint
                return res.status(400).send(`O curso com este ${error.meta.target} já existe.`);
            }
            res.status(500).send('Erro ao atualizar o curso.');
        }
    }
};

// Controller para remover um curso (rota /major/remove/:id)
export const remove = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await majorService.removeMajor(id); // Chama o serviço para remover o major
        res.status(200).send('Curso removido com sucesso.'); // Envia uma resposta de sucesso para a requisição AJAX
    } catch (error) {
        console.error('Error removing major:', error);
        res.status(500).send('Erro ao remover o curso.');
    }
};
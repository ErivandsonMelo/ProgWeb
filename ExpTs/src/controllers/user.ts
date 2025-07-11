// src/controllers/user.ts
import { Request, Response } from 'express';
import * as userService from '../services/user';
import * as majorService from '../services/major';

export const create = async (req: Request, res: Response) => {
    [cite_start]// [cite: 1948]
    if (req.method === 'GET') {
        const majors = await majorService.getAllMajors(); [cite_start]// Fetch majors for dropdown [cite: 1949]
        return res.render('user/create', { majors, layout: 'main' });
    } else { // POST request
        const { name, email, password, confirmPassword, majorId } = req.body; [cite_start]// [cite: 1949]

        [cite_start]if (password !== confirmPassword) { // [cite: 1964]
            return res.status(400).send('Senhas não conferem.');
        }

        try {
            await userService.createUser({ name, email, password, majorId }); [cite_start]// [cite: 1950]
            res.redirect('/login'); // Redirect to login after successful registration
        } catch (error: any) {
            console.error('Error creating user:', error);
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                return res.status(400).send('Email já cadastrado.');
            }
            res.status(500).send('Erro ao cadastrar usuário.');
        }
    }
};

export const login = async (req: Request, res: Response) => {
    [cite_start]// [cite: 1805]
    if (req.method === 'GET') {
        return res.render('auth/login', { layout: 'main' });
    } else { // POST request
        const { email, password } = req.body;
        try {
            const isValid = await userService.checkAuth({ email, password }); [cite_start]// [cite: 1770]
            if (isValid) {
                const user = await userService.findUserByEmail(email);
                if (user) {
                    req.session.uid = user.id; [cite_start]// Store user ID in session [cite: 1761]
                }
                res.redirect('/'); // Redirect to homepage or game page
            } else {
                res.status(401).send('Email ou senha inválidos.');
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).send('Erro no servidor.');
        }
    }
};

export const logout = (req: Request, res: Response) => {
    [cite_start]// [cite: 1786]
    [cite_start]req.session.destroy((err) => { // [cite: 1788]
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Erro ao sair.');
        }
        res.redirect('/');
    });
};

export const editProfile = async (req: Request, res: Response) => {
    [cite_start]// [cite: 1962]
    if (!req.session.uid) {
        return res.redirect('/login');
    }

    try {
        const user = await userService.findUserById(req.session.uid);
        if (!user) {
            return res.status(404).send('Usuário não encontrado.');
        }

        if (req.method === 'GET') {
            const majors = await majorService.getAllMajors();
            return res.render('user/edit-profile', { user, majors, layout: 'main' });
        } else { // POST request
            const { name, email, majorId } = req.body;
            await userService.updateUser(user.id, { name, email, majorId });
            res.redirect('/'); // Redirect after update
        }
    } catch (error) {
        console.error('Error editing profile:', error);
        res.status(500).send('Erro ao atualizar perfil.');
    }
};

export const changePassword = async (req: Request, res: Response) => {
    [cite_start]// [cite: 1962]
    if (!req.session.uid) {
        return res.redirect('/login');
    }

    if (req.method === 'GET') {
        return res.render('user/change-password', { layout: 'main' });
    } else {
        const { currentPassword, newPassword, confirmNewPassword } = req.body; [cite_start]// [cite: 1963]

        [cite_start]if (newPassword !== confirmNewPassword) { // [cite: 1964]
            return res.status(400).send('A nova senha e a confirmação não conferem.');
        }

        try {
            const user = await userService.findUserById(req.session.uid);
            if (!user) {
                return res.status(404).send('Usuário não encontrado.');
            }

            [cite_start]// [cite: 1964]
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                return res.status(400).send('Senha atual incorreta.');
            }

            await userService.updatePassword(user.id, newPassword);
            res.redirect('/'); // Redirect after password change
        } catch (error) {
            console.error('Error changing password:', error);
            res.status(500).send('Erro ao alterar senha.');
        }
    }
};

// CRUD operations for users (index, read, update, remove - if needed for admin)
export const index = async (req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.render('user/index', { users, layout: 'main' }); // Assuming a user listing page
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Erro ao carregar lista de usuários.');
    }
};

export const remove = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await userService.removeUser(id);
        res.status(200).send('Usuário deletado com sucesso');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Falha ao deletar usuário');
    }
};
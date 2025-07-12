// src/controllers/user.ts
import { Request, Response } from 'express';
import * as userService from '../services/user';
import * as majorService from '../services/major';
import bcrypt from 'bcryptjs';

export const create = async (req: Request, res: Response) => {
    if (req.method === 'GET') {
        const majors = await majorService.getAllMajors();
        return res.render('user/create', { majors, layout: 'main' });
    } else { // POST request
        const { name, email, password, confirmPassword, majorId } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).render('user/create', {
                layout: 'main',
                error: 'Senhas não conferem.',
                oldName: name,
                oldEmail: email,
                oldMajorId: majorId,
                majors: await majorService.getAllMajors() // Recarrega os majors para o dropdown
            });
        }

        try {
            await userService.createUser({ name, email, password, majorId });
            res.redirect('/login?success=registered'); // Redireciona para login com status de sucesso
        } catch (error: any) {
            console.error('Error creating user:', error);
            let errorMessage = 'Erro ao cadastrar usuário.';
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                errorMessage = 'Email já cadastrado.';
            }
            res.status(500).render('user/create', {
                layout: 'main',
                error: errorMessage,
                oldName: name,
                oldEmail: email,
                oldMajorId: majorId,
                majors: await majorService.getAllMajors() // Recarrega os majors para o dropdown
            });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    if (req.method === 'GET') {
        let successMessage = '';
        // Verifica se há uma mensagem de sucesso na query string (ex: de um registro bem-sucedido)
        if (req.query.success === 'registered') {
            successMessage = 'Conta criada com sucesso! Faça login.';
        }
        return res.render('auth/login', { layout: 'main', success: successMessage });
    } else { // POST request
        const { email, password } = req.body;
        try {
            const isValid = await userService.checkAuth({ email, password });
            if (isValid) {
                const user = await userService.findUserByEmail(email);
                if (user) {
                    req.session.uid = user.id;
                    req.session.save((err) => {
                        if (err) {
                            console.error('Error saving session:', err);
                            return res.status(500).send('Erro ao iniciar sessão.');
                        }
                        res.redirect('/');
                    });
                } else {
                    res.status(401).render('auth/login', {
                        layout: 'main',
                        error: 'Email ou senha inválidos.',
                        oldEmail: email
                    });
                }
            } else {
                res.status(401).render('auth/login', {
                    layout: 'main',
                    error: 'Email ou senha inválidos.',
                    oldEmail: email
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).send('Erro no servidor.'); // Para erros inesperados
        }
    }
};

export const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Erro ao sair.');
        }
        res.redirect('/login?success=logged_out'); // Redireciona para login com status de logout
    });
};

export const editProfile = async (req: Request, res: Response) => {
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
            try {
                await userService.updateUser(user.id, { name, email, majorId });
                res.redirect('/profile/edit?success=updated'); // Redireciona para a mesma página com sucesso
            } catch (error: any) {
                console.error('Error updating profile:', error);
                 let errorMessage = 'Erro ao atualizar perfil.';
                if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
                    errorMessage = 'Email já cadastrado.';
                }
                const majors = await majorService.getAllMajors(); // Recarrega os majors
                res.status(500).render('user/edit-profile', {
                    layout: 'main',
                    error: errorMessage,
                    user: { ...user, name, email, majorId }, // Mantém dados submetidos
                    majors
                });
            }
        }
    } catch (error) {
        console.error('Error in editProfile:', error);
        res.status(500).send('Erro no servidor ao carregar/processar perfil.');
    }
};

export const changePassword = async (req: Request, res: Response) => {
    if (!req.session.uid) {
        return res.redirect('/login');
    }

    if (req.method === 'GET') {
        let successMessage = '';
        if (req.query.success === 'changed') {
            successMessage = 'Senha alterada com sucesso!';
        }
        return res.render('user/change-password', { layout: 'main', success: successMessage });
    } else {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (newPassword !== confirmNewPassword) {
            return res.status(400).render('user/change-password', {
                layout: 'main',
                error: 'A nova senha e a confirmação não conferem.'
            });
        }

        try {
            const user = await userService.findUserById(req.session.uid);
            if (!user) {
                return res.status(404).send('Usuário não encontrado.');
            }

            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                return res.status(400).render('user/change-password', {
                    layout: 'main',
                    error: 'Senha atual incorreta.'
                });
            }

            await userService.updatePassword(user.id, newPassword);
            res.redirect('/profile/change-password?success=changed'); // Redireciona para a mesma página com sucesso
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
        res.render('user/index', { users, layout: 'main' });
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
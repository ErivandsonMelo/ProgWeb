// src/services/user.ts
import { PrismaClient, User } from '@prisma/client';
import { UserCreateDto, LoginDto, UserUpdateDto } from '../types/user';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const createUser = async (userData: UserCreateDto): Promise<User> => {
    const salt = await bcrypt.genSalt(10); // Gera um salt aleatório para a senha
    const hashedPassword = await bcrypt.hash(userData.password, salt); // Gera o hash da senha

    return await prisma.user.create({
        data: {
            ...userData, // Usa os dados do DTO
            password: hashedPassword, // Armazena a senha hash
        },
    });
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
    return await prisma.user.findUnique({ where: { email } }); // Busca um usuário pelo email
};

export const findUserById = async (id: string): Promise<User | null> => {
    return await prisma.user.findUnique({ where: { id } }); // Busca um usuário pelo ID
};

export const checkAuth = async (credentials: LoginDto): Promise<boolean> => {
    const user = await prisma.user.findUnique({ where: { email: credentials.email } }); // Encontra o usuário pelo email
    if (!user) {
        return false; // Usuário não encontrado
    }
    // Compara a senha fornecida com a senha hash armazenada
    const isValid = await bcrypt.compare(credentials.password, user.password); 
    return isValid;
};

export const updateUser = async (id: string, userData: UserUpdateDto): Promise<User> => {
    return await prisma.user.update({
        where: { id },
        data: userData,
    });
};

export const updatePassword = async (id: string, newPasswordPlain: string): Promise<User> => {
    const salt = await bcrypt.genSalt(10); // Gera um novo salt
    const hashedPassword = await bcrypt.hash(newPasswordPlain, salt); // Gera o hash da nova senha
    return await prisma.user.update({
        where: { id },
        data: { password: hashedPassword }, // Atualiza apenas a senha
    });
};

export const removeUser = async (id: string): Promise<User> => {
    return await prisma.user.delete({ where: { id } }); // Remove um usuário pelo ID
};

export const getAllUsers = async (): Promise<User[]> => {
    return await prisma.user.findMany(); // Busca todos os usuários (útil para uma página de admin, por exemplo)
};
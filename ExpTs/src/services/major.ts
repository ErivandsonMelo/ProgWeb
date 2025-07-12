// src/services/major.ts
import { Major } from '@prisma/client'; // Mantenha apenas o 'Major' se for usado para tipagem
import { CreateMajorDto, UpdateMajorDto } from '../types/major';
import prisma from '../lib/prisma'; // <--- ADICIONE ESTA LINHA AQUI!

export const getAllMajors = async(): Promise<Major[]> => {
    return prisma.major.findMany();
};

export const createMajor = async (
    newMajor: CreateMajorDto
): Promise<Major> => {
    return await prisma.major.create({ data: newMajor });
};

export const getMajorById = async (id: string): Promise<Major | null> => {
    return prisma.major.findUnique({ where: { id } });
};

export const updateMajor = async (id: string, majorData: UpdateMajorDto): Promise<Major> => {
    return prisma.major.update({
        where: { id },
        data: majorData,
    });
};

export const removeMajor = async (id: string): Promise<Major> => {
    return prisma.major.delete({ where: { id } });
};
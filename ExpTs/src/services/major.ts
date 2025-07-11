// src/services/major.ts
import { PrismaClient, Major } from '@prisma/client';
import { CreateMajorDto, UpdateMajorDto } from '../types/major'; // Certifique-se de que este caminho e os tipos existam e estejam corretos

const prisma = new PrismaClient();

export const getAllMajors = async(): Promise<Major[]> => {
    return prisma.major.findMany();
};

export const createMajor = async (
    newMajor: CreateMajorDto
): Promise<Major> => {
    return await prisma.major.create({ data: newMajor });
};

export const getMajorById = async (id: string): Promise<Major | null> => {
    return await prisma.major.findUnique({ where: { id } });
};

export const updateMajor = async (id: string, majorData: UpdateMajorDto): Promise<Major> => {
    return await prisma.major.update({
        where: { id },
        data: majorData,
    });
};

export const removeMajor = async (id: string): Promise<Major> => {
    return await prisma.major.delete({ where: { id } });
};
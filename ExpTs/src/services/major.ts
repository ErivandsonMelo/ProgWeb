// src/services/major.ts
import { PrismaClient, Major } from '@prisma/client';
import { CreateMajorDto, UpdateMajorDto } from '../types/major'; // Assuming UpdateMajorDto exists for majors

const prisma = new PrismaClient();

[cite_start]export const getAllMajors = async(): Promise<Major[]> => { // [cite: 705]
    return prisma.major.findMany(); [cite_start]// [cite: 707]
};

export const createMajor = async (
    newMajor: CreateMajorDto
[cite_start]): Promise<Major> => { // [cite: 708]
    return await prisma.major.create({ data: newMajor }); [cite_start]// [cite: 712]
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
    return await prisma.major.delete({ where: { id } }); [cite_start]// [cite: 580]
};
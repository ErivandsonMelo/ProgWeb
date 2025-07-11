// src/types/major.ts
import { Major } from '@prisma/client';

// DTO para a criação de um novo curso
export type CreateMajorDto = Pick<Major, 'name' | 'code' | 'description'>;

// DTO para a atualização de um curso existente
export type UpdateMajorDto = Pick<Major, 'name' | 'code' | 'description'>;
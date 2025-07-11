// src/types/user.ts
import { User } from '@prisma/client';

export type UserCreateDto = Pick<User, 'name' | 'email' | 'password' | 'majorId'>;
export type UserUpdateDto = Pick<User, 'name' | 'email' | 'majorId'>;
export type LoginDto = Pick<User, 'email' | 'password'>;
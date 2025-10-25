// src/entities/recipe/api/recipeApi.ts
import { api } from '@/shared/lib/axios'

export interface Recipe {
    id: number
    title: string
    description?: string
    ingredients: string
    instructions: string
    author: { id: number; name?: string; email: string }
}

export interface CreateRecipeDto {
    title: string
    description?: string
    ingredients: string
    instructions: string
}

export const recipeApi = {
    getAll: () => api.get<Recipe[]>('/recipes'),
    getMine: () => api.get<Recipe[]>('/recipes/me'),
    getOne: (id: number) => api.get<Recipe>(`/recipes/${id}`),
    create: (data: CreateRecipeDto) => api.post<Recipe>('/recipes', data),
    delete: (id: number) => api.delete<Recipe>(`/recipes/${id}`),
    update: (id: number, data: CreateRecipeDto) => api.patch<Recipe>(`/recipes/${id}`, data),
}

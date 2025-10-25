import { api } from '@/shared/lib/axios'

export interface Rating {
    id: number
    value: number
    userId: number
    recipeId: number
}

export interface RateRecipeDto {
    recipeId: number
    value: number
}

export interface RatingResponse {
    avg: number
    count: number
    userRating: number
}

export const ratingApi = {
    rate: (data: RateRecipeDto) => api.post<RatingResponse>('/ratings', data),

    getForRecipe: (recipeId: number) =>
        api.get<RatingResponse>(`/ratings/${recipeId}`),
}

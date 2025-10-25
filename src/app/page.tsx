'use client'

import { useAuthRedirect } from '@/features/auth/lib/useAuthRedirect'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { recipeApi, Recipe } from '@/entities/recipe/api/recipeApi'
import { RecipeCard } from '@/entities/recipe/ui/RecipeCard'

export default function Home() {
    useAuthRedirect()
    const router = useRouter()

    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [currentUserId, setCurrentUserId] = useState<number | null>(null)

    // ✅ Виконуємо тільки на клієнті
    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
        if (!token) return

        try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            setCurrentUserId(payload.sub)
        } catch (err) {
            console.error('Error decoding token', err)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.replace('/login')
    }

    const handleCreateRecipe = () => {
        router.push('/create')
    }

    const handleEditRecipe = (id: number) => {
        router.push(`/${id}`)
    }

    const handleDeleteRecipe = async (id: number) => {
        try {
            await recipeApi.delete(id)
            setRecipes(prev => prev.filter(r => r.id !== id))
        } catch (err: any) {
            console.error(err)
            setError(err.response?.data?.message || 'Error deleting recipe')
        }
    }

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true)
                const res = await recipeApi.getAll()
                setRecipes(res.data)
            } catch (err: any) {
                setError(err.response?.data?.message || 'Error fetching recipes')
            } finally {
                setLoading(false)
            }
        }
        fetchRecipes()
    }, [])

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">All Recipes</h1>
                <div className="flex gap-2">
                    <button
                        className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                        onClick={handleCreateRecipe}
                    >
                        Create Recipe
                    </button>
                    <button
                        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-600">{error}</p>}

            <div className="grid gap-4">
                {recipes.map(recipe => (
                    <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        isMine={recipe.author.id === currentUserId}
                        onEdit={() => handleEditRecipe(recipe.id)}
                        onDelete={() => handleDeleteRecipe(recipe.id)}
                    />
                ))}
            </div>
        </div>
    )
}

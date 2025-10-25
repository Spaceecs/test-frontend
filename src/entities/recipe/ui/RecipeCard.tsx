'use client'

import { useEffect, useState } from 'react'
import { Recipe } from '@/entities/recipe/api/recipeApi'
import { ratingApi } from '@/entities/rating/api/ratingApi'

interface RecipeCardProps {
    recipe: Recipe
    isMine?: boolean
    onEdit?: () => void
    onDelete?: () => void
}

export const RecipeCard = ({ recipe, isMine, onEdit, onDelete }: RecipeCardProps) => {
    const [userRating, setUserRating] = useState<number>(0)
    const [hover, setHover] = useState<number | null>(null)
    const [message, setMessage] = useState<string>('')
    const [avgRating, setAvgRating] = useState<number>(0)
    const [ratingCount, setRatingCount] = useState<number>(0)

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const res = await ratingApi.getForRecipe(recipe.id)
                setAvgRating(res.data.avg)
                setRatingCount(res.data.count)
                setUserRating(res.data.userRating)
            } catch (err) {
                console.error('Error fetching rating', err)
            }
        }
        fetchRating()
    }, [recipe.id])


    const handleRate = async (value: number) => {
        try {
            setUserRating(value)
            localStorage.setItem(`rating-${recipe.id}`, value.toString())

            const res = await ratingApi.rate({ recipeId: recipe.id, value })
            setAvgRating(res.data.avg)
            setRatingCount(res.data.count)
            setMessage('Rating submitted successfully!')
        } catch (err: any) {
            console.error(err)
            setMessage(err.response?.data?.message || 'Error submitting rating')
        }
    }

    return (
        <div className="border p-4 rounded shadow bg-white">
            <h2 className="text-xl font-semibold">{recipe.title}</h2>

            {recipe.description && (
                <p className="text-gray-700 mt-1">{recipe.description}</p>
            )}

            <p className="mt-2"><strong>Ingredients:</strong> {recipe.ingredients}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
            <p className="text-sm text-gray-500 mt-1">
                <em>Author: {recipe.author.name || recipe.author.email}</em>
            </p>

            <div className="mt-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(value => (
                    <button
                        key={value}
                        onClick={() => handleRate(value)}
                        onMouseEnter={() => setHover(value)}
                        onMouseLeave={() => setHover(null)}
                        className={`text-2xl transition ${
                            (hover ?? userRating) >= value ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                    >
                        ★
                    </button>
                ))}
                {message && (
                    <span className="ml-2 text-sm text-green-600">{message}</span>
                )}
            </div>

            <p className="mt-1 text-sm text-gray-500">
                Average rating: {avgRating.toFixed(1)} ({ratingCount} votes)
            </p>

            {isMine && (
                <div className="flex gap-2 mt-3">
                    <button
                        className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                        onClick={onEdit}
                    >
                        Edit
                    </button>
                    <button
                        className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700"
                        onClick={onDelete}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}

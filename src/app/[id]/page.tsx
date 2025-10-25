'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { recipeApi } from '@/entities/recipe/api/recipeApi'
import {RecipeForm} from "@/features/recipe/ui/RecipeForm";

interface RecipeData {
    title: string
    ingredients: string
    instructions: string
    description?: string
}

export default function Edit(){
    const router = useRouter()
    const { id } = useParams() // Next.js 13 app router
    const [recipe, setRecipe] = useState<RecipeData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchRecipe = async () => {
            if (!id) return
            try {
                const res = await recipeApi.getOne(Number(id))
                setRecipe(res.data)
            } catch (err: any) {
                console.error(err)
                setError('Failed to load recipe')
            } finally {
                setLoading(false)
            }
        }

        fetchRecipe()
    }, [id])

    if (loading) return <p className="text-center mt-10">Loading...</p>
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>
    if (!recipe) return <p className="text-center mt-10">Recipe not found</p>

    return (
        <RecipeForm
            initialValues={recipe}
            recipeId={Number(id)}
            onSuccess={() => router.replace(`/`)}
        />
    )
}

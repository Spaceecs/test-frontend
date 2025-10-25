'use client'

import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/shared/ui/Input'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { recipeApi } from '@/entities/recipe/api/recipeApi'

interface RecipeFormValues {
    title: string
    ingredients: string
    instructions: string
    description?: string
}

interface RecipeFormProps {
    initialValues?: RecipeFormValues
    recipeId?: number
    onSuccess?: () => void
}

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    ingredients: Yup.string().required('Ingredients are required'),
    instructions: Yup.string().required('Instructions are required'),
    description: Yup.string(),
})

export const RecipeForm = ({ initialValues, recipeId, onSuccess }: RecipeFormProps) => {
    const [message, setMessage] = useState('')
    const router = useRouter()

    const defaultValues: RecipeFormValues = {
        title: '',
        ingredients: '',
        instructions: '',
        description: '',
    }

    const handleSubmit = async (values: RecipeFormValues) => {
        setMessage('')
        try {
            if (recipeId) {
                await recipeApi.update(recipeId, values)
                setMessage('Recipe updated successfully!')
            } else {
                await recipeApi.create(values)
                setMessage('Recipe created successfully!')
            }

            if (onSuccess) {
                onSuccess()
            } else {
                router.replace('/')
            }
        } catch (err: any) {
            console.error(err)
            setMessage(err.response?.data?.message || 'Error saving recipe')
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    {recipeId ? 'Edit Recipe' : 'Add New Recipe'}
                </h1>

                <Formik
                    initialValues={initialValues || defaultValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleChange, values, errors, touched }) => (
                        <Form className="space-y-4">
                            <Input
                                name="title"
                                placeholder="Title"
                                value={values.title}
                                onChange={handleChange}
                                error={touched.title && errors.title ? errors.title : ''}
                            />

                            <Input
                                name="ingredients"
                                placeholder="Ingredients"
                                value={values.ingredients}
                                onChange={handleChange}
                                error={touched.ingredients && errors.ingredients ? errors.ingredients : ''}
                            />

                            <Input
                                name="instructions"
                                placeholder="Instructions"
                                value={values.instructions}
                                onChange={handleChange}
                                error={touched.instructions && errors.instructions ? errors.instructions : ''}
                            />

                            <Input
                                name="description"
                                placeholder="Description (optional)"
                                value={values.description}
                                onChange={handleChange}
                                error={touched.description && errors.description ? errors.description : ''}
                            />

                            <button
                                type="submit"
                                className="bg-green-600 text-white py-2 rounded w-full hover:bg-green-700 transition"
                            >
                                {recipeId ? 'Update Recipe' : 'Create Recipe'}
                            </button>

                            {message && (
                                <p className="text-center mt-2 text-gray-600">{message}</p>
                            )}
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

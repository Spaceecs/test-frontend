'use client'

import { Formik, Form } from 'formik'
import { Input } from '@/shared/ui/Input'
import { userApi } from '@/entities/user/api/userApi'
import { registerSchema, loginSchema } from '../lib/validation'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
    type: 'login' | 'register'
}

export const AuthForm = ({ type }: AuthFormProps) => {
    const [message, setMessage] = useState('')
    const isRegister = type === 'register'
    const router = useRouter()

    const initialValues = { email: '', password: '', name: '' }

    const handleSubmit = async (values: typeof initialValues) => {
        setMessage('')
        try {
            const res = isRegister
                ? await userApi.register(values)
                : await userApi.login(values)

            console.log('Response:', res.status, res.data)

            if (res.data.access_token) {
                localStorage.setItem('token', res.data.access_token)
                setMessage('Success! Redirecting...')
                router.replace('/')
            } else {
                setMessage('No access token received')
                console.warn('No access token in response:', res.data)
            }
        } catch (err: any) {
            if (err.response) {
                console.error('Server error:', err.response.status, err.response.data)
                setMessage(err.response.data.message || 'Server error')
            } else if (err.request) {
                console.error('No response received:', err.request)
                setMessage('Server did not respond')
            } else {
                console.error('Error:', err.message)
                setMessage(`Error: ${err.message}`)
            }
        }
    }

    const handleSwitchPage = () => {
        if (isRegister) router.push('/login')
        else router.push('/register')
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    {isRegister ? 'Register' : 'Login'}
                </h1>

                <Formik
                    initialValues={initialValues}
                    validationSchema={isRegister ? registerSchema : loginSchema}
                    onSubmit={handleSubmit}
                >
                    <Form className="space-y-4">
                        {isRegister && <Input name="name" placeholder="Name" />}
                        <Input name="email" placeholder="Email" type="email" />
                        <Input name="password" placeholder="Password" type="password" />

                        <button
                            type="submit"
                            className="bg-green-600 text-white py-2 rounded w-full hover:bg-green-700 transition"
                        >
                            {isRegister ? 'Register' : 'Login'}
                        </button>

                        {message && (
                            <p className="text-center mt-2 text-gray-600">{message}</p>
                        )}
                    </Form>
                </Formik>

                <p className="text-center mt-4 text-gray-500">
                    {isRegister
                        ? 'Already have an account? '
                        : "Don't have an account? "}
                    <button
                        type="button"
                        className="text-green-600 hover:underline ml-1"
                        onClick={handleSwitchPage}
                    >
                        {isRegister ? 'Login' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    )
}

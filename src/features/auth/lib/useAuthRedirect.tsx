'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useAuthRedirect = (redirectTo = '/login') => {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('token') // або cookie, якщо серверний токен
        if (!token) {
            router.replace(redirectTo)
        }
    }, [router, redirectTo])
}

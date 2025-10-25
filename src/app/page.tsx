'use client'

import { useAuthRedirect } from '@/features/auth/lib/useAuthRedirect'
import { useRouter } from 'next/navigation'

export default function Home() {
    useAuthRedirect()
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.replace('/login')
    }

    return (
        <div className="p-4">
            <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 rounded w-full hover:bg-red-700 transition"
            >
                Logout
            </button>
        </div>
    )
}

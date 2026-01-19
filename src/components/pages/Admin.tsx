import { ShieldCheck } from 'lucide-react'
import { SettingsManager } from '../admin/SettingsManager'
import { auth } from '../../lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { usersApi } from '../../lib/firebase/users'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function Admin() {
    const navigate = useNavigate()
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
        const sysAdmin = localStorage.getItem('isSystemAdmin') === 'true'
        if (sysAdmin) {
            setIsAuthorized(true)
            return
        }

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const role = await usersApi.getUserRole(user.uid)
                if (role === 'admin') {
                    setIsAuthorized(true)
                } else {
                    navigate('/')
                }
            } else {
                navigate('/auth')
            }
        })
        return () => unsubscribe()
    }, [navigate])

    if (isAuthorized === null) return <div className="p-20 text-center font-black animate-pulse">Checking credentials...</div>

    return (
        <div className="container mx-auto py-12 md:py-20 space-y-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <ShieldCheck size={28} />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                        Admin Dashboard
                    </h1>
                </div>
                <p className="text-muted-foreground font-medium max-w-2xl">
                    Configure your platform's dynamic filters, manage social presence, and oversee system health.
                </p>
            </div>

            <div className="space-y-8">
                <SettingsManager />
            </div>
        </div>
    )
}

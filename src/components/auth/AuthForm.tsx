import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    signOut,
    onAuthStateChanged,
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { usersApi } from '../../lib/firebase/users'
import { configsApi } from '../../lib/firebase/configs'
import { sendPasswordResetEmail } from 'firebase/auth'
import { ArrowRight, Mail, Lock, Eye, EyeOff, KeyRound } from 'lucide-react'
import { Alert } from '../ui/Alert'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export function AuthForm() {
    const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [resetSent, setResetSent] = useState(false)

    // Email/Password state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authError, setAuthError] = useState<string | null>(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            setUser(u)
            if (u) {
                await usersApi.syncUser(u.uid, u.email!, u.displayName || 'User')
                const r = await usersApi.getUserRole(u.uid)
                // Immediate redirect if super-admin
                if (r === 'super-admin') {
                    navigate('/admin')
                }
            }
            setLoading(false)
        })
        return () => unsubscribe()
    }, [navigate])

    const handleForgotPassword = async () => {
        if (!email) {
            setAuthError('Please enter your email address first.')
            return
        }
        setLoading(true)
        try {
            await sendPasswordResetEmail(auth, email)
            setResetSent(true)
            setAuthError(null)
        } catch (err) {
            setAuthError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setAuthError(null)

        try {
            const adminCreds = await configsApi.getAdminAuth()
            const adminEmail = adminCreds.email || import.meta.env.VITE_ADMIN_EMAIL || 'admin@gmail.com'
            const adminPassword = adminCreds.password || import.meta.env.VITE_ADMIN_PASSWORD || 'adminMeritSeries'

            if (email === adminEmail && password === adminPassword) {
                try {
                    // Try to sign in as the official admin
                    const userCredential = await signInWithEmailAndPassword(auth, email, password)
                    const u = userCredential.user

                    // Ensure role is super-admin in Firestore
                    await usersApi.updateUserRole(u.uid, 'super-admin')

                    navigate('/admin')
                    return
                } catch (err) {
                    const authErr = err as { code?: string; message: string }
                    console.error("Admin Login Error:", authErr)
                    if (authErr.code === 'auth/operation-not-allowed') {
                        setAuthError('Error: "Email/Password" sign-in is disabled in your Firebase Console.')
                        setLoading(false)
                        return
                    }
                    if (authErr.code === 'auth/user-not-found' || authErr.code === 'auth/invalid-credential') {
                        try {
                            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                            const u = userCredential.user

                            await usersApi.updateUserRole(u.uid, 'super-admin')
                            navigate('/admin')
                            return
                        } catch (createErr) {
                            throw createErr
                        }
                    }
                    throw err
                }
            }

            setAuthError('Invalid credentials. Access denied.')
        } catch (err) {
            setAuthError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth)
            navigate('/')
            window.location.reload()
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/20" />
            <div className="h-4 w-32 bg-muted rounded" />
        </div>
    )

    return (
        <div className="w-full flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-md bg-card border border-muted rounded-[2.5rem] p-6 sm:p-8 shadow-2xl shadow-black/5 space-y-6 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                <div className="text-center space-y-2 relative z-10">
                    <h1 className="text-3xl font-bold text-secondary">
                        Admin Panel
                    </h1>
                    <p className="text-muted-foreground font-medium text-sm">
                        Secure access for authorized personnel only
                    </p>
                </div>

                <div className="space-y-4 relative z-10">
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <Input
                            label="Admin Email"
                            type="email"
                            required
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            startIcon={<Mail className="h-5 w-5" />}
                        />

                        <Input
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            startIcon={<Lock className="h-5 w-5" />}
                            endIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="focus:outline-none hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            }
                        />

                        {authError && (
                            <Alert
                                severity="error"
                                className="animate-in slide-in-from-top-2"
                            >
                                {authError}
                            </Alert>
                        )}

                        {resetSent && (
                            <Alert
                                severity="success"
                                className="animate-in slide-in-from-top-2"
                            >
                                Password reset email sent! Please check your inbox.
                            </Alert>
                        )}

                        <Button type="submit" className="w-full h-14 rounded-2xl font-bold text-lg">
                            Authorize
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>

                        <div className="flex justify-center pt-2">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-primary/5"
                            >
                                <KeyRound className="h-4 w-4" />
                                Forgot Password?
                            </button>
                        </div>
                    </form>

                    <div className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 py-4">
                        Encrypted & Secure Session
                    </div>
                </div>

                {user && (
                    <div className="pt-6 border-t border-muted/50 mt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase tracking-tight font-bold">Authenticated As</span>
                                <span className="text-sm font-medium text-secondary truncate max-w-[180px]">{user.email}</span>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleLogout}
                                className="h-9 px-4 rounded-xl text-xs font-bold border-primary/20 hover:bg-primary/5"
                            >
                                Sign Out
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

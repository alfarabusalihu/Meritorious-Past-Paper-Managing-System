import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { usersApi } from '../../lib/firebase/users'
import { configsApi } from '../../lib/firebase/configs'
import { clsx } from 'clsx'
import { LogOut, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react'
import { Alert } from '@mui/material'
import { Button } from '../ui/Button'

export function AuthForm() {
    const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(null)
    const [isSystemAdmin, setIsSystemAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isLogin, setIsLogin] = useState(true)
    const [role, setRole] = useState<'user' | 'admin' | 'super-admin' | null>(null)

    // Email/Password state
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authError, setAuthError] = useState<string | null>(null)

    useEffect(() => {
        setIsSystemAdmin(localStorage.getItem('isSystemAdmin') === 'true')
        const unsubscribe = onAuthStateChanged(auth, async (u) => {
            setUser(u)
            if (u) {
                await usersApi.syncUser(u.uid, u.email!, u.displayName || 'User')
                const r = await usersApi.getUserRole(u.uid)
                setRole(r)
            } else {
                setRole(null)
            }
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider()
        try {
            await signInWithPopup(auth, provider)
            navigate('/')
        } catch (err) {
            console.error('Login failed:', err)
        }
    }

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setAuthError(null)

        try {
            const adminCreds = await configsApi.getAdminAuth()
            const adminEmail = adminCreds.email || import.meta.env.VITE_ADMIN_EMAIL || 'admin@gmail.com'
            const adminPassword = adminCreds.password || import.meta.env.VITE_ADMIN_PASSWORD || 'adminMPPMS'

            if (email === adminEmail && password === adminPassword) {
                try {
                    // Try to sign in as the official admin
                    const userCredential = await signInWithEmailAndPassword(auth, email, password)
                    const u = userCredential.user

                    // Ensure role is admin in Firestore
                    await usersApi.updateUserRole(u.uid, 'admin')

                    localStorage.setItem('isSystemAdmin', 'true')
                    localStorage.setItem('adminEmail', email)
                    navigate('/admin')
                    return
                } catch (err: any) {
                    console.error("Admin Login Error:", err)
                    if (err.code === 'auth/operation-not-allowed') {
                        setAuthError('Error: "Email/Password" sign-in is disabled in your Firebase Console. Please enable it in Authentication > Sign-in method.')
                        setLoading(false)
                        return
                    }
                    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                        try {
                            // User doesn't exist in Auth but matches Master Key? Create it!
                            // Note: This requires 'Email/Password' to be enabled in Firebase Console
                            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                            const u = userCredential.user

                            await usersApi.updateUserRole(u.uid, 'admin')
                            localStorage.setItem('isSystemAdmin', 'true')
                            localStorage.setItem('adminEmail', email)
                            navigate('/admin')
                            return
                        } catch (createErr: any) {
                            console.error("Admin Creation Error:", createErr)
                            if (createErr.code === 'auth/operation-not-allowed') {
                                setAuthError('Error: "Email/Password" sign-in is disabled in your Firebase Console. Please enable it in Authentication > Sign-in method.')
                                setLoading(false)
                                return
                            }
                            throw createErr
                        }
                    }
                    throw err
                }
            }

            setAuthError('Invalid credentials. Please use Google Sign-in.')
        } catch (err: any) {
            setAuthError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        localStorage.removeItem('isSystemAdmin')
        localStorage.removeItem('adminEmail')
        await signOut(auth)
        navigate('/')
        window.location.reload()
    }

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse space-y-4">
            <div className="h-12 w-12 rounded-full bg-primary/20" />
            <div className="h-4 w-32 bg-muted rounded" />
        </div>
    )

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-card border border-muted rounded-[2.5rem] p-8 shadow-2xl shadow-black/5 space-y-8 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                <div className="text-center space-y-2 relative z-10">
                    <h1 className="text-3xl font-bold text-secondary">
                        {(user || isSystemAdmin) ? 'Welcome Back!' : (isLogin ? 'Hello Again!' : 'Join MPPMS')}
                    </h1>
                    <p className="text-muted-foreground font-medium text-sm">
                        {(user || isSystemAdmin)
                            ? `Signed in as ${user?.displayName || 'System Admin'}`
                            : (isLogin ? 'Sign in to access and manage papers' : 'Create an account to contribute')}
                    </p>
                </div>

                {(!user && !isSystemAdmin) ? (
                    <div className="space-y-6 relative z-10">
                        <div className="flex p-1.5 bg-muted/50 rounded-2xl border border-muted">
                            <button
                                onClick={() => { setIsLogin(true); setAuthError(null); }}
                                className={clsx(
                                    "flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                                    isLogin ? "bg-white text-primary shadow-lg shadow-black/5" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => { setIsLogin(false); setAuthError(null); }}
                                className={clsx(
                                    "flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                                    !isLogin ? "bg-white text-primary shadow-lg shadow-black/5" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Sign Up
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? 'login' : 'signup'}
                                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                                className="space-y-6"
                            >
                                {isLogin && (
                                    <form onSubmit={handleEmailLogin} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full h-12 pl-10 pr-4 bg-muted/30 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm"
                                                    placeholder="admin@gmail.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                <input
                                                    type="password"
                                                    required
                                                    className="w-full h-12 pl-10 pr-4 bg-muted/30 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm"
                                                    placeholder="••••••••"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {authError && (
                                            <Alert
                                                severity="error"
                                                sx={{ borderRadius: '1rem', fontWeight: 700 }}
                                                className="animate-in slide-in-from-top-2"
                                            >
                                                {authError}
                                            </Alert>
                                        )}
                                        <Button type="submit" className="w-full h-14 rounded-2xl font-bold text-lg">
                                            Sign In
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </form>
                                )}

                                <div className="relative py-2">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-muted" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-card px-4 text-muted-foreground/50 font-bold">Or continue with</span>
                                    </div>
                                </div>

                                <div className="pt-0">
                                    <Button
                                        onClick={handleGoogleLogin}
                                        className="w-full h-14 bg-white hover:bg-slate-100 text-secondary border-2 border-muted hover:border-primary/30 shadow-none text-base font-bold rounded-2xl flex items-center justify-center gap-3 transition-all"
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Google Account
                                    </Button>
                                </div>
                                <div className="text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 py-4">
                                    Trusted by Students & Educators
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="space-y-8 relative z-10">
                        <div className="flex flex-col items-center space-y-6">
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full border-4 border-primary/20 p-1">
                                    <img
                                        src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'System Admin'}`}
                                        className="h-full w-full rounded-full object-cover shadow-inner"
                                        alt="Profile"
                                    />
                                </div>
                                {(role === 'admin' || isSystemAdmin) && (
                                    <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
                                        <ShieldCheck size={16} />
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-foreground">{user?.displayName || 'System Admin'}</h2>
                                <p className="text-sm font-bold text-muted-foreground">{user?.email || localStorage.getItem('adminEmail')}</p>
                            </div>
                            <div className={clsx(
                                "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                (role === 'admin' || isSystemAdmin) ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                            )}>
                                {isSystemAdmin ? 'System Admin' : (role || 'Standard Staff')}
                            </div>
                        </div>

                        <div className="pt-4 flex gap-4">
                            <Button variant="secondary" className="flex-1 h-12 font-bold rounded-2xl border-muted" onClick={handleLogout}>
                                <LogOut size={18} className="mr-2" />
                                Logout
                            </Button>
                            <Button className="flex-1 h-12 font-bold rounded-2xl shadow-primary/20" onClick={() => navigate('/')}>
                                Go Home
                                <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    )
}

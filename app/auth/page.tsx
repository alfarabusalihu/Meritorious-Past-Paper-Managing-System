"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ROUTES } from '@/constants/routes';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';
import { supabase } from '@/lib/supabase';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
            } else {
                const { data, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        }
                    }
                });
                if (signUpError) throw signUpError;

                if (data.user) {
                    // Create entry in profiles table
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([
                            {
                                id: data.user.id,
                                email: email,
                                name: name,
                                role: 'staff' // Default role
                            }
                        ]);

                    if (profileError) {
                        console.error('Error creating profile:', profileError);
                        // Even if profile fails, user is signed up in auth
                    }
                }

                alert('Account created successfully! You can now sign in.');
                setIsLogin(true);
                setLoading(false);
                return;
            }

            router.push(ROUTES.HOME);
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-card border rounded-3xl p-8 shadow-xl space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-secondary">
                        {isLogin ? 'Welcome Back!' : 'Join Us Today'}
                    </h1>
                    <p className="text-muted-foreground">
                        {isLogin ? 'Sign in to access and manage papers' : 'Create an account to contribute'}
                    </p>
                </div>

                <div className="flex p-1 bg-muted rounded-2xl">
                    <button
                        onClick={() => {
                            setIsLogin(true);
                            setError(null);
                        }}
                        className={cn(
                            "flex-1 py-2 rounded-xl text-sm font-bold transition-all",
                            isLogin ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => {
                            setIsLogin(false);
                            setError(null);
                        }}
                        className={cn(
                            "flex-1 py-2 rounded-xl text-sm font-bold transition-all",
                            !isLogin ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Sign Up
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-bold animate-in fade-in slide-in-from-top-1">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    required
                                    placeholder="John Doe"
                                    className="w-full h-12 pl-10 pr-4 bg-muted/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="email"
                                required
                                placeholder="mppms@example.com"
                                className="w-full h-12 pl-10 pr-4 bg-muted/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                className="w-full h-12 pl-10 pr-4 bg-muted/50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <button
                        type="button"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                        Forgot your password?
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

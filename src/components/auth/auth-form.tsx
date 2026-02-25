'use client'

import { useSupabase } from '@/components/providers/supabase-provider'
import { Button, Input } from '@/components/ui/base'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AuthFormProps {
    type: 'login' | 'register'
}

export function AuthForm({ type }: AuthFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { supabase } = useSupabase()
    const router = useRouter()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (type === 'register') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                })
                if (error) throw error
                alert('Kayıt başarılı! Lütfen e-postanızı kontrol edin.')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    return (
        <div className="w-full max-w-sm space-y-6 glass p-8 rounded-xl">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                    {type === 'login' ? 'Tekrar Hoş Geldiniz' : 'Hesap Oluşturun'}
                </h1>
                <p className="text-sm text-slate-400">
                    {type === 'login'
                        ? 'Devam etmek için giriş yapın'
                        : 'FocusFlow ile verimliliğinizi artırın'}
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
                {type === 'register' && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-slate-300">Ad Soyad</label>
                        <Input
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-slate-300">E-posta</label>
                    <Input
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-slate-300">Şifre</label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
                    {loading ? 'Yükleniyor...' : (type === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#0b0f19] px-2 text-slate-500">Veya şununla devam et</span>
                </div>
            </div>

            <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800" onClick={handleGoogleLogin}>
                Google ile Devam Et
            </Button>

            <p className="text-center text-sm text-slate-400">
                {type === 'login' ? (
                    <>
                        Hesabınız yok mu?{' '}
                        <a href="/register" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
                            Kayıt Ol
                        </a>
                    </>
                ) : (
                    <>
                        Zaten hesabınız var mı?{' '}
                        <a href="/login" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
                            Giriş Yap
                        </a>
                    </>
                )}
            </p>
        </div>
    )
}

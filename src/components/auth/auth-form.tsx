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
        try {
            setLoading(true)
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md space-y-8 bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-xl mx-4">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    {type === 'login' ? 'Tekrar Hoş Geldiniz' : 'Hesap Oluşturun'}
                </h1>
                <p className="text-sm font-medium text-slate-500">
                    {type === 'login'
                        ? 'Devam etmek için giriş yapın'
                        : 'FocusFlow ile verimliliğinizi artırın'}
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-5">
                {type === 'register' && (
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">AD SOYAD</label>
                        <Input
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="bg-slate-50 border-slate-200 focus:bg-white h-12 rounded-xl"
                            required
                        />
                    </div>
                )}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wide">E-posta</label>
                    <Input
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-slate-50 border-slate-200 focus:bg-white h-12 rounded-xl"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1 uppercase tracking-wide">Şifre</label>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-slate-50 border-slate-200 focus:bg-white h-12 rounded-xl"
                        required
                    />
                </div>

                {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 border-b-4 border-indigo-800" disabled={loading}>
                    {loading ? 'Yükleniyor...' : (type === 'login' ? 'Giriş Yap' : 'Kayıt Ol')}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                    <span className="bg-white px-4 text-slate-400 font-bold">Veya</span>
                </div>
            </div>

            <Button variant="outline" className="w-full h-12 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold shadow-sm" onClick={handleGoogleLogin} disabled={loading}>
                {loading ? 'Yükleniyor...' : 'Google ile Devam Et'}
            </Button>

            <p className="text-center text-sm font-medium text-slate-500">
                {type === 'login' ? (
                    <>
                        Hesabınız yok mu?{' '}
                        <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-4">
                            Kayıt Ol
                        </a>
                    </>
                ) : (
                    <>
                        Zaten hesabınız var mı?{' '}
                        <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-4">
                            Giriş Yap
                        </a>
                    </>
                )}
            </p>
        </div>
    )
}

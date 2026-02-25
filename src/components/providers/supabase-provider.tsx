'use client'

import { createClient } from '@/lib/supabase'
import type { SupabaseClient, User } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

type SupabaseContext = {
    supabase: SupabaseClient
    user: User | null
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
    const [supabase] = useState(() => createClient())
    const [user, setUser] = useState<User | null>(null)
    const router = useRouter()

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null)
            if (event === 'SIGNED_IN') router.refresh()
            if (event === 'SIGNED_OUT') {
                setUser(null)
                router.push('/login')
                router.refresh()
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [router, supabase])

    return (
        <Context.Provider value={{ supabase, user }}>
            {children}
        </Context.Provider>
    )
}

export const useSupabase = () => {
    const context = useContext(Context)
    if (context === undefined) {
        throw new Error('useSupabase must be used inside SupabaseProvider')
    }
    return context
}

'use client'

import { useSupabase } from '@/components/providers/supabase-provider'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export interface StickyNote {
    id: string
    user_id: string
    content: string
    color: string
    created_at: string
}

export function useStickyNotes() {
    const { supabase, user } = useSupabase()
    const queryClient = useQueryClient()

    const { data: notes, isLoading } = useQuery({
        queryKey: ['sticky_notes', user?.id],
        queryFn: async () => {
            if (!user) return []
            const { data, error } = await supabase
                .from('sticky_notes')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data as StickyNote[]
        },
        enabled: !!user,
    })

    const addNote = useMutation({
        mutationFn: async (content: string) => {
            const { data, error } = await supabase
                .from('sticky_notes')
                .insert({ content, user_id: user?.id, color: 'yellow' })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sticky_notes', user?.id] })
        },
    })

    const updateNote = useMutation({
        mutationFn: async ({ id, ...updates }: Partial<StickyNote> & { id: string }) => {
            const { data, error } = await supabase
                .from('sticky_notes')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sticky_notes', user?.id] })
        },
    })

    const deleteNote = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('sticky_notes').delete().eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sticky_notes', user?.id] })
        },
    })

    return { notes, isLoading, addNote, updateNote, deleteNote }
}

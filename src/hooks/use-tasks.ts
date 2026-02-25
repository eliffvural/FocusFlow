'use client'

import { useSupabase } from '@/components/providers/supabase-provider'
import { Database } from '@/types/database'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export type Task = Database['public']['Tables']['tasks']['Row']
export type InsertTask = Database['public']['Tables']['tasks']['Insert']
export type Category = Database['public']['Tables']['categories']['Row']
export type TaskWithCategory = Task & { categories: Category | null }

export function useTasks() {
    const { supabase, user } = useSupabase()
    const queryClient = useQueryClient()

    const { data: tasks, isLoading, error } = useQuery({
        queryKey: ['tasks', user?.id],
        queryFn: async () => {
            if (!user) return []
            const { data, error } = await supabase
                .from('tasks')
                .select('*, categories(*)')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data
        },
        enabled: !!user,
    })

    const addTask = useMutation({
        mutationFn: async (newTask: InsertTask) => {
            const { data, error } = await supabase
                .from('tasks')
                .insert({ ...newTask, user_id: user?.id })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
        },
    })

    const updateTask = useMutation({
        mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
            const { data, error } = await supabase
                .from('tasks')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
        },
    })

    const deleteTask = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('tasks').delete().eq('id', id)
            if (error) throw error
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
        },
    })

    return { tasks, isLoading, error, addTask, updateTask, deleteTask }
}

import { useSupabase } from '@/components/providers/supabase-provider'
import { Database } from '@/types/database'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export type Category = Database['public']['Tables']['categories']['Row']
type InsertCategory = Database['public']['Tables']['categories']['Insert']

export function useCategories() {
    const { supabase, user } = useSupabase()
    const queryClient = useQueryClient()

    const { data: categories, isLoading, error } = useQuery({
        queryKey: ['categories', user?.id],
        queryFn: async () => {
            if (!user) return []
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name')

            if (error) throw error
            return data
        },
        enabled: !!user,
    })

    const addCategory = useMutation({
        mutationFn: async (newCategory: InsertCategory) => {
            const { data, error } = await supabase
                .from('categories')
                .insert({ ...newCategory, user_id: user?.id })
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories', user?.id] })
        },
    })

    return { categories, isLoading, error, addCategory }
}

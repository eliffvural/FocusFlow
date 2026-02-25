export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    avatar_url: string | null
                    updated_at: string | null
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    avatar_url?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    updated_at?: string | null
                }
            }
            categories: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    color: string
                    icon: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    color: string
                    icon?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    color?: string
                    icon?: string | null
                }
            }
            tasks: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    category_id: string | null
                    start_time: string | null
                    end_time: string | null
                    status: 'todo' | 'in_progress' | 'done' | 'not_done'
                    image_url: string | null
                    is_reminder_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    category_id?: string | null
                    start_time?: string | null
                    end_time?: string | null
                    status?: 'todo' | 'in_progress' | 'done' | 'not_done'
                    image_url?: string | null
                    is_reminder_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    category_id?: string | null
                    start_time?: string | null
                    end_time?: string | null
                    status?: 'todo' | 'in_progress' | 'done' | 'not_done'
                    image_url?: string | null
                    is_reminder_active?: boolean
                    created_at?: string
                }
            }
        }
    }
}

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
          email: string
          full_name: string | null
          role: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          budget: number
          created_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          budget?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          budget?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cost_categories: {
        Row: {
          id: string
          name: string
          icon: string
          color: string
          created_at: string | null
        }
        Insert: {
          id: string
          name: string
          icon: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          color?: string
          created_at?: string
        }
      }
      cost_entries: {
        Row: {
          id: string
          project_id: string | null
          category_id: string | null
          amount: number
          description: string
          created_by: string | null
          date: string
          created_at: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          category_id?: string | null
          amount?: number
          description: string
          created_by?: string | null
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string | null
          category_id?: string | null
          amount?: number
          description?: string
          created_by?: string | null
          date?: string
          created_at?: string
        }
      }
    }
  }
}
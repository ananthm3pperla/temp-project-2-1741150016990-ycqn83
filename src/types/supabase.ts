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
          name: string | null
          email: string
          role: string | null
          department: string | null
          points: number
          badges: string[]
          attendance: Json
          preferences: Json
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email: string
          role?: string | null
          department?: string | null
          points?: number
          badges?: string[]
          attendance?: Json
          preferences?: Json
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          role?: string | null
          department?: string | null
          points?: number
          badges?: string[]
          attendance?: Json
          preferences?: Json
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      work_schedules: {
        Row: {
          id: string
          user_id: string
          date: string
          work_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          work_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          work_type?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
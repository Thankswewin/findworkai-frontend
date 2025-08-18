/**
 * Supabase Database Types
 * 
 * To generate these types:
 * 1. Install Supabase CLI: npm install -g supabase
 * 2. Login: supabase login
 * 3. Generate types: supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts
 */

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
          company: string | null
          phone: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company?: string | null
          phone?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company?: string | null
          phone?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          user_id: string
          name: string
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          country: string | null
          phone: string | null
          website: string | null
          email: string | null
          rating: number | null
          total_reviews: number | null
          business_category: string | null
          has_website: boolean | null
          opportunity_score: number | null
          lead_status: string | null
          last_contact_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          phone?: string | null
          website?: string | null
          email?: string | null
          rating?: number | null
          total_reviews?: number | null
          business_category?: string | null
          has_website?: boolean | null
          opportunity_score?: number | null
          lead_status?: string | null
          last_contact_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          phone?: string | null
          website?: string | null
          email?: string | null
          rating?: number | null
          total_reviews?: number | null
          business_category?: string | null
          has_website?: boolean | null
          opportunity_score?: number | null
          lead_status?: string | null
          last_contact_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          campaign_type: string
          service_type: string | null
          status: string
          total_recipients: number | null
          total_sent: number | null
          open_rate: number | null
          reply_rate: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          campaign_type: string
          service_type?: string | null
          status?: string
          total_recipients?: number | null
          total_sent?: number | null
          open_rate?: number | null
          reply_rate?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          campaign_type?: string
          service_type?: string | null
          status?: string
          total_recipients?: number | null
          total_sent?: number | null
          open_rate?: number | null
          reply_rate?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trainer_profiles: {
        Row: {
          bio: string | null
          career_motivation: string | null
          certifications: Json | null
          created_at: string
          email: string
          experience: string | null
          full_name: string
          government_id: string
          hourly_rate: number | null
          id: string
          phone_number: string
          profile_image_url: string | null
          specializations: string[] | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          career_motivation?: string | null
          certifications?: Json | null
          created_at?: string
          email: string
          experience?: string | null
          full_name: string
          government_id: string
          hourly_rate?: number | null
          id?: string
          phone_number: string
          profile_image_url?: string | null
          specializations?: string[] | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          career_motivation?: string | null
          certifications?: Json | null
          created_at?: string
          email?: string
          experience?: string | null
          full_name?: string
          government_id?: string
          hourly_rate?: number | null
          id?: string
          phone_number?: string
          profile_image_url?: string | null
          specializations?: string[] | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trainer_sessions: {
        Row: {
          client_name: string
          created_at: string
          earnings: number | null
          end_time: string
          feedback: string | null
          id: string
          rating: number | null
          session_date: string
          session_type: string
          start_time: string
          status: string | null
          trainer_id: string
        }
        Insert: {
          client_name: string
          created_at?: string
          earnings?: number | null
          end_time: string
          feedback?: string | null
          id?: string
          rating?: number | null
          session_date: string
          session_type: string
          start_time: string
          status?: string | null
          trainer_id: string
        }
        Update: {
          client_name?: string
          created_at?: string
          earnings?: number | null
          end_time?: string
          feedback?: string | null
          id?: string
          rating?: number | null
          session_date?: string
          session_type?: string
          start_time?: string
          status?: string | null
          trainer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trainer_sessions_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_time_slots: {
        Row: {
          created_at: string
          id: string
          time_slots: Json
          trainer_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          time_slots?: Json
          trainer_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          time_slots?: Json
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trainer_time_slots_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: true
            referencedRelation: "trainer_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          age: number | null
          avatar_url: string | null
          created_at: string
          email: string
          experience_level: string | null
          fitness_goals: string[] | null
          full_name: string
          gender: string | null
          health_conditions: string | null
          id: string
          phone_number: string | null
          preferred_workout_types: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          email: string
          experience_level?: string | null
          fitness_goals?: string[] | null
          full_name: string
          gender?: string | null
          health_conditions?: string | null
          id?: string
          phone_number?: string | null
          preferred_workout_types?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age?: number | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          experience_level?: string | null
          fitness_goals?: string[] | null
          full_name?: string
          gender?: string | null
          health_conditions?: string | null
          id?: string
          phone_number?: string | null
          preferred_workout_types?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_email: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

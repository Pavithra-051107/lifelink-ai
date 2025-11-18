export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blood_requests: {
        Row: {
          blood_type_needed: Database["public"]["Enums"]["blood_type"]
          contact_phone: string
          created_at: string | null
          expires_at: string
          id: string
          latitude: number
          location_name: string | null
          longitude: number
          notes: string | null
          recipient_id: string
          status: string | null
          units_needed: number
          updated_at: string | null
          urgency: Database["public"]["Enums"]["urgency_level"]
        }
        Insert: {
          blood_type_needed: Database["public"]["Enums"]["blood_type"]
          contact_phone: string
          created_at?: string | null
          expires_at: string
          id?: string
          latitude: number
          location_name?: string | null
          longitude: number
          notes?: string | null
          recipient_id: string
          status?: string | null
          units_needed?: number
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Update: {
          blood_type_needed?: Database["public"]["Enums"]["blood_type"]
          contact_phone?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          latitude?: number
          location_name?: string | null
          longitude?: number
          notes?: string | null
          recipient_id?: string
          status?: string | null
          units_needed?: number
          updated_at?: string | null
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Relationships: [
          {
            foreignKeyName: "blood_requests_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donation_history: {
        Row: {
          created_at: string | null
          donation_date: string
          donor_id: string
          hospital_name: string | null
          id: string
          notes: string | null
          recipient_id: string | null
          units_donated: number | null
        }
        Insert: {
          created_at?: string | null
          donation_date: string
          donor_id: string
          hospital_name?: string | null
          id?: string
          notes?: string | null
          recipient_id?: string | null
          units_donated?: number | null
        }
        Update: {
          created_at?: string | null
          donation_date?: string
          donor_id?: string
          hospital_name?: string | null
          id?: string
          notes?: string | null
          recipient_id?: string | null
          units_donated?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_history_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "donation_history_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donor_locations: {
        Row: {
          created_at: string | null
          donor_id: string
          id: string
          is_visible: boolean | null
          last_active: string | null
          latitude: number
          longitude: number
          status: Database["public"]["Enums"]["donation_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          donor_id: string
          id?: string
          is_visible?: boolean | null
          last_active?: string | null
          latitude: number
          longitude: number
          status?: Database["public"]["Enums"]["donation_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          donor_id?: string
          id?: string
          is_visible?: boolean | null
          last_active?: string | null
          latitude?: number
          longitude?: number
          status?: Database["public"]["Enums"]["donation_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donor_locations_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      donor_stats: {
        Row: {
          badges: string[] | null
          created_at: string | null
          donor_id: string
          id: string
          last_donation_date: string | null
          level: number | null
          lives_saved: number | null
          points: number | null
          streak_days: number | null
          total_donations: number | null
          updated_at: string | null
        }
        Insert: {
          badges?: string[] | null
          created_at?: string | null
          donor_id: string
          id?: string
          last_donation_date?: string | null
          level?: number | null
          lives_saved?: number | null
          points?: number | null
          streak_days?: number | null
          total_donations?: number | null
          updated_at?: string | null
        }
        Update: {
          badges?: string[] | null
          created_at?: string | null
          donor_id?: string
          id?: string
          last_donation_date?: string | null
          level?: number | null
          lives_saved?: number | null
          points?: number | null
          streak_days?: number | null
          total_donations?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donor_stats_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      health_profiles: {
        Row: {
          created_at: string | null
          current_medications: string[] | null
          donation_frequency: number | null
          eligibility_score: number | null
          has_diabetes: boolean | null
          has_hypertension: boolean | null
          has_infections: boolean | null
          height_cm: number | null
          id: string
          infection_details: string | null
          is_eligible: boolean | null
          last_donation_date: string | null
          notes: string | null
          recent_surgeries: boolean | null
          surgery_date: string | null
          updated_at: string | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          created_at?: string | null
          current_medications?: string[] | null
          donation_frequency?: number | null
          eligibility_score?: number | null
          has_diabetes?: boolean | null
          has_hypertension?: boolean | null
          has_infections?: boolean | null
          height_cm?: number | null
          id?: string
          infection_details?: string | null
          is_eligible?: boolean | null
          last_donation_date?: string | null
          notes?: string | null
          recent_surgeries?: boolean | null
          surgery_date?: string | null
          updated_at?: string | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          created_at?: string | null
          current_medications?: string[] | null
          donation_frequency?: number | null
          eligibility_score?: number | null
          has_diabetes?: boolean | null
          has_hypertension?: boolean | null
          has_infections?: boolean | null
          height_cm?: number | null
          id?: string
          infection_details?: string | null
          is_eligible?: boolean | null
          last_donation_date?: string | null
          notes?: string | null
          recent_surgeries?: boolean | null
          surgery_date?: string | null
          updated_at?: string | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "health_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          blood_type: Database["public"]["Enums"]["blood_type"]
          created_at: string | null
          date_of_birth: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          blood_type: Database["public"]["Enums"]["blood_type"]
          created_at?: string | null
          date_of_birth: string
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          blood_type?: Database["public"]["Enums"]["blood_type"]
          created_at?: string | null
          date_of_birth?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      sos_alerts: {
        Row: {
          distance_meters: number | null
          donor_id: string
          id: string
          notified_at: string | null
          request_id: string
          responded_at: string | null
          response: string | null
          status: string | null
        }
        Insert: {
          distance_meters?: number | null
          donor_id: string
          id?: string
          notified_at?: string | null
          request_id: string
          responded_at?: string | null
          response?: string | null
          status?: string | null
        }
        Update: {
          distance_meters?: number | null
          donor_id?: string
          id?: string
          notified_at?: string | null
          request_id?: string
          responded_at?: string | null
          response?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sos_alerts_donor_id_fkey"
            columns: ["donor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sos_alerts_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "blood_requests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      blood_type: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      donation_status: "available" | "unavailable" | "busy" | "emergency_mode"
      urgency_level: "low" | "medium" | "high" | "critical"
      user_role: "donor" | "recipient" | "hospital" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blood_type: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      donation_status: ["available", "unavailable", "busy", "emergency_mode"],
      urgency_level: ["low", "medium", "high", "critical"],
      user_role: ["donor", "recipient", "hospital", "admin"],
    },
  },
} as const

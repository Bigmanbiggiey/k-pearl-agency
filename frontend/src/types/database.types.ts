export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      areas: {
        Row: {
          county: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          county: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          county?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string | null
          id: string
          internal_notes: string | null
          message: string
          name: string
          phone: string
          preferred_contact_method: string
          property_id: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          message: string
          name: string
          phone: string
          preferred_contact_method: string
          property_id?: string | null
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          message?: string
          name?: string
          phone?: string
          preferred_contact_method?: string
          property_id?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inquiries_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiries_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          phone: string | null
          role: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string
          id: string
          phone?: string | null
          role?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address_line: string | null
          agent_id: string | null
          amenities: Json
          area_id: string | null
          available_from: string | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          created_by: string | null
          currency: string
          description: string
          featured: boolean
          id: string
          latitude: number | null
          listing_type: string
          longitude: number | null
          owner_email: string | null
          owner_name: string | null
          owner_phone: string | null
          price: number | null
          price_period: string | null
          property_type: string
          published_at: string | null
          reference_code: string
          size_unit: string | null
          size_value: number | null
          slug: string
          status: string
          title: string
          updated_at: string
          verified: boolean
        }
        Insert: {
          address_line?: string | null
          agent_id?: string | null
          amenities?: Json
          area_id?: string | null
          available_from?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string
          featured?: boolean
          id?: string
          latitude?: number | null
          listing_type: string
          longitude?: number | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          price?: number | null
          price_period?: string | null
          property_type: string
          published_at?: string | null
          reference_code: string
          size_unit?: string | null
          size_value?: number | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          verified?: boolean
        }
        Update: {
          address_line?: string | null
          agent_id?: string | null
          amenities?: Json
          area_id?: string | null
          available_from?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          created_by?: string | null
          currency?: string
          description?: string
          featured?: boolean
          id?: string
          latitude?: number | null
          listing_type?: string
          longitude?: number | null
          owner_email?: string | null
          owner_name?: string | null
          owner_phone?: string | null
          price?: number | null
          price_period?: string | null
          property_type?: string
          published_at?: string | null
          reference_code?: string
          size_unit?: string | null
          size_value?: number | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "properties_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_media: {
        Row: {
          alt_text: string
          created_at: string
          id: string
          is_cover: boolean
          property_id: string
          sort_order: number
          storage_path: string
        }
        Insert: {
          alt_text?: string
          created_at?: string
          id?: string
          is_cover?: boolean
          property_id: string
          sort_order?: number
          storage_path: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          id?: string
          is_cover?: boolean
          property_id?: string
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_media_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_media_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_submissions: {
        Row: {
          converted_property_id: string | null
          created_at: string
          id: string
          proposed_area_id: string | null
          proposed_bathrooms: number | null
          proposed_bedrooms: number | null
          proposed_description: string | null
          proposed_listing_type: string
          proposed_price: number | null
          proposed_property_type: string
          proposed_title: string
          reviewed_by: string | null
          status: string
          submitter_email: string | null
          submitter_name: string
          submitter_notes: string | null
          submitter_phone: string
          updated_at: string
        }
        Insert: {
          converted_property_id?: string | null
          created_at?: string
          id?: string
          proposed_area_id?: string | null
          proposed_bathrooms?: number | null
          proposed_bedrooms?: number | null
          proposed_description?: string | null
          proposed_listing_type: string
          proposed_price?: number | null
          proposed_property_type: string
          proposed_title: string
          reviewed_by?: string | null
          status?: string
          submitter_email?: string | null
          submitter_name: string
          submitter_notes?: string | null
          submitter_phone: string
          updated_at?: string
        }
        Update: {
          converted_property_id?: string | null
          created_at?: string
          id?: string
          proposed_area_id?: string | null
          proposed_bathrooms?: number | null
          proposed_bedrooms?: number | null
          proposed_description?: string | null
          proposed_listing_type?: string
          proposed_price?: number | null
          proposed_property_type?: string
          proposed_title?: string
          reviewed_by?: string | null
          status?: string
          submitter_email?: string | null
          submitter_name?: string
          submitter_notes?: string | null
          submitter_phone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_submissions_converted_property_id_fkey"
            columns: ["converted_property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_submissions_converted_property_id_fkey"
            columns: ["converted_property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_submissions_proposed_area_id_fkey"
            columns: ["proposed_area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_submissions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          by_appointment: boolean
          email: string
          hours_weekday: string
          hours_weekend: string
          id: boolean
          phone: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          by_appointment?: boolean
          email: string
          hours_weekday: string
          hours_weekend: string
          id?: boolean
          phone: string
          updated_at?: string
          whatsapp: string
        }
        Update: {
          by_appointment?: boolean
          email?: string
          hours_weekday?: string
          hours_weekend?: string
          id?: boolean
          phone?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      viewing_requests: {
        Row: {
          assigned_to: string | null
          created_at: string
          email: string | null
          id: string
          internal_notes: string | null
          message: string | null
          name: string
          phone: string
          preferred_date: string | null
          preferred_time: string | null
          property_id: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          name: string
          phone: string
          preferred_date?: string | null
          preferred_time?: string | null
          property_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          message?: string | null
          name?: string
          phone?: string
          preferred_date?: string | null
          preferred_time?: string | null
          property_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "viewing_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viewing_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "viewing_requests_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_properties: {
        Row: {
          amenities: Json | null
          area_county: string | null
          area_id: string | null
          area_name: string | null
          available_from: string | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          featured: boolean | null
          id: string | null
          listing_type: string | null
          price: number | null
          price_period: string | null
          property_type: string | null
          published_at: string | null
          reference_code: string | null
          size_unit: string | null
          size_value: number | null
          slug: string | null
          title: string | null
          verified: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_area_id_fkey"
            columns: ["area_id"]
            isOneToOne: false
            referencedRelation: "areas"
            referencedColumns: ["id"]
          },
        ]
      }
      public_property_media: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string | null
          is_cover: boolean | null
          property_id: string | null
          sort_order: number | null
          storage_path: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_media_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_media_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "public_properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const


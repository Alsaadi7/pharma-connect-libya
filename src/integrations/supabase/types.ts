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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          actor_email: string
          actor_id: string | null
          created_at: string
          entity_id: string
          entity_label: string
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          actor_email?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string
          entity_label?: string
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          actor_email?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string
          entity_label?: string
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      bookmarks: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          title?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clinical_cases: {
        Row: {
          category: string
          correct_answers: string
          course_id: string | null
          created_at: string
          diagnosis: string
          difficulty: string
          explanation: string
          gender: string
          id: string
          medical_history: string
          module_id: string | null
          patient_age: string
          prescription: string
          questions: string
          status: string
          symptoms: string
          title: string
        }
        Insert: {
          category?: string
          correct_answers?: string
          course_id?: string | null
          created_at?: string
          diagnosis?: string
          difficulty?: string
          explanation?: string
          gender?: string
          id?: string
          medical_history?: string
          module_id?: string | null
          patient_age?: string
          prescription?: string
          questions?: string
          status?: string
          symptoms?: string
          title: string
        }
        Update: {
          category?: string
          correct_answers?: string
          course_id?: string | null
          created_at?: string
          diagnosis?: string
          difficulty?: string
          explanation?: string
          gender?: string
          id?: string
          medical_history?: string
          module_id?: string | null
          patient_age?: string
          prescription?: string
          questions?: string
          status?: string
          symptoms?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "clinical_cases_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clinical_cases_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string
          cover_url: string
          created_at: string
          description: string
          duration: string
          id: string
          instructor: string
          level: string
          sort_order: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          cover_url?: string
          created_at?: string
          description?: string
          duration?: string
          id?: string
          instructor?: string
          level?: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          cover_url?: string
          created_at?: string
          description?: string
          duration?: string
          id?: string
          instructor?: string
          level?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      drugs: {
        Row: {
          brand_names: string[]
          contraindications: string
          counseling_points: string
          created_at: string
          dosage_form: string
          drug_class: string
          generic_name: string
          id: string
          indication: string
          side_effects: string
          status: string
          strength: string
        }
        Insert: {
          brand_names?: string[]
          contraindications?: string
          counseling_points?: string
          created_at?: string
          dosage_form?: string
          drug_class?: string
          generic_name: string
          id?: string
          indication?: string
          side_effects?: string
          status?: string
          strength?: string
        }
        Update: {
          brand_names?: string[]
          contraindications?: string
          counseling_points?: string
          created_at?: string
          dosage_form?: string
          drug_class?: string
          generic_name?: string
          id?: string
          indication?: string
          side_effects?: string
          status?: string
          strength?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          id: string
          progress: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          id?: string
          progress?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          id?: string
          progress?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed: boolean
          id: string
          lesson_id: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          completed?: boolean
          id?: string
          lesson_id: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          completed?: boolean
          id?: string
          lesson_id?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string
          created_at: string
          id: string
          media_url: string
          minutes: number
          module_id: string
          sort_order: number
          status: string
          title: string
          type: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          media_url?: string
          minutes?: number
          module_id: string
          sort_order?: number
          status?: string
          title: string
          type?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          media_url?: string
          minutes?: number
          module_id?: string
          sort_order?: number
          status?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: string
          created_at: string
          description: string
          id: string
          sort_order: number
          status: string
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string
          id?: string
          sort_order?: number
          status?: string
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string
          id?: string
          sort_order?: number
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          scheduled_at: string | null
          sent_by: string | null
          status: string
          target_id: string
          target_type: string
          title: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string
          scheduled_at?: string | null
          sent_by?: string | null
          status?: string
          target_id?: string
          target_type?: string
          title: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          scheduled_at?: string | null
          sent_by?: string | null
          status?: string
          target_id?: string
          target_type?: string
          title?: string
        }
        Relationships: []
      }
      pharmacies: {
        Row: {
          address: string
          area: string
          city: string
          contact_person: string
          created_at: string
          description: string
          email: string
          id: string
          name: string
          phone: string
          status: string
          updated_at: string
          working_hours: string
        }
        Insert: {
          address?: string
          area?: string
          city?: string
          contact_person?: string
          created_at?: string
          description?: string
          email?: string
          id?: string
          name: string
          phone?: string
          status?: string
          updated_at?: string
          working_hours?: string
        }
        Update: {
          address?: string
          area?: string
          city?: string
          contact_person?: string
          created_at?: string
          description?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          status?: string
          updated_at?: string
          working_hours?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          last_active_at: string
          phone: string
          status: string
          study_year: string
          university: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          full_name?: string
          id: string
          last_active_at?: string
          phone?: string
          status?: string
          study_year?: string
          university?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          last_active_at?: string
          phone?: string
          status?: string
          study_year?: string
          university?: string
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string
          correct: string
          course_id: string | null
          created_at: string
          difficulty: string
          explanation: string
          id: string
          module_id: string | null
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          status: string
        }
        Insert: {
          category?: string
          correct?: string
          course_id?: string | null
          created_at?: string
          difficulty?: string
          explanation?: string
          id?: string
          module_id?: string | null
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question: string
          status?: string
        }
        Update: {
          category?: string
          correct?: string
          course_id?: string | null
          created_at?: string
          difficulty?: string
          explanation?: string
          id?: string
          module_id?: string | null
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          created_at: string
          id: string
          score: number
          title: string
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          score?: number
          title: string
          total?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          score?: number
          title?: string
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      site_content: {
        Row: {
          body: string
          key: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          key: string
          title?: string
          updated_at?: string
        }
        Update: {
          body?: string
          key?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_applications: {
        Row: {
          created_at: string
          id: string
          status: string
          student_id: string
          training_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          student_id: string
          training_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          student_id?: string
          training_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_applications_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_applications_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "trainings"
            referencedColumns: ["id"]
          },
        ]
      }
      trainings: {
        Row: {
          created_at: string
          description: string
          end_date: string | null
          id: string
          pharmacy_id: string | null
          seats: number
          start_date: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          pharmacy_id?: string | null
          seats?: number
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string | null
          id?: string
          pharmacy_id?: string | null
          seats?: number
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trainings_pharmacy_id_fkey"
            columns: ["pharmacy_id"]
            isOneToOne: false
            referencedRelation: "pharmacies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_stats: { Args: never; Returns: Json }
      can_content: { Args: { _user_id: string }; Returns: boolean }
      can_support: { Args: { _user_id: string }; Returns: boolean }
      can_training: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "content_admin"
        | "training_admin"
        | "support_admin"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: [
        "super_admin",
        "content_admin",
        "training_admin",
        "support_admin",
      ],
    },
  },
} as const

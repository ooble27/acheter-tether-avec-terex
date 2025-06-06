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
      email_notifications: {
        Row: {
          created_at: string
          email_address: string
          email_type: string
          error_message: string | null
          id: string
          order_id: string | null
          sent_at: string | null
          status: string
          subject: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_address: string
          email_type: string
          error_message?: string | null
          id?: string
          order_id?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_address?: string
          email_type?: string
          error_message?: string | null
          id?: string
          order_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      international_transfers: {
        Row: {
          amount: number
          created_at: string
          exchange_rate: number
          fees: number
          from_currency: string
          id: string
          payment_method: string | null
          processed_at: string | null
          processed_by: string | null
          provider: string | null
          receive_method: string | null
          recipient_account: string
          recipient_bank: string | null
          recipient_country: string
          recipient_email: string | null
          recipient_name: string
          recipient_phone: string | null
          reference_number: string | null
          status: string
          to_currency: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          exchange_rate: number
          fees?: number
          from_currency?: string
          id?: string
          payment_method?: string | null
          processed_at?: string | null
          processed_by?: string | null
          provider?: string | null
          receive_method?: string | null
          recipient_account: string
          recipient_bank?: string | null
          recipient_country: string
          recipient_email?: string | null
          recipient_name: string
          recipient_phone?: string | null
          reference_number?: string | null
          status?: string
          to_currency: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          exchange_rate?: number
          fees?: number
          from_currency?: string
          id?: string
          payment_method?: string | null
          processed_at?: string | null
          processed_by?: string | null
          provider?: string | null
          receive_method?: string | null
          recipient_account?: string
          recipient_bank?: string | null
          recipient_country?: string
          recipient_email?: string | null
          recipient_name?: string
          recipient_phone?: string | null
          reference_number?: string | null
          status?: string
          to_currency?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      kyc_verifications: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          first_name: string | null
          id: string
          identity_document_back_url: string | null
          identity_document_front_url: string | null
          identity_document_number: string | null
          identity_document_type: string | null
          last_name: string | null
          nationality: string | null
          phone_number: string | null
          postal_code: string | null
          proof_of_address_url: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          selfie_url: string | null
          status: string
          submitted_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          identity_document_back_url?: string | null
          identity_document_front_url?: string | null
          identity_document_number?: string | null
          identity_document_type?: string | null
          last_name?: string | null
          nationality?: string | null
          phone_number?: string | null
          postal_code?: string | null
          proof_of_address_url?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_url?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          identity_document_back_url?: string | null
          identity_document_front_url?: string | null
          identity_document_number?: string | null
          identity_document_type?: string | null
          last_name?: string | null
          nationality?: string | null
          phone_number?: string | null
          postal_code?: string | null
          proof_of_address_url?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_url?: string | null
          status?: string
          submitted_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      merchant_accounts: {
        Row: {
          api_key: string
          business_address: string | null
          business_email: string
          business_name: string
          business_phone: string | null
          business_type: string
          commission_rate: number
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
          user_id: string
          webhook_url: string | null
        }
        Insert: {
          api_key?: string
          business_address?: string | null
          business_email: string
          business_name: string
          business_phone?: string | null
          business_type: string
          commission_rate?: number
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id: string
          webhook_url?: string | null
        }
        Update: {
          api_key?: string
          business_address?: string | null
          business_email?: string
          business_name?: string
          business_phone?: string | null
          business_type?: string
          commission_rate?: number
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          user_id?: string
          webhook_url?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string
          exchange_rate: number
          id: string
          network: string
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_reference: string | null
          payment_status: string | null
          processed_at: string | null
          processed_by: string | null
          status: Database["public"]["Enums"]["order_status"]
          type: string
          updated_at: string
          usdt_amount: number
          user_id: string
          wallet_address: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          exchange_rate: number
          id?: string
          network?: string
          notes?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_reference?: string | null
          payment_status?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          type?: string
          updated_at?: string
          usdt_amount: number
          user_id: string
          wallet_address?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          exchange_rate?: number
          id?: string
          network?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_reference?: string | null
          payment_status?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          type?: string
          updated_at?: string
          usdt_amount?: number
          user_id?: string
          wallet_address?: string | null
        }
        Relationships: []
      }
      payment_qr_codes: {
        Row: {
          created_at: string
          data: Json
          expires_at: string
          id: string
          payment_id: string
          qr_code: string
          scanned_at: string | null
        }
        Insert: {
          created_at?: string
          data: Json
          expires_at: string
          id?: string
          payment_id: string
          qr_code: string
          scanned_at?: string | null
        }
        Update: {
          created_at?: string
          data?: Json
          expires_at?: string
          id?: string
          payment_id?: string
          qr_code?: string
          scanned_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_qr_codes_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "terex_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          country: string | null
          created_at: string | null
          full_name: string | null
          id: string
          language: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          language?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      refunds: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_id: string
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          status: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payment_id: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          status?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "terex_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      terex_payments: {
        Row: {
          amount: number
          commission: number
          created_at: string
          currency: string
          customer_email: string | null
          customer_id: string | null
          customer_phone: string | null
          description: string | null
          exchange_rate: number
          expires_at: string | null
          id: string
          merchant_id: string
          metadata: Json | null
          net_amount: number
          paid_at: string | null
          payment_method: string
          qr_code_data: string | null
          reference_number: string
          status: string
          updated_at: string
          usdt_amount: number
          webhook_response: string | null
          webhook_sent: boolean
        }
        Insert: {
          amount: number
          commission: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_phone?: string | null
          description?: string | null
          exchange_rate: number
          expires_at?: string | null
          id?: string
          merchant_id: string
          metadata?: Json | null
          net_amount: number
          paid_at?: string | null
          payment_method?: string
          qr_code_data?: string | null
          reference_number: string
          status?: string
          updated_at?: string
          usdt_amount: number
          webhook_response?: string | null
          webhook_sent?: boolean
        }
        Update: {
          amount?: number
          commission?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_id?: string | null
          customer_phone?: string | null
          description?: string | null
          exchange_rate?: number
          expires_at?: string | null
          id?: string
          merchant_id?: string
          metadata?: Json | null
          net_amount?: number
          paid_at?: string | null
          payment_method?: string
          qr_code_data?: string | null
          reference_number?: string
          status?: string
          updated_at?: string
          usdt_amount?: number
          webhook_response?: string | null
          webhook_sent?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "terex_payments_merchant_id_fkey"
            columns: ["merchant_id"]
            isOneToOne: false
            referencedRelation: "merchant_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_payment_reference: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      is_kyc_verified: {
        Args: { _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      order_status:
        | "pending"
        | "processing"
        | "completed"
        | "cancelled"
        | "failed"
      payment_method: "card" | "mobile"
      user_role: "user" | "admin" | "kyc_reviewer"
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
    Enums: {
      order_status: [
        "pending",
        "processing",
        "completed",
        "cancelled",
        "failed",
      ],
      payment_method: ["card", "mobile"],
      user_role: ["user", "admin", "kyc_reviewer"],
    },
  },
} as const

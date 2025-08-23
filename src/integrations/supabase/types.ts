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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_conversations: {
        Row: {
          created_at: string
          id: string
          intent_data: Json | null
          message_content: string
          message_role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          intent_data?: Json | null
          message_content: string
          message_role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          intent_data?: Json | null
          message_content?: string
          message_role?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_comments: {
        Row: {
          author_email: string
          author_name: string
          content: string
          created_at: string
          id: string
          is_approved: boolean
          parent_id: string | null
          post_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          author_email: string
          author_name: string
          content: string
          created_at?: string
          id?: string
          is_approved?: boolean
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          author_email?: string
          author_name?: string
          content?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_tags: {
        Row: {
          id: string
          post_id: string | null
          tag_id: string | null
        }
        Insert: {
          id?: string
          post_id?: string | null
          tag_id?: string | null
        }
        Update: {
          id?: string
          post_id?: string | null
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_avatar: string | null
          author_bio: string | null
          author_name: string
          category_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean
          is_published: boolean
          likes_count: number | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          published_at: string | null
          reading_time: number | null
          slug: string
          title: string
          updated_at: string
          views_count: number | null
        }
        Insert: {
          author_avatar?: string | null
          author_bio?: string | null
          author_name?: string
          category_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          likes_count?: number | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          title: string
          updated_at?: string
          views_count?: number | null
        }
        Update: {
          author_avatar?: string | null
          author_bio?: string | null
          author_name?: string
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean
          is_published?: boolean
          likes_count?: number | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          title?: string
          updated_at?: string
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_subscriptions: {
        Row: {
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
          unsubscribed_at: string | null
          user_id: string | null
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          unsubscribed_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          status: string
          subject: string
          updated_at: string
          user_email: string
          user_id: string
          user_name: string
          user_phone: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          status?: string
          subject: string
          updated_at?: string
          user_email: string
          user_id: string
          user_name: string
          user_phone?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          updated_at?: string
          user_email?: string
          user_id?: string
          user_name?: string
          user_phone?: string | null
        }
        Relationships: []
      }
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
      favorite_recipients: {
        Row: {
          created_at: string
          id: string
          last_amount: number | null
          provider: string | null
          receive_method: string
          recipient_account: string | null
          recipient_bank: string | null
          recipient_country: string
          recipient_email: string | null
          recipient_name: string
          recipient_phone: string | null
          updated_at: string
          usage_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_amount?: number | null
          provider?: string | null
          receive_method: string
          recipient_account?: string | null
          recipient_bank?: string | null
          recipient_country: string
          recipient_email?: string | null
          recipient_name: string
          recipient_phone?: string | null
          updated_at?: string
          usage_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_amount?: number | null
          provider?: string | null
          receive_method?: string
          recipient_account?: string | null
          recipient_bank?: string | null
          recipient_country?: string
          recipient_email?: string | null
          recipient_name?: string
          recipient_phone?: string | null
          updated_at?: string
          usage_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      fraud_alerts: {
        Row: {
          alert_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          order_id: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          severity: string
          status: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity: string
          status?: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_alerts_order_id_fkey"
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
      job_applications: {
        Row: {
          admin_notes: string | null
          availability: string | null
          cover_letter: string | null
          created_at: string
          cv_url: string | null
          email: string
          experience_years: number | null
          first_name: string
          id: string
          last_name: string
          linkedin_profile: string | null
          location: string | null
          phone: string | null
          portfolio_url: string | null
          position: string
          salary_expectation: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          availability?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_url?: string | null
          email: string
          experience_years?: number | null
          first_name: string
          id?: string
          last_name: string
          linkedin_profile?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          position: string
          salary_expectation?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          availability?: string | null
          cover_letter?: string | null
          created_at?: string
          cv_url?: string | null
          email?: string
          experience_years?: number | null
          first_name?: string
          id?: string
          last_name?: string
          linkedin_profile?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          position?: string
          salary_expectation?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
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
      notification_settings: {
        Row: {
          created_at: string
          id: string
          kyc_updates: boolean | null
          marketing: boolean | null
          order_updates: boolean | null
          transfer_updates: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kyc_updates?: boolean | null
          marketing?: boolean | null
          order_updates?: boolean | null
          transfer_updates?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kyc_updates?: boolean | null
          marketing?: boolean | null
          order_updates?: boolean | null
          transfer_updates?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string
          deleted_at: string | null
          exchange_rate: number
          fees: number | null
          from_currency: string | null
          id: string
          is_deleted: boolean | null
          network: string
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_reference: string | null
          payment_status: string | null
          processed_at: string | null
          processed_by: string | null
          recipient_country: string | null
          recipient_name: string | null
          recipient_phone: string | null
          status: Database["public"]["Enums"]["order_status"]
          to_currency: string | null
          total_amount: number | null
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
          deleted_at?: string | null
          exchange_rate: number
          fees?: number | null
          from_currency?: string | null
          id?: string
          is_deleted?: boolean | null
          network?: string
          notes?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_reference?: string | null
          payment_status?: string | null
          processed_at?: string | null
          processed_by?: string | null
          recipient_country?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          to_currency?: string | null
          total_amount?: number | null
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
          deleted_at?: string | null
          exchange_rate?: number
          fees?: number | null
          from_currency?: string | null
          id?: string
          is_deleted?: boolean | null
          network?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_reference?: string | null
          payment_status?: string | null
          processed_at?: string | null
          processed_by?: string | null
          recipient_country?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          to_currency?: string | null
          total_amount?: number | null
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
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string
          user_id?: string
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
      user_2fa_settings: {
        Row: {
          backup_codes: string[] | null
          created_at: string
          enabled_at: string | null
          id: string
          is_enabled: boolean
          secret: string
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: string[] | null
          created_at?: string
          enabled_at?: string | null
          id?: string
          is_enabled?: boolean
          secret: string
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: string[] | null
          created_at?: string
          enabled_at?: string | null
          id?: string
          is_enabled?: boolean
          secret?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      user_wallets: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          is_default: boolean
          network: string | null
          updated_at: string
          user_id: string
          username: string | null
          wallet_id: string | null
          wallet_name: string
          wallet_type: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_default?: boolean
          network?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
          wallet_id?: string | null
          wallet_name: string
          wallet_type: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_default?: boolean
          network?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
          wallet_id?: string | null
          wallet_name?: string
          wallet_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      blog_comments_public: {
        Row: {
          author_name: string | null
          content: string | null
          created_at: string | null
          id: string | null
          is_approved: boolean | null
          parent_id: string | null
          post_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_name?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_approved?: boolean | null
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_name?: string | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_approved?: boolean | null
          parent_id?: string | null
          post_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      generate_payment_reference: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_comment_public_visible: {
        Args: {
          comment_row: Database["public"]["Tables"]["blog_comments"]["Row"]
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
      payment_method: "card" | "mobile" | "wave" | "orange_money" | "interac"
      user_role: "user" | "admin" | "kyc_reviewer"
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
      order_status: [
        "pending",
        "processing",
        "completed",
        "cancelled",
        "failed",
      ],
      payment_method: ["card", "mobile", "wave", "orange_money", "interac"],
      user_role: ["user", "admin", "kyc_reviewer"],
    },
  },
} as const

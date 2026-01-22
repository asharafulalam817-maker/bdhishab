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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          store_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          store_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          store_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string
          id: string
          name: string
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brands_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          parent_id: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parent_id?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parent_id?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          due_amount: number | null
          email: string | null
          id: string
          name: string
          phone: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          due_amount?: number | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          due_amount?: number | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string | null
          discount: number | null
          due_amount: number | null
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          paid_amount: number | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          sale_id: string | null
          store_id: string
          subtotal: number | null
          tax: number | null
          total: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          discount?: number | null
          due_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number: string
          notes?: string | null
          paid_amount?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          sale_id?: string | null
          store_id: string
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          discount?: number | null
          due_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          paid_amount?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          sale_id?: string | null
          store_id?: string
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          attempts: number
          created_at: string
          expires_at: string
          id: string
          otp_code: string
          phone: string
          verified: boolean
        }
        Insert: {
          attempts?: number
          created_at?: string
          expires_at?: string
          id?: string
          otp_code: string
          phone: string
          verified?: boolean
        }
        Update: {
          attempts?: number
          created_at?: string
          expires_at?: string
          id?: string
          otp_code?: string
          phone?: string
          verified?: boolean
        }
        Relationships: []
      }
      products: {
        Row: {
          barcode: string | null
          batch_tracking: boolean | null
          brand_id: string | null
          category_id: string | null
          created_at: string
          current_stock: number | null
          has_expiry: boolean | null
          id: string
          image_url: string | null
          low_stock_threshold: number | null
          name: string
          purchase_cost: number | null
          sale_price: number | null
          serial_number_required: boolean | null
          sku: string | null
          store_id: string
          unit: string | null
          updated_at: string
          warranty_duration: number | null
          warranty_start_from: string | null
          warranty_terms: string | null
          warranty_type: Database["public"]["Enums"]["warranty_type"] | null
          warranty_unit: Database["public"]["Enums"]["duration_unit"] | null
        }
        Insert: {
          barcode?: string | null
          batch_tracking?: boolean | null
          brand_id?: string | null
          category_id?: string | null
          created_at?: string
          current_stock?: number | null
          has_expiry?: boolean | null
          id?: string
          image_url?: string | null
          low_stock_threshold?: number | null
          name: string
          purchase_cost?: number | null
          sale_price?: number | null
          serial_number_required?: boolean | null
          sku?: string | null
          store_id: string
          unit?: string | null
          updated_at?: string
          warranty_duration?: number | null
          warranty_start_from?: string | null
          warranty_terms?: string | null
          warranty_type?: Database["public"]["Enums"]["warranty_type"] | null
          warranty_unit?: Database["public"]["Enums"]["duration_unit"] | null
        }
        Update: {
          barcode?: string | null
          batch_tracking?: boolean | null
          brand_id?: string | null
          category_id?: string | null
          created_at?: string
          current_stock?: number | null
          has_expiry?: boolean | null
          id?: string
          image_url?: string | null
          low_stock_threshold?: number | null
          name?: string
          purchase_cost?: number | null
          sale_price?: number | null
          serial_number_required?: boolean | null
          sku?: string | null
          store_id?: string
          unit?: string | null
          updated_at?: string
          warranty_duration?: number | null
          warranty_start_from?: string | null
          warranty_terms?: string | null
          warranty_type?: Database["public"]["Enums"]["warranty_type"] | null
          warranty_unit?: Database["public"]["Enums"]["duration_unit"] | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          phone_verified: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          phone_verified?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          phone_verified?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      purchase_items: {
        Row: {
          batch_number: string | null
          created_at: string
          expiry_date: string | null
          id: string
          product_id: string
          purchase_id: string
          quantity: number
          total: number
          unit_cost: number
        }
        Insert: {
          batch_number?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          product_id: string
          purchase_id: string
          quantity?: number
          total?: number
          unit_cost?: number
        }
        Update: {
          batch_number?: string | null
          created_at?: string
          expiry_date?: string | null
          id?: string
          product_id?: string
          purchase_id?: string
          quantity?: number
          total?: number
          unit_cost?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          created_at: string
          created_by: string | null
          discount: number | null
          due_amount: number | null
          id: string
          invoice_number: string | null
          notes: string | null
          paid_amount: number | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          purchase_date: string
          store_id: string
          subtotal: number | null
          supplier_id: string | null
          tax: number | null
          total: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          discount?: number | null
          due_amount?: number | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_amount?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          purchase_date?: string
          store_id: string
          subtotal?: number | null
          supplier_id?: string | null
          tax?: number | null
          total?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          discount?: number | null
          due_amount?: number | null
          id?: string
          invoice_number?: string | null
          notes?: string | null
          paid_amount?: number | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          purchase_date?: string
          store_id?: string
          subtotal?: number | null
          supplier_id?: string | null
          tax?: number | null
          total?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      sale_items: {
        Row: {
          batch_number: string | null
          created_at: string
          discount: number | null
          id: string
          product_id: string
          quantity: number
          sale_id: string
          serial_number: string | null
          total: number
          unit_price: number
        }
        Insert: {
          batch_number?: string | null
          created_at?: string
          discount?: number | null
          id?: string
          product_id: string
          quantity?: number
          sale_id: string
          serial_number?: string | null
          total?: number
          unit_price?: number
        }
        Update: {
          batch_number?: string | null
          created_at?: string
          discount?: number | null
          id?: string
          product_id?: string
          quantity?: number
          sale_id?: string
          serial_number?: string | null
          total?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string | null
          discount: number | null
          due_amount: number | null
          id: string
          notes: string | null
          paid_amount: number | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          sale_date: string
          store_id: string
          subtotal: number | null
          tax: number | null
          total: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          discount?: number | null
          due_amount?: number | null
          id?: string
          notes?: string | null
          paid_amount?: number | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          sale_date?: string
          store_id: string
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          discount?: number | null
          due_amount?: number | null
          id?: string
          notes?: string | null
          paid_amount?: number | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          sale_date?: string
          store_id?: string
          subtotal?: number | null
          tax?: number | null
          total?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_adjustments: {
        Row: {
          adjustment_date: string
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          reason: string
          store_id: string
        }
        Insert: {
          adjustment_date?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          reason: string
          store_id: string
        }
        Update: {
          adjustment_date?: string
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          reason?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_adjustments_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_ledger: {
        Row: {
          balance_after: number
          batch_number: string | null
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          product_id: string
          quantity: number
          reference_id: string | null
          reference_type: string | null
          serial_number: string | null
          store_id: string
          transaction_type: Database["public"]["Enums"]["stock_transaction_type"]
        }
        Insert: {
          balance_after?: number
          batch_number?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          product_id: string
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
          serial_number?: string | null
          store_id: string
          transaction_type: Database["public"]["Enums"]["stock_transaction_type"]
        }
        Update: {
          balance_after?: number
          batch_number?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          product_id?: string
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
          serial_number?: string | null
          store_id?: string
          transaction_type?: Database["public"]["Enums"]["stock_transaction_type"]
        }
        Relationships: [
          {
            foreignKeyName: "stock_ledger_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_ledger_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_memberships: {
        Row: {
          created_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
          store_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          store_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_memberships_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string | null
          created_at: string
          default_low_stock_threshold: number | null
          default_warranty_duration: number | null
          default_warranty_type:
            | Database["public"]["Enums"]["warranty_type"]
            | null
          default_warranty_unit:
            | Database["public"]["Enums"]["duration_unit"]
            | null
          email: string | null
          id: string
          invoice_footer_note: string | null
          invoice_header_note: string | null
          invoice_prefix: string | null
          logo_url: string | null
          name: string
          phone: string | null
          slug: string | null
          tax_enabled: boolean | null
          tax_rate: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          default_low_stock_threshold?: number | null
          default_warranty_duration?: number | null
          default_warranty_type?:
            | Database["public"]["Enums"]["warranty_type"]
            | null
          default_warranty_unit?:
            | Database["public"]["Enums"]["duration_unit"]
            | null
          email?: string | null
          id?: string
          invoice_footer_note?: string | null
          invoice_header_note?: string | null
          invoice_prefix?: string | null
          logo_url?: string | null
          name: string
          phone?: string | null
          slug?: string | null
          tax_enabled?: boolean | null
          tax_rate?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          default_low_stock_threshold?: number | null
          default_warranty_duration?: number | null
          default_warranty_type?:
            | Database["public"]["Enums"]["warranty_type"]
            | null
          default_warranty_unit?:
            | Database["public"]["Enums"]["duration_unit"]
            | null
          email?: string | null
          id?: string
          invoice_footer_note?: string | null
          invoice_header_note?: string | null
          invoice_prefix?: string | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          slug?: string | null
          tax_enabled?: boolean | null
          tax_rate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          created_at: string
          due_amount: number | null
          email: string | null
          id: string
          name: string
          phone: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          due_amount?: number | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          due_amount?: number | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      warranty_claims: {
        Row: {
          action_taken: string | null
          claim_date: string
          created_at: string
          created_by: string | null
          id: string
          issue_description: string
          resolution: string | null
          status: string | null
          store_id: string
          updated_at: string
          warranty_id: string
        }
        Insert: {
          action_taken?: string | null
          claim_date?: string
          created_at?: string
          created_by?: string | null
          id?: string
          issue_description: string
          resolution?: string | null
          status?: string | null
          store_id: string
          updated_at?: string
          warranty_id: string
        }
        Update: {
          action_taken?: string | null
          claim_date?: string
          created_at?: string
          created_by?: string | null
          id?: string
          issue_description?: string
          resolution?: string | null
          status?: string | null
          store_id?: string
          updated_at?: string
          warranty_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "warranty_claims_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranty_claims_warranty_id_fkey"
            columns: ["warranty_id"]
            isOneToOne: false
            referencedRelation: "warranty_records"
            referencedColumns: ["id"]
          },
        ]
      }
      warranty_records: {
        Row: {
          batch_number: string | null
          created_at: string
          customer_id: string | null
          customer_phone: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          product_id: string
          sale_date: string
          sale_id: string | null
          serial_number: string | null
          status: Database["public"]["Enums"]["warranty_status"] | null
          store_id: string
          updated_at: string
          warranty_duration: number
          warranty_expiry: string
          warranty_start: string
          warranty_type: Database["public"]["Enums"]["warranty_type"]
          warranty_unit: Database["public"]["Enums"]["duration_unit"]
        }
        Insert: {
          batch_number?: string | null
          created_at?: string
          customer_id?: string | null
          customer_phone?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          product_id: string
          sale_date: string
          sale_id?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["warranty_status"] | null
          store_id: string
          updated_at?: string
          warranty_duration: number
          warranty_expiry: string
          warranty_start: string
          warranty_type: Database["public"]["Enums"]["warranty_type"]
          warranty_unit: Database["public"]["Enums"]["duration_unit"]
        }
        Update: {
          batch_number?: string | null
          created_at?: string
          customer_id?: string | null
          customer_phone?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          product_id?: string
          sale_date?: string
          sale_id?: string | null
          serial_number?: string | null
          status?: Database["public"]["Enums"]["warranty_status"] | null
          store_id?: string
          updated_at?: string
          warranty_duration?: number
          warranty_expiry?: string
          warranty_start?: string
          warranty_type?: Database["public"]["Enums"]["warranty_type"]
          warranty_unit?: Database["public"]["Enums"]["duration_unit"]
        }
        Relationships: [
          {
            foreignKeyName: "warranty_records_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranty_records_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranty_records_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranty_records_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "warranty_records_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_otps: { Args: never; Returns: undefined }
      generate_invoice_number: { Args: { _store_id: string }; Returns: string }
      get_store_from_invoice: { Args: { _invoice_id: string }; Returns: string }
      get_store_from_purchase: {
        Args: { _purchase_id: string }
        Returns: string
      }
      get_store_from_sale: { Args: { _sale_id: string }; Returns: string }
      get_store_from_warranty: {
        Args: { _warranty_id: string }
        Returns: string
      }
      get_user_role: {
        Args: { _store_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      is_manager_or_owner: { Args: { _store_id: string }; Returns: boolean }
      is_owner: { Args: { _store_id: string }; Returns: boolean }
      is_staff_or_higher: { Args: { _store_id: string }; Returns: boolean }
      is_store_member: { Args: { _store_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "owner" | "manager" | "staff"
      duration_unit: "days" | "months" | "years"
      payment_method: "cash" | "bkash" | "nagad" | "bank" | "due" | "mixed"
      payment_status: "paid" | "partial" | "due"
      stock_transaction_type:
        | "purchase"
        | "sale"
        | "return_in"
        | "return_out"
        | "adjustment_in"
        | "adjustment_out"
        | "damage"
        | "loss"
      warranty_status: "active" | "expiring_soon" | "expired" | "claimed"
      warranty_type: "none" | "warranty" | "guarantee"
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
      app_role: ["owner", "manager", "staff"],
      duration_unit: ["days", "months", "years"],
      payment_method: ["cash", "bkash", "nagad", "bank", "due", "mixed"],
      payment_status: ["paid", "partial", "due"],
      stock_transaction_type: [
        "purchase",
        "sale",
        "return_in",
        "return_out",
        "adjustment_in",
        "adjustment_out",
        "damage",
        "loss",
      ],
      warranty_status: ["active", "expiring_soon", "expired", "claimed"],
      warranty_type: ["none", "warranty", "guarantee"],
    },
  },
} as const

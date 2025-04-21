
export interface Database {
  public: {
    Tables: {
      institutions: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          updated_at?: string;
        };
      };
      agencies: {
        Row: {
          id: string;
          name: string;
          rating: number | null;
          success_rate: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          rating?: number;
          success_rate?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          rating?: number;
          success_rate?: number;
          updated_at?: string;
        };
      };
      portfolios: {
        Row: {
          id: string;
          name: string;
          institution_id: string;
          total_debt_value: number;
          debtor_count: number;
          status: 'draft' | 'bidding' | 'assigned' | 'completed';
          created_at: string;
          due_date: string;
          assigned_agency_id: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          institution_id: string;
          total_debt_value: number;
          debtor_count: number;
          status?: 'draft' | 'bidding' | 'assigned' | 'completed';
          created_at?: string;
          due_date: string;
          assigned_agency_id?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          institution_id?: string;
          total_debt_value?: number;
          debtor_count?: number;
          status?: 'draft' | 'bidding' | 'assigned' | 'completed';
          due_date?: string;
          assigned_agency_id?: string;
          updated_at?: string;
        };
      };
      debtors: {
        Row: {
          id: string;
          name: string;
          document: string;
          debt_value: number;
          debt_date: string;
          created_at: string;
          updated_at: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          portfolio_id: string;
          status: 'pending' | 'negotiating' | 'paid' | 'written_off';
        };
        Insert: {
          id?: string;
          name: string;
          document: string;
          debt_value: number;
          debt_date: string;
          created_at?: string;
          updated_at?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          portfolio_id: string;
          status?: 'pending' | 'negotiating' | 'paid' | 'written_off';
        };
        Update: {
          id?: string;
          name?: string;
          document?: string;
          debt_value?: number;
          debt_date?: string;
          updated_at?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          portfolio_id?: string;
          status?: 'pending' | 'negotiating' | 'paid' | 'written_off';
        };
      };
    };
  };
}

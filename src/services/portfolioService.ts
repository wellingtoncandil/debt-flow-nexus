
import { supabase } from './supabaseClient';
import { CreatePortfolioData } from '@/types/portfolio';

export const portfolioService = {
  getPortfolios: async (institutionId: string) => {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('institution_id', institutionId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  createPortfolio: async (institutionId: string, data: CreatePortfolioData) => {
    const { data: newPortfolio, error } = await supabase
      .from('portfolios')
      .insert([
        {
          name: data.name,
          total_debt_value: data.totalDebtValue,
          debtor_count: data.debtorCount,
          due_date: data.dueDate,
          institution_id: institutionId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return newPortfolio;
  },

  getPortfolioStats: async (institutionId: string) => {
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('total_debt_value, status')
      .eq('institution_id', institutionId);

    if (error) throw error;

    const stats = {
      totalValue: 0,
      recoveredValue: 0,
      recoveryRate: 0,
      activePortfolios: 0,
    };

    if (portfolios) {
      stats.totalValue = portfolios.reduce((sum, p) => sum + (p.total_debt_value || 0), 0);
      stats.activePortfolios = portfolios.filter(p => p.status !== 'completed').length;
      
      // TODO: Implement recovered value calculation when payments table is ready
      stats.recoveryRate = stats.recoveredValue / stats.totalValue || 0;
    }

    return stats;
  },

  getPortfolioById: async (id: string) => {
    const { data, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },
};

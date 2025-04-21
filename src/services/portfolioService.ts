
import { DebtPortfolio, CreatePortfolioData } from '@/types/portfolio';

// Simulated API calls - replace with real API calls later
export const portfolioService = {
  getPortfolios: async (institutionId: string): Promise<DebtPortfolio[]> => {
    // Simulated API response
    return [
      {
        id: 'port-1',
        name: 'Consumer Loans Q1 2025',
        totalDebtValue: 2000000,
        debtorCount: 150,
        status: 'bidding',
        createdAt: '2025-01-01',
        dueDate: '2025-06-30',
        institutionId,
      },
      {
        id: 'port-2',
        name: 'Credit Card Debts March 2025',
        totalDebtValue: 1500000,
        debtorCount: 200,
        status: 'draft',
        createdAt: '2025-03-01',
        dueDate: '2025-09-30',
        institutionId,
      },
    ] as DebtPortfolio[];
  },

  createPortfolio: async (institutionId: string, data: CreatePortfolioData): Promise<DebtPortfolio> => {
    // Simulated API call
    return {
      id: `port-${Date.now()}`,
      ...data,
      status: 'draft',
      createdAt: new Date().toISOString(),
      institutionId,
    };
  },

  getPortfolioStats: async (institutionId: string) => {
    // Simulated API call
    return {
      totalValue: 3500000,
      recoveredValue: 1200000,
      recoveryRate: 0.34,
      activePortfolios: 2,
    };
  },
};

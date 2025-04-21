
export interface DebtPortfolio {
  id: string;
  name: string;
  totalDebtValue: number;
  debtorCount: number;
  status: 'draft' | 'bidding' | 'assigned' | 'completed';
  createdAt: string;
  dueDate: string;
  institutionId: string;
  assignedAgencyId?: string;
}

export interface PortfolioStats {
  totalValue: number;
  recoveredValue: number;
  recoveryRate: number;
  activePortfolios: number;
}

export interface CreatePortfolioData {
  name: string;
  totalDebtValue: number;
  debtorCount: number;
  dueDate: string;
}

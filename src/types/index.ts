
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'institution' | 'agency' | 'admin';
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
  type: 'institution' | 'agency';
  rating?: number;
  successRate?: number;
}

export interface DebtPortfolio {
  id: string;
  title: string;
  institutionId: string;
  institutionName: string;
  totalValue: number;
  debtCount: number;
  createdAt: string;
  status: 'draft' | 'published' | 'bidding' | 'contracted' | 'completed';
  dueDate?: string;
  description?: string;
  debtorTypes?: string[];
  guaranteeTypes?: string[];
  averageDebtAge?: number;
}

export interface Bid {
  id: string;
  portfolioId: string;
  agencyId: string;
  agencyName: string;
  fixedFee: number;
  percentageFee: number;
  totalEstimatedCost: number;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
  estimatedRecovery?: number;
  proposalDetails?: string;
}

export interface Contract {
  id: string;
  portfolioId: string;
  bidId: string;
  institutionId: string;
  agencyId: string;
  fixedFee: number;
  percentageFee: number;
  createdAt: string;
  signedAt?: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  terms?: string;
}

export interface Payment {
  id: string;
  contractId: string;
  portfolioId: string;
  amount: number;
  paymentDate: string;
  status: 'pending' | 'completed' | 'failed';
  debtId?: string;
  transactionId?: string;
}

export interface Commission {
  id: string;
  contractId: string;
  portfolioId: string;
  agencyId: string;
  paymentId: string;
  amount: number;
  percentage: number;
  status: 'pending' | 'paid';
  generatedAt: string;
  paidAt?: string;
}

export interface Rating {
  id: string;
  contractId: string;
  portfolioId: string;
  agencyId: string;
  institutionId: string;
  recoveryRate: number;
  recoverySpeed: number;
  serviceQuality: number;
  comments?: string;
  createdAt: string;
}

export interface Stats {
  totalPortfolios: number;
  activeContracts: number;
  totalDebtValue: number;
  recoveredValue: number;
  recoveryRate: number;
}

export interface MenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
}


import { 
  DebtPortfolio, 
  Bid, 
  Contract, 
  Payment, 
  Company,
  Stats
} from '@/types';

export const mockPortfolios: DebtPortfolio[] = [
  {
    id: 'port-001',
    title: 'Corporate Loans Q1 2025',
    institutionId: 'inst-001',
    institutionName: 'Banco Nacional',
    totalValue: 2000000,
    debtCount: 45,
    createdAt: '2025-01-15',
    status: 'published',
    dueDate: '2025-04-15',
    description: 'Corporate loan portfolio with businesses in the retail sector',
    debtorTypes: ['Corporate', 'SME'],
    guaranteeTypes: ['Real Estate', 'Equipment'],
    averageDebtAge: 180
  },
  {
    id: 'port-002',
    title: 'Personal Loans Package',
    institutionId: 'inst-001',
    institutionName: 'Banco Nacional',
    totalValue: 850000,
    debtCount: 230,
    createdAt: '2025-01-20',
    status: 'bidding',
    dueDate: '2025-03-30',
    description: 'Personal loans with varying credit quality',
    debtorTypes: ['Individual'],
    guaranteeTypes: ['Unsecured'],
    averageDebtAge: 120
  },
  {
    id: 'port-003',
    title: 'Credit Card Debt Bundle',
    institutionId: 'inst-001',
    institutionName: 'Banco Nacional',
    totalValue: 1200000,
    debtCount: 540,
    createdAt: '2025-02-01',
    status: 'contracted',
    dueDate: '2025-05-01',
    description: 'Bundle of credit card debts from premium cardholders',
    debtorTypes: ['Individual'],
    guaranteeTypes: ['Unsecured'],
    averageDebtAge: 90
  },
  {
    id: 'port-004',
    title: 'Auto Loan Defaults',
    institutionId: 'inst-002',
    institutionName: 'Crédito Regional',
    totalValue: 1750000,
    debtCount: 125,
    createdAt: '2025-02-10',
    status: 'draft',
    debtorTypes: ['Individual'],
    guaranteeTypes: ['Vehicle'],
    averageDebtAge: 150
  }
];

export const mockBids: Bid[] = [
  {
    id: 'bid-001',
    portfolioId: 'port-002',
    agencyId: 'agency-001',
    agencyName: 'RecoverPro',
    fixedFee: 15000,
    percentageFee: 12,
    totalEstimatedCost: 117000,
    createdAt: '2025-01-22',
    status: 'pending',
    estimatedRecovery: 850000,
    proposalDetails: 'Our team specializes in personal loans recovery with 85% success rate'
  },
  {
    id: 'bid-002',
    portfolioId: 'port-002',
    agencyId: 'agency-002',
    agencyName: 'DebtSolve',
    fixedFee: 12500,
    percentageFee: 15,
    totalEstimatedCost: 140000,
    createdAt: '2025-01-23',
    status: 'pending',
    estimatedRecovery: 850000,
    proposalDetails: 'We offer competitive rates and have a strong track record with similar portfolios'
  },
  {
    id: 'bid-003',
    portfolioId: 'port-002',
    agencyId: 'agency-003',
    agencyName: 'CollectWise',
    fixedFee: 20000,
    percentageFee: 10,
    totalEstimatedCost: 105000,
    createdAt: '2025-01-24',
    status: 'pending',
    estimatedRecovery: 850000,
    proposalDetails: 'Our AI-powered system can locate and engage with debtors efficiently'
  }
];

export const mockContracts: Contract[] = [
  {
    id: 'cont-001',
    portfolioId: 'port-003',
    bidId: 'bid-006',
    institutionId: 'inst-001',
    agencyId: 'agency-001',
    fixedFee: 25000,
    percentageFee: 8,
    createdAt: '2025-02-05',
    signedAt: '2025-02-07',
    status: 'active',
    terms: 'Standard 90-day recovery period with performance bonus at 50% recovery'
  }
];

export const mockPayments: Payment[] = [
  {
    id: 'pay-001',
    contractId: 'cont-001',
    portfolioId: 'port-003',
    amount: 5250.00,
    paymentDate: '2025-02-15',
    status: 'completed',
    debtId: 'debt-0045',
    transactionId: 'txn-9872354'
  },
  {
    id: 'pay-002',
    contractId: 'cont-001',
    portfolioId: 'port-003',
    amount: 3120.75,
    paymentDate: '2025-02-18',
    status: 'completed',
    debtId: 'debt-0062',
    transactionId: 'txn-9872412'
  },
  {
    id: 'pay-003',
    contractId: 'cont-001',
    portfolioId: 'port-003',
    amount: 8750.50,
    paymentDate: '2025-02-20',
    status: 'completed',
    debtId: 'debt-0078',
    transactionId: 'txn-9872568'
  }
];

export const mockCompanies: Company[] = [
  {
    id: 'inst-001',
    name: 'Banco Nacional',
    type: 'institution'
  },
  {
    id: 'inst-002',
    name: 'Crédito Regional',
    type: 'institution'
  },
  {
    id: 'agency-001',
    name: 'RecoverPro',
    type: 'agency',
    rating: 4.8,
    successRate: 0.75
  },
  {
    id: 'agency-002',
    name: 'DebtSolve',
    type: 'agency',
    rating: 4.5,
    successRate: 0.68
  },
  {
    id: 'agency-003',
    name: 'CollectWise',
    type: 'agency',
    rating: 4.2,
    successRate: 0.71
  }
];

export const mockInstitutionStats: Stats = {
  totalPortfolios: 4,
  activeContracts: 1,
  totalDebtValue: 5800000,
  recoveredValue: 17121.25,
  recoveryRate: 0.3
};

export const mockAgencyStats: Stats = {
  totalPortfolios: 1,
  activeContracts: 1,
  totalDebtValue: 1200000,
  recoveredValue: 17121.25,
  recoveryRate: 1.43
};

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockPortfolios, mockBids, mockContracts, mockPayments, mockInstitutionStats, mockAgencyStats } from '@/data/mockData';
import { CreditCard, FileText, DollarSign, BarChart, PieChart } from 'lucide-react';
import { DebtPortfolio, Bid, Payment } from '@/types';
import PortfolioCard from '@/components/portfolios/PortfolioCard';
import BidCard from '@/components/bidding/BidCard';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(numAmount);
  };
  
  const formatPercentage = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return `${(numValue * 100).toFixed(1)}%`;
  };

  const recentPortfolios = currentUser?.role === 'institution' 
    ? mockPortfolios.filter(p => p.institutionId === currentUser.companyId).slice(0, 3)
    : [];
  
  const recentBids = currentUser?.role === 'agency' 
    ? mockBids.filter(b => b.agencyId === currentUser.companyId).slice(0, 3)
    : [];
  
  const bidOpportunities = currentUser?.role === 'agency'
    ? mockPortfolios.filter(p => p.status === 'bidding').slice(0, 3)
    : [];
  
  const payments = mockPayments;
  
  const stats = currentUser?.role === 'institution' ? mockInstitutionStats : mockAgencyStats;

  const paymentColumns: ColumnDef<Payment>[] = [
    {
      accessorKey: "id",
      header: "Payment ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => formatCurrency(row.getValue("amount")),
    },
    {
      accessorKey: "paymentDate",
      header: "Date",
      cell: ({ row }) => new Date(row.getValue("paymentDate")).toLocaleDateString(),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={
            status === 'completed' ? "bg-fin-green-500" : 
            status === 'pending' ? "bg-amber-500" : "bg-red-500"
          }>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Painel de Controle</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Valor Total do Portfólio" 
          value={stats.totalDebtValue}
          icon={<CreditCard className="h-4 w-4" />}
          formatter={formatCurrency}
        />
        <StatCard 
          title="Valor Recuperado" 
          value={stats.recoveredValue}
          icon={<DollarSign className="h-4 w-4" />}
          formatter={formatCurrency}
        />
        <StatCard 
          title="Taxa de Recuperação" 
          value={stats.recoveryRate}
          icon={<PieChart className="h-4 w-4" />}
          formatter={formatPercentage}
          description="Do valor total da dívida"
        />
        <StatCard 
          title="Contratos Ativos" 
          value={stats.activeContracts}
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={paymentColumns} data={payments} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {currentUser?.role === 'institution' && (
            <Card>
              <CardHeader>
                <CardTitle>Portfólios Recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPortfolios.length > 0 ? (
                  recentPortfolios.map(portfolio => (
                    <div key={portfolio.id} className="mb-4">
                      <PortfolioCard portfolio={portfolio} showActions={false} />
                    </div>
                  ))
                ) : (
                  <p className="text-fin-neutral-500 text-sm">Nenhum portfólio criado ainda.</p>
                )}
              </CardContent>
            </Card>
          )}

          {currentUser?.role === 'agency' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Oportunidades de Lance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bidOpportunities.length > 0 ? (
                    bidOpportunities.map(portfolio => (
                      <div key={portfolio.id} className="mb-4">
                        <PortfolioCard portfolio={portfolio} showActions={false} />
                      </div>
                    ))
                  ) : (
                    <p className="text-fin-neutral-500 text-sm">Nenhuma oportunidade disponível.</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Lances Recentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentBids.length > 0 ? (
                    recentBids.map(bid => (
                      <div key={bid.id} className="mb-4">
                        <BidCard bid={bid} showActions={false} />
                      </div>
                    ))
                  ) : (
                    <p className="text-fin-neutral-500 text-sm">Nenhum lance feito ainda.</p>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

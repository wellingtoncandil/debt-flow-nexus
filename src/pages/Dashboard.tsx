
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

  // Only show recent portfolios created by the current institution
  const recentPortfolios = currentUser?.role === 'institution' 
    ? mockPortfolios.filter(p => p.institutionId === currentUser.companyId).slice(0, 3)
    : [];
  
  // Only show bids for agency users
  const recentBids = currentUser?.role === 'agency' 
    ? mockBids.filter(b => b.agencyId === currentUser.companyId).slice(0, 3)
    : [];
  
  // Show portfolios with bidding status for agencies
  const bidOpportunities = currentUser?.role === 'agency'
    ? mockPortfolios.filter(p => p.status === 'bidding').slice(0, 3)
    : [];
  
  // Payment data
  const payments = mockPayments;
  
  // Stats based on user role
  const stats = currentUser?.role === 'institution' ? mockInstitutionStats : mockAgencyStats;

  // Payment table columns
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
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Portfolio Value" 
          value={stats.totalDebtValue}
          icon={<CreditCard className="h-4 w-4" />}
          formatter={formatCurrency}
        />
        <StatCard 
          title="Recovered Value" 
          value={stats.recoveredValue}
          icon={<DollarSign className="h-4 w-4" />}
          formatter={formatCurrency}
        />
        <StatCard 
          title="Recovery Rate" 
          value={stats.recoveryRate}
          icon={<PieChart className="h-4 w-4" />}
          formatter={formatPercentage}
          description="Of total debt value"
        />
        <StatCard 
          title="Active Contracts" 
          value={stats.activeContracts}
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable columns={paymentColumns} data={payments} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {currentUser?.role === 'institution' && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Portfolios</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPortfolios.length > 0 ? (
                  recentPortfolios.map(portfolio => (
                    <div key={portfolio.id} className="mb-4">
                      <PortfolioCard portfolio={portfolio} showActions={false} />
                    </div>
                  ))
                ) : (
                  <p className="text-fin-neutral-500 text-sm">No portfolios created yet.</p>
                )}
              </CardContent>
            </Card>
          )}

          {currentUser?.role === 'agency' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Bidding Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bidOpportunities.length > 0 ? (
                    bidOpportunities.map(portfolio => (
                      <div key={portfolio.id} className="mb-4">
                        <PortfolioCard portfolio={portfolio} showActions={false} />
                      </div>
                    ))
                  ) : (
                    <p className="text-fin-neutral-500 text-sm">No open opportunities available.</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bids</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentBids.length > 0 ? (
                    recentBids.map(bid => (
                      <div key={bid.id} className="mb-4">
                        <BidCard bid={bid} showActions={false} />
                      </div>
                    ))
                  ) : (
                    <p className="text-fin-neutral-500 text-sm">No bids placed yet.</p>
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

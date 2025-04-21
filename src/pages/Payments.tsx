
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockPayments, mockContracts, mockPortfolios } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Payment } from '@/types';
import { Badge } from '@/components/ui/badge';
import StatCard from '@/components/dashboard/StatCard';
import { DollarSign, CreditCard, Calendar, BarChart } from 'lucide-react';

const Payments: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Get contracts for the current user
  const userContracts = currentUser?.role === 'institution'
    ? mockContracts.filter(c => c.institutionId === currentUser.companyId)
    : currentUser?.role === 'agency'
      ? mockContracts.filter(c => c.agencyId === currentUser.companyId)
      : [];
  
  // Get contract IDs
  const contractIds = userContracts.map(c => c.id);
  
  // Filter payments based on the user's contracts
  const userPayments = mockPayments.filter(p => contractIds.includes(p.contractId));
  
  // Calculate payment statistics
  const totalPayments = userPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = userPayments.filter(p => p.status === 'completed');
  const pendingPayments = userPayments.filter(p => p.status === 'pending');
  
  const totalCompleted = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPending = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Format currency
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(numAmount);
  };
  
  // Get portfolio title
  const getPortfolioTitle = (id: string) => {
    const portfolio = mockPortfolios.find(p => p.id === id);
    return portfolio ? portfolio.title : 'Unknown Portfolio';
  };
  
  // Define table columns
  const paymentColumns: ColumnDef<Payment>[] = [
    {
      accessorKey: "id",
      header: "Payment ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "portfolioId",
      header: "Portfolio",
      cell: ({ row }) => getPortfolioTitle(row.getValue("portfolioId")),
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
      <h1 className="text-3xl font-bold">Payments</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Total Payments" 
          value={totalPayments}
          icon={<DollarSign className="h-4 w-4" />}
          formatter={formatCurrency}
        />
        <StatCard 
          title="Completed" 
          value={totalCompleted}
          icon={<CreditCard className="h-4 w-4" />}
          formatter={formatCurrency}
        />
        <StatCard 
          title="Pending" 
          value={totalPending}
          icon={<Calendar className="h-4 w-4" />}
          formatter={formatCurrency}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {userPayments.length > 0 ? (
            <DataTable columns={paymentColumns} data={userPayments} />
          ) : (
            <div className="py-6 text-center">
              <p className="text-muted-foreground">No payment records found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;

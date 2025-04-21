
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePortfolios } from '@/hooks/usePortfolios';
import StatCard from '@/components/dashboard/StatCard';
import { FileText, PieChart, TrendingUp, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const Portfolios = () => {
  const navigate = useNavigate();
  const { portfolios, portfolioStats, isLoading } = usePortfolios();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Debt Portfolios</h1>
        <Button onClick={() => navigate('/portfolios/create')}>
          Create New Portfolio
        </Button>
      </div>

      {portfolioStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Portfolio Value"
            value={portfolioStats.totalValue}
            icon={<FileText className="h-4 w-4" />}
            formatter={formatCurrency}
          />
          <StatCard
            title="Recovered Value"
            value={portfolioStats.recoveredValue}
            icon={<TrendingUp className="h-4 w-4" />}
            formatter={formatCurrency}
          />
          <StatCard
            title="Recovery Rate"
            value={portfolioStats.recoveryRate}
            icon={<PieChart className="h-4 w-4" />}
            formatter={(value) => {
              // Convert the value to a number before arithmetic operation
              const numericValue = typeof value === 'number' ? value : 0;
              return `${(numericValue * 100).toFixed(1)}%`;
            }}
          />
          <StatCard
            title="Active Portfolios"
            value={portfolioStats.activePortfolios}
            icon={<Users className="h-4 w-4" />}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {portfolios.map((portfolio) => (
          <Card key={portfolio.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{portfolio.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-fin-neutral-500">Total Value:</dt>
                  <dd className="font-medium">{formatCurrency(portfolio.totalDebtValue)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-fin-neutral-500">Debtors:</dt>
                  <dd className="font-medium">{portfolio.debtorCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-fin-neutral-500">Status:</dt>
                  <dd className="font-medium capitalize">{portfolio.status}</dd>
                </div>
                <div className="pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/portfolios/${portfolio.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Portfolios;


import React from 'react';
import { DebtPortfolio } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PortfolioCardProps {
  portfolio: DebtPortfolio;
  showActions?: boolean;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ portfolio, showActions = true }) => {
  const navigate = useNavigate();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline" className="bg-fin-neutral-100">Draft</Badge>;
      case 'published':
        return <Badge className="bg-fin-blue-500">Published</Badge>;
      case 'bidding':
        return <Badge className="bg-amber-500">Bidding</Badge>;
      case 'contracted':
        return <Badge className="bg-fin-green-500">Contracted</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleView = () => {
    navigate(`/portfolios/${portfolio.id}`);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{portfolio.title}</CardTitle>
          {getStatusBadge(portfolio.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-fin-neutral-500">Total Value:</span>
            <span className="font-medium">{formatCurrency(portfolio.totalValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-fin-neutral-500">Number of Debts:</span>
            <span className="font-medium">{portfolio.debtCount}</span>
          </div>
          {portfolio.dueDate && (
            <div className="flex justify-between text-sm">
              <span className="text-fin-neutral-500">Due Date:</span>
              <span className="font-medium">
                {new Date(portfolio.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
          {portfolio.debtorTypes && (
            <div className="flex justify-between text-sm">
              <span className="text-fin-neutral-500">Debtor Types:</span>
              <span className="font-medium">{portfolio.debtorTypes.join(', ')}</span>
            </div>
          )}
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="pt-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleView}
          >
            View Details
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PortfolioCard;

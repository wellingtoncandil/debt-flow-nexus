
import React from 'react';
import { Contract } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ContractCardProps {
  contract: Contract;
  agencyName?: string;
  institutionName?: string;
  portfolioTitle?: string;
  onViewDetails?: (id: string) => void;
}

const ContractCard: React.FC<ContractCardProps> = ({ 
  contract, 
  agencyName, 
  institutionName,
  portfolioTitle,
  onViewDetails 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-fin-neutral-100">Pending</Badge>;
      case 'active':
        return <Badge className="bg-fin-green-500">Active</Badge>;
      case 'completed':
        return <Badge className="bg-fin-blue-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {portfolioTitle || `Contract #${contract.id.slice(-4)}`}
          </CardTitle>
          {getStatusBadge(contract.status)}
        </div>
        <p className="text-sm text-fin-neutral-600">
          Created on {new Date(contract.createdAt).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {agencyName && (
            <div className="flex justify-between text-sm">
              <span className="text-fin-neutral-500">Agency:</span>
              <span className="font-medium">{agencyName}</span>
            </div>
          )}
          {institutionName && (
            <div className="flex justify-between text-sm">
              <span className="text-fin-neutral-500">Institution:</span>
              <span className="font-medium">{institutionName}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-fin-neutral-500">Fixed Fee:</span>
            <span className="font-medium">{formatCurrency(contract.fixedFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-fin-neutral-500">Percentage Fee:</span>
            <span className="font-medium">{formatPercentage(contract.percentageFee)}</span>
          </div>
          {contract.signedAt && (
            <div className="flex justify-between text-sm">
              <span className="text-fin-neutral-500">Signed:</span>
              <span className="font-medium">
                {new Date(contract.signedAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => onViewDetails && onViewDetails(contract.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContractCard;

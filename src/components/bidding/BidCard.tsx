
import React from 'react';
import { Bid } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BidCardProps {
  bid: Bid;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
}

const BidCard: React.FC<BidCardProps> = ({ bid, onAccept, onReject, showActions = true }) => {
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

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{bid.agencyName}</CardTitle>
        <p className="text-sm text-fin-neutral-600">
          Submitted on {new Date(bid.createdAt).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-fin-neutral-500">Fixed Fee:</span>
            <span className="font-medium">{formatCurrency(bid.fixedFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-fin-neutral-500">Percentage Fee:</span>
            <span className="font-medium">{formatPercentage(bid.percentageFee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-fin-neutral-500">Est. Total Cost:</span>
            <span className="font-medium">{formatCurrency(bid.totalEstimatedCost)}</span>
          </div>
          {bid.proposalDetails && (
            <div className="mt-3 pt-3 border-t border-fin-neutral-200">
              <p className="text-xs text-fin-neutral-500 mb-1">Proposal Details:</p>
              <p className="text-sm">{bid.proposalDetails}</p>
            </div>
          )}
        </div>
      </CardContent>
      {showActions && (
        <CardFooter className="flex gap-2 pt-2">
          <Button
            variant="default"
            className="w-full bg-fin-green-500 hover:bg-fin-green-600"
            onClick={() => onAccept && onAccept(bid.id)}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onReject && onReject(bid.id)}
          >
            Decline
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default BidCard;

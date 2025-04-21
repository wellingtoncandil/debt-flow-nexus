
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockPortfolios, mockBids } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Users, FileText } from 'lucide-react';
import { DebtPortfolio } from '@/types';
import BidCard from '@/components/bidding/BidCard';
import { useToast } from '@/hooks/use-toast';

const PortfolioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Find the portfolio by ID
  const portfolio = mockPortfolios.find(p => p.id === id) as DebtPortfolio;
  
  // If portfolio not found, show an error
  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-2">Portfolio Not Found</h2>
        <p className="text-muted-foreground mb-6">The portfolio you're looking for doesn't exist or you don't have access.</p>
        <Button onClick={() => navigate('/portfolios')}>
          Back to Portfolios
        </Button>
      </div>
    );
  }
  
  // Get bids for this portfolio
  const portfolioBids = mockBids.filter(bid => bid.portfolioId === portfolio.id);
  
  // Format currency values
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Handle bid acceptance
  const handleAcceptBid = (bidId: string) => {
    toast({
      title: "Bid Accepted",
      description: `Contract is being generated for bid #${bidId}.`,
    });
  };
  
  // Handle bid rejection
  const handleRejectBid = (bidId: string) => {
    toast({
      title: "Bid Rejected",
      description: `Bid #${bidId} has been rejected.`,
    });
  };
  
  // Get status badge
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate('/portfolios')}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{portfolio.title}</h1>
        {getStatusBadge(portfolio.status)}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Portfolio details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-lg font-semibold">{formatCurrency(portfolio.totalValue)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Number of Debts</p>
                  <p className="text-lg font-semibold">{portfolio.debtCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-base">
                    {new Date(portfolio.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="text-base">
                    {portfolio.dueDate ? new Date(portfolio.dueDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">
                  {portfolio.description || 'No description provided'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Debtor Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.debtorTypes?.map(type => (
                      <Badge key={type} variant="outline" className="bg-fin-neutral-100">
                        <Users className="h-3 w-3 mr-1" /> {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Guarantee Types</h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.guaranteeTypes?.map(type => (
                      <Badge key={type} variant="outline" className="bg-fin-neutral-100">
                        <FileText className="h-3 w-3 mr-1" /> {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                {portfolio.averageDebtAge && (
                  <div>
                    <h3 className="font-medium mb-2">Average Debt Age</h3>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{portfolio.averageDebtAge} days</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - Actions and status */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {portfolio.status === 'draft' && (
                <>
                  <Button className="w-full">Publish Portfolio</Button>
                  <Button variant="outline" className="w-full">Edit Portfolio</Button>
                </>
              )}
              
              {portfolio.status === 'published' && (
                <>
                  <Button variant="outline" className="w-full">View Bids (0)</Button>
                  <Button variant="outline" className="w-full">Edit Portfolio</Button>
                </>
              )}
              
              {portfolio.status === 'bidding' && (
                <Button className="w-full">Review {portfolioBids.length} Bids</Button>
              )}
              
              {portfolio.status === 'contracted' && (
                <>
                  <Button className="w-full">View Contract</Button>
                  <Button variant="outline" className="w-full">Track Payments</Button>
                </>
              )}
              
              <Separator />
              
              <div className="text-sm">
                <p className="text-muted-foreground mb-1">Portfolio Status:</p>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(portfolio.status)}
                  <span className="capitalize">{portfolio.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Show additional cards based on status */}
          {portfolio.status === 'bidding' && portfolioBids.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Latest Bids</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  You have {portfolioBids.length} bids on this portfolio
                </p>
                {portfolioBids.slice(0, 1).map(bid => (
                  <BidCard 
                    key={bid.id} 
                    bid={bid} 
                    onAccept={handleAcceptBid}
                    onReject={handleRejectBid}
                  />
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {portfolio.status === 'bidding' && portfolioBids.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>All Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioBids.map(bid => (
                <BidCard 
                  key={bid.id} 
                  bid={bid} 
                  onAccept={handleAcceptBid}
                  onReject={handleRejectBid}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Show debt details tab only for published and contracted portfolios */}
      {(portfolio.status !== 'draft') && (
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="debts">Debt Details</TabsTrigger>
            {portfolio.status === 'contracted' && (
              <TabsTrigger value="payments">Payments</TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardContent className="pt-6">
                <p>Portfolio overview and analytics will be shown here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="debts">
            <Card>
              <CardContent className="pt-6">
                <p>Detailed list of debts in this portfolio will be shown here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          {portfolio.status === 'contracted' && (
            <TabsContent value="payments">
              <Card>
                <CardContent className="pt-6">
                  <p>Payment history and reconciliation data will be shown here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
};

export default PortfolioDetail;

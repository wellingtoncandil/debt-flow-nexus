
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockPortfolios, mockBids } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import PortfolioCard from '@/components/portfolios/PortfolioCard';
import { FileText } from 'lucide-react';

const Opportunities: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Filter portfolios that are in bidding status
  const availableOpportunities = mockPortfolios.filter(p => p.status === 'bidding' || p.status === 'published');
  
  // Get bids made by this agency
  const agencyBids = currentUser 
    ? mockBids.filter(b => b.agencyId === currentUser.companyId)
    : [];
  
  // Get portfolios the agency has bid on
  const biddedPortfolioIds = agencyBids.map(bid => bid.portfolioId);
  const biddedOpportunities = mockPortfolios.filter(p => biddedPortfolioIds.includes(p.id));
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bidding Opportunities</h1>
      
      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Available Opportunities</TabsTrigger>
          <TabsTrigger value="my-bids">My Bids</TabsTrigger>
        </TabsList>
        
        <TabsContent value="available">
          {availableOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableOpportunities.map(portfolio => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No opportunities available</h3>
                <p className="text-muted-foreground text-center">
                  There are currently no debt portfolios available for bidding.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="my-bids">
          {biddedOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {biddedOpportunities.map(portfolio => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No bids placed yet</h3>
                <p className="text-muted-foreground text-center">
                  You haven't placed any bids on portfolios yet.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Opportunities;

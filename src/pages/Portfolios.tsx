
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { mockPortfolios } from '@/data/mockData';
import PortfolioCard from '@/components/portfolios/PortfolioCard';
import { PlusCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Portfolios: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Filter portfolios based on current user's institution
  const userPortfolios = mockPortfolios.filter(p => p.institutionId === currentUser?.companyId);

  // Group portfolios by status
  const draftPortfolios = userPortfolios.filter(p => p.status === 'draft');
  const publishedPortfolios = userPortfolios.filter(p => p.status === 'published' || p.status === 'bidding');
  const contractedPortfolios = userPortfolios.filter(p => p.status === 'contracted' || p.status === 'completed');

  const handleCreatePortfolio = () => {
    // In a real app, navigate to portfolio creation page
    console.log('Create portfolio clicked');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Debt Portfolios</h1>
        <Button onClick={handleCreatePortfolio}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Portfolio
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Portfolios</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="contracted">Contracted</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {userPortfolios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPortfolios.map(portfolio => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No portfolios yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first debt portfolio to get started.
                </p>
                <Button onClick={handleCreatePortfolio}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Create Portfolio
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="draft">
          {draftPortfolios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftPortfolios.map(portfolio => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No draft portfolios available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="published">
          {publishedPortfolios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedPortfolios.map(portfolio => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No published portfolios available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contracted">
          {contractedPortfolios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contractedPortfolios.map(portfolio => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No contracted portfolios available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Portfolios;

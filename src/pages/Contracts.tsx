
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockContracts, mockCompanies, mockPortfolios } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import ContractCard from '@/components/contracts/ContractCard';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Contracts: React.FC = () => {
  const { currentUser } = useAuth();

  // Filter contracts based on user role
  const userContracts = currentUser?.role === 'institution'
    ? mockContracts.filter(c => c.institutionId === currentUser.companyId)
    : currentUser?.role === 'agency'
      ? mockContracts.filter(c => c.agencyId === currentUser.companyId)
      : [];

  // Group contracts by status
  const activeContracts = userContracts.filter(c => c.status === 'active');
  const pendingContracts = userContracts.filter(c => c.status === 'pending');
  const completedContracts = userContracts.filter(c => c.status === 'completed' || c.status === 'cancelled');

  // Get associated company names
  const getCompanyName = (id: string) => {
    const company = mockCompanies.find(c => c.id === id);
    return company ? company.name : 'Unknown Company';
  };

  // Get portfolio title
  const getPortfolioTitle = (id: string) => {
    const portfolio = mockPortfolios.find(p => p.id === id);
    return portfolio ? portfolio.title : 'Unknown Portfolio';
  };

  // Handle view contract details
  const handleViewContract = (id: string) => {
    console.log(`View contract: ${id}`);
    // In a real app, navigate to contract detail page
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contracts</h1>
      
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Contracts</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {userContracts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userContracts.map(contract => (
                <ContractCard 
                  key={contract.id} 
                  contract={contract}
                  agencyName={currentUser?.role === 'institution' ? getCompanyName(contract.agencyId) : undefined}
                  institutionName={currentUser?.role === 'agency' ? getCompanyName(contract.institutionId) : undefined}
                  portfolioTitle={getPortfolioTitle(contract.portfolioId)}
                  onViewDetails={handleViewContract}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No contracts yet</h3>
                <p className="text-muted-foreground text-center">
                  {currentUser?.role === 'institution'
                    ? "You haven't contracted any debt collection agencies yet."
                    : "You don't have any collection contracts yet."}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active">
          {activeContracts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeContracts.map(contract => (
                <ContractCard 
                  key={contract.id} 
                  contract={contract}
                  agencyName={currentUser?.role === 'institution' ? getCompanyName(contract.agencyId) : undefined}
                  institutionName={currentUser?.role === 'agency' ? getCompanyName(contract.institutionId) : undefined}
                  portfolioTitle={getPortfolioTitle(contract.portfolioId)}
                  onViewDetails={handleViewContract}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No active contracts available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending">
          {pendingContracts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingContracts.map(contract => (
                <ContractCard 
                  key={contract.id} 
                  contract={contract}
                  agencyName={currentUser?.role === 'institution' ? getCompanyName(contract.agencyId) : undefined}
                  institutionName={currentUser?.role === 'agency' ? getCompanyName(contract.institutionId) : undefined}
                  portfolioTitle={getPortfolioTitle(contract.portfolioId)}
                  onViewDetails={handleViewContract}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No pending contracts available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed">
          {completedContracts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedContracts.map(contract => (
                <ContractCard 
                  key={contract.id} 
                  contract={contract}
                  agencyName={currentUser?.role === 'institution' ? getCompanyName(contract.agencyId) : undefined}
                  institutionName={currentUser?.role === 'agency' ? getCompanyName(contract.institutionId) : undefined}
                  portfolioTitle={getPortfolioTitle(contract.portfolioId)}
                  onViewDetails={handleViewContract}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No completed contracts available.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Contracts;

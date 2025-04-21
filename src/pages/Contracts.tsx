import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockContracts, mockCompanies, mockPortfolios } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import ContractCard from '@/components/contracts/ContractCard';
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Contracts: React.FC = () => {
  const { currentUser } = useAuth();

  const userContracts = currentUser?.role === 'institution'
    ? mockContracts.filter(c => c.institutionId === currentUser.companyId)
    : currentUser?.role === 'agency'
      ? mockContracts.filter(c => c.agencyId === currentUser.companyId)
      : [];

  const activeContracts = userContracts.filter(c => c.status === 'active');
  const pendingContracts = userContracts.filter(c => c.status === 'pending');
  const completedContracts = userContracts.filter(c => c.status === 'completed' || c.status === 'cancelled');

  const getCompanyName = (id: string) => {
    const company = mockCompanies.find(c => c.id === id);
    return company ? company.name : 'Unknown Company';
  };

  const getPortfolioTitle = (id: string) => {
    const portfolio = mockPortfolios.find(p => p.id === id);
    return portfolio ? portfolio.title : 'Unknown Portfolio';
  };

  const handleViewContract = (id: string) => {
    console.log(`View contract: ${id}`);
    // In a real app, navigate to contract detail page
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Contratos</h1>
      
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos os Contratos</TabsTrigger>
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="pending">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Concluídos</TabsTrigger>
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
                <h3 className="text-lg font-medium mb-2">Nenhum contrato ainda</h3>
                <p className="text-muted-foreground text-center">
                  {currentUser?.role === 'institution'
                    ? "Você ainda não contratou nenhuma agência de cobrança."
                    : "Você não tem nenhum contrato de cobrança ainda."}
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
                <p className="text-muted-foreground">Nenhum contrato ativo disponível.</p>
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
                <p className="text-muted-foreground">Nenhum contrato pendente disponível.</p>
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
                <p className="text-muted-foreground">Nenhum contrato concluído disponível.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Contracts;


import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { FileText, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface PortfolioOpportunity {
  id: string;
  name: string;
  institution_name: string;
  total_debt_value: number;
  debtor_count: number;
  created_at: string;
  due_date: string;
  status: 'bidding';
  description: string | null;
  average_debt: number | null;
  debt_age: number | null;
  industry_type: string | null;
}

// This would be replaced with an actual API call to Supabase
const fetchOpportunities = async () => {
  // Simulated data
  return [
    {
      id: '1',
      name: 'Credit Card Portfolio Q1',
      institution_name: 'FinBank',
      total_debt_value: 2500000,
      debtor_count: 750,
      created_at: '2025-01-15T12:30:00Z',
      due_date: '2025-03-30T23:59:59Z',
      status: 'bidding',
      description: 'Credit card debt from retail customers',
      average_debt: 3333.33,
      debt_age: 180,
      industry_type: 'Retail'
    },
    {
      id: '2',
      name: 'Personal Loans Q2',
      institution_name: 'Credit Union Plus',
      total_debt_value: 1800000,
      debtor_count: 320,
      created_at: '2025-02-01T08:15:00Z',
      due_date: '2025-04-15T23:59:59Z',
      status: 'bidding',
      description: 'Personal loans from various branches',
      average_debt: 5625,
      debt_age: 120,
      industry_type: 'Financial'
    },
    {
      id: '3',
      name: 'Business Loans 2025',
      institution_name: 'Commerce Bank',
      total_debt_value: 5200000,
      debtor_count: 85,
      created_at: '2025-02-10T14:45:00Z',
      due_date: '2025-05-01T23:59:59Z',
      status: 'bidding',
      description: 'Small business loans and lines of credit',
      average_debt: 61176.47,
      debt_age: 90,
      industry_type: 'Commercial'
    }
  ] as PortfolioOpportunity[];
};

const Opportunities: React.FC = () => {
  const { currentUser } = useAuth();
  
  const { 
    data: opportunities, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['opportunities'],
    queryFn: fetchOpportunities
  });
  
  if (currentUser?.role !== 'agency') {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This page is only available for collection agencies.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Debt Collection Opportunities</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Portfolios</CardTitle>
          <CardDescription>
            Browse available debt portfolios open for bids from collection agencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading opportunities...</div>
          ) : error ? (
            <div className="bg-destructive/10 p-4 rounded-md text-center">
              Failed to load opportunities. Please try again later.
            </div>
          ) : opportunities && opportunities.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Portfolio</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead className="text-right">Total Value</TableHead>
                  <TableHead className="text-right">Debtors</TableHead>
                  <TableHead className="text-right">Average Debt</TableHead>
                  <TableHead className="text-right">Due Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.map((opportunity) => (
                  <TableRow key={opportunity.id}>
                    <TableCell className="font-medium">
                      <div className="font-medium">{opportunity.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {opportunity.description || 'No description'}
                      </div>
                    </TableCell>
                    <TableCell>{opportunity.institution_name}</TableCell>
                    <TableCell className="text-right">
                      R$ {(opportunity.total_debt_value / 1000).toFixed(0)}k
                    </TableCell>
                    <TableCell className="text-right">{opportunity.debtor_count}</TableCell>
                    <TableCell className="text-right">
                      R$ {opportunity.average_debt?.toFixed(2) || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {format(new Date(opportunity.due_date), 'P')}
                    </TableCell>
                    <TableCell>
                      <Button size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 flex flex-col items-center gap-4">
              <FileText className="h-12 w-12 text-muted-foreground/50" />
              <div>
                <p className="font-medium mb-1">No opportunities available</p>
                <p className="text-sm text-muted-foreground">
                  Check back later for new debt portfolios to bid on
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Insights</CardTitle>
          <CardDescription>Additional information about debt portfolios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Types of Debt</h3>
              <div className="space-y-2 text-sm">
                {['Credit Card', 'Personal Loans', 'Auto Loans', 'Mortgages', 'Business Loans'].map((type) => (
                  <div key={type} className="flex justify-between">
                    <span>{type}</span>
                    <Badge variant="outline">Available</Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Bidding Guidelines</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Review portfolio details carefully before submitting a bid</li>
                <li>Bids must include both fixed fee and percentage components</li>
                <li>Include recovery strategy summary with your proposal</li>
                <li>Bids are binding once submitted and accepted</li>
                <li>Institutions will evaluate bids based on terms and agency ratings</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Opportunities;

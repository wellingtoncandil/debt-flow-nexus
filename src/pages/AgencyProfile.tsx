
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Star, 
  Users, 
  Calendar, 
  Globe, 
  Briefcase,
  CheckCircle,
  BarChart
} from 'lucide-react';
import { format } from 'date-fns';

interface AgencyRating {
  id: string;
  institution_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface AgencyPortfolio {
  id: string;
  name: string;
  total_value: number;
  debtor_count: number;
  completed_at: string;
  recovery_rate: number;
}

// A service to fetch agency data would be implemented
// This is a placeholder for demonstration
const fetchAgencyProfile = async (id: string) => {
  // In a real implementation, this would fetch from Supabase
  return {
    id,
    name: 'Credence Recovery Solutions',
    description: 'Specialized in retail and financial debt recovery with over 10 years of experience.',
    rating: 4.7,
    success_rate: 0.72,
    founded_year: 2012,
    employee_count: 120,
    website: 'https://credencerecovery.com',
    specialties: ['Credit Card Debt', 'Personal Loans', 'Retail Debt'],
    logo_url: null
  };
};

const fetchAgencyRatings = async (id: string) => {
  // Placeholder for actual data fetch
  return [
    {
      id: '1',
      institution_name: 'FinBank',
      rating: 4.8,
      comment: 'Excellent communication and recovery rate.',
      created_at: '2024-12-10T15:30:00Z'
    },
    {
      id: '2',
      institution_name: 'Credit Union Plus',
      rating: 4.5,
      comment: 'Very professional team, good results.',
      created_at: '2024-11-22T09:45:00Z'
    }
  ];
};

const fetchAgencyPortfolios = async (id: string) => {
  // Placeholder for actual data fetch
  return [
    {
      id: '1',
      name: 'Credit Card Portfolio Q1 2025',
      total_value: 1250000,
      debtor_count: 350,
      completed_at: '2025-03-15T00:00:00Z',
      recovery_rate: 0.68
    },
    {
      id: '2',
      name: 'Personal Loans Q4 2024',
      total_value: 980000,
      debtor_count: 215,
      completed_at: '2024-12-20T00:00:00Z',
      recovery_rate: 0.72
    }
  ];
};

const AgencyProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  const { 
    data: agency, 
    isLoading: agencyLoading, 
    error: agencyError 
  } = useQuery({
    queryKey: ['agency', id],
    queryFn: () => fetchAgencyProfile(id!),
    enabled: !!id
  });

  const { 
    data: ratings, 
    isLoading: ratingsLoading 
  } = useQuery({
    queryKey: ['agencyRatings', id],
    queryFn: () => fetchAgencyRatings(id!),
    enabled: !!id
  });

  const { 
    data: portfolios, 
    isLoading: portfoliosLoading 
  } = useQuery({
    queryKey: ['agencyPortfolios', id],
    queryFn: () => fetchAgencyPortfolios(id!),
    enabled: !!id
  });

  if (agencyLoading) return <div className="flex items-center justify-center p-12">Loading...</div>;
  
  if (agencyError || !agency) {
    return (
      <div className="text-center p-12">
        <h2 className="text-2xl font-bold mb-4">Agency not found</h2>
        <p>The agency profile you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button className="mt-6" variant="outline" onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  // Format initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Render star rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-amber-500 text-amber-500" />
        ))}
        {halfStar && <Star className="h-4 w-4 fill-amber-500 text-amber-500" />}
        {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />
        ))}
        <span className="ml-2 text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Agency Profile</h1>
        <Button>Contact Agency</Button>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar className="h-16 w-16">
            {agency.logo_url ? (
              <AvatarImage src={agency.logo_url} alt={agency.name} />
            ) : (
              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                {getInitials(agency.name)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{agency.name}</CardTitle>
            <div className="flex items-center mt-1">
              {renderStars(agency.rating || 0)}
              <Badge className="ml-4" variant="outline">
                {(agency.success_rate * 100).toFixed(1)}% Success Rate
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{agency.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Founded: {agency.founded_year}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Employees: {agency.employee_count}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>Website: <a href={agency.website || '#'} className="text-primary hover:underline">{agency.website}</a></span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span>Specialties: {agency.specialties?.join(', ')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="performance">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators for this agency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background border rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-muted-foreground mb-1">Average Recovery Rate</div>
                  <div className="text-2xl font-bold">{(agency.success_rate * 100).toFixed(1)}%</div>
                  <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" /> Above industry average
                  </div>
                </div>
                
                <div className="bg-background border rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-muted-foreground mb-1">Portfolios Completed</div>
                  <div className="text-2xl font-bold">{portfolios?.length || 0}</div>
                  <div className="mt-2 text-xs text-muted-foreground">Last 12 months</div>
                </div>
                
                <div className="bg-background border rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-muted-foreground mb-1">Total Value Recovered</div>
                  <div className="text-2xl font-bold">R$ 2.3M</div>
                  <div className="mt-2 text-xs text-muted-foreground">From all portfolios</div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Recovery Rate by Debt Type</h4>
                <div className="h-64 bg-secondary/20 flex items-center justify-center rounded-lg">
                  <div className="text-muted-foreground text-sm flex items-center gap-2">
                    <BarChart className="h-4 w-4" /> Performance chart would render here
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews from Institutions</CardTitle>
              <CardDescription>Feedback from previous collaborations</CardDescription>
            </CardHeader>
            <CardContent>
              {ratingsLoading ? (
                <div className="text-center p-4">Loading reviews...</div>
              ) : ratings && ratings.length > 0 ? (
                <div className="space-y-6">
                  {ratings.map((rating: AgencyRating) => (
                    <div key={rating.id} className="border-b pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{rating.institution_name}</h4>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(rating.created_at), 'PP')}
                        </span>
                      </div>
                      <div className="mb-2">
                        {renderStars(rating.rating)}
                      </div>
                      <p className="text-sm text-muted-foreground">{rating.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No reviews available for this agency yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio History</CardTitle>
              <CardDescription>Portfolios previously handled by this agency</CardDescription>
            </CardHeader>
            <CardContent>
              {portfoliosLoading ? (
                <div className="text-center p-4">Loading history...</div>
              ) : portfolios && portfolios.length > 0 ? (
                <div className="space-y-4">
                  {portfolios.map((portfolio: AgencyPortfolio) => (
                    <div key={portfolio.id} className="border rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{portfolio.name}</h4>
                        <Badge variant={portfolio.recovery_rate > 0.7 ? "default" : "outline"}>
                          {(portfolio.recovery_rate * 100).toFixed(1)}% Recovered
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                        <div>Total Value: R$ {(portfolio.total_value / 1000).toFixed(0)}k</div>
                        <div>Debtors: {portfolio.debtor_count}</div>
                        <div>Completed: {format(new Date(portfolio.completed_at), 'PP')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No portfolio history available.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgencyProfile;


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioService } from '@/services/portfolioService';
import { useAuth } from '@/context/AuthContext';
import { CreatePortfolioData } from '@/types/portfolio';
import { useToast } from '@/hooks/use-toast';

export const usePortfolios = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const portfoliosQuery = useQuery({
    queryKey: ['portfolios', currentUser?.companyId],
    queryFn: () => portfolioService.getPortfolios(currentUser?.companyId || ''),
    enabled: !!currentUser?.companyId,
  });

  const statsQuery = useQuery({
    queryKey: ['portfolio-stats', currentUser?.companyId],
    queryFn: () => portfolioService.getPortfolioStats(currentUser?.companyId || ''),
    enabled: !!currentUser?.companyId,
  });

  const createPortfolioMutation = useMutation({
    mutationFn: (data: CreatePortfolioData) => 
      portfolioService.createPortfolio(currentUser?.companyId || '', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio-stats'] });
      toast({
        title: "Success",
        description: "Portfolio created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create portfolio",
        variant: "destructive",
      });
    },
  });

  return {
    portfolios: portfoliosQuery.data || [],
    portfolioStats: statsQuery.data,
    isLoading: portfoliosQuery.isLoading || statsQuery.isLoading,
    isError: portfoliosQuery.isError || statsQuery.isError,
    createPortfolio: createPortfolioMutation.mutate,
  };
};

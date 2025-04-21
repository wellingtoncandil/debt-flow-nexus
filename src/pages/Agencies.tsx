import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCompanies } from '@/data/mockData';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Company } from '@/types';
import { Users, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Agencies: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  if (currentUser?.role !== 'institution') {
    return (
      <Alert variant="destructive">
        <AlertTitle>Acesso Negado</AlertTitle>
        <AlertDescription>
          Esta página é exclusiva para instituições financeiras.
        </AlertDescription>
      </Alert>
    );
  }
  
  const agencies = mockCompanies.filter(c => c.type === 'agency');
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };
  
  const renderStars = (rating: number | undefined) => {
    if (rating === undefined) return 'Not rated';
    
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-amber-500 text-amber-500" />
        ))}
        {halfStar && <Star className="h-4 w-4 fill-amber-500 text-amber-500" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-fin-neutral-300" />
        ))}
        <span className="ml-2 text-fin-neutral-600">{rating.toFixed(1)}</span>
      </div>
    );
  };
  
  const columns: ColumnDef<Company>[] = [
    {
      accessorKey: "name",
      header: "Nome da Agência",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-fin-blue-200 text-fin-blue-700">
              {getInitials(row.getValue("name"))}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Avaliação",
      cell: ({ row }) => renderStars(row.getValue("rating")),
    },
    {
      accessorKey: "successRate",
      header: "Taxa de Sucesso",
      cell: ({ row }) => formatPercentage(row.getValue("successRate")),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/agencies/${row.original.id}`)}
        >
          Ver Perfil
        </Button>
      ),
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Agências de Cobrança</h1>
        <Button>
          <Users className="mr-2 h-4 w-4" /> Convidar Nova Agência
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Todas as Agências</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={agencies} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Agencies;

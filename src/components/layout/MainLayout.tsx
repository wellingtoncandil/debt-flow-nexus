import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { BarChart, FileText, Users, Settings, PieChart, DollarSign, CreditCard, Link, Star } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const MainLayout: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const userInitials = currentUser ? getInitials(currentUser.name) : 'U';

  const institutionNav = [
    { title: 'Painel', href: '/dashboard', icon: PieChart },
    { title: 'Upload de Devedores', href: '/upload-debtors', icon: FileText },
    { title: 'Portfólios', href: '/portfolios', icon: FileText },
    { title: 'Agências', href: '/agencies', icon: Users },
    { title: 'Contratos', href: '/contracts', icon: Link },
    { title: 'Pagamentos', href: '/payments', icon: DollarSign },
    { title: 'Configurações', href: '/settings', icon: Settings },
  ];

  const agencyNav = [
    { title: 'Painel', href: '/dashboard', icon: BarChart },
    { title: 'Oportunidades', href: '/opportunities', icon: FileText },
    { title: 'Contratos', href: '/contracts', icon: Link },
    { title: 'Pagamentos', href: '/payments', icon: CreditCard },
    { title: 'Configurações', href: '/settings', icon: Settings },
  ];

  const adminNav = [
    { title: 'Painel', href: '/dashboard', icon: PieChart },
    { title: 'Instituições', href: '/institutions', icon: Users },
    { title: 'Agências', href: '/agencies', icon: Users },
    { title: 'Todos os Contratos', href: '/all-contracts', icon: FileText },
    { title: 'Configurações do Sistema', href: '/system-settings', icon: Settings },
  ];

  let navigation;
  switch (currentUser.role) {
    case 'institution':
      navigation = institutionNav;
      break;
    case 'agency':
      navigation = agencyNav;
      break;
    case 'admin':
      navigation = adminNav;
      break;
    default:
      navigation = [];
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="bg-fin-blue-500 text-white p-1 rounded">
                <CreditCard className="h-6 w-6" />
              </div>
              <span className="text-lg font-semibold">DebtFlow</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <a 
                          href={item.href} 
                          className="flex items-center gap-3"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <div className="mt-auto p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={currentUser.name} />
                          <AvatarFallback className="bg-fin-blue-500 text-white">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium">{currentUser.name}</p>
                          <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                        </div>
                      </div>
                      <DropdownMenuItem onClick={handleLogout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1">
          <header className="border-b h-14 flex items-center px-6 bg-white">
            <SidebarTrigger />
            <div className="ml-4 font-medium text-lg">
              {currentUser?.role === 'institution' && 'Painel da Instituição'}
              {currentUser?.role === 'agency' && 'Painel da Agência'}
              {currentUser?.role === 'admin' && 'Painel do Administrador'}
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto bg-background">
            <Outlet />
          </main>
          <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
            DebtFlow Nexus &copy; {new Date().getFullYear()} - Plataforma de Gestão de Cobranças
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;

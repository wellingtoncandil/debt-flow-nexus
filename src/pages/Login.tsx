import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { CreditCard } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('institution');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(email, password);
      toast({
        title: "Success",
        description: "You are now logged in",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-4 animate-fade-in">
        <div className="mx-auto text-center mb-6">
          <div className="inline-flex items-center justify-center">
            <div className="bg-fin-blue-500 text-white p-2 rounded">
              <CreditCard className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold ml-2">DebtFlow</h1>
          </div>
          <p className="text-fin-neutral-600 mt-2">Plataforma de Gestão de Cobrança</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Entrar</CardTitle>
            <CardDescription>
              Acesse seu painel DebtFlow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="institution" onValueChange={(value) => setRole(value)}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="institution">Instituição</TabsTrigger>
                <TabsTrigger value="agency">Agência de Cobrança</TabsTrigger>
                <TabsTrigger value="admin">Administrador</TabsTrigger>
              </TabsList>
              {["institution", "agency", "admin"].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue}>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="seu@email.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Senha</Label>
                          <a href="#" className="text-xs text-fin-blue-500 hover:underline">
                            Esqueceu a senha?
                          </a>
                        </div>
                        <Input 
                          id="password" 
                          type="password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        {tabValue === "institution" && "Entrar como Instituição"}
                        {tabValue === "agency" && "Entrar como Agência"}
                        {tabValue === "admin" && "Entrar como Administrador"}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm text-fin-neutral-500">
              Não tem uma conta? <a href="#" className="text-fin-blue-500 hover:underline">Entre em contato</a> para começar.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Moon, Globe } from 'lucide-react';

const Settings = () => {
  const handleThemeChange = (checked: boolean) => {
    const theme = checked ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark', checked);
    localStorage.setItem('theme', theme);
  };

  const handleLanguageChange = (value: string) => {
    localStorage.setItem('language', value);
    // In a real app, you would trigger a language change here
    console.log('Language changed to:', value);
  };

  return (
    <div className="container max-w-2xl mx-auto space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold">Configurações</h1>
      
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Moon className="h-5 w-5" />
              <div>
                <Label className="text-base">Modo Escuro</Label>
                <p className="text-sm text-muted-foreground">
                  Ativar ou desativar o modo escuro
                </p>
              </div>
            </div>
            <Switch
              defaultChecked={document.documentElement.classList.contains('dark')}
              onCheckedChange={handleThemeChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Globe className="h-5 w-5" />
              <div>
                <Label className="text-base">Idioma</Label>
                <p className="text-sm text-muted-foreground">
                  Escolha seu idioma preferido
                </p>
              </div>
            </div>
            <Select 
              defaultValue="pt" 
              onValueChange={handleLanguageChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o Idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt">Português</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;

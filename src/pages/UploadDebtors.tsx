
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FileUpload } from '@/components/upload/FileUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText, Upload, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { debtorService } from '@/services/debtorService';
import { useToast } from '@/hooks/use-toast';

const UploadDebtors = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    portfolioId: string;
    debtorCount: number;
    totalValue: number;
  } | null>(null);

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

  const handleFileUpload = async (file: File, portfolioName: string) => {
    try {
      setProcessing(true);
      const result = await debtorService.uploadAndProcessDebtors(
        file,
        currentUser.companyId,
        portfolioName,
        setUploadProgress
      );
      
      setUploadResult(result);
      toast({
        title: "Upload Concluído",
        description: `${result.debtorCount} devedores foram importados com sucesso!`,
      });
    } catch (error) {
      console.error("Erro ao processar arquivo:", error);
      toast({
        title: "Erro ao processar arquivo",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Upload de Devedores</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload de Base de Devedores</CardTitle>
          <CardDescription>
            Faça o upload de sua base de devedores no formato CSV ou XLSX.
            O arquivo deve conter as seguintes colunas obrigatórias: nome, CPF/CNPJ, valor da dívida, data da dívida.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload 
            acceptedFileTypes={['.csv', '.xlsx']}
            maxFileSize={10} // em MB
            onUpload={handleFileUpload}
            disabled={processing}
          />
        </CardContent>
        {uploadResult && (
          <CardFooter className="flex flex-col items-start space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Portfólio Criado com Sucesso</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>
                  Um novo portfólio foi criado com {uploadResult.debtorCount} devedores, 
                  totalizando R$ {uploadResult.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em dívidas.
                </p>
                <Button 
                  onClick={() => navigate(`/portfolios/${uploadResult.portfolioId}`)}
                  variant="outline"
                >
                  Ver Portfólio
                </Button>
              </AlertDescription>
            </Alert>
          </CardFooter>
        )}
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Instruções de Formatação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">Colunas Necessárias</h3>
              <ul className="list-disc pl-5 mt-2">
                <li><strong>Nome:</strong> Nome completo do devedor</li>
                <li><strong>CPF/CNPJ:</strong> Documento de identificação, sem pontos ou traços</li>
                <li><strong>Valor:</strong> Valor total da dívida (em reais)</li>
                <li><strong>Data:</strong> Data da dívida (formato DD/MM/AAAA)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-lg">Colunas Opcionais</h3>
              <ul className="list-disc pl-5 mt-2">
                <li><strong>Email:</strong> Email de contato do devedor</li>
                <li><strong>Telefone:</strong> Telefone de contato</li>
                <li><strong>Endereço:</strong> Endereço do devedor</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadDebtors;

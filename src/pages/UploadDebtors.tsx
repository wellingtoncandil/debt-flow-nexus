
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { FileUpload } from '@/components/upload/FileUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText } from 'lucide-react';

const UploadDebtors = () => {
  const { currentUser } = useAuth();

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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Upload de Devedores</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload de Base de Devedores</CardTitle>
          <CardDescription>
            Faça o upload de sua base de devedores no formato CSV ou XLSX.
            O arquivo deve conter as seguintes colunas: nome, CPF/CNPJ, valor da dívida, data da dívida.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload 
            acceptedFileTypes={['.csv', '.xlsx']}
            maxFileSize={10} // em MB
            onUpload={(file) => console.log('Arquivo enviado:', file)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadDebtors;

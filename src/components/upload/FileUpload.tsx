
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploadProps {
  acceptedFileTypes: string[];
  maxFileSize: number;
  onUpload: (file: File, portfolioName: string) => Promise<void>;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  acceptedFileTypes,
  maxFileSize,
  onUpload,
  disabled = false,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [portfolioName, setPortfolioName] = useState('');
  const [uploadComplete, setUploadComplete] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    
    if (!selectedFile) return;

    if (selectedFile.size > maxFileSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Tamanho máximo permitido: ${maxFileSize}MB`);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setUploadProgress(0);
    setUploadComplete(false);
  }, [maxFileSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    disabled: isUploading || disabled || uploadComplete,
  });

  const handleUpload = async () => {
    if (!file || !portfolioName.trim()) {
      setError('Por favor, selecione um arquivo e dê um nome para o portfólio');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      await onUpload(file, portfolioName);
      setUploadComplete(true);
      setIsUploading(false);
    } catch (err) {
      setError((err as Error).message);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setPortfolioName('');
    setUploadProgress(0);
    setError(null);
    setUploadComplete(false);
  };

  return (
    <div className="space-y-6">
      {uploadComplete ? (
        <div className="flex flex-col items-center p-8 text-center space-y-4 border-2 border-dashed rounded-lg border-green-500 bg-green-50">
          <div className="bg-green-100 p-3 rounded-full">
            <Check className="h-12 w-12 text-green-600" />
          </div>
          <h4 className="text-xl font-semibold text-green-700">Upload Concluído com Sucesso!</h4>
          <p className="text-green-600">Os dados foram processados e o portfólio foi criado.</p>
          <Button onClick={resetUpload}>Fazer Novo Upload</Button>
        </div>
      ) : (
        <>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8
              ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
              ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-primary/5'}
              transition-colors duration-200
              flex flex-col items-center justify-center
              cursor-pointer
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            {file ? (
              <div className="text-center">
                <p className="font-medium text-primary">{file.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <>
                <p className="text-center text-gray-600">
                  {isDragActive
                    ? 'Solte o arquivo aqui'
                    : 'Arraste e solte um arquivo aqui, ou clique para selecionar'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Formatos aceitos: {acceptedFileTypes.join(', ')} (Max: {maxFileSize}MB)
                </p>
              </>
            )}
          </div>

          {file && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="portfolioName">Nome do Portfólio</Label>
                <Input
                  id="portfolioName"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  placeholder="Ex: Portfólio de Cartões - Março 2025"
                  disabled={isUploading}
                />
              </div>
              <Button 
                onClick={handleUpload} 
                disabled={isUploading || !file || !portfolioName.trim()} 
                className="w-full"
              >
                {isUploading ? 'Processando...' : 'Iniciar Processamento'}
              </Button>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-gray-500">Processando... {uploadProgress}%</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

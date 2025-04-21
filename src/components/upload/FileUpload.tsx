
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  acceptedFileTypes: string[];
  maxFileSize: number;
  onUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  acceptedFileTypes,
  maxFileSize,
  onUpload,
}) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    
    if (!file) return;

    if (file.size > maxFileSize * 1024 * 1024) {
      setError(`Arquivo muito grande. Tamanho máximo permitido: ${maxFileSize}MB`);
      return;
    }

    setError(null);
    
    // Simula um upload progressivo
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        onUpload(file);
      }
    }, 200);
  }, [maxFileSize, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}
          hover:border-primary hover:bg-primary/5
          transition-colors duration-200
          flex flex-col items-center justify-center
          cursor-pointer
        `}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-center text-gray-600">
          {isDragActive
            ? 'Solte o arquivo aqui'
            : 'Arraste e solte um arquivo aqui, ou clique para selecionar'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Formatos aceitos: {acceptedFileTypes.join(', ')} (Max: {maxFileSize}MB)
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} />
          <p className="text-sm text-gray-500">Enviando... {uploadProgress}%</p>
        </div>
      )}
    </div>
  );
};

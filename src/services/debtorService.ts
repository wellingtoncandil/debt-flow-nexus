
import { supabase } from './supabaseClient';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export interface DebtorData {
  name: string;
  document: string; // CPF ou CNPJ
  debtValue: number;
  debtDate: string;
  email?: string;
  phone?: string;
  address?: string;
  portfolio_id?: string;
}

export const debtorService = {
  /**
   * Faz upload do arquivo para o storage do Supabase
   */
  uploadFile: async (file: File, institutionId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${institutionId}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await supabase.storage
      .from('debtors')
      .upload(filePath, file);

    if (error) throw error;
    return data.path;
  },

  /**
   * Processa o arquivo CSV ou XLSX
   */
  processFile: async (file: File): Promise<DebtorData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const fileExt = file.name.split('.').pop()?.toLowerCase();
          let debtors: DebtorData[] = [];

          if (fileExt === 'csv') {
            // Processar CSV
            const text = data as string;
            const rows = text.split('\n');
            const headers = rows[0].split(',').map(h => h.trim());
            
            // Map headers to expected fields
            const nameIndex = headers.findIndex(h => 
              h.toLowerCase().includes('nome') || h.toLowerCase() === 'name');
            const documentIndex = headers.findIndex(h => 
              h.toLowerCase().includes('cpf') || h.toLowerCase().includes('cnpj') || 
              h.toLowerCase() === 'documento' || h.toLowerCase() === 'document');
            const valueIndex = headers.findIndex(h => 
              h.toLowerCase().includes('valor') || h.toLowerCase().includes('value') || 
              h.toLowerCase().includes('divida'));
            const dateIndex = headers.findIndex(h => 
              h.toLowerCase().includes('data') || h.toLowerCase().includes('date'));
            const emailIndex = headers.findIndex(h => h.toLowerCase() === 'email');
            const phoneIndex = headers.findIndex(h => 
              h.toLowerCase().includes('telefone') || h.toLowerCase().includes('phone'));
            const addressIndex = headers.findIndex(h => 
              h.toLowerCase().includes('endereco') || h.toLowerCase().includes('address'));
            
            for (let i = 1; i < rows.length; i++) {
              if (!rows[i].trim()) continue;
              
              const cols = rows[i].split(',').map(col => col.trim());
              
              if (cols.length >= Math.max(nameIndex, documentIndex, valueIndex, dateIndex) + 1) {
                debtors.push({
                  name: nameIndex >= 0 ? cols[nameIndex] : '',
                  document: documentIndex >= 0 ? cols[documentIndex] : '',
                  debtValue: valueIndex >= 0 ? parseFloat(cols[valueIndex]) : 0,
                  debtDate: dateIndex >= 0 ? cols[dateIndex] : new Date().toISOString().split('T')[0],
                  email: emailIndex >= 0 ? cols[emailIndex] : undefined,
                  phone: phoneIndex >= 0 ? cols[phoneIndex] : undefined,
                  address: addressIndex >= 0 ? cols[addressIndex] : undefined,
                });
              }
            }
          } else if (fileExt === 'xlsx') {
            // Processar XLSX usando a biblioteca xlsx
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            debtors = jsonData.map((row: any) => {
              // Tentar encontrar os campos correspondentes
              const nameField = Object.keys(row).find(key => 
                key.toLowerCase().includes('nome') || key.toLowerCase() === 'name');
              const documentField = Object.keys(row).find(key => 
                key.toLowerCase().includes('cpf') || key.toLowerCase().includes('cnpj') || 
                key.toLowerCase() === 'documento' || key.toLowerCase() === 'document');
              const valueField = Object.keys(row).find(key => 
                key.toLowerCase().includes('valor') || key.toLowerCase().includes('value') || 
                key.toLowerCase().includes('divida'));
              const dateField = Object.keys(row).find(key => 
                key.toLowerCase().includes('data') || key.toLowerCase().includes('date'));
              const emailField = Object.keys(row).find(key => key.toLowerCase() === 'email');
              const phoneField = Object.keys(row).find(key => 
                key.toLowerCase().includes('telefone') || key.toLowerCase().includes('phone'));
              const addressField = Object.keys(row).find(key => 
                key.toLowerCase().includes('endereco') || key.toLowerCase().includes('address'));
              
              return {
                name: nameField ? row[nameField] : '',
                document: documentField ? row[documentField] : '',
                debtValue: valueField ? parseFloat(row[valueField]) : 0,
                debtDate: dateField ? row[dateField] : new Date().toISOString().split('T')[0],
                email: emailField ? row[emailField] : undefined,
                phone: phoneField ? row[phoneField] : undefined,
                address: addressField ? row[addressField] : undefined,
              };
            });
          }

          // Validação básica dos dados
          const validDebtors = debtors.filter(debtor => 
            debtor.name && 
            debtor.document && 
            !isNaN(debtor.debtValue) && 
            debtor.debtValue > 0
          );
          
          if (validDebtors.length === 0) {
            reject(new Error('Nenhum devedor válido encontrado no arquivo.'));
          } else {
            resolve(validDebtors);
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Erro ao ler o arquivo'));
      };

      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  },

  /**
   * Salva os devedores no banco de dados
   */
  saveDebtors: async (debtors: DebtorData[], portfolioId: string) => {
    const debtorsWithPortfolio = debtors.map(debtor => ({
      ...debtor,
      portfolio_id: portfolioId
    }));

    const { data, error } = await supabase
      .from('debtors')
      .insert(debtorsWithPortfolio);

    if (error) throw error;
    return data;
  },

  /**
   * Cria um novo portfolio para os devedores
   */
  createPortfolio: async (institutionId: string, name: string, debtors: DebtorData[]) => {
    const totalDebtValue = debtors.reduce((sum, debtor) => sum + debtor.debtValue, 0);
    const debtorCount = debtors.length;
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + 3); // Vencimento padrão em 3 meses

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .insert([
        {
          name,
          institution_id: institutionId,
          total_debt_value: totalDebtValue,
          debtor_count: debtorCount,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'draft'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return portfolio;
  },

  /**
   * Processo completo de upload e processamento
   */
  uploadAndProcessDebtors: async (
    file: File, 
    institutionId: string, 
    portfolioName: string, 
    onProgress: (progress: number) => void
  ) => {
    try {
      // Etapa 1: Upload do arquivo (10%)
      onProgress(10);
      await debtorService.uploadFile(file, institutionId);
      
      // Etapa 2: Processamento do arquivo (40%)
      onProgress(40);
      const debtors = await debtorService.processFile(file);
      
      // Etapa 3: Criação do portfolio (60%)
      onProgress(60);
      const portfolio = await debtorService.createPortfolio(
        institutionId, 
        portfolioName || `Portfolio ${new Date().toLocaleDateString()}`, 
        debtors
      );
      
      // Etapa 4: Salvando os devedores (90%)
      onProgress(90);
      await debtorService.saveDebtors(debtors, portfolio.id);
      
      // Processo completo (100%)
      onProgress(100);
      
      toast.success(`Upload concluído: ${debtors.length} devedores importados com sucesso!`);
      return {
        portfolioId: portfolio.id,
        debtorCount: debtors.length,
        totalValue: debtors.reduce((sum, debtor) => sum + debtor.debtValue, 0)
      };
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast.error("Erro ao processar arquivo: " + (error as Error).message);
      throw error;
    }
  }
};

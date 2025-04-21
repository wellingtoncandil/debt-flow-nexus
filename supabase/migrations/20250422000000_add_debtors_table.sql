
-- Criação da tabela de devedores
CREATE TABLE IF NOT EXISTS public.debtors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  document TEXT NOT NULL,
  debt_value DECIMAL(12,2) NOT NULL,
  debt_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  email TEXT,
  phone TEXT,
  address TEXT,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'negotiating', 'paid', 'written_off'))
);

-- Adicionar índices para melhorar a performance das consultas
CREATE INDEX IF NOT EXISTS debtors_portfolio_id_idx ON public.debtors(portfolio_id);
CREATE INDEX IF NOT EXISTS debtors_document_idx ON public.debtors(document);

-- Criação do bucket para armazenar os arquivos de upload
INSERT INTO storage.buckets (id, name, public) VALUES ('debtors', 'debtors', false)
ON CONFLICT (id) DO NOTHING;

-- RLS (Row Level Security)
ALTER TABLE public.debtors ENABLE ROW LEVEL SECURITY;

-- Política para instituições: podem visualizar apenas seus próprios devedores
CREATE POLICY "Instituições podem ver seus próprios devedores" ON public.debtors
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.portfolios p
    WHERE p.id = portfolio_id
    AND p.institution_id = auth.uid()
  )
);

-- Política para inserção: instituições podem adicionar devedores aos seus próprios portfólios
CREATE POLICY "Instituições podem adicionar devedores" ON public.debtors
FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.portfolios p
    WHERE p.id = portfolio_id
    AND p.institution_id = auth.uid()
  )
);

-- Política para atualização: instituições podem atualizar seus próprios devedores
CREATE POLICY "Instituições podem atualizar seus próprios devedores" ON public.debtors
FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.portfolios p
    WHERE p.id = portfolio_id
    AND p.institution_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.portfolios p
    WHERE p.id = portfolio_id
    AND p.institution_id = auth.uid()
  )
);

-- Política para exclusão: instituições podem excluir seus próprios devedores
CREATE POLICY "Instituições podem excluir seus próprios devedores" ON public.debtors
FOR DELETE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.portfolios p
    WHERE p.id = portfolio_id
    AND p.institution_id = auth.uid()
  )
);

-- Função para atualizar o timestamp de atualização
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar o timestamp
CREATE TRIGGER update_debtors_updated_at
BEFORE UPDATE ON public.debtors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Função para atualizar os totais do portfólio quando devedores são adicionados/alterados
CREATE OR REPLACE FUNCTION update_portfolio_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza o total de valor e contagem de devedores no portfólio
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE public.portfolios
    SET 
      total_debt_value = (
        SELECT COALESCE(SUM(debt_value), 0)
        FROM public.debtors
        WHERE portfolio_id = NEW.portfolio_id
      ),
      debtor_count = (
        SELECT COUNT(*)
        FROM public.debtors
        WHERE portfolio_id = NEW.portfolio_id
      ),
      updated_at = NOW()
    WHERE id = NEW.portfolio_id;
  END IF;

  IF TG_OP = 'DELETE' THEN
    UPDATE public.portfolios
    SET 
      total_debt_value = (
        SELECT COALESCE(SUM(debt_value), 0)
        FROM public.debtors
        WHERE portfolio_id = OLD.portfolio_id
      ),
      debtor_count = (
        SELECT COUNT(*)
        FROM public.debtors
        WHERE portfolio_id = OLD.portfolio_id
      ),
      updated_at = NOW()
    WHERE id = OLD.portfolio_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers para manter os totais dos portfólios atualizados
CREATE TRIGGER update_portfolio_totals_on_insert_update
AFTER INSERT OR UPDATE ON public.debtors
FOR EACH ROW
EXECUTE FUNCTION update_portfolio_totals();

CREATE TRIGGER update_portfolio_totals_on_delete
AFTER DELETE ON public.debtors
FOR EACH ROW
EXECUTE FUNCTION update_portfolio_totals();

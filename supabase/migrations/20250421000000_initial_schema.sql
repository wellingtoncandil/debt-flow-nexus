
-- Criação da tabela de instituições financeiras
create table institutions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criação da tabela de agências de cobrança
create table agencies (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  rating numeric(3,2) default 0,
  success_rate numeric(5,2) default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criação da tabela de portfólios
create table portfolios (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  institution_id uuid references institutions(id) not null,
  total_debt_value numeric(15,2) not null,
  debtor_count integer not null,
  status text check (status in ('draft', 'bidding', 'assigned', 'completed')) not null default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  due_date timestamp with time zone not null,
  assigned_agency_id uuid references agencies(id),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criação da tabela de devedores
create table debtors (
  id uuid default gen_random_uuid() primary key,
  portfolio_id uuid references portfolios(id) not null,
  name text not null,
  document_number text not null,
  debt_value numeric(15,2) not null,
  debt_date timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criação da tabela de propostas (bids)
create table bids (
  id uuid default gen_random_uuid() primary key,
  portfolio_id uuid references portfolios(id) not null,
  agency_id uuid references agencies(id) not null,
  fixed_fee numeric(15,2) not null,
  percentage_fee numeric(5,2) not null,
  estimated_recovery numeric(15,2),
  status text check (status in ('pending', 'accepted', 'rejected')) not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criação da tabela de pagamentos
create table payments (
  id uuid default gen_random_uuid() primary key,
  portfolio_id uuid references portfolios(id) not null,
  debtor_id uuid references debtors(id) not null,
  amount numeric(15,2) not null,
  payment_date timestamp with time zone not null,
  status text check (status in ('pending', 'completed', 'failed')) not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criação de índices para melhor performance
create index idx_portfolios_institution on portfolios(institution_id);
create index idx_debtors_portfolio on debtors(portfolio_id);
create index idx_bids_portfolio on bids(portfolio_id);
create index idx_payments_portfolio on payments(portfolio_id);
create index idx_payments_debtor on payments(debtor_id);

-- Função para atualizar o updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers para atualizar updated_at automaticamente
create trigger update_institutions_updated_at before update on institutions for each row execute procedure update_updated_at_column();
create trigger update_agencies_updated_at before update on agencies for each row execute procedure update_updated_at_column();
create trigger update_portfolios_updated_at before update on portfolios for each row execute procedure update_updated_at_column();
create trigger update_debtors_updated_at before update on debtors for each row execute procedure update_updated_at_column();
create trigger update_bids_updated_at before update on bids for each row execute procedure update_updated_at_column();
create trigger update_payments_updated_at before update on payments for each row execute procedure update_updated_at_column();

-- Políticas de segurança (RLS)
alter table institutions enable row level security;
alter table agencies enable row level security;
alter table portfolios enable row level security;
alter table debtors enable row level security;
alter table bids enable row level security;
alter table payments enable row level security;

-- Políticas para instituições
create policy "Instituições podem ver seus próprios dados"
  on institutions for all
  using (auth.uid() = id);

-- Políticas para agências
create policy "Agências podem ver seus próprios dados"
  on agencies for all
  using (auth.uid() = id);

-- Políticas para portfólios
create policy "Instituições podem gerenciar seus portfólios"
  on portfolios for all
  using (auth.uid() = institution_id);

create policy "Agências podem ver portfólios em licitação ou atribuídos a elas"
  on portfolios for select
  using (
    status = 'bidding' or 
    assigned_agency_id = auth.uid()
  );

-- Políticas para devedores
create policy "Acesso aos devedores baseado no acesso ao portfólio"
  on debtors for all
  using (
    exists (
      select 1 from portfolios
      where id = debtors.portfolio_id
      and (
        institution_id = auth.uid() or
        assigned_agency_id = auth.uid()
      )
    )
  );

-- Políticas para propostas
create policy "Instituições podem ver propostas de seus portfólios"
  on bids for all
  using (
    exists (
      select 1 from portfolios
      where id = bids.portfolio_id
      and institution_id = auth.uid()
    )
  );

create policy "Agências podem gerenciar suas próprias propostas"
  on bids for all
  using (agency_id = auth.uid());

-- Políticas para pagamentos
create policy "Acesso aos pagamentos baseado no acesso ao portfólio"
  on payments for all
  using (
    exists (
      select 1 from portfolios
      where id = payments.portfolio_id
      and (
        institution_id = auth.uid() or
        assigned_agency_id = auth.uid()
      )
    )
  );


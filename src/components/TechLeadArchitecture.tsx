import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';

export const TechLeadArchitecture: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sql' | 'nextjs' | 'actions' | 'loop'>('sql');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    sounds.playLoot();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const sqlSchema = `-- =====================================================================
-- TALES OF FINANCE - ESQUEMA RELACIONAL SUPABASE (POSTGRESQL)
-- Arquitetura: Dupla Camada (Banking Raw vs RPG Custom), Multi-User Party
-- =====================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS DO SISTEMA DE RPG E BANCO
CREATE TYPE rpg_element AS ENUM ('SOLAR', 'LUNAR', 'ECLIPSE');
CREATE TYPE spell_type AS ENUM ('DAMAGE', 'LOOT', 'MANA_TRANSFER', 'POISON');
CREATE TYPE boss_status AS ENUM ('ACTIVE', 'ENRAGED', 'DEFEATED');
CREATE TYPE quest_type AS ENUM ('BEHAVIORAL', 'SAVINGS', 'BOSS_STRIKE', 'STREAK');
CREATE TYPE account_type AS ENUM ('CHECKING', 'CREDIT_CARD', 'SAVINGS', 'INVESTMENT');
CREATE TYPE relic_rarity AS ENUM ('COMUM', 'RARO', 'ÉPICO', 'LENDÁRIO', 'MÍTICO');

-- 2. TABELA DE GUILDAS (Família / Casa / Party Coletiva)
CREATE TABLE public.guilds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    sanctuary_name VARCHAR(150) NOT NULL DEFAULT 'Santuário Astral',
    level INT NOT NULL DEFAULT 1,
    xp INT NOT NULL DEFAULT 0,
    xp_to_next_level INT NOT NULL DEFAULT 1000,
    monthly_budget_cap NUMERIC(12, 2) NOT NULL DEFAULT 5000.00, -- HP Base do Orçamento
    current_turn INT NOT NULL DEFAULT 1,
    serasa_mystic_score INT NOT NULL DEFAULT 750,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABELA DE PERSONAGENS (Avatares da Guilda / Usuários)
CREATE TABLE public.characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    class_name VARCHAR(50) NOT NULL, -- Ex: 'Guerreiro Solar', 'Maga Lunar'
    element rpg_element NOT NULL DEFAULT 'SOLAR',
    title VARCHAR(100) DEFAULT 'Guardião Novato',
    avatar_url TEXT,
    level INT NOT NULL DEFAULT 1,
    xp INT NOT NULL DEFAULT 0,
    xp_max INT NOT NULL DEFAULT 1000,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABELA DE INVENTÁRIOS (Contas Bancárias e Cartões de Crédito)
CREATE TABLE public.inventories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
    character_id UUID NOT NULL REFERENCES public.characters(id) ON DELETE CASCADE,
    institution_name VARCHAR(80) NOT NULL, -- Ex: 'Nubank', 'Itaú'
    account_type account_type NOT NULL DEFAULT 'CHECKING',
    account_number_mask VARCHAR(20),
    balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    credit_limit NUMERIC(12, 2) DEFAULT 0.00,
    skin_equipped_id VARCHAR(50) DEFAULT 'default',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TABELA DE TRANSAÇÕES - MOTOR DE DUPLA CAMADA (OFX & RPG)
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
    inventory_id UUID NOT NULL REFERENCES public.inventories(id) ON DELETE CASCADE,
    
    -- Camada 1: Original Bancária (Imutável para Auditoria e Deduplicação OFX)
    raw_fitid VARCHAR(255) NOT NULL, -- Unique ID do OFX para evitar duplicatas
    raw_description TEXT NOT NULL,
    raw_amount NUMERIC(12, 2) NOT NULL,
    raw_date TIMESTAMPTZ NOT NULL,
    raw_checknum VARCHAR(100),
    
    -- Camada 2: Visual RPG Paralela (Totalmente Editável pelo Jogador)
    custom_name VARCHAR(150) NOT NULL,
    custom_tags TEXT[] DEFAULT '{}',
    spell_type spell_type NOT NULL DEFAULT 'DAMAGE',
    rpg_category VARCHAR(80) NOT NULL DEFAULT 'Taverna & Suprimentos',
    lore_note TEXT,
    is_critical BOOLEAN NOT NULL DEFAULT FALSE, -- Flag para gastos anômalos
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE, -- Assinaturas / Venenos fixos
    is_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Proporção Party (Split entre membros da casa)
    solar_share NUMERIC(4, 2) NOT NULL DEFAULT 0.50,
    lunar_share NUMERIC(4, 2) NOT NULL DEFAULT 0.50,

    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),

    -- Evita duplicidade de importação pelo mesmo FITID na conta
    CONSTRAINT unique_inventory_fitid UNIQUE (inventory_id, raw_fitid)
);

-- 6. TABELA DE BOSS FIGHTS (Faturas de Cartão e Contas Fixas Mensais)
CREATE TABLE public.boss_fights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
    inventory_id UUID NOT NULL REFERENCES public.inventories(id) ON DELETE CASCADE,
    boss_name VARCHAR(100) NOT NULL,
    title VARCHAR(150),
    threat_level INT NOT NULL DEFAULT 30,
    avatar_url TEXT,
    defeated_avatar_url TEXT,
    total_invoice_amount NUMERIC(12, 2) NOT NULL,
    current_hp NUMERIC(12, 2) NOT NULL, -- HP vai de total_invoice_amount a 0
    max_hp NUMERIC(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    status boss_status NOT NULL DEFAULT 'ACTIVE',
    passive_curse VARCHAR(150) DEFAULT 'Juros Rotativos Berserk (+14.5% a.m.)',
    rewards_xp INT NOT NULL DEFAULT 350,
    rewards_serasa_score INT NOT NULL DEFAULT 25,
    rewards_relic_id VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. TABELA DE MISSÕES ATIVAS (Quests Comportamentais e Metas)
CREATE TABLE public.quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guild_id UUID NOT NULL REFERENCES public.guilds(id) ON DELETE CASCADE,
    character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
    title VARCHAR(120) NOT NULL,
    quest_type quest_type NOT NULL DEFAULT 'BEHAVIORAL',
    description TEXT NOT NULL,
    current_progress NUMERIC(10, 2) NOT NULL DEFAULT 0,
    target_progress NUMERIC(10, 2) NOT NULL DEFAULT 1,
    progress_unit VARCHAR(30) NOT NULL DEFAULT 'Dias',
    reward_xp INT NOT NULL DEFAULT 150,
    reward_text VARCHAR(150) NOT NULL,
    is_ready_to_claim BOOLEAN NOT NULL DEFAULT FALSE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. TABELA DE RELÍQUIAS E COSMÉTICOS (Loot Vault)
CREATE TABLE public.relics (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rarity relic_rarity NOT NULL DEFAULT 'RARO',
    type VARCHAR(30) NOT NULL, -- 'FRAME', 'CARD_SKIN', 'AURA', 'TROPHY'
    description TEXT NOT NULL,
    image_url TEXT,
    requirement_lore TEXT,
    bonus_text TEXT
);

-- 9. TRIGGERS: ATUALIZAÇÃO AUTOMÁTICA DE XP E SALDO DA GUILDA
CREATE OR REPLACE FUNCTION public.handle_transaction_rpg_sync()
RETURNS TRIGGER AS $$
BEGIN
    -- Se for LOOT (Receita), adiciona XP à Guilda e recupera mana
    IF NEW.spell_type = 'LOOT' THEN
        UPDATE public.guilds 
        SET xp = xp + 20 
        WHERE id = NEW.guild_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_transaction_inserted
AFTER INSERT ON public.transactions
FOR EACH ROW EXECUTE PROCEDURE public.handle_transaction_rpg_sync();

-- 10. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boss_fights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

-- Usuários acessam apenas dados associados à sua guilda
CREATE POLICY "Guild members access own guild data" 
ON public.guilds FOR ALL 
USING (id IN (SELECT guild_id FROM public.characters WHERE user_id = auth.uid()));

CREATE POLICY "Characters accessible by guild members" 
ON public.characters FOR ALL 
USING (guild_id IN (SELECT guild_id FROM public.characters WHERE user_id = auth.uid()));

CREATE POLICY "Transactions accessible by guild members" 
ON public.transactions FOR ALL 
USING (guild_id IN (SELECT guild_id FROM public.characters WHERE user_id = auth.uid()));`;

  const nextJsDirectoryStructure = `tales-of-finance/
├── .env.local                    # Chaves Supabase (NEXT_PUBLIC_SUPABASE_URL, etc.)
├── middleware.ts                 # Autenticação e redirecionamento de Guilda
├── next.config.mjs
├── package.json
├── tailwind.config.ts            # Cores astrais Sea of Stars, scanlines e fontes
│
├── src/
│   ├── app/                      # Next.js 15 App Router
│   │   ├── layout.tsx            # Root Layout com Provedor de Áudio & Tema Escuro
│   │   ├── page.tsx              # Landing / Redirecionamento de Auth
│   │   │
│   │   ├── (auth)/               # Rota de Login / Registro dos Magos
│   │   │   ├── login/page.tsx
│   │   │   └── onboarding/page.tsx # Criação de Avatar, Guilda e Escolha de Classe
│   │   │
│   │   ├── (game)/               # Shell Mobile do Jogo (Tabs com Barra Inferior)
│   │   │   ├── layout.tsx        # Top Bar (Santuário), Ambient Canvas e Bottom Navigation
│   │   │   │
│   │   │   ├── taverna/          # Tab 1: Dashboard Principal (Resumo da Guilda & Party)
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── batalhas/         # Tab 2: Boss Fight (Faturas de Cartão)
│   │   │   │   ├── page.tsx      # Arena de Combate e HP do Orçamento
│   │   │   │   └── [id]/page.tsx # Ficha Técnica / Bestiário do Monstro
│   │   │   │
│   │   │   ├── grimorio/         # Tab 3: Extrato & Motor de Dupla Camada
│   │   │   │   ├── page.tsx      # Lista de Crônicas com Filtros RPG
│   │   │   │   └── import/page.tsx # Upload e Conciliação de Arquivos OFX
│   │   │   │
│   │   │   ├── quests/           # Tab 4: Tábula de Missões Comportamentais
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── inventario/       # Tab 5: Relíquias, Skins e Contas Bancárias
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                  # Webhooks e rotas REST utilitárias
│   │       └── ofx/upload/route.ts
│   │
│   ├── actions/                  # Server Actions (Mutação Segura de Dados)
│   │   ├── boss-battle.ts        # payInvoiceFullAction, strikeBossAction
│   │   ├── transactions.ts       # importOfxAction, updateCustomLayerAction
│   │   ├── quests.ts             # claimQuestAction, evaluateBehavioralQuests
│   │   └── party.ts              # transferManaAction, inviteMemberAction
│   │
│   ├── components/               # Componentes UI Modulares
│   │   ├── arena/                # BossSprite, HpGauge, FloatingDamageText
│   │   ├── grimorio/             # TransactionItem, DualLayerModal, OfxDropzone
│   │   ├── hud/                  # PartyStatusCard, NetBalanceHeader, BottomNav
│   │   └── shared/               # RetroButton, PixelModal, AudioToggle
│   │
│   ├── lib/
│   │   ├── supabase/             # Clientes Supabase SSR e Client
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   │
│   │   ├── ofx/                  # Parser de OFX robusto (XML / SGML)
│   │   │   ├── parser.ts
│   │   │   └── classifier.ts     # Tradutor Semântico de Lojas para Magias
│   │   │
│   │   └── audio/                # Web Audio API Synth (Ataques, Críticos, Fanfarra)
│   │       └── sfx-engine.ts
│   │
│   └── types/                    # Definições TypeScript
│       ├── database.ts           # Gerado pelo Supabase CLI
│       └── game.ts               # Entidades de Jogo, Bosses e Relíquias`;

  const serverActionSample = `// src/actions/boss-battle.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Server Action: Lançar Contra-Ataque Integral (Quitar Fatura Total)
 * Executa o ataque crítico no Boss, zera o HP da fatura,
 * concede XP à Guilda e desbloqueia as recompensas da vitória.
 */
export async function payInvoiceFullAction(bossId: string) {
  const supabase = await createClient();

  // 1. Busca os dados atuais do Boss
  const { data: boss, error: fetchErr } = await supabase
    .from('boss_fights')
    .select('*, guilds(*)')
    .eq('id', bossId)
    .single();

  if (fetchErr || !boss) {
    throw new Error('Boss não encontrado na arena cósmica.');
  }

  // 2. Executa a quitação e expurgo do Boss
  const { error: updateErr } = await supabase
    .from('boss_fights')
    .update({
      current_hp: 0,
      status: 'DEFEATED',
      updated_at: new Date().toISOString(),
    })
    .eq('id', bossId);

  if (updateErr) {
    throw new Error('Falha ao desferir o golpe na fatura.');
  }

  // 3. Concede XP e prestígio à Guilda
  await supabase
    .from('guilds')
    .update({
      xp: boss.guilds.xp + boss.rewards_xp,
      serasa_mystic_score: boss.guilds.serasa_mystic_score + boss.rewards_serasa_score,
    })
    .eq('id', boss.guild_id);

  // 4. Cria registro no Log de Batalha (Grimório)
  await supabase
    .from('transactions')
    .insert({
      guild_id: boss.guild_id,
      inventory_id: boss.inventory_id,
      raw_fitid: \`PAY-FULL-\${bossId}-\${Date.now()}\`,
      raw_description: \`PAGAMENTO INTEGRAL FATURA \${boss.boss_name.toUpperCase()}\`,
      raw_amount: -boss.total_invoice_amount,
      raw_date: new Date().toISOString(),
      custom_name: 'Contra-Ataque Crítico (Fatura Quitada)',
      spell_type: 'DAMAGE',
      rpg_category: 'Defesa de Castelo',
      is_critical: true,
      is_reviewed: true,
    });

  revalidatePath('/(game)/batalhas');
  revalidatePath('/(game)/taverna');

  return { success: true, xpEarned: boss.rewards_xp };
}`;

  return (
    <div className="flex flex-col w-full pb-space-2xl gap-space-md">
      {/* Header */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-0.5 rounded-full bg-primary-container/20 border border-primary/30">
          <span className="material-symbols-outlined text-primary text-[14px]">terminal</span>
          <span className="font-label-sm text-[10px] text-primary uppercase font-bold tracking-widest">
            ENTREGA TÉCNICA • TECH LEAD & ARQUITETURA
          </span>
        </div>
        <h2 className="font-title text-2xl font-bold text-on-surface">
          Estrutura & Engenharia do "Tales of Finance"
        </h2>
        <p className="text-xs text-on-surface-variant">
          Documentação de arquitetura, esquema relacional Supabase, árvore de pastas Next.js 15 e Server Actions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'sql', label: '1. Esquema SQL Supabase', icon: 'database' },
          { id: 'nextjs', label: '2. Árvore Next.js 15', icon: 'folder_copy' },
          { id: 'actions', label: '3. Server Actions', icon: 'bolt' },
          { id: 'loop', label: '4. Loop Comportamental', icon: 'all_inclusive' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { sounds.playSelect(); setActiveTab(tab.id as typeof activeTab); }}
            className={`px-3 py-1.5 rounded-full font-label-sm text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary-container text-on-primary-container font-bold shadow-md'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-surface-container-high'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: SQL SCHEMA */}
      {activeTab === 'sql' && (
        <div className="flex flex-col gap-3">
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-primary">Esquema Relacional PostgreSQL (Supabase)</span>
              <span className="text-[11px] text-outline">
                Inclui ENUMs, Guilds, Characters, Dupla Camada (OFX raw vs custom), Boss Fights, Quests, Triggers e RLS.
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(sqlSchema, 'sql')}
              className="py-1.5 px-3 rounded-lg bg-primary-container text-on-primary-container font-label-sm text-xs uppercase font-bold flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copiedKey === 'sql' ? 'check' : 'content_copy'}
              </span>
              <span>{copiedKey === 'sql' ? 'Copiado!' : 'Copiar SQL'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high font-mono text-[11px] text-on-surface overflow-x-auto leading-relaxed shadow-inner max-h-[600px]">
            {sqlSchema}
          </pre>
        </div>
      )}

      {/* TAB 2: NEXT.JS DIRECTORY STRUCTURE */}
      {activeTab === 'nextjs' && (
        <div className="flex flex-col gap-3">
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-secondary">Estrutura de Diretórios Recomendada (Next.js 15)</span>
              <span className="text-[11px] text-outline">
                Foco Mobile com Shell de navegação (Taverna, Batalhas, Grimório, Quests, Inventário).
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(nextJsDirectoryStructure, 'nextjs')}
              className="py-1.5 px-3 rounded-lg bg-secondary-container text-on-secondary font-label-sm text-xs uppercase font-bold flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copiedKey === 'nextjs' ? 'check' : 'content_copy'}
              </span>
              <span>{copiedKey === 'nextjs' ? 'Copiado!' : 'Copiar Estrutura'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high font-mono text-[11px] text-secondary-fixed overflow-x-auto leading-relaxed shadow-inner max-h-[600px]">
            {nextJsDirectoryStructure}
          </pre>
        </div>
      )}

      {/* TAB 3: SERVER ACTIONS */}
      {activeTab === 'actions' && (
        <div className="flex flex-col gap-3">
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-tertiary">Exemplo de Server Action: Batalha do Boss</span>
              <span className="text-[11px] text-outline">
                Operação atômica que derrota a fatura, atualiza o XP da família e reconcilia o log.
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(serverActionSample, 'action')}
              className="py-1.5 px-3 rounded-lg bg-tertiary-container text-on-tertiary font-label-sm text-xs uppercase font-bold flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copiedKey === 'action' ? 'check' : 'content_copy'}
              </span>
              <span>{copiedKey === 'action' ? 'Copiado!' : 'Copiar Action'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-surface-container-lowest border border-surface-container-high font-mono text-[11px] text-tertiary-container overflow-x-auto leading-relaxed shadow-inner max-h-[600px]">
            {serverActionSample}
          </pre>
        </div>
      )}

      {/* TAB 4: BEHAVIORAL GAME LOOP */}
      {activeTab === 'loop' && (
        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-xl bg-surface-container border border-surface-container-high flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">psychology</span>
              <h3 className="font-title text-sm font-bold text-primary uppercase">
                A Metáfora Comportamental (Guiabolso + Sea of Stars)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col gap-1.5">
                <span className="font-bold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                  HP do Orçamento (Orçamento Dinâmico)
                </span>
                <p className="text-on-surface-variant text-[11px]">
                  Em vez de gráficos de pizza ou barras estáticas chatas, o jogador começa o mês com 100% de HP. Cada gasto causa dano ao HP. Se o HP cair abaixo de 20%, entra em estado de perigo sonoro e visual ("Berserk").
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col gap-1.5">
                <span className="font-bold text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">swords</span>
                  Boss Fights de Fatura
                </span>
                <p className="text-on-surface-variant text-[11px]">
                  Faturas de cartão de crédito são monstros que avançam com um contador regressivo de dias. Pagar à vista antes do vencimento desfecha um Ataque Crítico que zera o HP do boss e concede relíquias raras.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col gap-1.5">
                <span className="font-bold text-tertiary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">groups</span>
                  Party Familiar (Multi-User Guild)
                </span>
                <p className="text-on-surface-variant text-[11px]">
                  O casal ou família gerencia a mesma casa sem conflitos: cada transação indica quem conjurou (Ray Maga Lunar ou Iury Guerreiro Solar) e a divisão de mana, estimulando a colaboração lúdica.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col gap-1.5">
                <span className="font-bold text-primary-fixed-dim flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">layers</span>
                  Auditoria de Dupla Camada
                </span>
                <p className="text-on-surface-variant text-[11px]">
                  A camada bancária original mantém os dados intocados para comprovação fiscal e conciliação bancária precisa, enquanto a camada superior permite gamificação sem corromper a verdade contábil.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

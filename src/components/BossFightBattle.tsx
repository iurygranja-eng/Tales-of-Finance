import React, { useState } from 'react';
import { BossFight, Character, DefeatedBattleRecord } from '../types/game';
import { YEARLY_BOSSES, INITIAL_DEFEATED_BATTLES } from '../data/yearlyBosses';
import { BossSpriteRenderer } from './BossSpriteRenderer';
import { sounds } from '../utils/soundEffects';

import { VocabularyTerms, DifficultyLevel } from '../utils/difficultyVocabulary';

interface BossFightProps {
  boss: BossFight;
  characters: Character[];
  onPayFullInvoice: () => void;
  onPayPartial: (amount: number) => void;
  onResetBoss: () => void;
  onSelectMonthBoss: (boss: BossFight) => void;
  vocab?: VocabularyTerms;
  difficulty?: DifficultyLevel;
}

interface MiniBossBill {
  id: string;
  name: string;
  service: string;
  amount: number;
  daysRemaining: number;
  dueDate: string;
  payerName: string;
  payerAvatar: string;
  icon: string;
  isPaid: boolean;
  description: string;
}

const INITIAL_MINI_BOSSES: MiniBossBill[] = [
  {
    id: 'mb-luz',
    name: 'Gárgula da Energia Elétrica',
    service: 'Conta de Luz (Enel)',
    amount: 245.00,
    daysRemaining: 8,
    dueDate: '10/11',
    payerName: 'Iury (Solar)',
    payerAvatar: '/assets/aistudio/Iury2_197a4062.jpg',
    icon: 'bolt',
    isPaid: false,
    description: 'Consumo do mês com ar-condicionado e setup gamer da guilda',
  },
  {
    id: 'mb-internet',
    name: 'Polvo da Fibra Óptica',
    service: 'Internet Fibra 600MB',
    amount: 149.90,
    daysRemaining: 12,
    dueDate: '14/11',
    payerName: 'Ray (Lunar)',
    payerAvatar: '/assets/aistudio/Ray_284119bd.jpg',
    icon: 'wifi',
    isPaid: false,
    description: 'Portal de alta velocidade para os feitiços e reuniões do santuário',
  },
  {
    id: 'mb-agua',
    name: 'Elemental da Água & Saneamento',
    service: 'Conta de Água (Sabesp)',
    amount: 98.40,
    daysRemaining: 15,
    dueDate: '17/11',
    payerName: 'Casa / Ambos',
    payerAvatar: '/assets/aistudio/Ray_284119bd.jpg',
    icon: 'water_drop',
    isPaid: false,
    description: 'Recurso hídrico fundamental para a manutenção do santuário',
  },
  {
    id: 'mb-condominio',
    name: 'Sentinela do Castelo',
    service: 'Taxa de Condomínio',
    amount: 680.00,
    daysRemaining: 5,
    dueDate: '07/11',
    payerName: 'Ambos',
    payerAvatar: '/assets/aistudio/Iury2_197a4062.jpg',
    icon: 'castle',
    isPaid: false,
    description: 'Blindagem e segurança das muralhas e dependências da guilda',
  },
  {
    id: 'mb-streaming',
    name: 'Sombra dos Portais de Streaming',
    service: 'Netflix, Spotify & Max',
    amount: 85.80,
    daysRemaining: 18,
    dueDate: '20/11',
    payerName: 'Ray (Lunar)',
    payerAvatar: '/assets/aistudio/Ray_284119bd.jpg',
    icon: 'subscriptions',
    isPaid: false,
    description: 'Lazer e festivais periódicos de música e cinema dos guardiões',
  },
  {
    id: 'mb-saude',
    name: 'Guardião da Saúde & Alquimia',
    service: 'Plano de Saúde Familiar',
    amount: 1190.00,
    daysRemaining: 10,
    dueDate: '12/11',
    payerName: 'Ambos',
    payerAvatar: '/assets/aistudio/Iury2_197a4062.jpg',
    icon: 'healing',
    isPaid: false,
    description: 'Cobertura curativa contra todas as aflições e poções de recuperação',
  },
];

export const BossFightBattle: React.FC<BossFightProps> = ({
  boss,
  characters: _characters,
  onPayFullInvoice,
  onPayPartial,
  onResetBoss,
  onSelectMonthBoss,
  vocab,
  difficulty = 'medio',
}) => {
  const [activeTab, setActiveTab] = useState<'arena' | 'bestiary' | 'completed_log' | 'victory'>('arena');
  const [isAttacking, setIsAttacking] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState<{ id: number; text: string; isCrit: boolean } | null>(null);
  const [defeatedBattles, setDefeatedBattles] = useState<DefeatedBattleRecord[]>(INITIAL_DEFEATED_BATTLES);
  const [miniBosses, setMiniBosses] = useState<MiniBossBill[]>(INITIAL_MINI_BOSSES);

  const hpPercent = Math.max(0, Math.min(100, (boss.current_hp / boss.max_hp) * 100));
  const budgetHpPercent = Math.max(0, Math.min(100, (boss.budget_defense_hp / boss.budget_defense_max) * 100));
  const isDefeated = boss.current_hp <= 0 || boss.status === 'DEFEATED';

  // Metrics for completed battles log
  const totalPaidSum = defeatedBattles.reduce((acc, b) => acc + b.total_paid, 0);
  const totalSerasaScore = defeatedBattles.reduce((acc, b) => acc + b.rewards_serasa_score, 0);

  const recordVictory = (isCrit: boolean = true) => {
    const now = new Date();
    const timestampStr = `${now.toLocaleDateString('pt-BR')} às ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    
    // Check if this month is already recorded
    const alreadyLogged = defeatedBattles.some(b => b.boss_id === boss.id);
    if (!alreadyLogged) {
      const newRecord: DefeatedBattleRecord = {
        id: `battle-cleared-${Date.now()}`,
        boss_id: boss.id,
        boss_name: boss.boss_name,
        title: boss.title,
        month_name: boss.month_name || 'Novembro',
        month_number: boss.month_number || 11,
        threat_level: boss.threat_level,
        total_paid: boss.total_invoice_amount,
        defeated_at: timestampStr,
        strike_type: isCrit ? 'CRITICAL_STRIKE' : 'MANA_BURST',
        rewards_xp: boss.reward_xp,
        rewards_serasa_score: boss.reward_serasa_score,
        image_url: boss.image_url || '/assets/aistudio/Boss_Novembro_71620e11.jpg',
        cleared_by: 'Party Amorim & Granja (Iury & Ray)',
        note: 'Fatura integral quitada no vencimento sem cheque especial! Golpe crítico executado com sucesso.',
      };
      setDefeatedBattles(prev => [newRecord, ...prev]);
    }
  };

  const triggerAttackAnimation = (amount: number, isCrit: boolean = false) => {
    setIsAttacking(true);
    if (isCrit) {
      sounds.playCritical();
    } else {
      sounds.playAttack();
    }

    setFloatingDamage({
      id: Date.now(),
      text: `- R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      isCrit,
    });

    setTimeout(() => {
      setIsAttacking(false);
    }, 700);

    setTimeout(() => {
      setFloatingDamage(null);
    }, 1500);
  };

  const handleFullAttack = () => {
    triggerAttackAnimation(boss.current_hp, true);
    setTimeout(() => {
      recordVictory(true);
      onPayFullInvoice();
      sounds.playVictory();
      setActiveTab('victory');
    }, 800);
  };

  const handlePartialAttack = (amount: number) => {
    triggerAttackAnimation(amount, false);
    setTimeout(() => {
      const remaining = boss.current_hp - amount;
      onPayPartial(amount);
      if (remaining <= 0) {
        recordVictory(false);
        sounds.playVictory();
        setActiveTab('victory');
      }
    }, 500);
  };

  const handleSelectMonth = (monthNumber: number) => {
    sounds.playSelect();
    const found = YEARLY_BOSSES.find(b => b.month_number === monthNumber);
    if (found) {
      onSelectMonthBoss(found);
    }
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-7 sm:space-y-8">
      {/* 1. SELETOR ANUAL DOS 12 MESES (Bestiário do Calendário) */}
      <section className="bg-surface-container-low rounded-3xl p-5 sm:p-6 border border-surface-container-high shadow-xl flex flex-col space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed-dim text-[22px]">calendar_month</span>
            <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
              Boss do Mês • Ciclo dos 12 Desafios
            </span>
          </div>
          <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-bold border border-primary/20">
            {boss.month_name || 'Novembro'} • Nív. {boss.threat_level}
          </span>
        </div>

        {/* 12 Months Ribbon com mini-portais */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 no-scrollbar pt-0.5">
          {YEARLY_BOSSES.map((b) => {
            const isSelected = boss.month_number === b.month_number || (!boss.month_number && b.month_number === 11);
            const isLoggedDefeated = defeatedBattles.some(d => d.boss_id === b.id);
            const shortName = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][b.month_number - 1];

            return (
              <button
                key={b.id}
                onClick={() => handleSelectMonth(b.month_number)}
                className={`shrink-0 py-2.5 px-3 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer border min-w-[58px] ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-container border-primary font-bold shadow-[0_0_16px_rgba(242,191,80,0.45)] scale-105'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border-surface-container-highest shadow-xs'
                }`}
              >
                <span className="font-mono text-xs font-bold">{shortName}</span>
                <span className="text-[10px] font-mono opacity-80">Mês {b.month_number}</span>
                {isLoggedDefeated && (
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse" title="Expurgado" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Sub-navigation tabs: Arena / Bestiário / Batalhas Concluídas / Vitória (Grid 2x2 no mobile e 4 colunas no desktop sem sobreposição) */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 sm:p-2 bg-surface-container-low rounded-2xl border border-surface-container-high shadow-md">
        <button
          onClick={() => { sounds.playSelect(); setActiveTab('arena'); }}
          className={`w-full py-2.5 px-3 rounded-xl font-label-sm uppercase tracking-wider text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
            activeTab === 'arena'
              ? 'bg-primary-container text-on-primary-container font-bold border-primary shadow-[0_0_14px_rgba(242,191,80,0.3)]'
              : 'bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border-surface-container-highest'
          }`}
        >
          <span className="material-symbols-outlined text-[18px] shrink-0">swords</span>
          <span className="truncate">{vocab?.arena_titulo || 'Arena'}</span>
        </button>

        <button
          onClick={() => { sounds.playSelect(); setActiveTab('bestiary'); }}
          className={`w-full py-2.5 px-3 rounded-xl font-label-sm uppercase tracking-wider text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
            activeTab === 'bestiary'
              ? 'bg-primary-container text-on-primary-container font-bold border-primary shadow-[0_0_14px_rgba(242,191,80,0.3)]'
              : 'bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border-surface-container-highest'
          }`}
        >
          <span className="material-symbols-outlined text-[18px] shrink-0">menu_book</span>
          <span className="truncate">{vocab?.bestiario_titulo || 'Histórico'}</span>
        </button>

        <button
          onClick={() => { sounds.playSelect(); setActiveTab('completed_log'); }}
          className={`w-full py-2.5 px-3 rounded-xl font-label-sm uppercase tracking-wider text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
            activeTab === 'completed_log'
              ? 'bg-secondary-container text-on-secondary font-bold border-secondary shadow-[0_0_14px_rgba(0,238,252,0.35)]'
              : 'bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border-surface-container-highest'
          }`}
        >
          <span className="material-symbols-outlined text-[18px] shrink-0">workspace_premium</span>
          <span className="truncate">{vocab?.batalhas_concluidas || 'Concluídas'}</span>
          <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full shrink-0 font-bold ${
            activeTab === 'completed_log' 
              ? 'bg-on-secondary/15 text-on-secondary' 
              : 'bg-surface-container-highest text-secondary border border-secondary/30'
          }`}>
            {defeatedBattles.length}
          </span>
        </button>

        <button
          onClick={() => { sounds.playSelect(); setActiveTab('victory'); }}
          className={`w-full py-2.5 px-3 rounded-xl font-label-sm uppercase tracking-wider text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
            activeTab === 'victory'
              ? 'bg-primary-container text-on-primary-container font-bold border-primary shadow-[0_0_14px_rgba(242,191,80,0.3)]'
              : 'bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border-surface-container-highest'
          }`}
        >
          <span className="material-symbols-outlined text-[18px] shrink-0">military_tech</span>
          <span className="truncate">{isDefeated ? (vocab?.vitoria_titulo || 'Vitória') : 'Troféus'}</span>
        </button>
      </div>

      {/* VIEW 1: ARENA DE COMBATE (CRIATURA EM DESTAQUE) */}
      {activeTab === 'arena' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Main Boss Card Column */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-6">
            <section className={`relative w-full rounded-3xl overflow-hidden bg-surface-container-low shadow-[0_20px_48px_rgba(0,0,0,0.85)] border border-surface-container-high transition-transform duration-300 ${
              isAttacking ? 'scale-[0.99] ring-2 ring-error shadow-[0_0_40px_rgba(255,92,92,0.4)]' : ''
            }`}>
            {/* Ambient Element Glow */}
            <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-opacity ${
              isDefeated ? 'bg-secondary-container/20' : 'bg-error-container/30'
            }`} />

            {/* Floating Damage Text */}
            {floatingDamage && (
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-bounce">
                <div className={`px-4 py-2 rounded-2xl backdrop-blur-md shadow-2xl flex flex-col items-center border ${
                  floatingDamage.isCrit 
                    ? 'bg-error-container/95 text-on-error-container border-error text-xl font-bold font-mono tracking-tight'
                    : 'bg-primary-container/95 text-on-primary-container border-primary font-bold text-lg font-mono'
                }`}>
                  <span className="text-[11px] font-label-sm uppercase tracking-widest text-primary-fixed">
                    {floatingDamage.isCrit ? 'CRITICAL STRIKE!' : 'GOLPE DE MANA'}
                  </span>
                  <span>{floatingDamage.text}</span>
                </div>
              </div>
            )}

            {/* BOSS DISPLAY (CRIATURA EM PIXEL ART DO MÊS) */}
            <div className="relative w-full min-h-[300px] sm:min-h-[360px] bg-gradient-to-b from-[#090c21] to-surface-container-lowest overflow-hidden flex flex-col items-center justify-between p-5 pt-6">
              {/* Top Month & Threat Badges */}
              <div className="w-full flex items-center justify-between z-10 pb-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-surface-container-high/90 backdrop-blur-md border border-surface-container-highest shadow">
                  <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                  <span className="font-label-sm text-[11px] text-primary uppercase font-bold tracking-wider">
                    {boss.month_name} • Nív. {boss.threat_level}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-error-container/80 text-on-error-container font-label-sm text-[11px] font-bold shadow-md">
                  <span className="material-symbols-outlined text-[14px]">timer</span>
                  <span>{isDefeated ? 'Quitado 100%' : `${boss.days_remaining} Dias Restantes`}</span>
                </div>
              </div>

              {/* STANDALONE BOSS PIXEL ART IMAGE */}
              <div className="my-auto py-2 z-10 animate-float flex flex-col items-center">
                <BossSpriteRenderer
                  archetype={boss.sprite_archetype || 'november-titan-blackfriday'}
                  imageUrl={boss.image_url}
                  size="hero"
                  isDefeated={isDefeated}
                />
              </div>

              {/* Monster Title & Seasonal Theme Bar */}
              <div className="w-full flex flex-col items-center text-center z-10 pt-2 pb-1 space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-surface-container-high/80 border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-[14px]">paid</span>
                  <span className="font-label-sm text-[10px] text-primary-fixed-dim uppercase tracking-wider font-semibold">
                    {boss.month_theme || 'Desafio Financeiro'}
                  </span>
                </div>
                <h2 className="font-title text-xl sm:text-2xl font-bold text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] leading-normal">
                  {boss.boss_name}
                </h2>
                <p className="text-xs text-on-surface-variant max-w-sm leading-relaxed">
                  {boss.financial_origin}
                </p>
              </div>
            </div>

            {/* Boss HP Gauge */}
            <div className="p-5 sm:p-6 flex flex-col space-y-4 bg-surface-container-low border-t border-surface-container-high">
              <div className="flex justify-between items-end gap-2">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[22px] ${isDefeated ? 'text-secondary' : 'text-error animate-pulse'}`}>
                    {isDefeated ? 'shield' : 'heart_broken'}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-xs text-error font-bold uppercase tracking-wider">
                      HP DO BOSS (TOTAL DA FATURA DE {boss.month_name?.toUpperCase()})
                    </span>
                    <span className="text-[11px] text-on-surface-variant">
                      {isDefeated ? 'Dano mitigado com sucesso' : 'Dano direto caso não pago'}
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 shrink-0">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-on-surface">
                    R$ {boss.current_hp.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="font-mono text-xs text-on-surface-variant">
                    / R$ {boss.max_hp.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Segmented Boss HP Bar */}
              <div className="relative w-full h-5 rounded-2xl bg-surface-container-lowest p-0.5 overflow-hidden shadow-inner border border-surface-container-high">
                <div
                  className={`h-full rounded-xl transition-all duration-700 relative ${
                    isDefeated 
                      ? 'bg-secondary-container shadow-[0_0_12px_rgba(0,238,252,0.6)]' 
                      : 'bg-gradient-to-r from-error via-tertiary-container to-error shadow-[0_0_12px_rgba(255,92,92,0.6)]'
                  }`}
                  style={{ width: `${hpPercent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                </div>
                <div className="absolute inset-0 grid grid-cols-5 pointer-events-none opacity-40">
                  <div className="border-r border-surface-container-lowest" />
                  <div className="border-r border-surface-container-lowest" />
                  <div className="border-r border-surface-container-lowest" />
                  <div className="border-r border-surface-container-lowest" />
                  <div />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-label-sm pt-0.5">
                <span className="text-primary flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[15px]">shield</span>
                  {hpPercent.toFixed(1)}% Blindagem Residual
                </span>
                <span className={isDefeated ? 'text-secondary font-bold' : 'text-error flex items-center gap-1.5 font-bold'}>
                  <span className="material-symbols-outlined text-[15px]">bolt</span>
                  {isDefeated ? 'Maldição Anulada' : `Berserk em ${boss.days_remaining} ciclos`}
                </span>
              </div>
            </div>

            {/* Budget Defense HP Bar (HP do Orçamento Mensal) */}
            <div className="px-5 sm:px-6 pb-5 sm:pb-6 flex flex-col bg-surface-container-low">
              <div className="p-4 sm:p-5 rounded-2xl bg-surface-container-high/60 border border-surface-container-highest flex flex-col space-y-2.5">
                <div className="flex justify-between items-center text-xs font-label-sm">
                  <div className="flex items-center gap-2 text-on-surface">
                    <span className="material-symbols-outlined text-primary text-[18px]">health_and_safety</span>
                    <span className="uppercase font-bold">HP do Orçamento Mensal (Defesa da Guilda)</span>
                  </div>
                  <span className={`font-bold ${budgetHpPercent < 35 ? 'text-error animate-pulse' : 'text-primary'}`}>
                    {budgetHpPercent.toFixed(1)}% {budgetHpPercent < 35 ? '(ESTADO CRÍTICO!)' : ''}
                  </span>
                </div>

                <div className="relative w-full h-4.5 rounded-xl bg-surface-container-lowest p-0.5 overflow-hidden">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-error via-surface-tint to-primary transition-all duration-500 shadow-[0_0_10px_rgba(245,194,83,0.5)]"
                    style={{ width: `${budgetHpPercent}%` }}
                  />
                  <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-30">
                    <div className="border-r border-surface-container-lowest" />
                    <div className="border-r border-surface-container-lowest" />
                    <div className="border-r border-surface-container-lowest" />
                    <div />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-outline font-mono">
                  <span>Defesa Atual: R$ {boss.budget_defense_hp.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <span>Teto Mensal: R$ {boss.budget_defense_max.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </section>

          {/* COMPOSIÇÃO DAS FATURAS UNIFICADAS DO BOSS (Identificação por Titular) */}
          <section className="bg-surface-container/90 rounded-3xl p-5 sm:p-6 border border-surface-container-high shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">credit_card</span>
                <h3 className="font-title text-sm sm:text-base font-bold text-on-surface">
                  Composição da Fatura Unificada ({boss.month_name})
                </h3>
              </div>
              <span className="font-mono text-xs text-primary font-bold px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                Total Boss: R$ {boss.total_invoice_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. Fatura da Ray (Maga Lunar) */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-secondary/30 flex flex-col justify-between space-y-2.5 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src="/assets/aistudio/Ray_284119bd.jpg" alt="Ray" className="w-8 h-8 rounded-lg object-cover border border-secondary/50 shrink-0" />
                    <div>
                      <span className="font-title text-xs font-bold text-on-surface block leading-tight">Fatura Ray</span>
                      <span className="text-[10px] text-secondary font-mono">Nubank Ultravioleta</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-secondary">
                    R$ 1.210,00 (35.4%)
                  </span>
                </div>

                <div className="pt-2 border-t border-surface-container-high/80 text-[11px] text-outline font-mono space-y-1">
                  <div className="flex justify-between"><span>• Cursos & Softwares IA:</span><span className="text-on-surface font-semibold">R$ 450,00</span></div>
                  <div className="flex justify-between"><span>• Farmácia & Saúde:</span><span className="text-on-surface font-semibold">R$ 380,00</span></div>
                  <div className="flex justify-between"><span>• Cuidados & Vestuário:</span><span className="text-on-surface font-semibold">R$ 380,00</span></div>
                </div>
              </div>

              {/* 2. Fatura do Iury (Guerreiro Solar) */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-primary/30 flex flex-col justify-between space-y-2.5 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src="/assets/aistudio/Iury2_197a4062.jpg" alt="Iury" className="w-8 h-8 rounded-lg object-cover border border-primary/50 shrink-0" />
                    <div>
                      <span className="font-title text-xs font-bold text-on-surface block leading-tight">Fatura Iury</span>
                      <span className="text-[10px] text-primary font-mono">Itaú Personnalité Black</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-primary">
                    R$ 1.980,00 (57.9%)
                  </span>
                </div>

                <div className="pt-2 border-t border-surface-container-high/80 text-[11px] text-outline font-mono space-y-1">
                  <div className="flex justify-between"><span>• Monitor Ultra-Arcano:</span><span className="text-on-surface font-semibold">R$ 1.200,00</span></div>
                  <div className="flex justify-between"><span>• Combustível & Transporte:</span><span className="text-on-surface font-semibold">R$ 480,00</span></div>
                  <div className="flex justify-between"><span>• Hardware & Nuvem:</span><span className="text-on-surface font-semibold">R$ 300,00</span></div>
                </div>
              </div>
            </div>

            {/* Fatura Compartilhada do Casal */}
            <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high flex items-center justify-between text-xs">
              <span className="text-outline font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[16px]">diversity_3</span>
                Despesas Compartilhadas do Casal (Supermercado / Casa):
              </span>
              <span className="font-mono text-primary font-bold">
                R$ 230,00 (6.7%)
              </span>
            </div>
          </section>
          </div>

          {/* Right Column: Combat Commands (Painel Tático de Ações) */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-6 lg:sticky lg:top-24">
            <section className="flex flex-col space-y-5 bg-surface-container/90 rounded-3xl p-5 sm:p-6 border border-surface-container-high shadow-2xl">
              <div className="flex items-center justify-between border-b border-surface-container-high pb-3.5">
                <span className="font-label-sm uppercase text-xs text-primary font-bold tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">swords</span>
                  Comandos de Combate ({boss.month_name})
                </span>
                <span className="text-[11px] font-label-sm text-secondary bg-surface-container-high px-2.5 py-0.5 rounded-full border border-secondary/20">
                  Vencimento: {boss.due_date}
                </span>
              </div>

              {/* Ultimate Command */}
              <button
                onClick={handleFullAttack}
                disabled={isDefeated}
                className={`w-full relative overflow-hidden rounded-2xl p-4 sm:p-5 flex items-center justify-between transition-all group active:scale-95 shadow-lg ${
                  isDefeated
                    ? 'bg-surface-container-high text-outline cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-primary-container via-surface-tint to-primary text-on-primary-container shadow-[0_8px_24px_rgba(242,191,80,0.35)] hover:shadow-[0_8px_32px_rgba(242,191,80,0.5)] cursor-pointer hover:brightness-105'
                }`}
              >
                <div className="flex items-center gap-3.5 z-10">
                  <div className="w-12 h-12 rounded-xl bg-on-primary-container/20 flex items-center justify-center text-on-primary-container group-hover:rotate-12 transition-transform">
                    <span className="material-symbols-outlined text-[28px]">swords</span>
                  </div>
                  <div className="flex flex-col text-left space-y-0.5">
                    <span className="font-title text-sm sm:text-base font-bold leading-normal flex items-center gap-2">
                      {vocab?.pagar_total || 'Lançar Contra-Ataque Integral'}
                      <span className="text-[10px] font-label-sm bg-on-primary-container/20 px-2 py-0.5 rounded font-bold">
                        CRÍTICO
                      </span>
                    </span>
                    <span className="font-label-sm text-xs opacity-90 uppercase">
                      {vocab?.hp_fatura || 'Valor da Fatura'} • R$ {boss.current_hp.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 z-10 bg-on-primary-container/15 px-3 py-1.5 rounded-xl">
                  <span className="font-label-sm text-xs font-bold text-on-primary-container">
                    +{boss.reward_xp} XP
                  </span>
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </div>
              </button>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  onClick={() => handlePartialAttack(500)}
                  disabled={isDefeated}
                  className="p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container-high border border-surface-container-high transition-all flex items-center gap-3 text-left text-on-surface cursor-pointer shadow-sm active:scale-95"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary-container shrink-0">
                    <span className="material-symbols-outlined text-[20px]">shield</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-xs font-bold text-secondary truncate">
                      Escudo de Mana
                    </span>
                    <span className="text-[11px] text-on-surface-variant truncate">
                      Antecipar R$ 500,00
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => handlePartialAttack(1000)}
                  disabled={isDefeated}
                  className="p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container-high border border-surface-container-high transition-all flex items-center gap-3 text-left text-on-surface cursor-pointer shadow-sm active:scale-95"
                >
                  <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary shrink-0">
                    <span className="material-symbols-outlined text-[20px]">bolt</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-xs font-bold text-tertiary truncate">
                      Golpe Duplo Solar
                    </span>
                    <span className="text-[11px] text-on-surface-variant truncate">
                      Antecipar R$ 1.000,00
                    </span>
                  </div>
                </button>
              </div>

              {/* Reset simulator & Completed Log Direct CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-surface-container-high">
                <button
                  onClick={() => { sounds.playSelect(); setActiveTab('completed_log'); }}
                  className="text-xs font-label-sm text-secondary hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">history_edu</span>
                  Ver Histórico de Batalhas Concluídas ({defeatedBattles.length})
                </button>
                <button
                  onClick={onResetBoss}
                  className="text-xs font-label-sm text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                  Restaurar HP deste Boss
                </button>
              </div>
            </section>
          </div>

          {/* SEÇÃO DE FATURAS RECORRENTES FIXAS (MINI BOSSES MENSAIS) */}
          <section className="col-span-1 lg:col-span-12 bg-surface-container-low rounded-3xl p-5 sm:p-7 border border-surface-container-high shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-container-high">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 text-primary border border-primary/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">pest_control</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-title font-bold text-on-surface flex items-center gap-2">
                    Faturas Recorrentes Fixas • Mini Bosses do Mês
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-surface-container-high text-secondary border border-secondary/20">
                      {miniBosses.filter(m => !m.isPaid).length} Ativos
                    </span>
                  </h3>
                  <p className="text-xs text-outline">
                    Custos fixos mensais essenciais (energia, internet, água, condomínio). Expurgue-os antes do vencimento para manter as muralhas da guilda intactas!
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-mono text-outline">Total Recorrente:</span>
                <span className="text-xs font-mono font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
                  R$ {miniBosses.reduce((acc, m) => acc + m.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Grid dos Mini Bosses com Indicadores de Dias Restantes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {miniBosses.map((mini) => {
                const isUrgent = mini.daysRemaining <= 5 && !mini.isPaid;
                const isWarning = mini.daysRemaining <= 10 && !mini.isPaid;

                return (
                  <div
                    key={mini.id}
                    className={`rounded-2xl p-4 border transition-all flex flex-col justify-between space-y-3 ${
                      mini.isPaid
                        ? 'bg-surface-container-high/40 border-surface-container-high opacity-70'
                        : isUrgent
                          ? 'bg-surface-container border-error/50 shadow-[0_0_16px_rgba(255,92,92,0.25)]'
                          : 'bg-surface-container border-surface-container-highest hover:border-outline-variant shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Top status & days remaining */}
                      <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-outline font-semibold">
                          {mini.service}
                        </span>
                        <div className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                          mini.isPaid
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : isUrgent
                              ? 'bg-error-container text-on-error-container animate-pulse'
                              : isWarning
                                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                : 'bg-surface-container-high text-secondary border border-secondary/20'
                        }`}>
                          <span className="material-symbols-outlined text-[12px]">
                            {mini.isPaid ? 'check_circle' : 'timer'}
                          </span>
                          <span>
                            {mini.isPaid ? 'EXPURGADO' : `${mini.daysRemaining} DIAS RESTANTES`}
                          </span>
                        </div>
                      </div>

                      {/* Mini Boss Name and Value */}
                      <div className="flex items-center gap-3 my-2.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                          mini.isPaid
                            ? 'bg-surface-container text-outline border-surface-container-high'
                            : isUrgent
                              ? 'bg-error/20 text-error border-error/40'
                              : 'bg-primary/15 text-primary border-primary/30'
                        }`}>
                          <span className="material-symbols-outlined text-[22px]">{mini.icon}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-title text-sm font-bold text-on-surface truncate">
                            {mini.name}
                          </h4>
                          <span className="font-mono text-base font-bold text-on-surface block">
                            R$ {mini.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-outline line-clamp-1">
                        {mini.description}
                      </p>
                    </div>

                    {/* Bottom: Responsible guardian and Action Button */}
                    <div className="pt-2.5 border-t border-surface-container-high/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <img src={mini.payerAvatar} alt={mini.payerName} className="w-5 h-5 rounded-full object-cover border border-primary/40 shrink-0" />
                        <span className="text-[10px] font-mono text-outline truncate">{mini.payerName}</span>
                      </div>

                      <button
                        onClick={() => {
                          if (!mini.isPaid) {
                            sounds.playCritical();
                            setMiniBosses(prev => prev.map(m => m.id === mini.id ? { ...m, isPaid: true } : m));
                          }
                        }}
                        disabled={mini.isPaid}
                        className={`px-3 py-1.5 rounded-xl font-label-sm text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          mini.isPaid
                            ? 'bg-surface-container-highest text-outline cursor-default'
                            : 'bg-primary-container text-on-primary-container shadow-md hover:brightness-105 active:scale-95'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {mini.isPaid ? 'verified' : 'bolt'}
                        </span>
                        <span>{mini.isPaid ? 'Pago ✓' : 'Expurgar Conta'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* VIEW 2: BESTIÁRIO ARCANO DOS 12 MESES (GALERIA COM AS 12 CRIATURAS) */}
      {activeTab === 'bestiary' && (
        <div className="flex flex-col space-y-6 sm:space-y-7">
          {/* Header */}
          <div className="p-5 sm:p-6 rounded-3xl bg-surface-container/90 border border-surface-container-high shadow-2xl flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-3.5 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">menu_book</span>
                <h3 className="font-title text-sm sm:text-base font-bold text-primary uppercase tracking-wider leading-normal">
                  Bestiário Anual dos 12 Meses
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-secondary text-xs font-label-sm uppercase font-bold border border-secondary/20">
                12 / 12 Criaturas Catalogadas
              </span>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Cada criatura personifica a ameaça financeira correspondente da vida real. Selecione qualquer criatura para levá-la à Arena de Combate.
            </p>
          </div>

          {/* 12 BOSSES GRID SHOWCASE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {YEARLY_BOSSES.map((b) => {
              const isCurrent = boss.id === b.id;
              const isLogged = defeatedBattles.some(d => d.boss_id === b.id);

              return (
                <div
                  key={b.id}
                  onClick={() => {
                    sounds.playSelect();
                    onSelectMonthBoss(b);
                    setActiveTab('arena');
                  }}
                  className={`p-4 sm:p-5 rounded-3xl bg-surface-container-low border transition-all cursor-pointer flex flex-col justify-between space-y-3.5 shadow-md hover:scale-[1.01] ${
                    isCurrent
                      ? 'border-primary shadow-[0_0_24px_rgba(242,191,80,0.35)] bg-surface-container ring-1 ring-primary/40'
                      : 'border-surface-container-high hover:border-surface-container-highest'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-label-sm text-[11px] text-primary uppercase font-bold tracking-wider">
                        Mês {b.month_number} • {b.month_name}
                      </span>
                      <h4 className="font-title text-sm font-bold text-on-surface leading-normal mt-0.5">
                        {b.boss_name}
                      </h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-surface-container-high font-mono text-[11px] text-error font-bold border border-error/20">
                      Nív. {b.threat_level}
                    </span>
                  </div>

                  {/* AUTHENTIC CREATURE PIXEL ART DISPLAY */}
                  <div className="w-full h-44 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex items-center justify-center relative overflow-hidden group">
                    <img
                      src={b.image_url}
                      alt={b.boss_name}
                      className="w-full h-full object-cover pixel-art transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-2 left-2.5 text-[10px] font-mono text-primary-fixed font-semibold px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs">
                      {b.month_theme}
                    </span>
                    {isLogged && (
                      <span className="absolute top-2 right-2.5 text-[10px] font-mono font-bold text-secondary-fixed bg-surface-container-lowest/90 px-2 py-0.5 rounded-full border border-secondary/40 shadow-sm flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" />
                        EXPURGADO
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
                    {b.financial_origin}
                  </p>

                  <div className="pt-3 border-t border-surface-container-high flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-label-sm text-outline uppercase">Fatura Estimada</span>
                      <span className="font-mono text-sm font-bold text-error">
                        R$ {b.total_invoice_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <button
                      className={`py-2 px-3.5 rounded-xl font-label-sm text-xs uppercase font-bold flex items-center gap-1.5 cursor-pointer shadow-sm ${
                        isCurrent
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-surface-container-high text-on-surface hover:bg-surface-bright border border-surface-container-highest'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">swords</span>
                      <span>{isCurrent ? 'Na Arena' : 'Desafiar'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: LOG DE BATALHAS CONCLUÍDAS (FATURAS QUITADAS COM HISTÓRICO) */}
      {activeTab === 'completed_log' && (
        <div className="flex flex-col space-y-6 sm:space-y-7 animate-fade-in">
          {/* Header Summary Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-surface-container/90 border border-surface-container-high shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary-fixed-dim text-[24px]">workspace_premium</span>
                <h3 className="font-title text-base sm:text-lg font-bold text-secondary uppercase tracking-wider leading-normal">
                  Log de Batalhas Concluídas
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-secondary text-xs font-label-sm uppercase font-bold border border-secondary/25">
                {defeatedBattles.length} Vitórias Registradas
              </span>
            </div>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Registro imutável dos chefões e faturas mensais completamente abatidos pela Guilda, com timestamps de quitação, valores expurgados e recompensas celestiais colhidas.
            </p>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high flex flex-col space-y-1">
                <span className="text-[10px] font-label-sm uppercase text-outline">Total de Dívidas Quitadas</span>
                <span className="font-mono text-lg sm:text-xl font-bold text-secondary-fixed leading-normal">
                  R$ {totalPaidSum.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-secondary">Sem rotativo ou juros</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high flex flex-col space-y-1">
                <span className="text-[10px] font-label-sm uppercase text-outline">Bosses Expurgados</span>
                <span className="font-mono text-lg sm:text-xl font-bold text-primary-fixed leading-normal">
                  {defeatedBattles.length} de 12
                </span>
                <span className="text-[10px] text-primary">Calendário Astral</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high flex flex-col space-y-1">
                <span className="text-[10px] font-label-sm uppercase text-outline">Score Místico Protegido</span>
                <span className="font-mono text-lg sm:text-xl font-bold text-secondary leading-normal">
                  +{totalSerasaScore} pts
                </span>
                <span className="text-[10px] text-outline">Selo Serasa Blindado</span>
              </div>
            </div>
          </div>

          {/* List of Defeated Battles */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between px-1 text-xs text-outline font-label-sm uppercase">
              <span>Crônicas de Quitação ({defeatedBattles.length})</span>
              <span>Classificação de Combate</span>
            </div>

            {defeatedBattles.map((rec) => (
              <div
                key={rec.id}
                className="p-5 sm:p-6 rounded-3xl bg-surface-container-low border border-surface-container-high shadow-xl flex flex-col space-y-4 hover:border-secondary/40 transition-all relative overflow-hidden"
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-secondary-container/5 rounded-full blur-2xl pointer-events-none" />

                {/* Top Row: Month, Threat, and Timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-surface-container-high">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg font-bold bg-surface-container-high text-primary border border-primary/20">
                      MÊS {rec.month_number} • {rec.month_name.toUpperCase()}
                    </span>
                    <span className="font-label-sm text-[11px] text-error font-bold px-2 py-0.5 rounded bg-error-container/30">
                      Nív. {rec.threat_level}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-outline">
                    <span className="material-symbols-outlined text-[15px] text-secondary">schedule</span>
                    <span>Quitado em {rec.defeated_at}</span>
                  </div>
                </div>

                {/* Creature Thumbnail & Details */}
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-secondary/30 shadow-md">
                    <img
                      src={rec.image_url}
                      alt={rec.boss_name}
                      className="w-full h-full object-cover pixel-art"
                    />
                    <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0 space-y-1">
                    <h4 className="font-title text-base sm:text-lg font-bold text-on-surface leading-normal">
                      {rec.boss_name}
                    </h4>
                    <p className="text-xs text-outline leading-snug">
                      {rec.title}
                    </p>
                    {rec.note && (
                      <p className="text-[11px] text-secondary-fixed leading-relaxed pt-1">
                        🛡️ {rec.note}
                      </p>
                    )}
                    <span className="text-[10px] text-outline font-label-sm uppercase pt-0.5">
                      Combatentes: {rec.cleared_by}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Financial Quittance & Rewards */}
                <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-label-sm uppercase text-outline">Valor Total Quitado</span>
                    <span className="font-mono text-base sm:text-lg font-bold text-secondary-fixed leading-normal">
                      R$ {rec.total_paid.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-xl bg-primary-container/20 text-primary-fixed font-mono text-xs font-bold border border-primary/30">
                      +{rec.rewards_xp} XP
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-secondary-container/20 text-secondary-fixed font-mono text-xs font-bold border border-secondary/30">
                      +{rec.rewards_serasa_score} Score
                    </span>
                    <span className="px-3 py-1 rounded-xl bg-secondary-container text-on-secondary font-label-sm text-[11px] uppercase font-bold shadow-sm">
                      100% PAGO ✨
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: TELA DE VITÓRIA / EXPURGADO */}
      {activeTab === 'victory' && (
        <div className="flex flex-col space-y-6 sm:space-y-7 animate-fade-in">
          {/* Victory Banner */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-primary-container/20 to-surface-container-low border border-primary/40 flex flex-col items-center text-center space-y-3 shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-xs uppercase font-bold shadow-md">
              <span className="material-symbols-outlined text-[18px]">stars</span>
              <span>Ameaça de {boss.month_name} Banida ao Vácuo</span>
            </div>

            <h2 className="font-title text-2xl sm:text-3xl font-bold text-primary uppercase tracking-normal leading-normal drop-shadow-md">
              Vitória Alcançada!
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-md leading-relaxed">
              O <strong className="text-primary">{boss.boss_name}</strong> foi completamente abatido pelo poder coletivo da guilda! A fatura de R$ {boss.total_invoice_amount.toFixed(2)} foi quitada e arquivada nas Batalhas Concluídas.
            </p>

            {/* Defeated Creature Display */}
            <div className="relative w-full max-w-sm h-64 rounded-2xl overflow-hidden mt-3 bg-surface-container-lowest border border-surface-container-high flex flex-col items-center justify-center p-2">
              <img
                src={boss.image_url}
                alt={boss.boss_name}
                className="w-full h-full object-cover rounded-xl pixel-art grayscale contrast-75 brightness-75"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="transform -rotate-6 bg-error-container/95 border border-error px-4 py-2 rounded-2xl shadow-2xl">
                  <span className="font-mono text-sm sm:text-base font-extrabold text-on-error-container uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">dangerous</span> FATURA QUITADA!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Victory Loot Grid */}
          <div className="p-5 sm:p-6 rounded-3xl bg-surface-container/90 border border-surface-container-high shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">military_tech</span>
                <span className="font-title text-sm sm:text-base font-bold text-primary uppercase leading-normal">
                  Tesouro da Batalha de {boss.month_name}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-surface-container-high text-secondary font-label-sm text-xs font-bold border border-secondary/25">
                RANK S • CRÍTICO
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between border border-surface-container-high">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary-fixed-dim shrink-0">
                    <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-on-surface">+{boss.reward_xp} XP de Guilda</p>
                    <p className="text-[11px] text-primary">Fortalece o Santuário Astral</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-primary bg-primary-container/20 px-2.5 py-1 rounded-lg">
                  VITÓRIA!
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low flex items-center justify-between border border-surface-container-high">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary-container shrink-0">
                    <span className="material-symbols-outlined text-[22px]">shield_with_heart</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-on-surface">+{boss.reward_serasa_score} Selo Serasa</p>
                    <p className="text-[11px] text-on-surface-variant">Proteção contra negativação cósmica</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-secondary bg-secondary-container/20 px-2.5 py-1 rounded-lg">
                  +{boss.reward_serasa_score} pts
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <button
              onClick={() => { sounds.playSelect(); setActiveTab('completed_log'); }}
              className="py-3.5 px-4 bg-secondary-container text-on-secondary font-title text-xs uppercase font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:brightness-105"
            >
              <span className="material-symbols-outlined text-[20px]">history_edu</span>
              <span>Ver no Log de Concluídas</span>
            </button>

            <button
              onClick={() => { sounds.playSelect(); setActiveTab('arena'); }}
              className="py-3.5 px-4 bg-surface-container-high hover:bg-surface-bright text-on-surface font-title text-xs uppercase font-bold rounded-2xl border border-surface-container-highest shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">swords</span>
              <span>Retornar à Arena</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Guild, Character, BossFight, Transaction, Quest } from '../types/game';
import { BossSpriteRenderer } from './BossSpriteRenderer';
import { sounds } from '../utils/soundEffects';
import { VocabularyTerms, DifficultyLevel } from '../utils/difficultyVocabulary';

interface GuildDashboardProps {
  guild: Guild;
  characters: Character[];
  boss: BossFight;
  transactions: Transaction[];
  quests: Quest[];
  onNavigateToBattle: () => void;
  onNavigateToGrimoire: () => void;
  onNavigateToQuests: () => void;
  onNavigateToMembers?: () => void;
  onClaimQuest: (questId: string) => void;
  onOpenAIChat?: (initialPrompt?: string) => void;
  vocab?: VocabularyTerms;
  difficulty?: DifficultyLevel;
}

export const GuildDashboard: React.FC<GuildDashboardProps> = ({
  guild,
  characters,
  boss,
  transactions,
  quests,
  onNavigateToBattle,
  onNavigateToGrimoire,
  onNavigateToQuests,
  onNavigateToMembers,
  onClaimQuest,
  onOpenAIChat,
  vocab,
  difficulty = 'medio',
}) => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const hpPercent = Math.max(0, Math.min(100, (boss.current_hp / boss.max_hp) * 100));
  const isBossDefeated = boss.current_hp <= 0;

  return (
    <div className="flex flex-col w-full pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start w-full">
        {/* Left Column: Treasury, Party & Boss Fight & Quests */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-6 sm:space-y-8">
          {/* 1. GUILD HEADER (Resumo do Tesouro & Party) */}
          <section className="flex flex-col w-full bg-surface-container/90 rounded-3xl p-5 sm:p-6 shadow-2xl border border-surface-container-high relative overflow-hidden space-y-5">
            {/* Glow Effects */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary-container/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Window: Title & Status */}
            <div className="flex items-center justify-between pb-3.5 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed-dim text-[22px]">stars</span>
                <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
                  {vocab?.guild_level || 'Tesouro da Guilda'}
                </span>
              </div>
              <span className="font-label-sm text-[11px] px-3 py-1 rounded-full bg-surface-container-high text-secondary flex items-center gap-2 border border-secondary/25 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim animate-pulse" />
                {guild.cycle_name}
              </span>
            </div>

            {/* Total Net Balance (Saldo Líquido Astral) */}
            <div className="flex flex-col gap-1.5 my-1">
              <span className="font-label-sm text-xs text-outline uppercase tracking-wider font-medium">
                {vocab?.mana_liquida || 'Saldo Líquido Astral (Mana Disponível)'}
              </span>
              <div className="flex items-baseline justify-between flex-wrap gap-x-3 gap-y-2">
                <h2 className="font-mono text-3xl sm:text-4xl font-extrabold text-primary tracking-tight drop-shadow-[0_2px_12px_rgba(245,194,83,0.35)]">
                  R$ {guild.total_net_mana.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </h2>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container-lowest text-secondary text-xs font-mono border border-surface-container-high shadow-inner">
                  <span className="material-symbols-outlined text-[16px] text-secondary">trending_up</span>
                  <span>+ R$ 2.450 neste ciclo</span>
                </div>
              </div>
            </div>

            {/* QUADRO DE PREVISÃO MENSAL (Entradas Previstas vs Despesas Previstas) */}
            <div className="bg-surface-container-lowest/90 rounded-2xl p-4 sm:p-5 border border-surface-container-high shadow-lg flex flex-col gap-3.5 relative overflow-hidden">
              <div className="flex items-center justify-between pb-2.5 border-b border-surface-container-high/80">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[20px]">troubleshoot</span>
                  <span className="font-label-sm text-xs uppercase tracking-wider font-bold text-on-surface">
                    Previsão Astral do Ciclo Mensal
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary-container/20 text-secondary border border-secondary/30 font-bold">
                  PADRÕES RECORRENTES
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* 1. Saldo Previsto a Entrar */}
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-emerald-500/30 flex flex-col justify-between space-y-2 relative overflow-hidden group hover:border-emerald-500/60 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">arrow_downward_alt</span>
                      Saldo Previsto a Entrar
                    </span>
                    <span className="text-[10px] font-mono text-outline">Salários & Fixo</span>
                  </div>

                  <div>
                    <span className="font-mono text-xl sm:text-2xl font-bold text-emerald-300 tracking-tight">
                      R$ 10.700,00
                    </span>
                    <div className="flex flex-col gap-0.5 mt-2 text-[11px] text-outline font-mono">
                      <div className="flex justify-between">
                        <span>• Salário Iury (Fixo Solar):</span>
                        <span className="text-on-surface font-semibold">R$ 6.500,00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Salário Ray (Design Lunar):</span>
                        <span className="text-on-surface font-semibold">R$ 4.200,00</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Despesa Prevista */}
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-rose-500/30 flex flex-col justify-between space-y-2 relative overflow-hidden group hover:border-rose-500/60 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">arrow_upward_alt</span>
                      Despesa Prevista
                    </span>
                    <span className="text-[10px] font-mono text-outline">Faturas & Contas</span>
                  </div>

                  <div>
                    <span className="font-mono text-xl sm:text-2xl font-bold text-rose-300 tracking-tight">
                      R$ 7.700,00
                    </span>
                    <div className="flex flex-col gap-0.5 mt-2 text-[11px] text-outline font-mono">
                      <div className="flex justify-between">
                        <span>• Faturas de Cartão (Boss):</span>
                        <span className="text-on-surface font-semibold">R$ 3.420,00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Contas Fixas (Mini Bosses):</span>
                        <span className="text-on-surface font-semibold">R$ 2.450,00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Despesas Variáveis Estimadas:</span>
                        <span className="text-on-surface font-semibold">R$ 1.830,00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barra de Saldo Líquido Projetado */}
              <div className="p-2.5 rounded-xl bg-surface-container-high/60 border border-surface-container-highest flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[17px]">account_balance_wallet</span>
                  <span className="font-label-sm text-outline font-medium">Sobra Prevista para Investimentos & Reserva:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm sm:text-base font-bold text-primary">
                    + R$ 3.000,00
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold border border-primary/20">
                    28.0% Margem Livre
                  </span>
                </div>
              </div>
            </div>

            {/* Party HUD Members with Full Bust Pixel Art Presentation */}
            <div className="flex flex-col gap-3.5 pt-3 border-t border-surface-container-high">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">groups</span>
                  <span className="font-label-sm text-xs text-outline uppercase tracking-wider font-bold">
                    {vocab?.party_members || 'Membros da Party'} ({characters.length})
                  </span>
                </div>
                {onNavigateToMembers && (
                  <button
                    type="button"
                    onClick={() => { sounds.playSelect(); onNavigateToMembers(); }}
                    className="text-xs text-primary hover:text-white font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    title={vocab?.gerenciar_membros || 'Gerenciar Guardiões'}
                  >
                    <span className="material-symbols-outlined text-[16px]">person_add</span>
                    <span className="hidden sm:inline">{vocab?.gerenciar_membros || 'Gerenciar Guardiões'}</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {characters.map((char) => {
                  const isLunar = char.element === 'LUNAR';
                  return (
                    <div
                      key={char.id}
                      onClick={() => { sounds.playSpell(); setSelectedCharacter(char); }}
                      className={`group relative flex items-stretch gap-3.5 p-3.5 rounded-2xl bg-surface-container-lowest/90 border transition-all duration-300 cursor-pointer hover:scale-[1.02] shadow-md overflow-hidden ${
                        isLunar
                          ? 'border-secondary/40 hover:border-secondary hover:shadow-[0_0_20px_rgba(0,238,252,0.3)]'
                          : 'border-primary/40 hover:border-primary hover:shadow-[0_0_20px_rgba(242,191,80,0.3)]'
                      }`}
                    >
                      {/* Subtle Element Gradient Background */}
                      <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-xl pointer-events-none opacity-40 transition-opacity group-hover:opacity-80 ${
                        isLunar ? 'bg-secondary-container' : 'bg-primary-container'
                      }`} />

                      {/* BUSTO COMPLETO EM PIXEL ART */}
                      <div className={`relative w-24 sm:w-28 h-32 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border bg-surface-container-high shadow-lg ${
                        isLunar ? 'border-secondary/50' : 'border-primary/50'
                      }`}>
                        <img
                          src={char.avatar_url}
                          alt={`${char.name} - Busto Completo em Pixel Art`}
                          className="w-full h-full object-cover object-top pixel-art filter contrast-110 saturate-110 group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Character Stats & Lore Column */}
                      <div className="flex flex-col justify-between min-w-0 flex-1 py-0.5 z-10">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-title text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                              {char.name}
                            </span>
                            <span className={`font-mono text-xs font-bold shrink-0 ${isLunar ? 'text-secondary' : 'text-primary'}`}>
                              NÍV. {char.level}
                            </span>
                          </div>
                          <span className={`font-label-sm text-[10px] font-semibold uppercase tracking-wider block mt-0.5 ${
                            isLunar ? 'text-secondary-fixed-dim' : 'text-primary-fixed-dim'
                          }`}>
                            {char.class_name}
                          </span>
                          <span className="text-[11px] text-outline truncate block mt-0.5">
                            {char.title}
                          </span>
                        </div>

                        <div className="flex flex-col gap-1 mt-2">
                          <div className="w-full h-2 rounded-full bg-surface-container-high overflow-hidden relative">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isLunar
                                  ? 'bg-gradient-to-r from-secondary-fixed-dim to-secondary shadow-[0_0_8px_rgba(0,238,252,0.4)]'
                                  : 'bg-gradient-to-r from-primary-fixed-dim to-primary shadow-[0_0_8px_rgba(242,191,80,0.4)]'
                              }`}
                              style={{ width: `${(char.xp / char.xp_max) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] font-mono text-outline">
                            <span>XP: {char.xp} / {char.xp_max}</span>
                            <span className="text-on-surface font-semibold">Inspecionar</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guild Quick Action */}
            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <button
                onClick={() => { sounds.playSpell(); onNavigateToBattle(); }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-primary-container text-on-primary-container font-label-sm text-xs uppercase font-bold transition-transform active:scale-95 shadow-md cursor-pointer hover:brightness-105"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>{vocab?.tab_batalhas || 'Enfrentar Boss'}</span>
              </button>
              <button
                onClick={() => { sounds.playSelect(); onNavigateToGrimoire(); }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-surface-container-high text-on-surface hover:bg-surface-bright font-label-sm text-xs uppercase transition-transform active:scale-95 border border-surface-container-highest cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                <span>{vocab?.tab_grimorio || 'Abrir Grimório'}</span>
              </button>
            </div>
          </section>

          {/* 2. PAINEL DE "BOSS FIGHT" (Faturas & Orçamento) */}
          <section className="flex flex-col w-full bg-surface-container-low rounded-3xl p-5 sm:p-6 shadow-2xl border border-surface-container-high relative overflow-hidden space-y-4">
            <div className="absolute -top-16 -left-16 w-52 h-52 bg-error/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-error-container text-on-error-container shadow-sm">
                <span className="material-symbols-outlined text-[16px] animate-bounce">local_fire_department</span>
                <span className="font-label-sm text-xs tracking-wider uppercase font-bold">
                  {vocab?.fatura_mes || 'Boss do Mês'}
                </span>
              </div>
              <span className="font-label-sm text-[11px] text-error px-2.5 py-0.5 rounded-full bg-surface-container-lowest border border-error/25 font-bold">
                {isBossDefeated ? 'EXPURGADO' : 'NÍV. 30 AMEDRONTADOR'}
              </span>
            </div>

            {/* Monster Snapshot */}
            <div className="flex gap-4 items-center p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container-high">
              <img
                src={boss.image_url || boss.avatar_url || '/assets/aistudio/Boss_Novembro_71620e11.jpg'}
                alt={boss.boss_name}
                className={`w-[90px] h-[90px] rounded-2xl object-cover shrink-0 pixel-art border border-primary/30 shadow-[0_8px_24px_rgba(0,0,0,0.7)] transition-transform hover:scale-105 ${
                  isBossDefeated ? 'grayscale contrast-75 brightness-75' : ''
                }`}
                style={{ width: '90px', height: '90px' }}
              />

              <div className="flex flex-col min-w-0 flex-1 justify-center">
                <span className="font-title text-base font-bold text-on-surface truncate">{boss.boss_name}</span>
                <span className="text-[11px] text-outline mt-0.5">
                  {isBossDefeated ? 'Quitado com louvor' : `${boss.month_theme} • Vence em ${boss.days_remaining} dias`}
                </span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="material-symbols-outlined text-error text-[18px]">swords</span>
                  <span className="font-mono text-lg font-bold text-error">
                    R$ {boss.current_hp.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* HP Bar */}
            <div className="flex flex-col gap-2 bg-surface-container-high/60 p-3.5 sm:p-4 rounded-2xl border border-surface-container-highest">
              <div className="flex items-center justify-between text-xs font-label-sm">
                <span className="text-on-surface uppercase font-bold">
                  {vocab?.escudo_orcamento || 'HP do Orçamento Mensal'}
                </span>
                <span className={`font-bold ${isBossDefeated ? 'text-secondary' : 'text-error'}`}>
                  {isBossDefeated ? '100% BLINDADO' : `${hpPercent.toFixed(1)}% (ALERTA!)`}
                </span>
              </div>

              <div className="relative w-full h-4.5 rounded-lg bg-surface-container-lowest overflow-hidden p-0.5">
                <div
                  className={`h-full rounded transition-all duration-500 ${
                    isBossDefeated
                      ? 'bg-secondary-container shadow-[0_0_12px_rgba(0,238,252,0.5)]'
                      : 'bg-gradient-to-r from-error via-surface-tint to-primary shadow-[0_0_12px_rgba(255,180,171,0.5)]'
                  }`}
                  style={{ width: `${isBossDefeated ? 100 : hpPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-outline font-mono">
                <span>Defesa Atual: R$ {boss.budget_defense_hp.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <span>Teto: R$ {boss.budget_defense_max.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Battle CTA */}
            <button
              onClick={() => { sounds.playAttack(); onNavigateToBattle(); }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-container via-primary to-primary-fixed-dim text-on-primary-container font-label-sm text-xs uppercase font-bold tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:brightness-105 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">swords</span>
              <span>{isBossDefeated ? (vocab?.bestiario_titulo || 'Ver Histórico') : (vocab?.arena_titulo || 'Entrar na Arena de Combate')}</span>
            </button>
          </section>

          {/* 4. TABULA DE MISSÕES ATIVAS (Quests) */}
          <section className="flex flex-col w-full bg-surface-container-low rounded-3xl p-5 sm:p-6 shadow-2xl border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed-dim text-[22px]">explore</span>
                <h3 className="font-title text-base font-bold text-on-surface uppercase tracking-wide">
                  Tábula de Missões (Quests)
                </h3>
              </div>
              <span className="text-xs text-outline font-medium">{quests.length} Missões Ativas</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quests.map((q) => {
                const isCompleted = q.current_progress >= q.target_progress;

                return (
                  <div
                    key={q.id}
                    className={`flex flex-col justify-between gap-2 p-3 rounded-xl bg-surface-container-lowest border ${
                      q.is_ready_to_claim
                        ? 'border-primary/50 shadow-[0_0_12px_rgba(245,194,83,0.2)]'
                        : 'border-surface-container-high'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-label-sm text-[10px] uppercase text-secondary font-bold">
                          {q.quest_type === 'BEHAVIORAL' ? 'Missão Comportamental' : 'Aporte de Reserva'}
                        </span>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-primary font-bold">
                          +{q.reward_xp} XP
                        </span>
                      </div>
                      <h4 className="font-title text-xs font-bold text-on-surface mt-1">{q.title}</h4>
                      <p className="text-[11px] text-outline leading-tight mt-0.5">{q.description}</p>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className={isCompleted ? 'text-primary font-bold' : 'text-secondary'}>
                          {q.current_progress} / {q.target_progress} {q.progress_unit}
                        </span>
                        <span className="text-outline">
                          {((q.current_progress / q.target_progress) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded bg-surface-container-high overflow-hidden">
                        <div
                          className={`h-full rounded ${
                            isCompleted
                              ? 'bg-gradient-to-r from-primary-fixed-dim to-primary shadow-[0_0_8px_rgba(242,191,80,0.5)]'
                              : 'bg-secondary-container'
                          }`}
                          style={{ width: `${Math.min(100, (q.current_progress / q.target_progress) * 100)}%` }}
                        />
                      </div>

                      {q.is_ready_to_claim && (
                        <button
                          onClick={() => { sounds.playLoot(); onClaimQuest(q.id); }}
                          className="mt-1 w-full py-1.5 px-3 rounded-lg bg-primary-container text-on-primary-container font-label-sm text-xs uppercase font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          <span>Reivindicar Relíquia</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right Column: AI Oracle & Live Battle Log */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col space-y-6 sm:space-y-8 lg:sticky lg:top-24">
          {/* 2.5. CONSELHO DO ORÁCULO DE IA */}
          <section className="flex flex-col w-full bg-gradient-to-br from-[#121635] via-surface-container to-surface-container-high rounded-3xl p-5 shadow-2xl border border-secondary/40 relative overflow-hidden space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-secondary/20 border border-secondary/50 flex items-center justify-center text-secondary shadow-[0_0_10px_rgba(0,238,252,0.3)]">
                  <span className="material-symbols-outlined text-[19px] animate-pulse">psychology</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-title text-xs sm:text-sm font-bold text-on-surface">Oráculo Arcano de IA</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-primary/20 text-primary border border-primary/30 uppercase">Gemini 3.8</span>
                  </div>
                  <span className="text-[10px] text-on-surface-variant">Análise de Comportamento & Nudges</span>
                </div>
              </div>

              <button
                onClick={() => {
                  sounds.playSpell();
                  onOpenAIChat?.();
                }}
                className="px-3 py-1.5 rounded-xl bg-secondary-container/30 hover:bg-secondary-container/50 text-secondary border border-secondary/40 font-label-sm text-[11px] font-bold uppercase flex items-center gap-1 shadow-sm active:scale-95 cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined text-[15px]">chat</span>
                <span>Abrir Chat</span>
              </button>
            </div>

            {/* Quick Insight Snippet */}
            <div className="bg-[#090c21]/80 rounded-2xl p-3.5 border border-surface-container-highest flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-secondary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">insights</span>
                  Padrão Detectado:
                </span>
                <span className="text-primary font-mono text-[10px] font-bold">Poupança 29.7%</span>
              </div>
              <p className="text-xs text-on-surface leading-relaxed">
                &quot;Atenção Guardiões: <strong>Alimentação & Taverna</strong> consome 34% dos gastos mensais. Há margem para economizar <strong>R$ 480/mês</strong> aplicando meal-prep e antecipando R$ 500 no Boss.&quot;
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() => {
                    sounds.playSelect();
                    onOpenAIChat?.('Como podemos reduzir gastos com alimentação aos finais de semana?');
                  }}
                  className="text-[10px] px-2 py-1 rounded-lg bg-surface-container hover:bg-surface-bright text-primary border border-primary/30 cursor-pointer active:scale-95 transition-all"
                >
                  🍲 Dicas de Alimentação
                </button>
                <button
                  onClick={() => {
                    sounds.playSelect();
                    onOpenAIChat?.('Qual a melhor estratégia para derrotar o Boss da fatura de cartão este mês?');
                  }}
                  className="text-[10px] px-2 py-1 rounded-lg bg-surface-container hover:bg-surface-bright text-secondary border border-secondary/30 cursor-pointer active:scale-95 transition-all"
                >
                  ⚔️ Estratégia anti-fatura
                </button>
              </div>
            </div>
          </section>

          {/* 3. LOG DE BATALHA EM TEMPO REAL (Transações com Lore de RPG) */}
          <section className="flex flex-col w-full bg-surface-container/90 rounded-3xl p-5 shadow-2xl border border-surface-container-high space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-surface-container-high">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">auto_stories</span>
                <h3 className="font-title text-sm sm:text-base font-bold text-on-surface uppercase tracking-wide">
                  Log de Batalha (Extrato Rúnico)
                </h3>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-surface-container-high text-primary font-bold border border-primary/20">
                Turno {guild.current_turn}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {transactions.slice(0, 5).map((tx) => {
                const isLoot = tx.spell_type === 'LOOT';
                const isPoison = tx.spell_type === 'POISON';

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-lowest/80 hover:bg-surface-container-lowest border border-surface-container-high transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center ${
                        isLoot 
                          ? 'bg-primary-container/20 text-primary-fixed shadow-[0_0_8px_rgba(242,191,80,0.3)]'
                          : isPoison
                            ? 'bg-tertiary-container/20 text-tertiary-container'
                            : 'bg-error-container/30 text-error'
                      }`}>
                        <span className="material-symbols-outlined text-[20px]">
                          {isLoot ? 'diamond' : isPoison ? 'skull' : 'local_fire_department'}
                        </span>
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-label-sm text-[8.5px] uppercase px-1.5 py-0.2 rounded font-bold ${
                            isLoot ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-outline'
                          }`}>
                            {tx.spell_type}
                          </span>
                          <span className="text-[10px] text-outline truncate">{tx.rpg_category}</span>
                        </div>
                        <span className="text-xs text-on-surface font-medium truncate mt-0.5">{tx.custom_name}</span>
                      </div>
                    </div>

                    <span className={`font-mono text-xs font-bold flex-shrink-0 ml-2.5 ${
                      isLoot ? 'text-secondary-fixed' : 'text-error'
                    }`}>
                      {isLoot ? '+' : ''} R$ {Math.abs(tx.raw_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => { sounds.playSelect(); onNavigateToGrimoire(); }}
              className="pt-1 text-center font-label-sm text-xs uppercase tracking-wider text-primary hover:text-on-surface flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Abrir Grimório Completo</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </section>
        </div>
      </div>

      {/* MODAL DE BUSTO COMPLETO EM PIXEL ART (JRPG Character Sheet) */}
      {selectedCharacter && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className={`w-full max-w-md bg-surface-container rounded-2xl border p-5 shadow-2xl flex flex-col gap-4 animate-scale-up my-auto max-h-[92vh] overflow-y-auto ${
            selectedCharacter.element === 'LUNAR' ? 'border-secondary/50 shadow-[0_0_30px_rgba(0,238,252,0.3)]' : 'border-primary/50 shadow-[0_0_30px_rgba(242,191,80,0.3)]'
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-surface-container-high pb-2.5">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md ${
                  selectedCharacter.element === 'LUNAR' ? 'bg-secondary-container/20 text-secondary' : 'bg-primary-container/20 text-primary'
                }`}>
                  <span className="material-symbols-outlined text-[20px]">
                    {selectedCharacter.element === 'LUNAR' ? 'bedtime' : 'wb_sunny'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider font-bold">
                    RETRATO DE BUSTO COMPLETO • 32-BIT
                  </span>
                  <h3 className="font-title text-base font-bold text-on-surface">
                    {selectedCharacter.name} — {selectedCharacter.class_name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => { sounds.playSelect(); setSelectedCharacter(null); }}
                className="w-8 h-8 rounded-xl bg-surface-container-high text-outline hover:text-on-surface flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Busto Completo Pixel Art Showcase Frame */}
            <div className="relative w-full h-72 rounded-2xl bg-surface-container-lowest overflow-hidden border border-surface-container-high flex items-center justify-center shadow-inner">
              {/* Elemental Radial Atmosphere */}
              <div className={`absolute inset-0 pointer-events-none opacity-40 blur-2xl ${
                selectedCharacter.element === 'LUNAR' ? 'bg-secondary-container' : 'bg-primary-container'
              }`} />

              <img
                src={selectedCharacter.avatar_url}
                alt={`${selectedCharacter.name} - Busto Completo em Pixel Art`}
                className="w-full h-full object-cover object-top pixel-art filter contrast-115 saturate-110 drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent pointer-events-none" />

              {/* Rarity & Retro Tag */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-lowest/90 backdrop-blur-md border border-surface-container-high shadow">
                <span className="material-symbols-outlined text-primary text-[14px]">stars</span>
                <span className="font-label-sm text-[10px] uppercase font-bold text-primary">
                  {selectedCharacter.element === 'LUNAR' ? 'Ordem da Lua Astral' : 'Ordem da Lâmina Solar'}
                </span>
              </div>

              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-surface-container-high/90 text-[10px] font-mono text-outline border border-surface-container-highest shadow">
                32-BIT PIXEL ART
              </div>

              {/* Character Title Plate */}
              <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-title text-lg font-bold text-primary drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                    {selectedCharacter.name}
                  </span>
                  <span className="font-label-sm text-[11px] text-secondary-fixed-dim uppercase tracking-wider font-semibold">
                    {selectedCharacter.title}
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-lowest/90 border border-primary/30">
                  <span className="material-symbols-outlined text-primary text-[16px]">military_tech</span>
                  <span className="font-mono text-xs font-bold text-primary">NÍV. {selectedCharacter.level}</span>
                </div>
              </div>
            </div>

            {/* Lore Biography Box (JRPG Dialogue Style) */}
            <div className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high flex flex-col gap-1.5">
              <span className="font-label-sm text-[10px] uppercase text-outline font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-primary">history_edu</span>
                Crônica & Papel na Guilda
              </span>
              <p className="text-xs text-on-surface leading-relaxed">
                {selectedCharacter.element === 'LUNAR'
                  ? 'Canaliza a sabedoria da lua crescente através de seu cajado celestial. Especialista em moderação de banquetes na taverna, planejamento de longo prazo e alquimia de rendimentos da reserva.'
                  : 'Empunha a lâmina solar forjada na luz do zênite. Especialista em blindar o tesouro contra compras anômalas e liderar o contra-ataque decisivo contra o Titã da Fatura de Cartão.'}
              </p>
            </div>

            {/* Combat Attributes & Guild Role */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col items-center text-center">
                <span className="font-label-sm text-[9px] uppercase text-outline font-bold">Contribuição</span>
                <span className="font-mono text-sm font-bold text-primary mt-0.5">
                  {selectedCharacter.contribution_percent}%
                </span>
                <span className="text-[9px] text-on-surface-variant">Mana da Party</span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col items-center text-center">
                <span className="font-label-sm text-[9px] uppercase text-outline font-bold">Progresso XP</span>
                <span className="font-mono text-sm font-bold text-secondary mt-0.5">
                  {selectedCharacter.xp}
                </span>
                <span className="text-[9px] text-on-surface-variant">/ {selectedCharacter.xp_max} XP</span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col items-center text-center">
                <span className="font-label-sm text-[9px] uppercase text-outline font-bold">Selo Astral</span>
                <span className="font-mono text-sm font-bold text-tertiary mt-0.5">
                  Ativo
                </span>
                <span className="text-[9px] text-on-surface-variant">Sincronizado</span>
              </div>
            </div>

            {/* Action Button: Conjurar Feitiço com este Membro */}
            <button
              onClick={() => {
                sounds.playAttack();
                setSelectedCharacter(null);
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-container via-primary to-primary-fixed-dim text-on-primary-container font-title text-xs font-bold uppercase shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Confirmar Seleção do Guerreiro</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

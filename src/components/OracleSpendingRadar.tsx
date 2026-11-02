import React, { useState } from 'react';
import { Guild, Character, Transaction } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface OracleSpendingRadarProps {
  guild: Guild;
  characters: Character[];
  transactions: Transaction[];
  onNavigateToGrimoire?: () => void;
  onOpenAIChat?: (initialPrompt?: string) => void;
}

interface MonthCycleData {
  id: string;
  name: string;
  cycleTitle: string;
  gains: number;
  expenses: number;
  investments: number;
  surplus: number;
  savingsRate: number;
  passiveMana: number;
}

const CYCLES: MonthCycleData[] = [
  {
    id: 'jun',
    name: 'Junho',
    cycleTitle: 'Ciclo Solstício de Inverno • Ano IV',
    gains: 7200,
    expenses: 4900,
    investments: 1600,
    surplus: 700,
    savingsRate: 22.2,
    passiveMana: 98.40,
  },
  {
    id: 'jul',
    name: 'Julho',
    cycleTitle: 'Ciclo das Brumas Astrais • Ano IV',
    gains: 7450,
    expenses: 5100,
    investments: 1750,
    surplus: 600,
    savingsRate: 23.5,
    passiveMana: 105.20,
  },
  {
    id: 'ago',
    name: 'Agosto',
    cycleTitle: 'Ciclo dos Ventos Cósmicos • Ano IV',
    gains: 7600,
    expenses: 4650,
    investments: 2000,
    surplus: 950,
    savingsRate: 26.3,
    passiveMana: 118.70,
  },
  {
    id: 'set',
    name: 'Setembro',
    cycleTitle: 'Ciclo do Equinócio da Primavera • Ano IV',
    gains: 7900,
    expenses: 4800,
    investments: 2150,
    surplus: 950,
    savingsRate: 27.2,
    passiveMana: 126.90,
  },
  {
    id: 'out',
    name: 'Outubro',
    cycleTitle: 'Ciclo Lunar das Sombras • Ano IV',
    gains: 8050,
    expenses: 5100,
    investments: 2200,
    surplus: 750,
    savingsRate: 27.3,
    passiveMana: 134.10,
  },
  {
    id: 'nov',
    name: 'Novembro',
    cycleTitle: 'Ciclo Solar Ativo • Ano IV',
    gains: 8250,
    expenses: 4790,
    investments: 2450,
    surplus: 1010,
    savingsRate: 29.7,
    passiveMana: 142.80,
  },
];

export const OracleSpendingRadar: React.FC<OracleSpendingRadarProps> = ({
  guild,
  characters,
  transactions: _transactions,
  onNavigateToGrimoire,
  onOpenAIChat,
}) => {
  const [selectedCycleIndex, setSelectedCycleIndex] = useState(5); // Default: Novembro
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Categorias de Teto de Gastos e Investimentos definidas pelo Usuário (%)
  const [userCaps, setUserCaps] = useState({
    essenciais: 50, // Gastos Essenciais / Moradia & Alimentação
    lazer: 20,      // Estilo de Vida, Cultura & Lazer
    investimentos: 20, // Investimentos & Futuro
    reserva: 10,    // Reserva de Emergência
  });

  const currentCycle = CYCLES[selectedCycleIndex];
  const prevCycle = selectedCycleIndex > 0 ? CYCLES[selectedCycleIndex - 1] : CYCLES[CYCLES.length - 1];

  // Cálculo de variações percentuais
  const expenseDiff = ((currentCycle.expenses - prevCycle.expenses) / prevCycle.expenses) * 100;
  const gainsDiff = ((currentCycle.gains - prevCycle.gains) / prevCycle.gains) * 100;

  // Sugestão de investimento da IA (Baseada na sobra líquida + aporte planejado)
  const suggestedInvestment = Math.round(currentCycle.surplus * 0.75 + currentCycle.investments * 0.25);

  const iuryChar = characters.find(c => c.id === 'char-iury') || characters[1] || {
    name: 'Iury',
    class_name: 'Guerreiro Solar',
    avatar_url: '/assets/aistudio/Iury2_197a4062.jpg',
  };

  const rayChar = characters.find(c => c.id === 'char-ray') || characters[0] || {
    name: 'Ray',
    class_name: 'Maga Lunar',
    avatar_url: '/assets/aistudio/Ray_284119bd.jpg',
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePrevCycle = () => {
    sounds.playSelect();
    setSelectedCycleIndex(prev => (prev > 0 ? prev - 1 : CYCLES.length - 1));
  };

  const handleNextCycle = () => {
    sounds.playSelect();
    setSelectedCycleIndex(prev => (prev < CYCLES.length - 1 ? prev + 1 : 0));
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Atualização com normalização suave
  const handleCapChange = (key: keyof typeof userCaps, value: number) => {
    setUserCaps(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Cálculo dos arcos do Donut Chart (Rosca SVG)
  const totalCapPercent = userCaps.essenciais + userCaps.lazer + userCaps.investimentos + userCaps.reserva;
  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12

  const p1 = (userCaps.essenciais / totalCapPercent) * circumference;
  const p2 = (userCaps.lazer / totalCapPercent) * circumference;
  const p3 = (userCaps.investimentos / totalCapPercent) * circumference;
  const p4 = (userCaps.reserva / totalCapPercent) * circumference;

  const o1 = 0;
  const o2 = -p1;
  const o3 = -(p1 + p2);
  const o4 = -(p1 + p2 + p3);

  // Valor das cotas em R$ baseado nas entradas do mês
  const capReais = {
    essenciais: (currentCycle.gains * (userCaps.essenciais / 100)),
    lazer: (currentCycle.gains * (userCaps.lazer / 100)),
    investimentos: (currentCycle.gains * (userCaps.investimentos / 100)),
    reserva: (currentCycle.gains * (userCaps.reserva / 100)),
  };

  return (
    <div className="flex flex-col w-full px-3 sm:px-6 pb-28 gap-6 sm:gap-7 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-secondary-container text-on-secondary-container font-label-sm text-xs font-bold shadow-[0_0_24px_rgba(0,238,252,0.5)] border border-secondary flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          {toastMessage}
        </div>
      )}

      {/* Header Banner com Título Místico */}
      <div className="flex flex-col gap-1 border-b border-surface-container-high/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[22px]">psychology</span>
          <span className="font-label-sm text-[10px] tracking-widest text-primary uppercase font-bold">
            {guild.sanctuary_name || 'Santuário Amorim Granja'}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="font-title text-xl sm:text-2xl font-bold text-on-surface">
              Oráculo de Inteligência Financeira
            </h1>
            <p className="text-xs text-outline">
              Análise comportamental das contas, projeções de superávit e calibrador de tetos da guilda.
            </p>
          </div>
          {onOpenAIChat && (
            <button
              onClick={() => { sounds.playSelect(); onOpenAIChat(); }}
              className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-secondary-container/20 to-primary-container/20 border border-secondary/50 text-secondary hover:text-white font-label-sm text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">chat_spark</span>
              <span>Consultar Oráculo IA</span>
            </button>
          )}
        </div>
      </div>

      {/* Seletor do Mês de Referência */}
      <div className="flex items-center justify-between bg-surface-container-high/80 rounded-2xl px-4 py-3 backdrop-blur-md border border-surface-container-highest shadow-md">
        <button
          onClick={handlePrevCycle}
          aria-label="Ciclo Anterior"
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container-lowest text-primary hover:text-white transition-colors cursor-pointer border border-primary/20 hover:border-primary active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </button>

        <div className="flex items-center gap-2 text-center">
          <span className="material-symbols-outlined text-primary-fixed-dim text-[20px] animate-pulse">
            calendar_month
          </span>
          <div className="flex flex-col items-center">
            <span className="font-title text-base sm:text-lg font-bold text-primary tracking-wide">
              {currentCycle.name}
            </span>
            <span className="font-label-sm text-[10px] text-secondary tracking-widest uppercase font-semibold">
              {currentCycle.cycleTitle}
            </span>
          </div>
        </div>

        <button
          onClick={handleNextCycle}
          aria-label="Próximo Ciclo"
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-container-lowest text-primary hover:text-white transition-colors cursor-pointer border border-primary/20 hover:border-primary active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </button>
      </div>

      {/* 1. OS 3 CARTÕES DO TOPO (Entrada do Mês, Gasto Abatido, Sugestão de Investimento) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Valor da Entrada do Mês de Referência */}
        <div className="bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low border border-emerald-500/40 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-emerald-500 transition-all">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
            <span className="font-label-sm text-xs text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">south_east</span>
              Entrada do Mês ({currentCycle.name})
            </span>
            <span className="material-symbols-outlined text-emerald-400 text-[20px]">
              savings
            </span>
          </div>

          <div className="my-3">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-emerald-300 tracking-tight">
              {formatCurrency(currentCycle.gains)}
            </div>
            <p className="text-xs text-outline mt-1">
              Total consolidado de salários dos guardiões e receitas do ciclo
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-surface-container-high/60 font-mono">
            <span className="text-outline">Variação vs mês ant.:</span>
            <span className={`font-bold flex items-center gap-0.5 ${gainsDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span className="material-symbols-outlined text-[14px]">
                {gainsDiff >= 0 ? 'trending_up' : 'trending_down'}
              </span>
              {gainsDiff >= 0 ? `+${gainsDiff.toFixed(1)}%` : `${gainsDiff.toFixed(1)}%`}
            </span>
          </div>
        </div>

        {/* Card 2: Total do Gasto Já Abatido */}
        <div className="bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low border border-rose-500/40 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-rose-500 transition-all">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
            <span className="font-label-sm text-xs text-rose-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">payments</span>
              Gasto Já Abatido (Faturas & Custos)
            </span>
            <span className="material-symbols-outlined text-rose-400 text-[20px]">
              receipt_long
            </span>
          </div>

          <div className="my-3">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-rose-300 tracking-tight">
              {formatCurrency(currentCycle.expenses)}
            </div>
            <p className="text-xs text-outline mt-1">
              Despesas fixas liquidadas e faturas pagas até o momento
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-surface-container-high/60 font-mono">
            <span className="text-outline">Ritmo de gastos:</span>
            <span className={`font-bold flex items-center gap-0.5 ${expenseDiff <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span className="material-symbols-outlined text-[14px]">
                {expenseDiff <= 0 ? 'arrow_downward' : 'arrow_upward'}
              </span>
              {expenseDiff > 0 ? `+${expenseDiff.toFixed(1)}%` : `${expenseDiff.toFixed(1)}%`}
            </span>
          </div>
        </div>

        {/* Card 3: Sugestão de Valor para Investir (IA do Oráculo) */}
        <div className="bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low border border-primary/50 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:border-primary transition-all">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/15 blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-high/60">
            <span className="font-label-sm text-xs text-primary uppercase tracking-wider font-bold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              Sugestão de Aporte (IA)
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-[10px] font-bold border border-primary/20">
              RECOMENDADO
            </span>
          </div>

          <div className="my-3">
            <div className="font-mono text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
              {formatCurrency(suggestedInvestment)}
            </div>
            <p className="text-xs text-on-surface-variant mt-1">
              Calculado para maximizar o efeito dos juros compostos sem comprometer o conforto
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playVictory();
              showToast(`Aporte sugerido de ${formatCurrency(suggestedInvestment)} simulado com sucesso na Forja Astral!`);
            }}
            className="w-full py-2 px-3 rounded-xl bg-primary-container text-on-primary-container font-label-sm text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">diamond</span>
            Simular Aporte Sugerido
          </button>
        </div>
      </div>

      {/* 2. GRÁFICO DE GASTOS MENSAIS COM INDICADOR DE AUMENTO (VERMELHO) OU QUEDA (VERDE) */}
      <section className="bg-surface-container-low rounded-3xl p-5 sm:p-6 border border-surface-container-high shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-container-high">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">monitoring</span>
            </div>
            <div>
              <h2 className="font-title text-base sm:text-lg font-bold text-on-surface">
                Evolução dos Gastos Mensais
              </h2>
              <p className="text-xs text-outline">
                Histórico de despesas consolidadas dos últimos 6 ciclos lunares
              </p>
            </div>
          </div>

          {/* Indicador de Aumento (Vermelho) ou Queda (Verde) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-outline font-label-sm uppercase">Tendência de Gastos:</span>
            <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1 border ${
              expenseDiff > 0
                ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
            }`}>
              <span className="material-symbols-outlined text-[16px]">
                {expenseDiff > 0 ? 'arrow_upward' : 'arrow_downward'}
              </span>
              <span>
                {expenseDiff > 0 ? `+${expenseDiff.toFixed(1)}% (Aumento de Gastos)` : `${expenseDiff.toFixed(1)}% (Queda / Economia)`}
              </span>
            </div>
          </div>
        </div>

        {/* Gráfico de Barras de Gastos com Valores e Indicadores */}
        <div className="grid grid-cols-6 gap-2 sm:gap-4 pt-4 pb-2 items-end min-h-[180px]">
          {CYCLES.map((cycle, idx) => {
            const isSelected = idx === selectedCycleIndex;
            const maxExpense = 6000;
            const heightPercent = Math.min(100, Math.round((cycle.expenses / maxExpense) * 100));
            
            // Variação vs mês anterior
            const prev = idx > 0 ? CYCLES[idx - 1] : cycle;
            const diff = idx > 0 ? ((cycle.expenses - prev.expenses) / prev.expenses) * 100 : 0;
            const hasIncreased = diff > 0;

            return (
              <div
                key={cycle.id}
                onClick={() => { sounds.playSelect(); setSelectedCycleIndex(idx); }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                {/* Badge de Variação Individual */}
                <span className={`text-[10px] font-mono font-bold ${
                  idx === 0 
                    ? 'text-outline' 
                    : hasIncreased 
                      ? 'text-rose-400' 
                      : 'text-emerald-400'
                }`}>
                  {idx === 0 ? '—' : hasIncreased ? `+${diff.toFixed(0)}%` : `${diff.toFixed(0)}%`}
                </span>

                {/* Coluna da Barra */}
                <div className="w-full flex justify-center h-28 items-end">
                  <div
                    className={`w-8 sm:w-12 rounded-t-xl transition-all duration-300 relative ${
                      isSelected
                        ? 'bg-rose-400 shadow-[0_0_16px_rgba(244,63,94,0.6)]'
                        : hasIncreased
                          ? 'bg-rose-500/60 hover:bg-rose-500/80'
                          : 'bg-emerald-500/60 hover:bg-emerald-500/80'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {isSelected && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-on-surface whitespace-nowrap bg-surface-container-highest px-1.5 py-0.5 rounded border border-surface-container-high">
                        R$ {cycle.expenses}
                      </span>
                    )}
                  </div>
                </div>

                {/* Nome do Mês */}
                <span className={`text-xs font-mono uppercase font-bold ${isSelected ? 'text-primary' : 'text-outline'}`}>
                  {cycle.name.slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center text-[11px] text-outline pt-2 border-t border-surface-container-high font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            Vermelho: Aumento de gastos no período
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            Verde: Redução e contenção de despesas
          </span>
        </div>
      </section>

      {/* 3. GRÁFICO DE ENTRADAS MENSAIS COM INDICADOR DE CRESCIMENTO (VERDE) OU QUEDA (VERMELHO) */}
      <section className="bg-surface-container-low rounded-3xl p-5 sm:p-6 border border-surface-container-high shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-surface-container-high">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">show_chart</span>
            </div>
            <div>
              <h2 className="font-title text-base sm:text-lg font-bold text-on-surface">
                Evolução das Entradas Mensais
              </h2>
              <p className="text-xs text-outline">
                Histórico de receitas, salários e rendas extras arrecadadas pela guilda
              </p>
            </div>
          </div>

          {/* Indicador de Crescimento (Verde) ou Queda (Vermelho) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-outline font-label-sm uppercase">Tendência de Entradas:</span>
            <div className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1 border ${
              gainsDiff >= 0
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
            }`}>
              <span className="material-symbols-outlined text-[16px]">
                {gainsDiff >= 0 ? 'trending_up' : 'trending_down'}
              </span>
              <span>
                {gainsDiff >= 0 ? `+${gainsDiff.toFixed(1)}% (Crescimento de Renda)` : `${gainsDiff.toFixed(1)}% (Queda de Entradas)`}
              </span>
            </div>
          </div>
        </div>

        {/* Gráfico de Barras de Entradas */}
        <div className="grid grid-cols-6 gap-2 sm:gap-4 pt-4 pb-2 items-end min-h-[180px]">
          {CYCLES.map((cycle, idx) => {
            const isSelected = idx === selectedCycleIndex;
            const maxGains = 10000;
            const heightPercent = Math.min(100, Math.round((cycle.gains / maxGains) * 100));
            
            const prev = idx > 0 ? CYCLES[idx - 1] : cycle;
            const diff = idx > 0 ? ((cycle.gains - prev.gains) / prev.gains) * 100 : 0;
            const hasGrown = diff >= 0;

            return (
              <div
                key={cycle.id}
                onClick={() => { sounds.playSelect(); setSelectedCycleIndex(idx); }}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                {/* Badge de Variação Individual de Entradas */}
                <span className={`text-[10px] font-mono font-bold ${
                  idx === 0 
                    ? 'text-outline' 
                    : hasGrown 
                      ? 'text-emerald-400' 
                      : 'text-rose-400'
                }`}>
                  {idx === 0 ? '—' : hasGrown ? `+${diff.toFixed(0)}%` : `${diff.toFixed(0)}%`}
                </span>

                {/* Coluna da Barra */}
                <div className="w-full flex justify-center h-28 items-end">
                  <div
                    className={`w-8 sm:w-12 rounded-t-xl transition-all duration-300 relative ${
                      isSelected
                        ? 'bg-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.6)]'
                        : hasGrown
                          ? 'bg-emerald-500/60 hover:bg-emerald-500/80'
                          : 'bg-rose-500/60 hover:bg-rose-500/80'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {isSelected && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-on-surface whitespace-nowrap bg-surface-container-highest px-1.5 py-0.5 rounded border border-surface-container-high">
                        R$ {cycle.gains}
                      </span>
                    )}
                  </div>
                </div>

                {/* Nome do Mês */}
                <span className={`text-xs font-mono uppercase font-bold ${isSelected ? 'text-primary' : 'text-outline'}`}>
                  {cycle.name.slice(0, 3)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center text-[11px] text-outline pt-2 border-t border-surface-container-high font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            Verde: Crescimento das receitas da família
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            Vermelho: Queda das entradas em relação ao ciclo anterior
          </span>
        </div>
      </section>

      {/* 4. GRÁFICO DE ROSCA (DONUT) COM AS PORCENTAGENS DE TETO PARA CATEGORIAS DE GASTOS E INVESTIMENTOS (DEFINIDOS PELOS USUÁRIOS) */}
      <section className="bg-surface-container-low rounded-3xl p-5 sm:p-7 border border-surface-container-high shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-surface-container-high">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">donut_large</span>
            </div>
            <div>
              <h2 className="font-title text-base sm:text-lg font-bold text-on-surface">
                Tetos de Orçamento & Investimentos
              </h2>
              <p className="text-xs text-outline">
                Defina suas próprias porcentagens de teto por categoria e acompanhe os limites em R$
              </p>
            </div>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30 font-bold self-start sm:self-auto">
            Base: {formatCurrency(currentCycle.gains)} / mês
          </span>
        </div>

        {/* Visualização: Rosca SVG Interativa + Legenda com Valores em Reais */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Lado Esquerdo: Donut Chart SVG */}
          <div className="md:col-span-5 flex flex-col items-center justify-center relative py-2">
            <svg width="220" height="220" viewBox="0 0 160 160" className="rotate-[-90deg]">
              {/* Círculo de Fundo */}
              <circle cx="80" cy="80" r={radius} fill="none" stroke="#1b1e34" strokeWidth="22" />

              {/* Segmento 1: Essenciais (Azul Ciano) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#00eefc"
                strokeWidth="22"
                strokeDasharray={`${p1} ${circumference}`}
                strokeDashoffset={o1}
                className="transition-all duration-500 cursor-pointer hover:opacity-90"
              />

              {/* Segmento 2: Lazer (Rosa/Magenta) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#ffb5c8"
                strokeWidth="22"
                strokeDasharray={`${p2} ${circumference}`}
                strokeDashoffset={o2}
                className="transition-all duration-500 cursor-pointer hover:opacity-90"
              />

              {/* Segmento 3: Investimentos (Dourado Solar) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#f5c253"
                strokeWidth="22"
                strokeDasharray={`${p3} ${circumference}`}
                strokeDashoffset={o3}
                className="transition-all duration-500 cursor-pointer hover:opacity-90"
              />

              {/* Segmento 4: Reserva (Esmeralda) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#10b981"
                strokeWidth="22"
                strokeDasharray={`${p4} ${circumference}`}
                strokeDashoffset={o4}
                className="transition-all duration-500 cursor-pointer hover:opacity-90"
              />
            </svg>

            {/* Centro da Rosca com Total */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="font-label-sm text-[10px] text-outline uppercase font-bold tracking-wider">
                Teto Total
              </span>
              <span className="font-mono text-xl font-bold text-on-surface">
                100%
              </span>
              <span className="font-mono text-[11px] text-primary">
                {formatCurrency(currentCycle.gains)}
              </span>
            </div>
          </div>

          {/* Lado Direito: Sliders para o Usuário Definir Suas Porcentagens */}
          <div className="md:col-span-7 flex flex-col space-y-4">
            <span className="font-label-sm text-xs font-bold text-primary uppercase tracking-wider">
              Ajuste as Porcentagens de Cada Categoria:
            </span>

            {/* Slider 1: Essenciais */}
            <div className="p-3 rounded-2xl bg-surface-container border border-[#00eefc]/30 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#00eefc] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00eefc]" />
                  Gastos Essenciais & Moradia
                </span>
                <span className="font-mono font-bold text-on-surface">
                  {userCaps.essenciais}% • {formatCurrency(capReais.essenciais)}
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="70"
                value={userCaps.essenciais}
                onChange={(e) => handleCapChange('essenciais', Number(e.target.value))}
                className="w-full accent-[#00eefc] cursor-pointer"
              />
            </div>

            {/* Slider 2: Lazer & Estilo de Vida */}
            <div className="p-3 rounded-2xl bg-surface-container border border-[#ffb5c8]/30 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#ffb5c8] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffb5c8]" />
                  Estilo de Vida & Lazer
                </span>
                <span className="font-mono font-bold text-on-surface">
                  {userCaps.lazer}% • {formatCurrency(capReais.lazer)}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={userCaps.lazer}
                onChange={(e) => handleCapChange('lazer', Number(e.target.value))}
                className="w-full accent-[#ffb5c8] cursor-pointer"
              />
            </div>

            {/* Slider 3: Investimentos & Futuro */}
            <div className="p-3 rounded-2xl bg-surface-container border border-[#f5c253]/30 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#f5c253] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f5c253]" />
                  Investimentos & Futuro
                </span>
                <span className="font-mono font-bold text-on-surface">
                  {userCaps.investimentos}% • {formatCurrency(capReais.investimentos)}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                value={userCaps.investimentos}
                onChange={(e) => handleCapChange('investimentos', Number(e.target.value))}
                className="w-full accent-[#f5c253] cursor-pointer"
              />
            </div>

            {/* Slider 4: Reserva de Emergência */}
            <div className="p-3 rounded-2xl bg-surface-container border border-[#10b981]/30 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#10b981] flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  Reserva de Emergência
                </span>
                <span className="font-mono font-bold text-on-surface">
                  {userCaps.reserva}% • {formatCurrency(capReais.reserva)}
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={userCaps.reserva}
                onChange={(e) => handleCapChange('reserva', Number(e.target.value))}
                className="w-full accent-[#10b981] cursor-pointer"
              />
            </div>

            <div className="flex justify-between items-center pt-1 text-[11px] font-mono text-outline">
              <span>Soma dos Tetos: {totalCapPercent}%</span>
              <button
                onClick={() => {
                  sounds.playVictory();
                  showToast('Novos tetos de gastos e investimentos gravados com sucesso no Oráculo!');
                }}
                className="text-primary hover:underline font-bold cursor-pointer"
              >
                Salvar Regra de Tetos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Oráculo Tático: Vozes do Conselho Astral dos Guardiões */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-1">
          <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
          <h2 className="font-title text-sm sm:text-base font-bold text-on-surface">
            Vozes do Conselho Astral dos Guardiões
          </h2>
        </div>

        {/* Parecer do Guerreiro Solar Iury */}
        <div className="bg-surface-container-high rounded-2xl p-4 flex gap-3.5 shadow-md items-start border border-primary/30 hover:border-primary transition-colors">
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-lowest border border-primary/40 shadow-[0_0_12px_rgba(242,191,80,0.3)]">
            <img
              src={iuryChar.avatar_url}
              alt="Avatar de Iury"
              className="w-full h-full object-cover object-top pixel-art"
            />
          </div>
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="font-title text-xs sm:text-sm text-primary font-bold leading-tight truncate">
                Iury • Guerreiro Solar
              </span>
              <span className="font-label-sm text-[9px] text-primary px-1.5 py-0.5 rounded bg-primary-container/20 border border-primary/30 uppercase font-bold shrink-0">
                Defesa Ativa
              </span>
            </div>
            <p className="text-xs text-on-surface leading-relaxed">
              &quot;🛡️ O teto de gastos essenciais ficou em <strong className="text-primary font-bold">{userCaps.essenciais}%</strong>. Nossa taxa de poupança superou a meta! O escudo do santuário permanece firme.&quot;
            </p>
          </div>
        </div>

        {/* Parecer da Maga Lunar Ray */}
        <div className="bg-surface-container-high rounded-2xl p-4 flex gap-3.5 shadow-md items-start border border-secondary/30 hover:border-secondary transition-colors">
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-lowest border border-secondary/40 shadow-[0_0_12px_rgba(0,238,252,0.3)]">
            <img
              src={rayChar.avatar_url}
              alt="Avatar de Ray"
              className="w-full h-full object-cover object-top pixel-art"
            />
          </div>
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="font-title text-xs sm:text-sm text-secondary font-bold leading-tight truncate">
                Ray • Maga Lunar
              </span>
              <span className="font-label-sm text-[9px] text-secondary px-1.5 py-0.5 rounded bg-secondary-container/20 border border-secondary/30 uppercase font-bold shrink-0">
                Oráculo
              </span>
            </div>
            <p className="text-xs text-on-surface leading-relaxed">
              &quot;✨ Recomendo canalizar os <strong className="text-secondary font-bold">{formatCurrency(suggestedInvestment)}</strong> para o tesouro astral este mês. Com a reserva em {userCaps.reserva}%, nosso crescimento composto será extraordinário!&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

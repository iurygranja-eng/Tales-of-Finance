/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  INITIAL_GUILD, 
  INITIAL_CHARACTERS, 
  INITIAL_BOSS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_QUESTS, 
  INITIAL_RELICS 
} from './data/mockGameData';
import { GuildDashboard } from './components/GuildDashboard';
import { BossFightBattle } from './components/BossFightBattle';
import { OracleSpendingRadar } from './components/OracleSpendingRadar';
import { GrimoireTransactions } from './components/GrimoireTransactions';
import { RelicInventory } from './components/RelicInventory';
import { NewTransactionModal } from './components/NewTransactionModal';
import { OracleAIChatModal } from './components/OracleAIChatModal';
import { TechLeadArchitecture } from './components/TechLeadArchitecture';
import { GuildMembersCrud } from './components/GuildMembersCrud';
import { AppSettingsView } from './components/AppSettingsView';
import { PWAInstallButton } from './components/PWAInstallButton';
import { RpgDialogueToast, RpgToastData } from './components/RpgDialogueToast';
import { RpgLoginScreen, AuthSession } from './components/RpgLoginScreen';
import { sounds } from './utils/soundEffects';
import { Transaction, Character } from './types/game';
import { 
  DifficultyLevel, 
  getSavedDifficulty, 
  saveDifficulty, 
  getVocabulary, 
  DIFFICULTY_CONFIGS 
} from './utils/difficultyVocabulary';

type NavigationTab = 
  | 'dashboard' 
  | 'membros' 
  | 'batalhas' 
  | 'grimorio' 
  | 'oraculo' 
  | 'quests' 
  | 'inventario' 
  | 'arquitetura'
  | 'configuracoes';

const AUTH_STORAGE_KEY = 'tales_of_finance_auth';
const CHARACTERS_STORAGE_KEY = 'tales_of_finance_characters';

const getInitialAuthSession = (): AuthSession | null => {
  try {
    const local = localStorage.getItem(AUTH_STORAGE_KEY);
    if (local) return JSON.parse(local);
    const session = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (session) return JSON.parse(session);
  } catch (e) {
    console.error('Falha ao restaurar sessão arcana:', e);
  }
  return null;
};

const getInitialCharacters = (): Character[] => {
  try {
    const saved = localStorage.getItem(CHARACTERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Falha ao restaurar personagens da guilda:', e);
  }
  return INITIAL_CHARACTERS;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthSession | null>(getInitialAuthSession);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [guild, setGuild] = useState(INITIAL_GUILD);
  const [characters, setCharacters] = useState<Character[]>(getInitialCharacters);
  const [boss, setBoss] = useState(INITIAL_BOSS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [relics, setRelics] = useState(INITIAL_RELICS);
  const [isConjureOpen, setIsConjureOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [aiChatInitialPrompt, setAiChatInitialPrompt] = useState<string | undefined>(undefined);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(getSavedDifficulty);
  const [activeToast, setActiveToast] = useState<RpgToastData | null>(null);

  const vocab = getVocabulary(difficulty);

  const showToast = (toastData: RpgToastData) => {
    setActiveToast(toastData);
  };

  const handleDifficultyChange = (newLevel: DifficultyLevel) => {
    setDifficulty(newLevel);
    saveDifficulty(newLevel);
  };

  const handleTriggerTestToast = (type: 'QUEST' | 'BOSS') => {
    if (type === 'QUEST') {
      showToast({
        id: `test-quest-${Date.now()}`,
        type: 'QUEST_COMPLETE',
        speaker: 'Tábula de Missões',
        speakerRole: 'Meta Concluída',
        title: 'Meta: Guardião das Economias',
        message: 'Aporte de R$ 500 na reserva estratégica concluído! Recompensas adicionadas ao tesouro sagrado.',
        rewardXp: 250,
        badge: 'Emblema da Reserva',
        icon: 'verified',
      });
    } else {
      showToast({
        id: `test-boss-${Date.now()}`,
        type: 'BOSS_DEFEATED',
        speaker: 'Santuário do Solstício',
        speakerRole: 'Vitória Épica',
        avatarUrl: boss.image_url,
        title: `${boss.boss_name} foi Derrotado!`,
        message: `Golpe Crítico no Vencimento! A fatura integral de R$ ${boss.total_invoice_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} foi quitada com sucesso!`,
        rewardXp: boss.reward_xp,
        rewardAmount: boss.total_invoice_amount,
        rewardSerasa: boss.reward_serasa_score,
        badge: 'Fatura Paga',
        icon: 'military_tech',
      });
    }
  };

  const handleResetToDefaults = () => {
    setCharacters(INITIAL_CHARACTERS);
    setBoss(INITIAL_BOSS);
    setGuild(INITIAL_GUILD);
    setQuests(INITIAL_QUESTS);
    setRelics(INITIAL_RELICS);
    try {
      localStorage.removeItem(CHARACTERS_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Guild Members CRUD Handlers
  const handleAddCharacter = (newChar: Character) => {
    setCharacters(prev => {
      const next = [...prev, newChar];
      try {
        localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleUpdateCharacter = (updatedChar: Character) => {
    setCharacters(prev => {
      const next = prev.map(c => c.id === updatedChar.id ? updatedChar : c);
      try {
        localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    if (currentUser && (currentUser.characterId === updatedChar.id || currentUser.username === updatedChar.username)) {
      setCurrentUser(prev => prev ? ({
        ...prev,
        name: updatedChar.name,
        username: updatedChar.username || prev.username,
        className: updatedChar.class_name,
        element: updatedChar.element,
        avatarUrl: updatedChar.avatar_url,
      }) : null);
    }
  };

  const handleDeleteCharacter = (characterId: string) => {
    setCharacters(prev => {
      const next = prev.filter(c => c.id !== characterId);
      try {
        localStorage.setItem(CHARACTERS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });

    if (currentUser && currentUser.characterId === characterId) {
      handleLogout();
    }
  };

  const handleLogin = (session: AuthSession) => {
    setCurrentUser(session);
    setCharacters(prev => prev.map(c => ({
      ...c,
      is_active: c.id === session.characterId || session.characterId === 'char-custom',
    })));

    try {
      if (session.rememberMe) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Falha ao armazenar sessão:', e);
    }
  };

  const handleLogout = () => {
    sounds.playSelect();
    setCurrentUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (e) {
      console.error('Falha ao limpar sessão:', e);
    }
  };

  const handleOpenAIChat = (prompt?: string) => {
    sounds.playSpell();
    setAiChatInitialPrompt(prompt);
    setIsAIChatOpen(true);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    sounds.enabled = next;
    setSoundEnabled(next);
    if (next) sounds.playSelect();
  };

  const handlePayFullInvoice = () => {
    setBoss(prev => ({
      ...prev,
      current_hp: 0,
      status: 'DEFEATED',
      budget_defense_hp: prev.budget_defense_max,
    }));

    // Add battle XP to guild
    setGuild(prev => ({
      ...prev,
      xp: prev.xp + boss.reward_xp,
      serasa_mystic_score: prev.serasa_mystic_score + boss.reward_serasa_score,
      total_net_mana: prev.total_net_mana - boss.total_invoice_amount,
    }));

    // Unlock Relic
    setRelics(prev => prev.map(r => r.id === 'relic-titan-frame' ? { ...r, unlocked: true } : r));

    // Add transaction record
    const paymentTx: Transaction = {
      id: `pay-full-${Date.now()}`,
      guild_id: guild.id,
      character_id: 'char-iury',
      inventory_id: 'inv-nubank-iury',
      raw_fitid: `PAY-FULL-${Date.now()}`,
      raw_description: 'PGTO INTEGRAL FATURA TITAN NUBANK',
      raw_amount: -boss.total_invoice_amount,
      raw_date: new Date().toISOString(),
      custom_name: 'Contra-Ataque Crítico (Fatura Quitada)',
      custom_tags: ['fatura', 'critico', 'boss-slain'],
      spell_type: 'DAMAGE',
      rpg_category: 'Defesa de Castelo',
      is_critical: true,
      is_recurring: false,
      is_reviewed: true,
      caster_name: 'Ambos',
      solar_share: 0.58,
      lunar_share: 0.42,
      created_at: new Date().toISOString(),
    };
    setTransactions(prev => [paymentTx, ...prev]);

    // Disparar Toast de Diálogo Clássico RPG
    showToast({
      id: `boss-slain-${boss.id}-${Date.now()}`,
      type: 'BOSS_DEFEATED',
      speaker: 'Santuário do Solstício',
      speakerRole: 'Vitória Decisiva',
      avatarUrl: boss.image_url,
      title: `${boss.boss_name} foi Expurgado!`,
      message: `Vitória épica! A fatura de R$ ${boss.total_invoice_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} foi integralmente quitada sem juros! O equilíbrio de mana foi restaurado.`,
      rewardXp: boss.reward_xp,
      rewardAmount: boss.total_invoice_amount,
      rewardSerasa: boss.reward_serasa_score,
      badge: 'Fatura Paga',
      icon: 'military_tech',
    });
  };

  const handlePayPartial = (amount: number) => {
    setBoss(prev => {
      const nextHp = Math.max(0, prev.current_hp - amount);
      return {
        ...prev,
        current_hp: nextHp,
        status: nextHp <= 0 ? 'DEFEATED' : 'ACTIVE',
      };
    });

    setGuild(prev => ({
      ...prev,
      xp: prev.xp + 50,
      total_net_mana: prev.total_net_mana - amount,
    }));
  };

  const handleResetBoss = () => {
    sounds.playSelect();
    setBoss(INITIAL_BOSS);
  };

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
    // Adjust guild mana
    setGuild(prev => ({
      ...prev,
      total_net_mana: prev.total_net_mana + newTx.raw_amount,
      xp: newTx.spell_type === 'LOOT' ? prev.xp + 25 : prev.xp + 5,
    }));
  };

  const handleUpdateTransaction = (updatedTx: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTx.id ? updatedTx : t));
  };

  const handleClaimQuest = (questId: string) => {
    const quest = quests.find(q => q.id === questId);

    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        return { ...q, is_ready_to_claim: false, is_completed: true };
      }
      return q;
    }));

    setGuild(prev => ({ ...prev, xp: prev.xp + 200 }));
    // Unlock solar card skin
    setRelics(prev => prev.map(r => r.id === 'relic-solar-card' ? { ...r, unlocked: true } : r));

    // Disparar Toast de Diálogo Clássico RPG
    showToast({
      id: `quest-${questId}-${Date.now()}`,
      type: 'QUEST_COMPLETE',
      speaker: 'Tábula de Missões',
      speakerRole: 'Meta Concluída',
      title: quest ? quest.title : 'Missão Concluída!',
      message: quest 
        ? `Parabéns, Guardião! A missão "${quest.title}" foi concluída com louvor. As recompensas foram adicionadas ao tesouro sagrado da guilda!`
        : 'Parabéns, Guardião! A missão foi concluída com louvor!',
      rewardXp: quest?.reward_xp || 200,
      badge: quest?.reward_text || 'Recompensa Sagrada',
      icon: 'verified',
    });
  };

  const handleEquipRelic = (relicId: string) => {
    setRelics(prev => prev.map(r => ({
      ...r,
      is_equipped: r.id === relicId ? !r.is_equipped : r.type === 'FRAME' ? false : r.is_equipped,
    })));
  };

  if (!currentUser) {
    return (
      <RpgLoginScreen
        onLogin={handleLogin}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        characters={characters}
      />
    );
  }

  const navItems = [
    { id: 'dashboard', label: vocab.tab_dashboard, icon: 'shield' },
    { id: 'membros', label: vocab.tab_membros, icon: 'groups' },
    { id: 'batalhas', label: vocab.tab_batalhas, icon: 'swords' },
    { id: 'grimorio', label: vocab.tab_grimorio, icon: 'auto_stories' },
    { id: 'oraculo', label: vocab.tab_oraculo, icon: 'radar' },
    { id: 'quests', label: vocab.tab_quests, icon: 'explore' },
    { id: 'inventario', label: vocab.tab_inventario, icon: 'backpack' },
    { id: 'arquitetura', label: vocab.tab_arquitetura, icon: 'terminal' },
    { id: 'configuracoes', label: vocab.tab_configuracoes, icon: 'tune' },
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#0f1227] text-[#dfe0fe] font-body relative flex flex-col items-center">
      {/* Background Radial Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(245,194,83,0.12),rgba(15,18,39,0)_70%),radial-gradient(ellipse_70%_40%_at_50%_110%,rgba(0,238,252,0.1),rgba(15,18,39,0)_70%)]" />

      {/* Retro scanline CRT atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 scanlines opacity-40" />

      {/* Sticky Responsive Header (Mobile & Desktop: Static, bounded, perfectly framed) */}
      <header className="sticky top-0 inset-x-0 w-full z-40 bg-[#090c21]/95 backdrop-blur-xl border-b border-surface-container-high shadow-[0_4px_24px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="w-full max-w-7xl mx-auto h-14 sm:h-16 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-3">
          {/* Logo & Guild Brand */}
          <div 
            onClick={() => { sounds.playSelect(); setCurrentTab('dashboard'); }}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0 min-w-0"
          >
            {/* Centered Sun & Moon Solstice Emblem inside Rounded Rectangle */}
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-surface-container-highest via-surface-container-high to-surface-container border border-primary/40 shadow-[0_0_16px_rgba(242,191,80,0.25)] overflow-hidden shrink-0 group-hover:border-primary transition-all">
              <svg viewBox="0 0 36 36" className="w-6 h-6 sm:w-7 sm:h-7 filter drop-shadow-[0_0_6px_rgba(242,191,80,0.4)]">
                {/* Solar Corona Rays */}
                <g stroke="#f5c253" strokeWidth="1.5" strokeLinecap="round" opacity="0.9">
                  <line x1="18" y1="3" x2="18" y2="6" />
                  <line x1="18" y1="30" x2="18" y2="33" />
                  <line x1="3" y1="18" x2="6" y2="18" />
                  <line x1="30" y1="18" x2="33" y2="18" />
                  <line x1="7.4" y1="7.4" x2="9.5" y2="9.5" />
                  <line x1="26.5" y1="26.5" x2="28.6" y2="28.6" />
                  <line x1="7.4" y1="28.6" x2="9.5" y2="26.5" />
                  <line x1="26.5" y1="9.5" x2="28.6" y2="7.4" />
                </g>
                {/* Solar Golden Sun Core */}
                <circle cx="18" cy="18" r="7.5" fill="#f5c253" />
                {/* Celestial Lunar Crescent */}
                <path
                  d="M 18,10.5 A 7.5,7.5 0 0,1 25.5,18 A 7.5,7.5 0 0,1 18,25.5 A 7.5,7.5 0 0,0 21,18 A 7.5,7.5 0 0,0 18,10.5 Z"
                  fill="#00eefc"
                />
                <circle cx="15.5" cy="16.5" r="1.2" fill="#ffffff" />
                <circle cx="21" cy="19.5" r="0.8" fill="#ffffff" />
              </svg>
            </div>

            <div className="flex flex-col min-w-0 max-w-[190px] sm:max-w-none">
              <span 
                className="font-label-sm text-[10px] text-primary tracking-widest uppercase font-bold truncate block w-[177px]"
                style={{ width: '177px', fontSize: '10px' }}
              >
                Santuário Amorim Granja
              </span>
              <h1 className="font-title text-xs sm:text-base font-bold text-on-surface truncate leading-tight">
                Tales of Finance
              </h1>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Visible on Tablet & Desktop) */}
          <nav className="hidden md:flex items-center gap-1 xl:gap-1.5 bg-surface-container-low/80 p-1 rounded-2xl border border-surface-container-high overflow-x-auto max-w-full">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { sounds.playSelect(); setCurrentTab(item.id as NavigationTab); }}
                  className={`px-2.5 lg:px-3 py-1.5 rounded-xl font-label-sm text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(242,191,80,0.3)]'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls (Compact, firmly framed on mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* PWA Mobile App Install Prompt */}
            <PWAInstallButton />

            {/* Difficulty Badge / Quick Switcher */}
            <button
              onClick={() => { sounds.playSelect(); setCurrentTab('configuracoes'); }}
              title={`Dificuldade atual: ${DIFFICULTY_CONFIGS[difficulty].name}. Clique para alterar.`}
              className="flex items-center gap-1 h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright border transition-all cursor-pointer active:scale-95 shadow-sm text-on-surface"
              style={{ borderColor: `${DIFFICULTY_CONFIGS[difficulty].accentColor}60` }}
            >
              <span className="material-symbols-outlined text-[17px]" style={{ color: DIFFICULTY_CONFIGS[difficulty].accentColor }}>
                {DIFFICULTY_CONFIGS[difficulty].icon}
              </span>
              <span className="font-label-sm text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hidden xs:inline" style={{ color: DIFFICULTY_CONFIGS[difficulty].accentColor }}>
                {DIFFICULTY_CONFIGS[difficulty].shortName}
              </span>
            </button>

            {/* Guardian Profile Badge & Settings / Logout */}
            <div 
              title={`Conectado como ${currentUser.name}. Clique para abrir configurações.`}
              onClick={() => { sounds.playSelect(); setCurrentTab('configuracoes'); }}
              className="flex items-center gap-1.5 h-8 sm:h-9 pl-1 pr-1.5 rounded-xl bg-surface-container-high border border-surface-container-highest shadow-sm shrink-0 cursor-pointer hover:border-primary/50 transition-colors"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg object-cover border border-primary/40 shrink-0"
              />
              <span className="text-[11px] font-bold text-on-surface truncate hidden xl:inline max-w-[65px]">
                {currentUser.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
                title={vocab.desconectar}
                className="w-5 h-5 rounded-md hover:bg-surface-bright flex items-center justify-center text-on-surface-variant hover:text-red-400 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area (Responsive width: full on mobile, wide on desktop) */}
      <main className="w-full max-w-7xl mx-auto flex-1 px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-28 md:pb-14 relative z-10 space-y-6 sm:space-y-8 overflow-x-hidden">
        {currentTab === 'dashboard' && (
          <GuildDashboard
            guild={guild}
            characters={characters}
            boss={boss}
            transactions={transactions}
            quests={quests}
            onNavigateToBattle={() => setCurrentTab('batalhas')}
            onNavigateToGrimoire={() => setCurrentTab('grimorio')}
            onNavigateToQuests={() => setCurrentTab('quests')}
            onNavigateToMembers={() => setCurrentTab('membros')}
            onClaimQuest={handleClaimQuest}
            onOpenAIChat={handleOpenAIChat}
            vocab={vocab}
            difficulty={difficulty}
          />
        )}

        {currentTab === 'membros' && (
          <GuildMembersCrud
            characters={characters}
            onAddCharacter={handleAddCharacter}
            onUpdateCharacter={handleUpdateCharacter}
            onDeleteCharacter={handleDeleteCharacter}
            currentUserId={currentUser.characterId}
          />
        )}

        {currentTab === 'batalhas' && (
          <BossFightBattle
            boss={boss}
            characters={characters}
            onPayFullInvoice={handlePayFullInvoice}
            onPayPartial={handlePayPartial}
            onResetBoss={handleResetBoss}
            onSelectMonthBoss={(selected) => setBoss(selected)}
            vocab={vocab}
            difficulty={difficulty}
          />
        )}

        {currentTab === 'oraculo' && (
          <OracleSpendingRadar
            guild={guild}
            characters={characters}
            transactions={transactions}
            onNavigateToGrimoire={() => setCurrentTab('grimorio')}
            onOpenAIChat={handleOpenAIChat}
          />
        )}

        {currentTab === 'grimorio' && (
          <GrimoireTransactions
            transactions={transactions}
            onAddTransaction={handleAddTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onOpenConjureModal={() => setIsConjureOpen(true)}
          />
        )}

        {currentTab === 'quests' && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 pt-1">
              <span className="font-label-sm text-[10px] text-primary uppercase tracking-widest font-bold">
                Tábula Cósmica
              </span>
              <h2 className="font-title text-2xl font-bold text-on-surface">Missões da Guilda</h2>
              <p className="text-xs text-on-surface-variant">
                Quests comportamentais que recompensam a família por não ceder aos impulsos de consumo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quests.map((q) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl bg-surface-container-low border flex flex-col justify-between gap-3 shadow-md ${
                    q.is_ready_to_claim ? 'border-primary/50 shadow-[0_0_16px_rgba(245,194,83,0.25)]' : 'border-surface-container-high'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-label-sm text-[10px] uppercase text-secondary font-bold">
                          {q.quest_type}
                        </span>
                        <h3 className="font-title text-sm font-bold text-on-surface mt-0.5">{q.title}</h3>
                      </div>
                      <span className="font-mono text-xs text-primary font-bold bg-surface-container-high px-2 py-0.5 rounded">
                        +{q.reward_xp} XP
                      </span>
                    </div>

                    <p className="text-xs text-on-surface-variant">{q.description}</p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-secondary">{q.current_progress} / {q.target_progress} {q.progress_unit}</span>
                        <span className="text-outline">{((q.current_progress / q.target_progress) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-container-lowest overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-container to-primary rounded-full shadow-[0_0_8px_rgba(245,194,83,0.5)]"
                          style={{ width: `${Math.min(100, (q.current_progress / q.target_progress) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-outline flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-primary">card_giftcard</span>
                        {q.reward_text}
                      </span>

                      {q.is_ready_to_claim && (
                        <button
                          onClick={() => handleClaimQuest(q.id)}
                          className="py-1.5 px-3 rounded-lg bg-primary-container text-on-primary-container font-label-sm text-xs uppercase font-bold cursor-pointer active:scale-95 shadow"
                        >
                          Reivindicar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'inventario' && (
          <RelicInventory
            guild={guild}
            relics={relics}
            onEquipRelic={handleEquipRelic}
          />
        )}

        {currentTab === 'arquitetura' && (
          <TechLeadArchitecture />
        )}

        {currentTab === 'configuracoes' && (
          <AppSettingsView
            currentDifficulty={difficulty}
            onChangeDifficulty={handleDifficultyChange}
            vocab={vocab}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            currentUser={currentUser}
            onLogout={handleLogout}
            characters={characters}
            onResetToDefaults={handleResetToDefaults}
            onTriggerTestToast={handleTriggerTestToast}
          />
        )}
      </main>

      {/* Floating Action Buttons (Positioned comfortably on both mobile & desktop) */}
      <button
        onClick={() => handleOpenAIChat()}
        className="fixed bottom-20 md:bottom-8 left-4 md:left-8 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-secondary-container via-secondary to-secondary-container text-[#050814] shadow-[0_0_20px_rgba(0,238,252,0.55)] flex items-center justify-center cursor-pointer active:scale-95 hover:scale-110 transition-transform group border border-secondary"
        title={vocab.oraculo_titulo}
      >
        <span className="material-symbols-outlined text-[24px] animate-pulse">psychology</span>
      </button>

      <button
        onClick={() => { sounds.playSpell(); setIsConjureOpen(true); }}
        className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-primary-container to-primary text-on-primary-container shadow-[0_0_20px_rgba(245,194,83,0.5)] flex items-center justify-center cursor-pointer active:scale-95 hover:scale-105 transition-transform"
        title={vocab.novo_registro}
      >
        <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
      </button>

      {/* Fixed Bottom Navigation (Mobile Only: scrollable carousel with comfortable spacing) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 w-full z-40 bg-[#090c21]/95 backdrop-blur-xl border-t border-surface-container-high shadow-[0_-8px_24px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-1.5 h-16 px-2.5 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => { sounds.playSelect(); setCurrentTab(item.id as NavigationTab); }}
                className={`flex flex-col items-center justify-center min-w-[70px] h-13 px-1.5 py-1 rounded-xl transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-primary/15 text-primary border border-primary/30 shadow-[0_0_12px_rgba(242,191,80,0.3)]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-label-sm text-[9px] uppercase font-bold tracking-tight text-center whitespace-nowrap mt-0.5">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Modal: Conjurar Registro */}
      <NewTransactionModal
        isOpen={isConjureOpen}
        onClose={() => setIsConjureOpen(false)}
        onSave={handleAddTransaction}
      />

      {/* Modal: Oráculo Arcano de IA (Chat Comportamental) */}
      <OracleAIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        guild={guild}
        characters={characters}
        boss={boss}
        transactions={transactions}
        initialPrompt={aiChatInitialPrompt}
      />

      {/* Classic 16-bit JRPG Dialogue Box Toast Component */}
      <RpgDialogueToast
        toast={activeToast}
        onDismiss={() => setActiveToast(null)}
      />
    </div>
  );
}

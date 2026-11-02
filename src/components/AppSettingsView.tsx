import React from 'react';
import { DifficultyLevel, DIFFICULTY_CONFIGS, VocabularyTerms } from '../utils/difficultyVocabulary';
import { AuthSession } from './RpgLoginScreen';
import { Character } from '../types/game';
import { sounds } from '../utils/soundEffects';
import { PWAInstallButton } from './PWAInstallButton';

interface AppSettingsViewProps {
  currentDifficulty: DifficultyLevel;
  onChangeDifficulty: (newLevel: DifficultyLevel) => void;
  vocab: VocabularyTerms;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentUser: AuthSession | null;
  onLogout: () => void;
  characters: Character[];
  onResetToDefaults: () => void;
  onTriggerTestToast?: (type: 'QUEST' | 'BOSS') => void;
}

export const AppSettingsView: React.FC<AppSettingsViewProps> = ({
  currentDifficulty,
  onChangeDifficulty,
  vocab,
  soundEnabled,
  onToggleSound,
  currentUser,
  onLogout,
  characters,
  onResetToDefaults,
  onTriggerTestToast,
}) => {
  const levels: DifficultyLevel[] = ['facil', 'medio', 'dificil'];

  return (
    <div className="w-full flex flex-col space-y-6 sm:space-y-8 pb-12">
      {/* 1. HEADER DO PAINEL DE CONFIGURAÇÕES */}
      <section className="bg-gradient-to-r from-surface-container via-surface-container-high to-surface-container rounded-3xl p-5 sm:p-7 border border-surface-container-highest shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary-container/20 text-primary-fixed border border-primary/40 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(245,194,83,0.3)]">
              <span className="material-symbols-outlined text-[28px]">tune</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-[11px] text-primary uppercase tracking-widest font-bold">
                  Painel de Controle Arcano
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-container-highest text-secondary border border-secondary/30">
                  {DIFFICULTY_CONFIGS[currentDifficulty].badge}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-title font-bold text-on-surface">
                {vocab.tab_configuracoes}
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Botão de Áudio transferido da Navbar */}
            <button
              onClick={() => {
                onToggleSound();
                if (!soundEnabled) sounds.playVictory();
              }}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl border transition-all cursor-pointer active:scale-95 shadow-md ${
                soundEnabled
                  ? 'bg-primary/20 border-primary/50 text-primary shadow-[0_0_12px_rgba(242,191,80,0.25)]'
                  : 'bg-surface-container-high border-surface-container-highest text-outline hover:text-on-surface'
              }`}
              title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Efeitos Sonoros'}
            >
              <span className={`material-symbols-outlined text-[20px] ${soundEnabled ? 'text-primary' : 'text-outline'}`}>
                {soundEnabled ? 'volume_up' : 'volume_off'}
              </span>
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider block font-bold leading-none">
                  Controle de Áudio
                </span>
                <span className="text-xs font-bold">
                  {soundEnabled ? 'Efeitos JRPG Ativos' : 'Modo Silencioso'}
                </span>
              </div>
            </button>

            <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm">
              Personalize a imersão de jogo, linguagem financeira, efeitos sonoros e gerencie as preferências do seu santuário a qualquer momento.
            </p>
          </div>
        </div>
      </section>

      {/* 2. SELETOR DE NÍVEIS DE DIFICULDADE (FÁCIL / MÉDIO / DIFÍCIL) */}
      <section className="bg-surface-container-low rounded-3xl p-5 sm:p-7 border border-surface-container-high shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-container-high gap-2">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-secondary text-[24px]">instant_mix</span>
            <div>
              <h3 className="text-base sm:text-lg font-title font-bold text-on-surface">
                Nível de Dificuldade & Linguagem
              </h3>
              <p className="text-xs text-outline">
                Alterne instantaneamente o modo de exibição entre termos convencionais e fantasia RPG.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-primary font-bold px-3 py-1 rounded-full bg-primary/10 border border-primary/30 shrink-0 self-start sm:self-auto">
            Modo Atual: {DIFFICULTY_CONFIGS[currentDifficulty].shortName}
          </span>
        </div>

        {/* Grade com os 3 Níveis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {levels.map((lvl) => {
            const config = DIFFICULTY_CONFIGS[lvl];
            const isSelected = currentDifficulty === lvl;

            return (
              <div
                key={lvl}
                onClick={() => {
                  sounds.playSelect();
                  onChangeDifficulty(lvl);
                }}
                className={`relative rounded-2xl p-5 transition-all cursor-pointer flex flex-col justify-between border text-left ${
                  isSelected
                    ? 'bg-surface-container-high border-2 shadow-[0_0_24px_rgba(242,191,80,0.3)] scale-[1.02]'
                    : 'bg-surface-container hover:bg-surface-container-high border-surface-container-highest hover:border-outline-variant opacity-85 hover:opacity-100'
                }`}
                style={{
                  borderColor: isSelected ? config.accentColor : undefined,
                }}
              >
                {/* Active Checkmark Pill */}
                {isSelected && (
                  <div 
                    className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider flex items-center gap-1 shadow-sm"
                    style={{ backgroundColor: config.accentColor, color: '#090c21' }}
                  >
                    <span className="material-symbols-outlined text-[13px]">check_circle</span>
                    <span>Ativo</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{ 
                        backgroundColor: `${config.accentColor}15`, 
                        borderColor: `${config.accentColor}40`,
                        color: config.accentColor 
                      }}
                    >
                      <span className="material-symbols-outlined text-[22px]">{config.icon}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider block font-bold" style={{ color: config.accentColor }}>
                        {config.badge}
                      </span>
                      <h4 className="text-base font-title font-bold text-on-surface">
                        {config.shortName}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-on-surface mb-2">
                    {config.tagline}
                  </p>

                  <p className="text-[11px] text-outline leading-relaxed mb-4">
                    {config.description}
                  </p>
                </div>

                {/* Exemplo Prático */}
                <div className="pt-3 border-t border-surface-container-high/80">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-outline block mb-1">
                    Como será exibido:
                  </span>
                  <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-surface-container-high font-mono text-[11px] text-on-surface-variant leading-snug">
                    {config.example}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabela de Amostragem Comparativa dos Termos */}
        <div className="mt-4 p-4 rounded-2xl bg-surface-container border border-surface-container-high space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[17px]">translate</span>
              Dicionário Comparativo em Tempo Real
            </span>
            <span className="text-[11px] text-outline">Mudança imediata em toda a interface</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-surface-container-low border border-emerald-500/30">
              <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1 uppercase">Modo Fácil</span>
              <p className="text-on-surface font-semibold">"Saldo Total em Conta"</p>
              <p className="text-on-surface-variant text-[11px]">"Pagar Fatura Integral"</p>
              <p className="text-outline text-[11px]">"Extrato de Transações"</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-amber-500/30">
              <span className="text-[10px] font-mono text-amber-400 font-bold block mb-1 uppercase">Modo Médio (Padrão)</span>
              <p className="text-on-surface font-semibold">"Mana Líquida (Saldo)"</p>
              <p className="text-on-surface-variant text-[11px]">"Contra-Ataque (Quitar Fatura)"</p>
              <p className="text-outline text-[11px]">"Grimório (Extrato)"</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-container-low border border-cyan-500/30">
              <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1 uppercase">Modo Difícil</span>
              <p className="text-on-surface font-semibold">"Mana Líquida Total"</p>
              <p className="text-on-surface-variant text-[11px]">"Contra-Ataque Crítico ao Boss"</p>
              <p className="text-outline text-[11px]">"Grimório Arcano de Feitiços"</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ÁUDIO, SONS E AMBIÊNCIA */}
      <section className="bg-surface-container-low rounded-3xl p-5 sm:p-7 border border-surface-container-high shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-surface-container-high">
          <span className="material-symbols-outlined text-primary text-[24px]">music_note</span>
          <div>
            <h3 className="text-base sm:text-lg font-title font-bold text-on-surface">
              Áudio e Efeitos Arcanos JRPG
            </h3>
            <p className="text-xs text-outline">
              Sons sintetizados Web Audio API estilo 16-bit Sea of Stars para golpes, magias e seleções.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container border border-surface-container-high">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${soundEnabled ? 'bg-primary/20 text-primary' : 'bg-surface-container-highest text-outline'}`}>
              <span className="material-symbols-outlined text-[24px]">
                {soundEnabled ? 'volume_up' : 'volume_off'}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-on-surface">Efeitos Sonoros Retrô</p>
              <p className="text-xs text-outline">
                {soundEnabled ? 'Sons de feitiços, ataques e vitórias ativados' : 'Aplicativo em modo silencioso'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onToggleSound();
                if (!soundEnabled) sounds.playVictory();
              }}
              className={`px-4 py-2.5 rounded-xl font-label-sm text-xs font-bold transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-primary-container text-on-primary-container shadow-md'
                  : 'bg-surface-container-high text-outline hover:text-on-surface'
              }`}
            >
              {soundEnabled ? 'Desativar Som' : 'Ativar Efeitos'}
            </button>

            {soundEnabled && (
              <button
                onClick={() => sounds.playCritical()}
                title="Testar som de golpe crítico"
                className="px-3 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-secondary border border-secondary/30 font-label-sm text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                <span>Testar</span>
              </button>
            )}
          </div>
        </div>

        {/* Demonstração de Toast em Caixa de Diálogo Clássica */}
        {onTriggerTestToast && (
          <div className="mt-4 p-4 rounded-2xl bg-surface-container border border-surface-container-high flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Demonstração de Toast Clássico RPG
              </p>
              <p className="text-[11px] text-outline">
                Simule instantaneamente os alertas sonoros e visuais de Missão Concluída e Boss Derrotado.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onTriggerTestToast('QUEST')}
                className="px-3 py-2 rounded-xl bg-primary-container/20 hover:bg-primary-container/30 text-primary-fixed border border-primary/40 font-label-sm text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Testar Missão</span>
              </button>

              <button
                type="button"
                onClick={() => onTriggerTestToast('BOSS')}
                className="px-3 py-2 rounded-xl bg-error-container/20 hover:bg-error-container/30 text-error border border-error/40 font-label-sm text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">swords</span>
                <span>Testar Boss</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 4. CONTA CONECTADA & GUARDIÃO ATIVO */}
      <section className="bg-surface-container-low rounded-3xl p-5 sm:p-7 border border-surface-container-high shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-surface-container-high">
          <span className="material-symbols-outlined text-secondary text-[24px]">account_circle</span>
          <div>
            <h3 className="text-base sm:text-lg font-title font-bold text-on-surface">
              Sessão do Guardião Conectado
            </h3>
            <p className="text-xs text-outline">
              Gerencie suas credenciais de acesso ou alterne para outro membro da guilda.
            </p>
          </div>
        </div>

        {currentUser && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface-container border border-surface-container-high">
            <div className="flex items-center gap-3.5">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-12 h-12 rounded-xl object-cover border border-primary/40 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-on-surface">{currentUser.name}</h4>
                  <span className="font-mono text-[10px] text-primary px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                    @{currentUser.username}
                  </span>
                </div>
                <p className="text-xs text-secondary font-medium">{currentUser.className} • Elemento {currentUser.element}</p>
                <p className="text-[11px] text-outline">
                  {currentUser.rememberMe ? 'Sessão permanente (Lembrar-me ativo)' : 'Sessão temporária (Expira ao fechar navegador)'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playSelect();
                onLogout();
              }}
              className="px-4 py-2.5 rounded-xl bg-error-container/20 hover:bg-error-container/40 text-error border border-error/30 font-label-sm text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>{vocab.desconectar}</span>
            </button>
          </div>
        )}
      </section>

      {/* 5. APLICATIVO DE CELULAR & PWA (ÍCONE NA TELA DO USUÁRIO) */}
      <section className="bg-gradient-to-br from-secondary-container/10 via-surface-container-low to-primary-container/10 rounded-3xl p-5 sm:p-7 border border-secondary/30 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-surface-container-high gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 text-secondary flex items-center justify-center border border-secondary/30">
              <span className="material-symbols-outlined text-[22px]">smartphone</span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-title font-bold text-on-surface flex items-center gap-2">
                Aplicativo de Celular
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-secondary text-[#050814] font-bold">
                  PWA
                </span>
              </h3>
              <p className="text-xs text-on-surface-variant">
                Adicione o Santuário à tela inicial do seu celular (Android & iOS) para usar como app nativo sem barra de navegador.
              </p>
            </div>
          </div>
          <PWAInstallButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-surface-container-high flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">phone_iphone</span>
            <div>
              <p className="font-bold text-on-surface mb-0.5">No iPhone (iOS / Safari)</p>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Abra no Safari, toque no ícone de <strong className="text-secondary">Compartilhar</strong> (quadrado com seta para cima) e escolha <strong className="text-secondary">"Adicionar à Tela de Início"</strong>.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface-container/60 border border-surface-container-high flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">phone_android</span>
            <div>
              <p className="font-bold text-on-surface mb-0.5">No Android (Chrome)</p>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Toque no botão <strong className="text-primary">"Instalar App"</strong> acima ou no menu do Chrome (três pontos) e selecione <strong className="text-primary">"Instalar aplicativo"</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GESTÃO DE DADOS & RESTAURAÇÃO */}
      <section className="bg-surface-container-low rounded-3xl p-5 sm:p-7 border border-surface-container-high shadow-xl space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-surface-container-high">
          <span className="material-symbols-outlined text-outline text-[24px]">database</span>
          <div>
            <h3 className="text-base sm:text-lg font-title font-bold text-on-surface">
              Persistência de Dados & Simulação
            </h3>
            <p className="text-xs text-outline">
              Seus registros, personagens recrutados e boss fights estão salvos com segurança no navegador.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface-container border border-surface-container-high flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm font-bold text-on-surface">Restaurar Dados Originais de Exemplo</p>
            <p className="text-[11px] text-outline">
              Reinicia o boss da fatura atual e restaura a party padrão caso queira recomeçar a demonstração.
            </p>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Deseja realmente restaurar os dados iniciais do Santuário?')) {
                sounds.playSelect();
                onResetToDefaults();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-outline-variant hover:text-on-surface border border-surface-container-highest font-label-sm text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
          >
            Restaurar Padrões
          </button>
        </div>
      </section>
    </div>
  );
};

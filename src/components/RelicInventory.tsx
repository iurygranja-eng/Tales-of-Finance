import React, { useState } from 'react';
import { Relic, Guild } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface RelicInventoryProps {
  guild: Guild;
  relics: Relic[];
  onEquipRelic: (relicId: string) => void;
  onActivateTicket?: (ticket: Relic) => void;
}

export const RelicInventory: React.FC<RelicInventoryProps> = ({
  guild,
  relics,
  onEquipRelic,
  onActivateTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'SCENERY' | 'OUTFIT' | 'BONUS_TICKET' | 'FRAME' | 'CARD_SKIN' | 'AURA' | 'TROPHY'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filtered = relics.filter(r => {
    if (activeTab === 'all') return true;
    return r.type === activeTab;
  });

  const equippedScenery = relics.find(r => r.is_equipped && r.type === 'SCENERY') || relics.find(r => r.type === 'SCENERY');
  const equippedFrame = relics.find(r => r.is_equipped && r.type === 'FRAME');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleTicketAction = (ticket: Relic) => {
    sounds.playVictory();
    if (onActivateTicket) {
      onActivateTicket(ticket);
    }
    showToast(`🎉 ${ticket.name} ativado com sucesso! Você tem +R$ ${ticket.bonus_amount || 150},00 liberados para lazer sem afetar o teto!`);
  };

  return (
    <div className="flex flex-col w-full pb-28 gap-6 sm:gap-7 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-secondary-container text-on-secondary-container font-label-sm text-xs font-bold shadow-[0_0_24px_rgba(0,238,252,0.5)] border border-secondary flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[18px]">celebration</span>
          {toastMessage}
        </div>
      )}

      {/* 1. Subheading & Titles */}
      <div className="flex flex-col gap-1 pt-1">
        <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-0.5 rounded-full bg-surface-container-high border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim animate-pulse" />
          <span className="font-label-sm text-[10px] text-primary-fixed tracking-widest uppercase font-bold">
            ARQUIVO ASTRAL • COLEÇÃO DA GUILDA
          </span>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="font-title text-2xl font-bold text-primary tracking-tight flex items-center gap-1.5">
            Inventário de Relíquias & Melhores Visuais
            <span className="text-secondary animate-bounce">✨</span>
          </h2>
          <div className="flex items-center gap-1 bg-surface-container-low px-2.5 py-1 rounded-full border border-surface-container-high shadow-inner">
            <span className="material-symbols-outlined text-primary-fixed-dim text-[16px]">stars</span>
            <span className="font-mono text-xs font-bold text-on-surface">1.850 PTS</span>
          </div>
        </div>
        <p className="text-xs text-on-surface-variant">
          Cenários cósmicos dos personagens, vestuários lendários e tickets de bonificação para lazer extra da família.
        </p>
      </div>

      {/* 2. Banner de Cenário Equipado Ativo (Visual Showcase) */}
      {equippedScenery && (
        <div className="relative w-full rounded-3xl overflow-hidden border border-primary/40 shadow-2xl min-h-[160px] sm:min-h-[190px] flex flex-col justify-end p-5 sm:p-6 group">
          {/* Background image do cenário */}
          <img
            src={equippedScenery.scenery_bg_url || equippedScenery.image_url}
            alt={equippedScenery.name}
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-60 contrast-110 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090c21] via-[#090c21]/40 to-transparent pointer-events-none" />

          {/* Foreground content */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 mb-1.5 text-primary text-[10px] font-mono uppercase font-bold">
                <span className="material-symbols-outlined text-[12px]">wallpaper</span>
                Cenário Ativo Equipado no Santuário
              </div>
              <h3 className="text-lg sm:text-xl font-title font-bold text-white drop-shadow-md">
                {equippedScenery.name}
              </h3>
              <p className="text-xs text-on-surface-variant max-w-lg drop-shadow">
                {equippedScenery.description}
              </p>
            </div>

            <span className="text-[11px] font-mono text-primary-fixed font-bold px-3 py-1 rounded-xl bg-surface-container-lowest/80 backdrop-blur-md border border-primary/30 shrink-0 self-start sm:self-auto">
              {equippedScenery.bonus_text}
            </span>
          </div>
        </div>
      )}

      {/* 3. Category Tabs (Cenários, Vestuário, Tickets de Lazer, Molduras, etc.) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
        {[
          { id: 'all', label: 'Todos', icon: 'grid_view' },
          { id: 'SCENERY', label: 'Cenários', icon: 'wallpaper' },
          { id: 'OUTFIT', label: 'Vestuário & Trajes', icon: 'checkroom' },
          { id: 'BONUS_TICKET', label: 'Tickets de Lazer', icon: 'confirmation_number' },
          { id: 'FRAME', label: 'Molduras', icon: 'crop_free' },
          { id: 'CARD_SKIN', label: 'Skins Cartão', icon: 'credit_card' },
          { id: 'AURA', label: 'Auras & Títulos', icon: 'all_inclusive' },
          { id: 'TROPHY', label: 'Troféus Boss', icon: 'military_tech' },
        ].map((tab) => {
          const count = relics.filter(r => tab.id === 'all' || r.type === tab.id).length;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => { sounds.playSelect(); setActiveTab(tab.id as typeof activeTab); }}
              className={`shrink-0 px-3.5 py-2 rounded-xl font-label-sm text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-bold border-primary shadow-md'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface border-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                isActive ? 'bg-on-primary-container/20 text-on-primary-container' : 'bg-surface-container-high text-outline'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Artifacts Catalog Cards */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-label-sm px-1">
          <span className="text-primary uppercase font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">magic_button</span>
            Catálogo de Artefatos & Benefícios
          </span>
          <span className="text-outline">{filtered.length} Exibidos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((relic) => {
            const isUnlocked = relic.unlocked;
            const isTicket = relic.type === 'BONUS_TICKET';
            const isScenery = relic.type === 'SCENERY';
            const isOutfit = relic.type === 'OUTFIT';

            return (
              <div
                key={relic.id}
                className={`w-full rounded-2xl p-4 border transition-all flex flex-col justify-between gap-3 shadow-md ${
                  isTicket
                    ? 'bg-gradient-to-br from-surface-container via-surface-container-low to-surface-container border-amber-500/40 hover:border-amber-400'
                    : isUnlocked
                      ? 'bg-surface-container-low hover:bg-surface-container border-surface-container-high'
                      : 'bg-surface-container-lowest/80 border-surface-container-high opacity-80'
                }`}
              >
                <div>
                  <div className="flex gap-3.5 items-start">
                    {/* Thumbnail / Visual Asset */}
                    <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0 bg-surface-container-lowest rounded-xl flex items-center justify-center border border-surface-container-high overflow-hidden shadow">
                      {relic.image_url ? (
                        <img src={relic.image_url} alt={relic.name} className="w-full h-full object-cover pixel-art" />
                      ) : isTicket ? (
                        <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-primary/20 flex flex-col items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
                          <span className="font-mono text-[9px] font-bold mt-0.5">+R$ {relic.bonus_amount}</span>
                        </div>
                      ) : (
                        <span className="material-symbols-outlined text-secondary text-[26px]">
                          {relic.type === 'AURA' ? 'all_inclusive' : relic.type === 'TROPHY' ? 'trophy' : 'diamond'}
                        </span>
                      )}

                      {!isUnlocked && (
                        <div className="absolute inset-0 bg-surface-container-lowest/70 backdrop-blur-xs flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline text-[20px]">lock</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Lore */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-[9px] uppercase font-bold">
                          {relic.rarity}
                        </span>
                        {relic.is_equipped && (
                          <span className="text-[9px] font-mono text-secondary px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/30 font-bold">
                            ATIVO
                          </span>
                        )}
                      </div>

                      <h4 className="font-title text-sm font-bold text-on-surface leading-snug mt-1 truncate">
                        {relic.name}
                      </h4>

                      <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5 leading-relaxed">
                        {relic.description}
                      </p>
                    </div>
                  </div>

                  {/* Bonus Tag */}
                  <div className="mt-3 p-2 rounded-xl bg-surface-container-lowest border border-surface-container-high flex items-center gap-1.5 text-primary-fixed-dim font-label-sm text-[11px]">
                    <span className="material-symbols-outlined text-[15px] shrink-0 text-primary">
                      {isTicket ? 'local_activity' : 'auto_fix_high'}
                    </span>
                    <span className="truncate">{relic.bonus_text}</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2.5 border-t border-surface-container-high flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-outline">
                    {isTicket ? 'Benefício Especial' : isScenery ? 'Melhoria de Cenário' : isOutfit ? 'Traje de Personagem' : 'Relíquia'}
                  </span>

                  {isTicket ? (
                    <button
                      onClick={() => handleTicketAction(relic)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-primary text-on-primary-container font-label-sm text-xs font-bold shadow-md hover:brightness-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[14px]">confirmation_number</span>
                      <span>Ativar Ticket (+R$ {relic.bonus_amount})</span>
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => { sounds.playLoot(); onEquipRelic(relic.id); }}
                      className={`px-3 py-1.5 rounded-xl font-label-sm text-xs font-bold transition-all cursor-pointer ${
                        relic.is_equipped
                          ? 'bg-surface-container-high text-outline cursor-default'
                          : 'bg-primary-container text-on-primary-container shadow-md active:scale-95 hover:brightness-105'
                      }`}
                    >
                      {relic.is_equipped ? 'Em Uso' : isScenery ? 'Equipar Cenário' : isOutfit ? 'Vestir Traje' : 'Equipar'}
                    </button>
                  ) : (
                    <span className="text-xs text-outline font-mono">Bloqueado</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

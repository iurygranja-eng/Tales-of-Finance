import React, { useEffect, useState } from 'react';
import { sounds } from '../utils/soundEffects';

export interface RpgToastData {
  id: string;
  type: 'QUEST_COMPLETE' | 'BOSS_DEFEATED' | 'ACHIEVEMENT' | 'INFO';
  speaker: string;
  speakerRole?: string;
  avatarUrl?: string;
  icon?: string;
  title: string;
  message: string;
  rewardXp?: number;
  rewardAmount?: number;
  rewardSerasa?: number;
  badge?: string;
  durationMs?: number;
}

interface RpgDialogueToastProps {
  toast: RpgToastData | null;
  onDismiss: () => void;
}

export const RpgDialogueToast: React.FC<RpgDialogueToastProps> = ({ toast, onDismiss }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!toast) return;

    // Play appropriate JRPG sound effect
    if (toast.type === 'BOSS_DEFEATED') {
      sounds.playVictory();
    } else if (toast.type === 'QUEST_COMPLETE') {
      sounds.playLoot();
    } else {
      sounds.playSelect();
    }

    const duration = toast.durationMs || 6500;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    setProgress(100);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isBoss = toast.type === 'BOSS_DEFEATED';
  const isQuest = toast.type === 'QUEST_COMPLETE';

  return (
    <div className="fixed top-4 md:top-6 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 w-full max-w-lg z-50 pointer-events-auto transition-all animate-in fade-in slide-in-from-top-6 duration-300">
      {/* JRPG Classic Dialogue Box Frame */}
      <div 
        onClick={() => { sounds.playSelect(); onDismiss(); }}
        className="relative bg-[#090c21]/95 backdrop-blur-xl rounded-2xl border-2 border-primary/90 shadow-[0_16px_40px_rgba(0,0,0,0.85)] p-4 sm:p-5 cursor-pointer group hover:border-primary transition-all overflow-hidden"
      >
        {/* Ornate Corner Rivets (Solstice Diamond Accents) */}
        <span className="absolute top-1.5 left-1.5 text-primary text-[10px] opacity-70">◆</span>
        <span className="absolute top-1.5 right-1.5 text-primary text-[10px] opacity-70">◆</span>
        <span className="absolute bottom-2 left-1.5 text-primary text-[10px] opacity-70">◆</span>
        <span className="absolute bottom-2 right-1.5 text-primary text-[10px] opacity-70">◆</span>

        {/* Outer Glow Halo */}
        <div className={`absolute -inset-1 rounded-2xl blur-lg pointer-events-none opacity-40 ${
          isBoss ? 'bg-error/30' : 'bg-primary/30'
        }`} />

        {/* Speaker Nameplate Tag (Attached to top-left border like classic RPGs) */}
        <div className="absolute -top-3 left-6 flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-gradient-to-r from-primary-container via-primary to-primary-container text-on-primary-container font-mono text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest border border-amber-300 shadow-md">
          <span className="material-symbols-outlined text-[13px]">
            {isBoss ? 'swords' : isQuest ? 'verified' : 'campaign'}
          </span>
          <span>{toast.speaker}</span>
          {toast.speakerRole && (
            <span className="opacity-80 font-normal ml-1 hidden sm:inline">
              • {toast.speakerRole}
            </span>
          )}
        </div>

        {/* Close Button in Top-Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            sounds.playSelect();
            onDismiss();
          }}
          className="absolute top-2 right-2.5 w-6 h-6 rounded-lg bg-surface-container-high/80 hover:bg-surface-bright text-on-surface-variant hover:text-white flex items-center justify-center transition-colors text-xs"
          title="Fechar mensagem"
        >
          ✕
        </button>

        {/* Content Body */}
        <div className="flex items-start gap-3.5 pt-1">
          {/* Speaker Portrait / Emblem Frame */}
          <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-surface-container-high flex-shrink-0 overflow-hidden border border-primary/50 shadow-md flex items-center justify-center p-0.5">
            {toast.avatarUrl ? (
              <img
                src={toast.avatarUrl}
                alt={toast.speaker}
                className="w-full h-full object-cover rounded-lg pixel-art filter contrast-110"
              />
            ) : (
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-primary-container/20 to-surface-container flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">
                  {toast.icon || (isBoss ? 'swords' : 'award_star')}
                </span>
              </div>
            )}
            {/* 16-bit scanlines subtle overlay */}
            <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
          </div>

          {/* Text and Details */}
          <div className="flex flex-col min-w-0 flex-1 space-y-1">
            <h4 className="font-title text-sm sm:text-base font-bold text-primary drop-shadow-[0_1px_8px_rgba(245,194,83,0.3)] leading-tight flex items-center gap-2">
              {toast.title}
            </h4>

            <p className="text-xs sm:text-[13px] text-on-surface leading-relaxed">
              {toast.message}
            </p>

            {/* Rewards & Metrics Badges */}
            <div className="flex items-center gap-2 pt-1.5 flex-wrap">
              {toast.rewardXp !== undefined && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-primary-container/20 text-primary-fixed border border-primary/40 text-[10.5px] font-mono font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[12px]">stars</span>
                  +{toast.rewardXp} XP
                </span>
              )}

              {toast.rewardAmount !== undefined && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10.5px] font-mono font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[12px]">payments</span>
                  R$ {toast.rewardAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} Quitado
                </span>
              )}

              {toast.rewardSerasa !== undefined && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-secondary-container/20 text-secondary border border-secondary/40 text-[10.5px] font-mono font-bold shadow-xs">
                  <span className="material-symbols-outlined text-[12px]">shield</span>
                  +{toast.rewardSerasa} Score
                </span>
              )}

              {toast.badge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant text-[10px] font-mono font-medium">
                  {toast.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* JRPG Blinking Advance Cursor Prompt in Bottom-Right */}
        <div className="flex items-center justify-end gap-1 mt-2 text-[10px] font-mono text-outline">
          <span className="opacity-75">Toque para fechar</span>
          <span className="text-primary animate-bounce text-[13px] leading-none">▼</span>
        </div>

        {/* Auto-dismiss progress countdown line */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-surface-container-high overflow-hidden">
          <div
            className={`h-full transition-all duration-75 ${
              isBoss ? 'bg-gradient-to-r from-error to-primary' : 'bg-gradient-to-r from-secondary-container to-primary'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

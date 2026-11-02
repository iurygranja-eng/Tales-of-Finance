import React, { useEffect, useState, useMemo } from 'react';

export type JrpgTransitionMode = 'wipe' | 'diamond' | 'particles' | 'random';

export interface JrpgScreenTransitionProps {
  isActive: boolean;
  phase: 'idle' | 'covering' | 'revealing';
  mode: JrpgTransitionMode;
  targetTabTitle?: string;
  targetTabIcon?: string;
}

export const JrpgScreenTransition: React.FC<JrpgScreenTransitionProps> = ({
  isActive,
  phase,
  mode,
  targetTabTitle,
  targetTabIcon = 'auto_awesome',
}) => {
  // Resolved visual mode (if random, pick one)
  const resolvedMode = useMemo(() => {
    if (mode === 'random') {
      const modes: Array<'wipe' | 'diamond' | 'particles'> = ['wipe', 'diamond', 'particles'];
      return modes[Math.floor(Math.random() * modes.length)];
    }
    return mode;
  }, [mode, isActive]);

  // Generate deterministic particles for the particle burst effect
  const particles = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: (i * 13.7) % 100,
      y: (i * 23.3) % 100,
      size: 4 + (i % 5) * 3,
      delay: (i * 0.02).toFixed(2),
      isSolar: i % 2 === 0,
      shape: i % 3 === 0 ? 'star' : i % 3 === 1 ? 'diamond' : 'circle',
    }));
  }, []);

  if (!isActive && phase === 'idle') {
    return null;
  }

  const isCovering = phase === 'covering';
  const isRevealing = phase === 'revealing';

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center"
      style={{ perspective: 1000 }}
    >
      {/* ============================================================== */}
      {/* 1. WIPE DIAGONAL (LÂMINAS DO SOLSTÍCIO: SEA OF STARS STYLE)    */}
      {/* ============================================================== */}
      {resolvedMode === 'wipe' && (
        <div className="absolute inset-0 w-full h-full pointer-events-auto">
          {/* Top-Left Solar Blade */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#121634] via-[#090c21] to-[#050714] origin-top-left transition-transform duration-200 ease-out"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 0 100%)',
              transform: isCovering
                ? 'translate3d(0, 0, 0)'
                : isRevealing
                ? 'translate3d(-105%, -105%, 0)'
                : 'translate3d(-105%, -105%, 0)',
              boxShadow: '0 0 40px rgba(245, 194, 83, 0.6)',
              borderBottom: '3px solid #f5c253',
            }}
          >
            <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-[#f5c253] to-white shadow-[0_0_20px_#f5c253]" />
          </div>

          {/* Bottom-Right Lunar Blade */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-[#121634] via-[#090c21] to-[#050714] origin-bottom-right transition-transform duration-200 ease-out"
            style={{
              clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
              transform: isCovering
                ? 'translate3d(0, 0, 0)'
                : isRevealing
                ? 'translate3d(105%, 105%, 0)'
                : 'translate3d(105%, 105%, 0)',
              boxShadow: '0 0 40px rgba(0, 238, 252, 0.6)',
              borderTop: '3px solid #00eefc',
            }}
          >
            <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-l from-transparent via-[#00eefc] to-white shadow-[0_0_20px_#00eefc]" />
          </div>

          {/* Energy Seam Flash at Diagonal Intersection */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-150 ${
              isCovering ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-[150%] h-1 bg-gradient-to-r from-[#f5c253] via-white to-[#00eefc] shadow-[0_0_30px_#ffffff] -rotate-45 absolute top-1/2 -left-1/4" />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DIAMOND IRIS (ÍRIS DE CRISTAL / RETRO PS1/SNES DIAMOND)     */}
      {/* ============================================================== */}
      {resolvedMode === 'diamond' && (
        <div className="absolute inset-0 w-full h-full pointer-events-auto flex items-center justify-center">
          <div
            className="w-[180vw] h-[180vw] max-w-none max-h-none bg-gradient-to-b from-[#141838] via-[#090c21] to-[#04060f] flex items-center justify-center transition-all duration-200 ease-in-out"
            style={{
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              transform: isCovering
                ? 'scale(1) rotate(0deg)'
                : isRevealing
                ? 'scale(0.01) rotate(45deg)'
                : 'scale(0.01) rotate(-45deg)',
              opacity: isCovering ? 1 : isRevealing ? 0.3 : 0,
              boxShadow: 'inset 0 0 60px rgba(0, 238, 252, 0.5), 0 0 50px rgba(245, 194, 83, 0.6)',
              border: '2px solid rgba(245, 194, 83, 0.8)',
            }}
          >
            <div className="w-full h-full scanlines opacity-35 pointer-events-none" />
          </div>

          {/* Glowing Arcane Concentric Diamond Borders */}
          <div
            className={`absolute w-72 h-72 border-2 border-secondary/60 rotate-45 transition-all duration-200 ${
              isCovering ? 'scale-100 opacity-100' : 'scale-150 opacity-0'
            } shadow-[0_0_24px_rgba(0,238,252,0.5)]`}
          />
          <div
            className={`absolute w-56 h-56 border border-primary/70 -rotate-45 transition-all duration-200 ${
              isCovering ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            } shadow-[0_0_20px_rgba(245,194,83,0.5)]`}
          />
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. PARTICLE BURST & DISSOLVE (MANA BURST / CENTELHAS CÓSMICAS) */}
      {/* ============================================================== */}
      {resolvedMode === 'particles' && (
        <div className="absolute inset-0 w-full h-full pointer-events-auto">
          {/* Backdrop Radial Dissolve */}
          <div
            className={`absolute inset-0 bg-[#090c21] transition-opacity duration-200 ease-in-out ${
              isCovering ? 'opacity-95' : isRevealing ? 'opacity-0' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,194,83,0.25)_0%,rgba(0,238,252,0.15)_40%,transparent_80%)]" />
            <div className="absolute inset-0 scanlines opacity-30" />
          </div>

          {/* Shimmering Floating Arcane Spark Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute transition-all duration-300"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  backgroundColor: p.isSolar ? '#f5c253' : '#00eefc',
                  boxShadow: p.isSolar
                    ? '0 0 12px #f5c253, 0 0 20px #ffdea1'
                    : '0 0 12px #00eefc, 0 0 20px #7df4ff',
                  borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'diamond' ? '2px' : '0px',
                  transform: isCovering
                    ? `scale(1) rotate(${p.id * 35}deg)`
                    : isRevealing
                    ? `translateY(-40px) scale(0) rotate(${p.id * 90}deg)`
                    : 'scale(0)',
                  opacity: isCovering ? 1 : 0,
                  transitionDelay: `${p.delay}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* CENTERPIECE: CELESTIAL SOLSTICE EMBLEM & TAB BANNER             */}
      {/* ============================================================== */}
      <div
        className={`relative z-20 flex flex-col items-center justify-center gap-3 transition-all duration-200 transform pointer-events-none ${
          isCovering
            ? 'scale-100 opacity-100'
            : isRevealing
            ? 'scale-90 opacity-0'
            : 'scale-75 opacity-0'
        }`}
      >
        {/* Arcane Rotating Ring */}
        <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24">
          {/* Outer Sun Rune Orbit */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/50 animate-jrpg-spin shadow-[0_0_20px_rgba(245,194,83,0.4)]" />

          {/* Inner Moon Rune Orbit */}
          <div className="absolute inset-2 rounded-full border border-secondary/60 animate-jrpg-spin-rev shadow-[0_0_16px_rgba(0,238,252,0.4)]" />

          {/* Golden Solstice Core */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-surface-container-highest via-[#090c21] to-surface-container border border-primary shadow-[0_0_24px_rgba(245,194,83,0.7)] flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[28px] sm:text-[32px] drop-shadow-[0_0_8px_rgba(245,194,83,0.8)]">
              {targetTabIcon}
            </span>
          </div>

          {/* Four Cardinal Rune Dots */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_#f5c253]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_#00eefc]" />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_#f5c253]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary shadow-[0_0_6px_#00eefc]" />
        </div>

        {/* Retro JRPG Tab Title Banner */}
        {targetTabTitle && (
          <div className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl bg-[#090c21]/90 border border-primary/50 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2">
              <span className="text-secondary text-xs">◆</span>
              <span className="font-pixel text-[10px] sm:text-[12px] text-primary tracking-wider uppercase text-center drop-shadow-[0_0_6px_rgba(245,194,83,0.6)]">
                {targetTabTitle}
              </span>
              <span className="text-primary text-xs">◆</span>
            </div>
            <span className="text-[9px] font-mono text-outline uppercase tracking-widest">
              Santuário de Solstício
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

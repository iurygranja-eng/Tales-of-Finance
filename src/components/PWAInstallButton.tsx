import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sounds } from '../utils/soundEffects';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'compact',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already running as an installed PWA on mobile home screen, suppress button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    sounds.playVictory();
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Instalar Aplicativo no Celular"
        className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-secondary-container/20 via-primary-container/20 to-surface-container border border-secondary/40 text-secondary hover:text-white font-label-sm text-xs font-bold shadow-[0_0_12px_rgba(0,238,252,0.25)] hover:shadow-[0_0_16px_rgba(0,238,252,0.4)] cursor-pointer active:scale-95 transition-all ${className}`}
      >
        <span className="material-symbols-outlined text-[17px] text-secondary animate-pulse">
          install_mobile
        </span>
        <span className={variant === 'compact' ? 'hidden sm:inline' : 'inline'}>
          Instalar App
        </span>
      </button>

      {/* Modal Guiado de Instalação para Celular (iOS & Android) */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-surface-container border border-primary/40 p-6 shadow-2xl flex flex-col space-y-4 text-on-surface relative">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary/40 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[24px]">install_mobile</span>
                </div>
                <div>
                  <h3 className="font-title text-base font-bold text-on-surface leading-snug">
                    Instalar no seu Celular
                  </h3>
                  <span className="text-[10px] font-mono text-secondary uppercase font-bold">
                    Ícone na Tela Inicial
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="w-8 h-8 rounded-lg bg-surface-container-high text-outline hover:text-on-surface flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs text-on-surface-variant leading-relaxed">
              <p>
                Transforme o <strong className="text-primary font-bold">Santuário Amorim Granja</strong> em um aplicativo nativo no seu telefone com ícone dedicado na tela inicial:
              </p>

              <div className="p-3 rounded-2xl bg-surface-container-lowest border border-surface-container-high space-y-2">
                <span className="font-label-sm text-[11px] font-bold text-primary block uppercase">
                  No iPhone (Safari):
                </span>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-outline">
                  <li>Toque no botão <strong className="text-on-surface">Compartilhar</strong> (ícone de quadrado com seta para cima).</li>
                  <li>Role para baixo e selecione <strong className="text-secondary">Adicionar à Tela de Início</strong>.</li>
                  <li>Toque em <strong className="text-primary">Adicionar</strong> no canto superior direito.</li>
                </ol>
              </div>

              <div className="p-3 rounded-2xl bg-surface-container-lowest border border-surface-container-high space-y-2">
                <span className="font-label-sm text-[11px] font-bold text-secondary block uppercase">
                  No Android (Chrome / Brave / Edge):
                </span>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-outline">
                  <li>Toque nos <strong className="text-on-surface">três pontinhos</strong> (menu do navegador).</li>
                  <li>Selecione <strong className="text-primary">Instalar aplicativo</strong> ou <strong className="text-secondary">Adicionar à tela inicial</strong>.</li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => { sounds.playSelect(); setShowIOSModal(false); }}
              className="w-full py-2.5 rounded-xl bg-primary-container text-on-primary-container font-label-sm text-xs font-bold shadow-md hover:brightness-105 active:scale-95 cursor-pointer"
            >
              Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

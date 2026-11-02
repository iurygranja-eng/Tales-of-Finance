import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';
import { Character } from '../types/game';

export interface AuthSession {
  username: string;
  name: string;
  characterId: string;
  className: string;
  element: 'SOLAR' | 'LUNAR' | 'ECLIPSE';
  avatarUrl: string;
  rememberMe: boolean;
  loggedInAt: string;
}

interface RpgLoginScreenProps {
  onLogin: (session: AuthSession) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  characters?: Character[];
}

const PRESET_GUARDIANS = [
  {
    username: 'iury',
    name: 'Iury',
    characterId: 'char-iury',
    className: 'Guerreiro Solar',
    element: 'SOLAR' as const,
    title: 'Guardião da Reserva',
    level: 22,
    avatarUrl: '/assets/aistudio/Iury2_197a4062.jpg',
    defaultPassword: 'solar',
    accentColor: '#f5c253',
    glowColor: 'rgba(245, 194, 83, 0.4)',
    borderHover: 'border-[#f5c253]',
    bgBadge: 'bg-[#f5c253]/15 text-[#f5c253]',
    icon: 'wb_sunny',
  },
  {
    username: 'ray',
    name: 'Ray',
    characterId: 'char-ray',
    className: 'Maga Lunar',
    element: 'LUNAR' as const,
    title: 'Sabedoria Financeira',
    level: 18,
    avatarUrl: '/assets/aistudio/Ray_284119bd.jpg',
    defaultPassword: 'lunar',
    accentColor: '#00eefc',
    glowColor: 'rgba(0, 238, 252, 0.4)',
    borderHover: 'border-[#00eefc]',
    bgBadge: 'bg-[#00eefc]/15 text-[#00eefc]',
    icon: 'dark_mode',
  },
];

export function RpgLoginScreen({ onLogin, soundEnabled, onToggleSound, characters }: RpgLoginScreenProps) {
  const guardiansList = (characters && characters.length > 0)
    ? characters.map(c => {
        const isLunar = c.element === 'LUNAR';
        const isSolar = c.element === 'SOLAR';
        const u = c.username || c.id.replace('char-', '').toLowerCase();
        const p = c.password || (isSolar ? 'solar' : isLunar ? 'lunar' : 'senha123');
        const accent = isLunar ? '#00eefc' : isSolar ? '#f5c253' : '#d8b4fe';
        return {
          username: u,
          name: c.name,
          characterId: c.id,
          className: c.class_name,
          element: c.element,
          title: c.title,
          level: c.level,
          avatarUrl: c.avatar_url,
          defaultPassword: p,
          accentColor: accent,
          glowColor: `${accent}66`,
          borderHover: isLunar ? 'border-[#00eefc]' : isSolar ? 'border-[#f5c253]' : 'border-purple-400',
          bgBadge: isLunar ? 'bg-[#00eefc]/15 text-[#00eefc]' : isSolar ? 'bg-[#f5c253]/15 text-[#f5c253]' : 'bg-purple-400/15 text-purple-300',
          icon: isLunar ? 'dark_mode' : isSolar ? 'wb_sunny' : 'auto_awesome',
        };
      })
    : PRESET_GUARDIANS;

  const initialGuardian = guardiansList[0] || PRESET_GUARDIANS[0];

  const [selectedGuardian, setSelectedGuardian] = useState<string>(initialGuardian.username);
  const [username, setUsername] = useState(initialGuardian.username);
  const [password, setPassword] = useState(initialGuardian.defaultPassword);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectGuardian = (guardianUsername: string) => {
    sounds.playSelect();
    setSelectedGuardian(guardianUsername);
    const guardian = guardiansList.find(g => g.username === guardianUsername);
    if (guardian) {
      setUsername(guardian.username);
      setPassword(guardian.defaultPassword);
      setErrorMessage(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMessage('Informe a identidade do Guardião para desbloquear o portão.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Digite o Selo Arcano (senha) para autenticar.');
      return;
    }

    setIsLoading(true);
    sounds.playSpell();

    setTimeout(() => {
      // Find matching guardian or construct profile
      const matched = guardiansList.find(
        g => g.username.toLowerCase() === username.trim().toLowerCase()
      );

      const session: AuthSession = {
        username: username.trim(),
        name: matched ? matched.name : username.trim(),
        characterId: matched ? matched.characterId : 'char-custom',
        className: matched ? matched.className : 'Guardião de Mana',
        element: matched ? matched.element : 'ECLIPSE',
        avatarUrl: matched ? matched.avatarUrl : '/assets/aistudio/Iury2_197a4062.jpg',
        rememberMe,
        loggedInAt: new Date().toISOString(),
      };

      sounds.playLoot();
      onLogin(session);
    }, 600);
  };

  const handleGuestLogin = () => {
    sounds.playSelect();
    const session: AuthSession = {
      username: 'explorador',
      name: 'Explorador Convidado',
      characterId: 'char-iury',
      className: 'Guardião Solar',
      element: 'SOLAR',
      avatarUrl: '/assets/aistudio/Iury2_197a4062.jpg',
      rememberMe: false,
      loggedInAt: new Date().toISOString(),
    };
    sounds.playLoot();
    onLogin(session);
  };

  return (
    <div className="min-h-screen w-full bg-[#070914] text-[#e0e2ec] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Mystical Astral Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-gradient-to-br from-[#f5c253]/15 via-transparent to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] rounded-full bg-gradient-to-tl from-[#00eefc]/15 via-transparent to-transparent blur-3xl pointer-events-none" />

      {/* Floating Retro RPG Stars & Dust particles */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Header Audio Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Silenciar Áudio' : 'Ativar Efeitos Sonoros RPG'}
          className="w-10 h-10 rounded-xl bg-[#121629]/80 hover:bg-[#1a203a] border border-[#2b314d] flex items-center justify-center text-[#e0e2ec] cursor-pointer shadow-md active:scale-95 transition-all"
        >
          <span className={`material-symbols-outlined text-[20px] ${soundEnabled ? 'text-[#f5c253]' : 'text-slate-400'}`}>
            {soundEnabled ? 'volume_up' : 'volume_off'}
          </span>
        </button>
      </div>

      {/* Main RPG Login Parchment / Card */}
      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Solstice Emblem (Sun & Moon Harmony) */}
        <div className="relative mb-3 flex items-center justify-center">
          <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#1e233d] via-[#12162b] to-[#0c0f20] border-2 border-[#f5c253]/50 shadow-[0_0_30px_rgba(245,194,83,0.3)]">
            <svg viewBox="0 0 36 36" className="w-11 h-11 sm:w-14 sm:h-14 filter drop-shadow-[0_0_10px_rgba(245,194,83,0.6)]">
              {/* Solar Rays */}
              <g stroke="#f5c253" strokeWidth="1.6" strokeLinecap="round" opacity="0.95">
                <line x1="18" y1="3" x2="18" y2="6" />
                <line x1="18" y1="30" x2="18" y2="33" />
                <line x1="3" y1="18" x2="6" y2="18" />
                <line x1="30" y1="18" x2="33" y2="18" />
                <line x1="7.4" y1="7.4" x2="9.5" y2="9.5" />
                <line x1="26.5" y1="26.5" x2="28.6" y2="28.6" />
                <line x1="7.4" y1="28.6" x2="9.5" y2="26.5" />
                <line x1="26.5" y1="9.5" x2="28.6" y2="7.4" />
              </g>
              {/* Golden Solar Core */}
              <circle cx="18" cy="18" r="7.5" fill="#f5c253" />
              {/* Lunar Cyan Eclipse */}
              <path
                d="M 18,10.5 A 7.5,7.5 0 0,1 25.5,18 A 7.5,7.5 0 0,1 18,25.5 A 7.5,7.5 0 0,0 21,18 A 7.5,7.5 0 0,0 18,10.5 Z"
                fill="#00eefc"
              />
              <circle cx="15.5" cy="16.5" r="1.3" fill="#ffffff" />
              <circle cx="21" cy="19.5" r="0.9" fill="#ffffff" />
            </svg>
          </div>
          {/* Subtle pulsating halo */}
          <div className="absolute inset-0 rounded-3xl border border-[#00eefc]/40 animate-pulse pointer-events-none" />
        </div>

        {/* Title & RPG Header */}
        <div className="text-center mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#f5c253] drop-shadow-[0_0_8px_rgba(245,194,83,0.5)]">
            Crônicas de Mana • Santuário
          </span>
          <h1 className="font-title text-2xl sm:text-3xl font-extrabold text-white tracking-wide mt-0.5">
            TALES OF FINANCE
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Portão Cósmico de Acesso à Gestão de Mana e Combate às Faturas
          </p>
        </div>

        {/* RPG Dialogue / Lore Box (Classic JRPG Frame) */}
        <div className="w-full bg-[#0e1224]/90 border border-[#262c4a] rounded-2xl p-3.5 mb-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md relative">
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[20px] text-[#00eefc] shrink-0 mt-0.5 animate-pulse">
              auto_stories
            </span>
            <div className="text-xs leading-relaxed text-slate-300 font-sans">
              <span className="text-white font-semibold block mb-0.5">Prólogo da Guilda:</span>
              Os Titãs da Fatura rondam o reino de Amorim Granja. Escolha seu Guardião ou insira seu Selo Arcano para adentrar o Santuário.
            </div>
          </div>
        </div>

        {/* Main Form Box */}
        <div className="w-full bg-[#12162b]/95 border border-[#2b3354] rounded-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          {/* Quick Guardian Selector */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              Selecione o Guardião:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {guardiansList.map((guardian) => {
                const isSelected = selectedGuardian === guardian.username;
                return (
                  <button
                    key={guardian.username}
                    type="button"
                    onClick={() => handleSelectGuardian(guardian.username)}
                    className={`relative flex items-center gap-2.5 p-2 rounded-xl border text-left cursor-pointer transition-all active:scale-[0.98] ${
                      isSelected
                        ? `bg-[#1a213e] ${guardian.borderHover} shadow-[0_0_16px_${guardian.glowColor}]`
                        : 'bg-[#0e1224] border-[#222842] hover:border-[#384168] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-[#303859]">
                      <img
                        src={guardian.avatarUrl}
                        alt={guardian.name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div
                          className="absolute inset-0 border-2 rounded-lg pointer-events-none"
                          style={{ borderColor: guardian.accentColor }}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white truncate">
                          {guardian.name}
                        </span>
                        <span
                          className="material-symbols-outlined text-[13px]"
                          style={{ color: guardian.accentColor }}
                        >
                          {guardian.icon}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {guardian.className}
                      </span>
                      <span
                        className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${guardian.bgBadge}`}
                      >
                        Nv. {guardian.level}
                      </span>
                    </div>

                    {isSelected && (
                      <span
                        className="material-symbols-outlined text-[16px] shrink-0"
                        style={{ color: guardian.accentColor }}
                      >
                        check_circle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Guardian Name / Login */}
            <div>
              <label
                htmlFor="rpg-username"
                className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5"
              >
                Identificador / Guardião
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">
                  person
                </span>
                <input
                  id="rpg-username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Nome do Guardião ou E-mail"
                  className="w-full bg-[#0a0d1c] border border-[#262e4f] focus:border-[#f5c253] text-white text-sm rounded-xl pl-9 pr-3 py-2.5 outline-none transition-colors placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Secret Seal (Password) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="rpg-password"
                  className="text-[11px] font-bold text-slate-300 uppercase tracking-wider"
                >
                  Selo Arcano (Senha)
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  demo: solar / lunar
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-slate-400 text-[18px]">
                  key
                </span>
                <input
                  id="rpg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Digite sua senha arcana"
                  className="w-full bg-[#0a0d1c] border border-[#262e4f] focus:border-[#00eefc] text-white text-sm rounded-xl pl-9 pr-10 py-2.5 outline-none transition-colors placeholder:text-slate-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-white cursor-pointer transition-colors"
                  title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me Option (Manter Conectado) */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => {
                      sounds.playSelect();
                      setRememberMe(e.target.checked);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 rounded-md border border-[#3a446e] bg-[#0a0d1c] peer-checked:bg-[#f5c253] peer-checked:border-[#f5c253] transition-all flex items-center justify-center shadow-inner group-hover:border-[#f5c253]">
                    {rememberMe && (
                      <span className="material-symbols-outlined text-[15px] text-[#0c0f20] font-bold">
                        check
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                    Manter conectado
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Preservar acesso no dispositivo
                  </span>
                </div>
              </label>

              <span className="text-[10px] text-[#00eefc] font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">shield</span>
                Sessão Segura
              </span>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2 animate-shake">
                <span className="material-symbols-outlined text-[16px] text-red-400 shrink-0">
                  error
                </span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-title text-sm uppercase tracking-wider font-extrabold bg-gradient-to-r from-[#f5c253] via-[#ffcf66] to-[#00eefc] text-[#0c0f20] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-[0_0_24px_rgba(245,194,83,0.35)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    progress_activity
                  </span>
                  <span>Rompendo Selos...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[19px]">
                    meeting_room
                  </span>
                  <span>Iniciar Jornada no Santuário</span>
                </>
              )}
            </button>

            {/* Quick Guest Access */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleGuestLogin}
                className="text-xs text-slate-400 hover:text-[#00eefc] transition-colors underline-offset-4 hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Entrar como Guardião Convidado</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer Lore note */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-slate-500">
            Tales of Finance • Versão 2.4.0 • Guilda Amorim Granja
          </p>
        </div>
      </div>
    </div>
  );
}

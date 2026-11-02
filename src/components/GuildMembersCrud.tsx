import React, { useState } from 'react';
import { Character, CharacterClass, ElementType } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface GuildMembersCrudProps {
  characters: Character[];
  onAddCharacter: (character: Character) => void;
  onUpdateCharacter: (character: Character) => void;
  onDeleteCharacter: (characterId: string) => void;
  currentUserId?: string;
}

// Preset RPG Avatars ready for selection
export const AVATAR_PRESETS = [
  {
    id: 'ray',
    label: 'Ray (Maga Lunar)',
    url: '/assets/aistudio/Ray_284119bd.jpg',
    element: 'LUNAR' as ElementType,
    defaultClass: 'Maga Lunar' as CharacterClass,
  },
  {
    id: 'iury',
    label: 'Iury (Guerreiro Solar)',
    url: '/assets/aistudio/Iury2_197a4062.jpg',
    element: 'SOLAR' as ElementType,
    defaultClass: 'Guerreiro Solar' as CharacterClass,
  },
  {
    id: 'alchemist',
    label: 'Alquimista do Aporte',
    url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=300&auto=format&fit=crop&q=80',
    element: 'ECLIPSE' as ElementType,
    defaultClass: 'Alquimista do Aporte' as CharacterClass,
  },
  {
    id: 'guardian',
    label: 'Guardião do Orçamento',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80',
    element: 'SOLAR' as ElementType,
    defaultClass: 'Guardião do Orçamento' as CharacterClass,
  },
  {
    id: 'cleric',
    label: 'Clériga da Reserva',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
    element: 'LUNAR' as ElementType,
    defaultClass: 'Clérigo da Reserva' as CharacterClass,
  },
];

const AVAILABLE_CLASSES: CharacterClass[] = [
  'Guerreiro Solar',
  'Maga Lunar',
  'Alquimista do Aporte',
  'Guardião do Orçamento',
  'Clérigo da Reserva',
];

export const GuildMembersCrud: React.FC<GuildMembersCrudProps> = ({
  characters,
  onAddCharacter,
  onUpdateCharacter,
  onDeleteCharacter,
  currentUserId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [characterToDelete, setCharacterToDelete] = useState<Character | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Membro');
  const [className, setClassName] = useState<CharacterClass>('Guerreiro Solar');
  const [element, setElement] = useState<ElementType>('SOLAR');
  const [title, setTitle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/assets/aistudio/Iury2_197a4062.jpg');
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [level, setLevel] = useState(1);
  const [contributionPercent, setContributionPercent] = useState(50);
  const [formError, setFormError] = useState<string | null>(null);

  const totalContribution = characters.reduce((sum, c) => sum + (c.contribution_percent || 0), 0);

  const openCreateModal = () => {
    sounds.playSelect();
    setEditingCharacter(null);
    setName('');
    setUsername('');
    setPassword('');
    setEmail('');
    setRole('Membro');
    setClassName('Guerreiro Solar');
    setElement('SOLAR');
    setTitle('Guardião do Tesouro');
    setAvatarUrl('/assets/aistudio/Iury2_197a4062.jpg');
    setCustomAvatarInput('');
    setLevel(1);
    // suggest balanced percent
    const remaining = Math.max(0, 100 - totalContribution);
    setContributionPercent(remaining > 0 ? remaining : 25);
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (char: Character) => {
    sounds.playSelect();
    setEditingCharacter(char);
    setName(char.name);
    setUsername(char.username || char.id.replace('char-', ''));
    setPassword(char.password || 'solar');
    setEmail(char.email || '');
    setRole(char.role || 'Membro');
    setClassName(char.class_name);
    setElement(char.element);
    setTitle(char.title);
    setAvatarUrl(char.avatar_url);
    setCustomAvatarInput(char.avatar_url.startsWith('http') ? char.avatar_url : '');
    setLevel(char.level);
    setContributionPercent(char.contribution_percent || 50);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('O Nome do Guardião é obrigatório.');
      return;
    }
    if (!username.trim()) {
      setFormError('O Identificador de Login (username) é obrigatório.');
      return;
    }

    // Check for unique username among other characters
    const cleanUsername = username.trim().toLowerCase();
    const isDuplicate = characters.some(
      c => c.username?.toLowerCase() === cleanUsername && c.id !== editingCharacter?.id
    );
    if (isDuplicate) {
      setFormError('Este identificador de login já está em uso por outro membro.');
      return;
    }

    const finalAvatar = customAvatarInput.trim() || avatarUrl;

    if (editingCharacter) {
      // Update
      const updated: Character = {
        ...editingCharacter,
        name: name.trim(),
        username: cleanUsername,
        password: password.trim() || editingCharacter.password || 'senha123',
        email: email.trim() || undefined,
        role: role.trim(),
        class_name: className,
        element,
        title: title.trim() || 'Guardião de Mana',
        avatar_url: finalAvatar,
        level,
        contribution_percent: contributionPercent,
      };
      sounds.playSpell();
      onUpdateCharacter(updated);
    } else {
      // Create
      const newChar: Character = {
        id: `char-${cleanUsername}-${Date.now()}`,
        guild_id: 'guild-amorim-granja',
        user_id: `user-${cleanUsername}`,
        username: cleanUsername,
        password: password.trim() || 'solar',
        email: email.trim() || undefined,
        role: role.trim(),
        name: name.trim(),
        class_name: className,
        element,
        title: title.trim() || 'Guardião de Mana',
        avatar_url: finalAvatar,
        level,
        xp: 150,
        xp_max: 1000,
        contribution_percent: contributionPercent,
        is_active: false,
        created_at: new Date().toISOString(),
      };
      sounds.playLoot();
      onAddCharacter(newChar);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!characterToDelete) return;
    if (characters.length <= 1) {
      alert('A Guilda precisa de ao menos um Guardião ativo para existir!');
      setCharacterToDelete(null);
      return;
    }

    sounds.playAttack();
    onDeleteCharacter(characterToDelete.id);
    setCharacterToDelete(null);
  };

  return (
    <div className="flex flex-col w-full space-y-6 sm:space-y-8 pb-12">
      {/* 1. Header Banner do Salão dos Guardiões */}
      <section className="bg-surface-container/90 rounded-3xl p-5 sm:p-6 lg:p-8 shadow-2xl border border-surface-container-high relative overflow-hidden space-y-5">
        <div className="absolute -top-16 -right-16 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container-high">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary-container/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(245,194,83,0.3)]">
              <span className="material-symbols-outlined text-[24px]">groups</span>
            </div>
            <div>
              <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold block">
                Aliança Amorim & Granja
              </span>
              <h2 className="font-title text-xl sm:text-2xl lg:text-3xl font-bold text-on-surface">
                Salão dos Guardiões da Guilda
              </h2>
            </div>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-label-sm text-xs uppercase font-extrabold shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            <span>Recrutar Guardião</span>
          </button>
        </div>

        {/* Guild Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container-high flex flex-col justify-between">
            <span className="text-[11px] text-outline uppercase font-bold tracking-wider">
              Total de Membros
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-primary">
                {characters.length}
              </span>
              <span className="text-xs text-on-surface-variant">Guardiões Ativos</span>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container-high flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-outline uppercase font-bold tracking-wider">
                Distribuição Orçamentária
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                totalContribution === 100 ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'
              }`}>
                {totalContribution}%
              </span>
            </div>
            <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden mt-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  totalContribution === 100
                    ? 'bg-gradient-to-r from-secondary-container to-secondary shadow-[0_0_8px_rgba(0,238,252,0.4)]'
                    : 'bg-gradient-to-r from-primary-container to-primary'
                }`}
                style={{ width: `${Math.min(100, totalContribution)}%` }}
              />
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-4 border border-surface-container-high flex flex-col justify-between">
            <span className="text-[11px] text-outline uppercase font-bold tracking-wider">
              Autenticação de Membros
            </span>
            <p className="text-xs text-on-surface-variant mt-1">
              Todos os membros cadastrados podem se conectar na tela de login com seu Selo Arcano.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Responsive Grid de Guardiões (CRUD Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {characters.map((char) => {
          const isLunar = char.element === 'LUNAR';
          const isSolar = char.element === 'SOLAR';
          const isCurrentUser = char.id === currentUserId || char.username === currentUserId;

          const accentColor = isLunar ? '#00eefc' : isSolar ? '#f5c253' : '#d8b4fe';
          const borderClass = isLunar 
            ? 'border-secondary/40 hover:border-secondary' 
            : isSolar 
            ? 'border-primary/40 hover:border-primary' 
            : 'border-purple-400/40 hover:border-purple-400';

          return (
            <div
              key={char.id}
              className={`bg-surface-container/90 rounded-3xl p-5 border ${borderClass} shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4 transition-all duration-300 hover:shadow-2xl group`}
            >
              {/* Top Row: Role Badge & Active Indicator */}
              <div className="flex items-center justify-between">
                <span
                  className="font-label-sm text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: `${accentColor}18`,
                    color: accentColor,
                    borderColor: `${accentColor}40`,
                    borderWidth: '1px',
                  }}
                >
                  {char.role || 'Guardião'}
                </span>

                <div className="flex items-center gap-1.5">
                  {isCurrentUser && (
                    <span className="text-[10px] bg-secondary-container/20 text-secondary border border-secondary/30 px-2 py-0.5 rounded-md font-bold">
                      Você
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-outline font-bold">
                    Nv. {char.level}
                  </span>
                </div>
              </div>

              {/* Character Profile Overview */}
              <div className="flex items-center gap-3.5">
                <div
                  className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shrink-0 border-2 shadow-md bg-surface-container-high"
                  style={{ borderColor: accentColor }}
                >
                  <img
                    src={char.avatar_url}
                    alt={char.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-title text-base sm:text-lg font-bold text-on-surface truncate">
                    {char.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-0.5">
                    <span
                      className="material-symbols-outlined text-[15px]"
                      style={{ color: accentColor }}
                    >
                      {isLunar ? 'dark_mode' : isSolar ? 'wb_sunny' : 'auto_awesome'}
                    </span>
                    <span className="font-semibold text-slate-200 truncate">{char.class_name}</span>
                  </div>
                  <span className="text-[11px] text-outline truncate block mt-0.5">
                    {char.title}
                  </span>
                </div>
              </div>

              {/* Credentials & Financial Contribution info */}
              <div className="bg-surface-container-low rounded-2xl p-3 border border-surface-container-high space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-outline">Login:</span>
                  <span className="font-mono text-on-surface font-semibold">
                    @{char.username || char.name.toLowerCase()}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-outline">Cota no Tesouro:</span>
                    <span className="font-mono font-bold" style={{ color: accentColor }}>
                      {char.contribution_percent}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${char.contribution_percent}%`,
                        backgroundColor: accentColor,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <span className="text-outline">XP Mágico:</span>
                  <span className="font-mono text-outline">
                    {char.xp} / {char.xp_max}
                  </span>
                </div>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => openEditModal(char)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-bold border border-surface-container-highest transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">edit</span>
                  <span>Editar</span>
                </button>

                <button
                  type="button"
                  disabled={characters.length <= 1}
                  onClick={() => {
                    sounds.playSelect();
                    setCharacterToDelete(char);
                  }}
                  title={characters.length <= 1 ? 'Mínimo de 1 guardião na guilda' : 'Dispensar guardião'}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface-container-high hover:bg-error-container/40 text-on-surface-variant hover:text-error text-xs font-bold border border-surface-container-highest transition-all active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[16px]">person_remove</span>
                  <span>Dispensar</span>
                </button>
              </div>
            </div>
          );
        })}

        {/* Quick Add Member Card Slot */}
        <div
          onClick={openCreateModal}
          className="rounded-3xl border-2 border-dashed border-surface-container-highest hover:border-primary/60 bg-surface-container-low/40 hover:bg-surface-container-low/80 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 min-h-[260px] group"
        >
          <div className="w-14 h-14 rounded-2xl bg-surface-container-high group-hover:bg-primary-container/30 border border-surface-container-highest group-hover:border-primary flex items-center justify-center text-outline group-hover:text-primary transition-all shadow-sm">
            <span className="material-symbols-outlined text-[28px]">add</span>
          </div>
          <h4 className="font-title text-base font-bold text-on-surface group-hover:text-primary mt-3 transition-colors">
            Adicionar Novo Membro
          </h4>
          <p className="text-xs text-outline mt-1 max-w-[200px]">
            Amplie a aliança da guilda para dividir faturas e missões financeiras
          </p>
        </div>
      </div>

      {/* 3. Modal de Cadastro & Edição de Membro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#12162b] border border-[#2b3354] rounded-3xl w-full max-w-xl p-5 sm:p-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#252c48]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary-container/20 border border-primary/40 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">
                    {editingCharacter ? 'manage_accounts' : 'person_add'}
                  </span>
                </div>
                <div>
                  <h3 className="font-title text-lg font-bold text-white">
                    {editingCharacter ? 'Editar Selo do Guardião' : 'Recrutar Novo Guardião'}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Cadastre o herói para combate às dívidas e login no Santuário
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#1a203a] hover:bg-[#252c48] flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Error Notification */}
            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-red-400 shrink-0">
                  error
                </span>
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4 sm:space-y-5 mt-4">
              {/* Row 1: Nome & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Nome Completo / Exibição *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Solana, Thales, Lívia"
                    className="w-full bg-[#0a0d1c] border border-[#262e4f] focus:border-[#f5c253] text-white text-sm rounded-xl px-3 py-2.5 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Login / Username (@identificador) *
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ex: solana, thales"
                    className="w-full bg-[#0a0d1c] border border-[#262e4f] focus:border-[#00eefc] text-white text-sm rounded-xl px-3 py-2.5 outline-none transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Row 2: Senha & Papel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Selo Arcano (Senha de Acesso)
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ex: senha123"
                    className="w-full bg-[#0a0d1c] border border-[#262e4f] focus:border-[#f5c253] text-white text-sm rounded-xl px-3 py-2.5 outline-none transition-colors font-mono"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Usado para entrar no aplicativo
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Papel na Guilda
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#0a0d1c] border border-[#262e4f] focus:border-primary text-white text-sm rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                  >
                    <option value="Líder da Guilda">Líder da Guilda</option>
                    <option value="Oficial da Guilda">Oficial da Guilda</option>
                    <option value="Membro">Membro</option>
                    <option value="Aprendiz Financeiro">Aprendiz Financeiro</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Classe RPG & Elemento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Classe RPG
                  </label>
                  <select
                    value={className}
                    onChange={(e) => setClassName(e.target.value as CharacterClass)}
                    className="w-full bg-[#0a0d1c] border border-[#262e4f] focus:border-primary text-white text-sm rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                  >
                    {AVAILABLE_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Afinidade Elemental
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'SOLAR' as ElementType, label: 'Solar', icon: 'wb_sunny', color: '#f5c253' },
                      { id: 'LUNAR' as ElementType, label: 'Lunar', icon: 'dark_mode', color: '#00eefc' },
                      { id: 'ECLIPSE' as ElementType, label: 'Eclipse', icon: 'auto_awesome', color: '#d8b4fe' },
                    ].map((elem) => (
                      <button
                        key={elem.id}
                        type="button"
                        onClick={() => {
                          sounds.playSelect();
                          setElement(elem.id);
                        }}
                        className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          element === elem.id
                            ? 'bg-[#1a213e] border-current shadow-sm'
                            : 'bg-[#0a0d1c] border-[#262e4f] opacity-60 hover:opacity-100'
                        }`}
                        style={{ color: elem.color }}
                      >
                        <span className="material-symbols-outlined text-[15px]">{elem.icon}</span>
                        <span>{elem.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 4: Título Épico */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Título Honorífico (Epiteto)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Sentinela dos Aportes, Guardião da Reserva"
                  className="w-full bg-[#0a0d1c] border border-[#262e4f] focus:border-primary text-white text-sm rounded-xl px-3 py-2.5 outline-none transition-colors"
                />
              </div>

              {/* Row 5: Galeria de Avatares */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Escolha o Retrato / Avatar
                </label>
                <div className="grid grid-cols-5 gap-2.5">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = avatarUrl === preset.url && !customAvatarInput;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          sounds.playSelect();
                          setAvatarUrl(preset.url);
                          setCustomAvatarInput('');
                        }}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all p-0.5 ${
                          isSelected
                            ? 'border-primary ring-2 ring-primary/40 scale-105'
                            : 'border-[#2b3354] hover:border-slate-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2.5">
                  <input
                    type="url"
                    value={customAvatarInput}
                    onChange={(e) => setCustomAvatarInput(e.target.value)}
                    placeholder="Ou cole a URL de uma imagem personalizada"
                    className="w-full bg-[#0a0d1c] border border-[#262e4f] focus:border-secondary text-white text-xs rounded-xl px-3 py-2 outline-none transition-colors placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Row 6: Contribuição & Nível */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    <span>Cota de Despesas (%)</span>
                    <span className="text-primary font-mono">{contributionPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={contributionPercent}
                    onChange={(e) => setContributionPercent(Number(e.target.value))}
                    className="w-full accent-[#f5c253] cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Participação percentual no orçamento e faturas
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                    <span>Nível Inicial</span>
                    <span className="text-secondary font-mono">Nv. {level}</span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={level}
                    onChange={(e) => setLevel(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#0a0d1c] border border-[#262e4f] focus:border-secondary text-white text-sm rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#252c48]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-label-sm text-xs uppercase font-extrabold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>{editingCharacter ? 'Salvar Alterações' : 'Concluir Recrutamento'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Confirmation Dialog para Deletar Guardião */}
      {characterToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#12162b] border border-red-500/40 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center gap-3 text-error">
              <span className="material-symbols-outlined text-[28px]">warning</span>
              <h3 className="font-title text-lg font-bold text-white">Dispensar Guardião</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tem certeza que deseja dispensar <strong className="text-white">{characterToDelete.name}</strong> da guilda?
              Suas transações e histórico no grimório serão preservados para fins de auditoria, mas o perfil não poderá mais ser utilizado para login.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCharacterToDelete(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="py-2.5 px-4 rounded-xl bg-error hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Confirmar Dispensa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

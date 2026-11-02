import React, { useState } from 'react';
import { Transaction, SpellType, RpgCategory } from '../types/game';
import { sounds } from '../utils/soundEffects';

interface NewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Transaction) => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [spellType, setSpellType] = useState<SpellType>('DAMAGE');
  const [amountStr, setAmountStr] = useState('142,50');
  const [caster, setCaster] = useState<'Ray' | 'Iury' | 'Ambos'>('Ray');
  const [category, setCategory] = useState<RpgCategory>('Taverna & Suprimentos');
  const [description, setDescription] = useState('Mercado Municipal dos Elfos (Frutas & Ervas)');
  const [isRecurring, setIsRecurring] = useState(false);

  const parsedAmount = parseFloat(amountStr.replace(/\./g, '').replace(',', '.')) || 0;

  const adjustAmount = (val: number) => {
    sounds.playSelect();
    const nextVal = Math.max(0, parsedAmount + val);
    setAmountStr(nextVal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  };

  const handleSave = () => {
    sounds.playSpell();
    const finalAmount = spellType === 'LOOT' ? parsedAmount : -parsedAmount;

    const newTx: Transaction = {
      id: `manual-${Date.now()}`,
      guild_id: 'guild-amorim-granja',
      character_id: caster === 'Ray' ? 'char-ray' : 'char-iury',
      inventory_id: caster === 'Ray' ? 'inv-nubank-ray' : 'inv-itau-iury',
      raw_fitid: `MANUAL-${Date.now()}`,
      raw_description: description.toUpperCase(),
      raw_amount: finalAmount,
      raw_date: new Date().toISOString(),
      custom_name: description,
      custom_tags: [category.toLowerCase(), spellType.toLowerCase()],
      spell_type: spellType,
      rpg_category: category,
      is_critical: parsedAmount >= 500,
      is_recurring: isRecurring,
      is_reviewed: true,
      caster_name: caster,
      solar_share: caster === 'Iury' ? 1 : caster === 'Ray' ? 0 : 0.5,
      lunar_share: caster === 'Ray' ? 1 : caster === 'Iury' ? 0 : 0.5,
      created_at: new Date().toISOString(),
    };

    onSave(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-surface-container rounded-2xl border border-primary/40 p-space-md shadow-2xl flex flex-col gap-3 my-auto max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-surface-container-high pb-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed-dim shadow-[0_0_8px_rgba(242,191,80,0.8)]" />
              <span className="font-label-sm text-[10px] text-primary uppercase tracking-widest font-bold">
                Alquimia Contábil • Grimório Arcano
              </span>
            </div>
            <h2 className="font-title text-xl font-bold text-on-surface flex items-center gap-1.5">
              Conjurar Registro
              <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
            </h2>
            <p className="text-[11px] text-outline">Transmute números em crônicas astrais e defenda o tesouro</p>
          </div>
          <button
            onClick={() => { sounds.playSelect(); onClose(); }}
            className="w-8 h-8 rounded-xl bg-surface-container-high text-outline hover:text-on-surface flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* 1. Ritual Paradigm Switch (Dano / Loot / Mana) */}
        <div className="p-1 rounded-xl bg-surface-container-lowest grid grid-cols-3 gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => { sounds.playSelect(); setSpellType('DAMAGE'); }}
            className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
              spellType === 'DAMAGE'
                ? 'bg-surface-container-high text-on-surface shadow-[0_0_12px_rgba(255,92,92,0.25)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-error text-[16px]">swords</span>
              <span className="font-label-sm text-xs uppercase font-bold text-error">Dano</span>
            </div>
            <span className="font-label-sm text-[10px] text-outline">Gasto Ativo</span>
          </button>

          <button
            type="button"
            onClick={() => { sounds.playSelect(); setSpellType('LOOT'); }}
            className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
              spellType === 'LOOT'
                ? 'bg-surface-container-high text-on-surface shadow-[0_0_12px_rgba(0,238,252,0.25)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-secondary text-[16px]">diamond</span>
              <span className="font-label-sm text-xs uppercase font-bold text-secondary">Loot</span>
            </div>
            <span className="font-label-sm text-[10px] text-outline">Tesouro / XP</span>
          </button>

          <button
            type="button"
            onClick={() => { sounds.playSelect(); setSpellType('MANA_TRANSFER'); }}
            className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
              spellType === 'MANA_TRANSFER'
                ? 'bg-surface-container-high text-on-surface shadow-[0_0_12px_rgba(242,191,80,0.25)]'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-primary text-[16px]">cyclone</span>
              <span className="font-label-sm text-xs uppercase font-bold text-primary">Mana</span>
            </div>
            <span className="font-label-sm text-[10px] text-outline">Vórtice Party</span>
          </button>
        </div>

        {/* 2. Core Crucible: Value Display & Increments */}
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-high flex flex-col items-center shadow-inner relative overflow-hidden">
          <div className="flex items-center gap-1 mb-1">
            <span className="material-symbols-outlined text-primary text-[16px]">toll</span>
            <span className="font-label-sm text-[10px] text-primary uppercase tracking-widest font-bold">
              Tributo Alquímico
            </span>
          </div>

          <div className="flex items-baseline justify-center gap-1.5 my-1">
            <span className="font-mono text-lg text-primary-fixed-dim font-bold">R$</span>
            <input
              type="text"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-48 text-center bg-transparent font-mono text-3xl font-extrabold text-primary tracking-tight focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 mb-2">
            <span className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] flex items-center gap-1 ${
              spellType === 'DAMAGE'
                ? 'bg-error-container/60 text-error'
                : spellType === 'LOOT'
                  ? 'bg-secondary-container/30 text-secondary'
                  : 'bg-primary-container/30 text-primary'
            }`}>
              <span className="material-symbols-outlined text-[12px]">
                {spellType === 'DAMAGE' ? 'local_fire_department' : spellType === 'LOOT' ? 'sparkles' : 'sync_alt'}
              </span>
              {spellType === 'DAMAGE' ? 'Dano Solar ao Tesouro' : spellType === 'LOOT' ? 'Loot & Prosperidade' : 'Vórtice Entre Membros'}
            </span>
            <span className="text-outline text-xs">• Moeda Real da Guilda</span>
          </div>

          {/* Increments */}
          <div className="grid grid-cols-4 gap-1.5 w-full pt-1">
            <button
              type="button"
              onClick={() => adjustAmount(10)}
              className="py-1 px-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-xs flex flex-col items-center cursor-pointer active:scale-95 border border-surface-container-highest"
            >
              <span className="text-[10px] text-outline">+10</span>
              <span>Prata</span>
            </button>

            <button
              type="button"
              onClick={() => adjustAmount(50)}
              className="py-1 px-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-xs flex flex-col items-center cursor-pointer active:scale-95 border border-surface-container-highest"
            >
              <span className="text-[10px] text-outline">+50</span>
              <span>Ouro</span>
            </button>

            <button
              type="button"
              onClick={() => adjustAmount(100)}
              className="py-1 px-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-xs flex flex-col items-center cursor-pointer active:scale-95 border border-surface-container-highest"
            >
              <span className="text-[10px] text-outline">+100</span>
              <span>Platina</span>
            </button>

            <button
              type="button"
              onClick={() => adjustAmount(500)}
              className="py-1 px-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-primary font-label-sm text-xs flex flex-col items-center cursor-pointer active:scale-95 border border-surface-container-highest"
            >
              <span className="text-[10px] text-outline">+500</span>
              <span className="font-bold">Astral</span>
            </button>
          </div>
        </div>

        {/* 3. Caster Selection (Ray / Iury / Ambos) */}
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-xs text-on-surface uppercase tracking-wider flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-secondary text-[16px]">person_check</span>
            Membro Conjurador (Quem Gastou/Forjou?)
          </span>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => { sounds.playSelect(); setCaster('Ray'); }}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                caster === 'Ray'
                  ? 'bg-surface-container-high border-secondary shadow-[0_0_12px_rgba(0,238,252,0.3)]'
                  : 'bg-surface-container-low border-surface-container-high opacity-70'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[16px]">bedtime</span>
              </div>
              <span className="font-title text-xs font-bold text-on-surface">Ray</span>
              <span className="font-label-sm text-[9px] text-secondary uppercase">Maga Lunar</span>
            </button>

            <button
              type="button"
              onClick={() => { sounds.playSelect(); setCaster('Iury'); }}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                caster === 'Iury'
                  ? 'bg-surface-container-high border-primary shadow-[0_0_12px_rgba(242,191,80,0.3)]'
                  : 'bg-surface-container-low border-surface-container-high opacity-70'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[16px]">wb_sunny</span>
              </div>
              <span className="font-title text-xs font-bold text-on-surface">Iury</span>
              <span className="font-label-sm text-[9px] text-primary uppercase">Guerreiro Solar</span>
            </button>

            <button
              type="button"
              onClick={() => { sounds.playSelect(); setCaster('Ambos'); }}
              className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                caster === 'Ambos'
                  ? 'bg-surface-container-high border-tertiary shadow-[0_0_12px_rgba(255,181,200,0.3)]'
                  : 'bg-surface-container-low border-surface-container-high opacity-70'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-tertiary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-tertiary text-[16px]">diversity_1</span>
              </div>
              <span className="font-title text-xs font-bold text-on-surface">Ambos</span>
              <span className="font-label-sm text-[9px] text-tertiary uppercase">Party Eclipse</span>
            </button>
          </div>
        </div>

        {/* 4. Category Runes */}
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-xs text-on-surface uppercase tracking-wider flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-primary text-[16px]">category</span>
            Natureza da Runa / Categoria
          </span>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'Taverna & Suprimentos', icon: 'restaurant', sub: 'Mercado & Banquete' },
              { id: 'Montaria & Teleporte', icon: 'electric_bolt', sub: 'Uber & Transporte' },
              { id: 'Arsenal & Loot', icon: 'shield', sub: 'Compras Pessoais' },
              { id: 'Veneno Periódico', icon: 'nest_clock_farsight_analog', sub: 'Assinaturas Fixas' },
              { id: 'Defesa de Castelo', icon: 'fort', sub: 'Moradia & Contas' },
              { id: 'Lazer & Festival', icon: 'sports_esports', sub: 'Diversão Party' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => { sounds.playSelect(); setCategory(cat.id as RpgCategory); }}
                className={`p-2 rounded-xl flex flex-col items-center text-center gap-0.5 transition-all cursor-pointer border ${
                  category === cat.id
                    ? 'bg-surface-container-high border-primary text-on-surface shadow-md'
                    : 'bg-surface-container-low border-surface-container-high text-outline hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-primary text-[18px]">{cat.icon}</span>
                <span className="font-label-sm text-[10px] font-bold truncate w-full text-on-surface">{cat.id}</span>
                <span className="text-[8px] text-outline truncate">{cat.sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 5. Description */}
        <div className="flex flex-col gap-1">
          <label className="font-label-sm text-xs text-on-surface uppercase tracking-wider font-bold">
            Descrição da Crônica
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-surface-container-low text-xs text-on-surface p-2.5 rounded-xl border border-surface-container-high focus:outline-none focus:border-primary"
            placeholder="Ex: Banquete Real na Feira, Poção de Estamina..."
          />
        </div>

        {/* 6. Recurrence Toggle */}
        <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface">Feitiço Recorrente (Maldição Fixa)</span>
            <span className="text-[10px] text-outline">Conjurar automaticamente a cada ciclo lunar</span>
          </div>
          <input
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
          />
        </div>

        {/* 7. Boss Impact Feedback Banner */}
        <div className="p-3 rounded-xl bg-surface-container-high border border-error/30 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">warning</span>
          <div className="flex flex-col flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-error uppercase font-bold">Impacto no Boss Mensal</span>
              <span className="text-outline font-mono text-[11px]">-1.2% HP Orçamento</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              Este lançamento consome do baú coletivo. A fatura do Titã reage instantaneamente aos gastos da casa.
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary-container via-primary to-primary-fixed-dim text-on-primary-container font-title text-sm font-bold uppercase shadow-[0_0_24px_rgba(245,194,83,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">electric_bolt</span>
          <span>Selar Feitiço no Grimório</span>
        </button>
      </div>
    </div>
  );
};

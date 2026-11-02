import React, { useState } from 'react';
import { Transaction, SpellType } from '../types/game';
import { sounds } from '../utils/soundEffects';
import { parseOfxContent, classifyRpgTransaction, SAMPLE_OFX_FILE } from '../utils/ofxParser';

interface GrimoireTransactionsProps {
  transactions: Transaction[];
  onAddTransaction: (tx: Transaction) => void;
  onUpdateTransaction: (tx: Transaction) => void;
  onOpenConjureModal: () => void;
}

export const GrimoireTransactions: React.FC<GrimoireTransactionsProps> = ({
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onOpenConjureModal,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [showOfxModal, setShowOfxModal] = useState(false);
  const [importedPreview, setImportedPreview] = useState<Transaction[]>([]);

  // Calculate totals
  const lootTotal = transactions
    .filter(t => t.spell_type === 'LOOT')
    .reduce((acc, t) => acc + Math.abs(t.raw_amount), 0);

  const damageTotal = transactions
    .filter(t => t.spell_type === 'DAMAGE' || t.spell_type === 'POISON')
    .reduce((acc, t) => acc + Math.abs(t.raw_amount), 0);

  const netBalance = lootTotal - damageTotal;

  // Filter transactions
  const filtered = transactions.filter(t => {
    const matchesSearch = 
      t.custom_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.raw_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.rpg_category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === 'all') return true;
    if (activeFilter === 'loot') return t.spell_type === 'LOOT';
    if (activeFilter === 'damage') return t.spell_type === 'DAMAGE' || t.spell_type === 'POISON';
    if (activeFilter === 'crit') return t.is_critical;
    if (activeFilter === 'poison') return t.spell_type === 'POISON' || t.is_recurring;
    return true;
  });

  const handleLoadSampleOfx = () => {
    sounds.playSelect();
    const parsed = parseOfxContent(SAMPLE_OFX_FILE);
    const mapped = parsed.transactions.map(raw => 
      classifyRpgTransaction(raw, 'guild-amorim-granja', 'char-iury', 'inv-nubank-iury')
    );
    setImportedPreview(mapped);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    sounds.playSelect();
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseOfxContent(content);
      const mapped = parsed.transactions.map(raw => 
        classifyRpgTransaction(raw, 'guild-amorim-granja', 'char-iury', 'inv-nubank-iury')
      );
      setImportedPreview(mapped);
    };
    reader.readAsText(file);
  };

  const handleConfirmOfxImport = () => {
    if (importedPreview.length === 0) return;
    sounds.playLoot();
    importedPreview.forEach(tx => onAddTransaction(tx));
    setShowOfxModal(false);
    setImportedPreview([]);
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-7 sm:space-y-8">
      {/* 1. HERO CARD: HISTÓRICO ASTRAL & GRIMÓRIO (Padrão Consistente de Moldura e Títulos) */}
      <section className="flex flex-col w-full bg-surface-container/90 rounded-3xl p-5 sm:p-6 shadow-2xl border border-surface-container-high relative overflow-hidden space-y-5">
        {/* Glow Effects de Fundo */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary-container/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Window: Title & Status com margem de segurança para letras e acentos */}
        <div className="flex items-center justify-between pb-3.5 border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-fixed-dim text-[22px]">auto_stories</span>
            <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
              Histórico Astral & Crônicas
            </span>
          </div>
          <span className="font-label-sm text-[11px] px-3 py-1 rounded-full bg-surface-container-high text-secondary flex items-center gap-2 border border-secondary/25 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping" />
            Sincronia OFX Ativa
          </span>
        </div>

        {/* Bloco de Título Principal com respiro vertical amplo para evitar corte na moldura */}
        <div className="flex flex-col space-y-2 py-1">
          <h2 className="font-title text-2xl sm:text-3xl font-bold text-primary tracking-normal leading-normal flex items-center gap-2.5">
            Grimório de Batalha
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Registro imutável de transações bancárias (OFX) e tradução mística paralela para os guerreiros do Solstício.
          </p>
        </div>

        {/* Seletor de Ciclo Lunar com espaçamento refinado */}
        <div className="bg-surface-container-low rounded-2xl p-3.5 sm:p-4 border border-surface-container-high shadow-md flex items-center justify-between">
          <button 
            onClick={() => sounds.playSelect()}
            className="w-9 h-9 rounded-xl bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-primary cursor-pointer active:scale-95 transition-all"
            title="Ciclo Anterior"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          
          <div className="flex flex-col items-center text-center px-2 py-0.5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed-dim text-[18px]">bedtime</span>
              <span className="font-title text-sm sm:text-base font-bold text-on-surface leading-snug">
                Ciclo de Novembro
              </span>
            </div>
            <span className="font-label-sm text-[10px] sm:text-[11px] text-primary-fixed-dim tracking-wider uppercase mt-0.5">
              Lua Crescente Astral • Turno 42
            </span>
          </div>

          <button 
            onClick={() => sounds.playSelect()}
            className="w-9 h-9 rounded-xl bg-surface-container-high hover:bg-surface-bright flex items-center justify-center text-primary cursor-pointer active:scale-95 transition-all"
            title="Próximo Ciclo"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </section>

      {/* 2. CARD DE BALANÇO MENSAL (HUD Fluxo de Mana & Shards) */}
      <section className="bg-surface-container/90 rounded-3xl p-5 sm:p-6 shadow-2xl border border-surface-container-high relative overflow-hidden flex flex-col space-y-5">
        <div className="flex items-start justify-between pb-3.5 border-b border-surface-container-high">
          <div className="flex flex-col space-y-1">
            <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">
              Saldo do Feitiço (Balanço Mensal)
            </span>
            <span className={`font-mono text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-sm leading-normal ${
              netBalance >= 0 ? 'text-secondary-fixed' : 'text-error'
            }`}>
              {netBalance >= 0 ? '+' : '-'} R$ {Math.abs(netBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-surface-container-highest px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-surface-container-high shadow-xs">
            <span className="material-symbols-outlined text-primary-fixed-dim text-[18px]">verified</span>
            <span className="font-label-sm text-[11px] text-primary-fixed uppercase font-bold tracking-wider">
              {netBalance >= 0 ? 'Mana Positiva' : 'Déficit Mágico'}
            </span>
          </div>
        </div>

        {/* Shards Grid: Loot Coletado vs Dano Sofrido com molduras espaçosas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 border border-surface-container-high flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[16px]">savings</span>
              </div>
              <span className="font-label-sm text-xs uppercase text-on-surface-variant font-bold tracking-wider">
                Loot Coletado
              </span>
            </div>
            <span className="font-mono text-base sm:text-lg font-bold text-secondary-fixed leading-normal">
              + R$ {lootTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-outline">Receitas de Mana e Rendimentos</span>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-4 sm:p-5 border border-surface-container-high flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-error-container/40 flex items-center justify-center text-error shrink-0">
                <span className="material-symbols-outlined text-[16px]">swords</span>
              </div>
              <span className="font-label-sm text-xs uppercase text-on-surface-variant font-bold tracking-wider">
                Dano Sofrido
              </span>
            </div>
            <span className="font-mono text-base sm:text-lg font-bold text-error leading-normal">
              - R$ {damageTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[11px] text-outline">Tributos, Faturas e Gastos Fixos</span>
          </div>
        </div>
      </section>

      {/* 3. AÇÕES RÁPIDAS: Conjurar Registro & Importar OFX */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <button
          onClick={() => { sounds.playSpell(); onOpenConjureModal(); }}
          className="py-3.5 px-4 bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-label-sm text-xs uppercase font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:brightness-105 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add_circle</span>
          <span className="tracking-wider">Conjurar Registro</span>
        </button>

        <button
          onClick={() => { sounds.playSelect(); setShowOfxModal(true); }}
          className="py-3.5 px-4 bg-surface-container-high hover:bg-surface-bright text-secondary font-label-sm text-xs uppercase font-bold rounded-2xl border border-secondary/30 shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">upload_file</span>
          <span className="tracking-wider">Importar Extrato OFX</span>
        </button>
      </section>

      {/* 4. BUSCA E FILTROS ASTRheader */}
      <section className="bg-surface-container-low rounded-3xl p-4 sm:p-5 border border-surface-container-high shadow-xl flex flex-col space-y-3.5">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">manage_search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por monstro, mercador, feitiço ou raw memo..."
            className="w-full bg-surface-container text-on-surface placeholder:text-outline text-xs sm:text-sm pl-11 pr-4 py-3 rounded-2xl border border-surface-container-high focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar pt-0.5">
          {[
            { id: 'all', label: 'Todos os Registros', icon: 'token' },
            { id: 'loot', label: 'Somente Loot (+)', icon: 'diamond' },
            { id: 'damage', label: 'Somente Dano (-)', icon: 'local_fire_department' },
            { id: 'crit', label: 'Dano Crítico (>500)', icon: 'crisis_alert' },
            { id: 'poison', label: 'Veneno Recorrente', icon: 'skull' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => { sounds.playSelect(); setActiveFilter(pill.id); }}
              className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-full font-label-sm text-[11px] sm:text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === pill.id
                  ? 'bg-primary-container text-on-primary-container font-bold shadow-md'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface border border-surface-container-highest'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{pill.icon}</span>
              <span>{pill.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 5. LISTA DE CRÔNICAS DE BATALHA (Moldura e Espaçamento Consistente) */}
      <section className="bg-surface-container/90 rounded-3xl p-5 sm:p-6 shadow-2xl border border-surface-container-high space-y-4">
        <div className="flex items-center justify-between pb-3.5 border-b border-surface-container-high">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
            <span className="font-label-sm text-xs uppercase tracking-widest text-primary font-bold">
              Crônicas Gravadas ({filtered.length})
            </span>
          </div>
          <span className="text-[11px] text-outline font-label-sm uppercase">
            Toque para auditar camada bancária
          </span>
        </div>

        <div className="flex flex-col space-y-3 pt-1">
          {filtered.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2">
              <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
              <p className="text-sm font-bold text-on-surface">Nenhum registro mágico encontrado</p>
              <p className="text-xs text-outline">Tente ajustar seus filtros de busca ou importar um novo arquivo OFX.</p>
            </div>
          ) : (
            filtered.map((tx) => {
              const isLoot = tx.spell_type === 'LOOT';
              const isPoison = tx.spell_type === 'POISON';

              return (
                <div
                  key={tx.id}
                  onClick={() => { sounds.playSelect(); setSelectedTx(tx); }}
                  className="p-4 sm:p-4.5 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high transition-all flex items-center justify-between gap-3.5 shadow-sm cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 ${
                      isLoot
                        ? 'bg-primary-container/20 text-primary-fixed shadow-[0_0_12px_rgba(242,191,80,0.3)]'
                        : isPoison
                          ? 'bg-tertiary-container/20 text-tertiary-container'
                          : 'bg-error-container/30 text-error'
                    }`}>
                      <span className="material-symbols-outlined text-[22px]">
                        {isLoot ? 'diamond' : isPoison ? 'skull' : 'crisis_alert'}
                      </span>
                    </div>

                    <div className="flex flex-col min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded font-bold bg-surface-container-high text-outline border border-surface-container-highest">
                          [{tx.spell_type}]
                        </span>
                        <span className="text-[11px] font-bold text-secondary truncate">{tx.caster_name}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-on-surface truncate group-hover:text-primary transition-colors leading-snug">
                        {tx.custom_name}
                      </h4>
                      <span className="text-[11px] text-outline truncate flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] shrink-0">receipt</span>
                        <span className="truncate">Raw: {tx.raw_description}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 space-y-1">
                    <span className={`font-mono text-xs sm:text-sm font-bold leading-none ${isLoot ? 'text-secondary-fixed' : 'text-error'}`}>
                      {isLoot ? '+' : ''} R$ {Math.abs(tx.raw_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] font-mono text-outline">
                      {new Date(tx.raw_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* DUAL LAYER INSPECTOR MODAL */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-container rounded-3xl border border-primary/30 p-5 sm:p-6 shadow-2xl flex flex-col space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">layers</span>
                <h3 className="font-title text-sm sm:text-base font-bold text-primary uppercase tracking-wider leading-normal">
                  Auditoria de Dupla Camada
                </h3>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Layer 1: Bank Raw Data */}
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-high flex flex-col space-y-2">
              <div className="flex items-center justify-between text-[11px] font-label-sm uppercase text-outline">
                <span className="flex items-center gap-1.5 text-secondary font-bold">
                  <span className="material-symbols-outlined text-[15px]">account_balance</span>
                  Camada 1: Original Bancária (Imutável)
                </span>
                <span>OFX / FITID</span>
              </div>
              <div className="font-mono text-xs text-on-surface bg-surface-container p-3 rounded-xl border border-surface-container-high space-y-1">
                <p><strong className="text-outline">RAW MEMO:</strong> {selectedTx.raw_description}</p>
                <p><strong className="text-outline">FITID:</strong> {selectedTx.raw_fitid}</p>
                <p><strong className="text-outline">VALOR:</strong> R$ {selectedTx.raw_amount.toFixed(2)}</p>
                <p><strong className="text-outline">DATA BANCO:</strong> {selectedTx.raw_date}</p>
              </div>
            </div>

            {/* Layer 2: Player Editable RPG Visual Layer */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-primary/30 flex flex-col space-y-3">
              <span className="font-label-sm text-xs uppercase text-primary font-bold flex items-center gap-1.5 leading-normal">
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                Camada 2: Lore de RPG Customizada (Jogador)
              </span>

              <div className="flex flex-col space-y-1">
                <label className="text-[11px] text-outline uppercase font-label-sm">Nome Visual no Jogo</label>
                <input
                  type="text"
                  value={selectedTx.custom_name}
                  onChange={(e) => {
                    const updated = { ...selectedTx, custom_name: e.target.value };
                    setSelectedTx(updated);
                    onUpdateTransaction(updated);
                  }}
                  className="bg-surface-container-high text-xs sm:text-sm text-on-surface p-2.5 rounded-xl border border-surface-container-highest focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col space-y-1">
                  <label className="text-[11px] text-outline uppercase font-label-sm">Tipo de Feitiço</label>
                  <select
                    value={selectedTx.spell_type}
                    onChange={(e) => {
                      const updated = { ...selectedTx, spell_type: e.target.value as SpellType };
                      setSelectedTx(updated);
                      onUpdateTransaction(updated);
                    }}
                    className="bg-surface-container-high text-xs sm:text-sm text-on-surface p-2.5 rounded-xl border border-surface-container-highest"
                  >
                    <option value="DAMAGE">DANO (Gasto)</option>
                    <option value="LOOT">LOOT (Receita)</option>
                    <option value="POISON">VENENO (Fixo/Recorrente)</option>
                    <option value="MANA_TRANSFER">TRANSFERÊNCIA</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[11px] text-outline uppercase font-label-sm">Membro Responsável</label>
                  <select
                    value={selectedTx.caster_name}
                    onChange={(e) => {
                      const updated = { ...selectedTx, caster_name: e.target.value };
                      setSelectedTx(updated);
                      onUpdateTransaction(updated);
                    }}
                    className="bg-surface-container-high text-xs sm:text-sm text-on-surface p-2.5 rounded-xl border border-surface-container-highest"
                  >
                    <option value="Iury">Iury (Guerreiro Solar)</option>
                    <option value="Ray">Ray (Maga Lunar)</option>
                    <option value="Ambos">Party Compartilhada (50/50)</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => { sounds.playLoot(); setSelectedTx(null); }}
              className="w-full py-3 rounded-2xl bg-primary-container text-on-primary-container font-title text-xs font-bold uppercase cursor-pointer hover:brightness-105 active:scale-95 shadow-md"
            >
              Salvar Alterações no Grimório
            </button>
          </div>
        </div>
      )}

      {/* OFX IMPORT MODAL */}
      {showOfxModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface-container rounded-3xl border border-secondary/40 p-5 sm:p-6 shadow-2xl flex flex-col space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">upload_file</span>
                <h3 className="font-title text-sm sm:text-base font-bold text-secondary uppercase tracking-wider leading-normal">
                  Motor de Importação OFX (Dupla Camada)
                </h3>
              </div>
              <button
                onClick={() => setShowOfxModal(false)}
                className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-outline hover:text-on-surface cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Carregue extratos bancários em formato .OFX (Nubank, Itaú, Bradesco, Santander). O motor preserva a camada bancária original intacta e traduz automaticamente as transações para a lore de Sea of Stars.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleLoadSampleOfx}
                className="py-3 px-3.5 rounded-2xl bg-secondary-container text-on-secondary font-label-sm text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md hover:brightness-105"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                <span>Carregar OFX Exemplo</span>
              </button>

              <label className="py-3 px-3.5 rounded-2xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-sm text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer border border-surface-container-highest">
                <span className="material-symbols-outlined text-[18px]">folder_open</span>
                <span>Upload Arquivo .OFX</span>
                <input type="file" accept=".ofx,.txt" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Preview of Parsed OFX */}
            {importedPreview.length > 0 && (
              <div className="flex flex-col space-y-3 pt-3 border-t border-surface-container-high">
                <div className="flex items-center justify-between text-xs font-label-sm text-primary">
                  <span>Prévia das Transações ({importedPreview.length} lidas)</span>
                  <span>Mapeamento Automático RPG</span>
                </div>

                <div className="flex flex-col space-y-2 max-h-60 overflow-y-auto pr-1">
                  {importedPreview.map((tx, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high flex items-center justify-between gap-3">
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-on-surface truncate leading-snug">{tx.custom_name}</span>
                        <span className="text-[11px] text-outline truncate">Raw: {tx.raw_description}</span>
                      </div>
                      <span className={`font-mono text-xs font-bold shrink-0 ${
                        tx.spell_type === 'LOOT' ? 'text-secondary-fixed' : 'text-error'
                      }`}>
                        {tx.spell_type === 'LOOT' ? '+' : ''} R$ {Math.abs(tx.raw_amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleConfirmOfxImport}
                  className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-title text-xs font-bold uppercase shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-95 hover:brightness-105 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">cloud_done</span>
                  <span>Confirmar & Selar no Grimório</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

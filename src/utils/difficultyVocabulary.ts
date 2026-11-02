/**
 * Sistema de Vocabulário e Níveis de Dificuldade
 * Tales of Finance - Sea of Stars Edition
 * 
 * Modos:
 * 1. Fácil: Linguajar comum/cotidiano, sem jargões de RPG.
 * 2. Médio: Termos de RPG com tradução comum entre parênteses.
 * 3. Difícil: Termos puros e arcanos de RPG.
 */

export type DifficultyLevel = 'facil' | 'medio' | 'dificil';

export interface DifficultyInfo {
  id: DifficultyLevel;
  name: string;
  shortName: string;
  badge: string;
  tagline: string;
  description: string;
  example: string;
  icon: string;
  accentColor: string;
  bgGlow: string;
}

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, DifficultyInfo> = {
  facil: {
    id: 'facil',
    name: 'Fácil (Modo Convencional)',
    shortName: 'Fácil',
    badge: 'Linguagem Direta',
    tagline: 'Termos bancários claros e objetivos, sem metáforas de jogos',
    description: 'Indicado para quem prefere uma visão financeira tradicional. Substitui termos como Mana, Grimório e Boss por Saldo, Extrato e Fatura.',
    example: 'Ex: "Saldo Total Disponível", "Extrato de Transações", "Pagar Fatura Integral"',
    icon: 'verified_user',
    accentColor: '#34d399',
    bgGlow: 'rgba(52, 211, 153, 0.25)',
  },
  medio: {
    id: 'medio',
    name: 'Médio (Modo Aventureiro)',
    shortName: 'Médio',
    badge: 'Termos com Tradução',
    tagline: 'Termos de RPG acompanhados da tradução comum entre parênteses',
    description: 'O equilíbrio perfeito entre imersão lúdica e clareza financeira. Mantém os termos épicos, mas com a tradução entre parênteses.',
    example: 'Ex: "Mana Líquida (Saldo)", "Grimório (Extrato)", "Boss Fight (Fatura do Cartão)"',
    icon: 'balance',
    accentColor: '#f5c253',
    bgGlow: 'rgba(245, 194, 83, 0.25)',
  },
  dificil: {
    id: 'dificil',
    name: 'Difícil (Modo Mestre RPG)',
    shortName: 'Difícil',
    badge: 'RPG Raiz',
    tagline: 'Imersão total no universo RPG Sea of Stars sem concessões',
    description: 'Projetado para os verdadeiros mestres arcanos: vocabulário 100% gamificado (Mana Líquida, Grimório de Feitiços, Boss da Fatura, Relíquias, Quests).',
    example: 'Ex: "Mana Líquida Total", "Grimório Arcano", "Contra-Ataque Crítico ao Titã"',
    icon: 'swords',
    accentColor: '#00eefc',
    bgGlow: 'rgba(0, 238, 252, 0.25)',
  },
};

export interface VocabularyTerms {
  // Navigation Tabs
  tab_dashboard: string;
  tab_membros: string;
  tab_batalhas: string;
  tab_grimorio: string;
  tab_oraculo: string;
  tab_quests: string;
  tab_inventario: string;
  tab_arquitetura: string;
  tab_configuracoes: string;

  // Header & Status
  sanctuary_title: string;
  party_members: string;
  mana_liquida: string;
  teto_orcamento: string;
  serasa_score: string;
  guild_level: string;

  // Actions & Buttons
  novo_registro: string;
  importar_ofx: string;
  consultar_oraculo: string;
  gerenciar_membros: string;
  pagar_total: string;
  pagar_parcial: string;
  reset_boss: string;
  desconectar: string;

  // Boss & Faturas
  boss_title: string;
  boss_subtitle: string;
  fatura_mes: string;
  hp_fatura: string;
  escudo_orcamento: string;
  batalhas_concluidas: string;
  bestiario_titulo: string;
  arena_titulo: string;
  vitoria_titulo: string;

  // Transações & Grimório
  grimorio_titulo: string;
  grimorio_subtitulo: string;
  loot_receita: string;
  dano_despesa: string;
  veneno_recorrente: string;
  dano_critico: string;
  feitiço_lancamento: string;

  // Quests & Metas
  quests_titulo: string;
  quests_subtitulo: string;
  reivindicar_recompensa: string;

  // Inventário & Relíquias
  inventario_titulo: string;
  inventario_subtitulo: string;

  // Oráculo de IA
  oraculo_titulo: string;
  oraculo_subtitulo: string;
  oraculo_botao_chat: string;
}

export const VOCABULARY: Record<DifficultyLevel, VocabularyTerms> = {
  facil: {
    // Navigation Tabs
    tab_dashboard: 'Início',
    tab_membros: 'Membros',
    tab_batalhas: 'Faturas',
    tab_grimorio: 'Extrato',
    tab_oraculo: 'Análise IA',
    tab_quests: 'Metas',
    tab_inventario: 'Contas & Cartões',
    tab_arquitetura: 'Sistema',
    tab_configuracoes: 'Configurações',

    // Header & Status
    sanctuary_title: 'Santuário Amorim Granja',
    party_members: 'Titulares da Conta',
    mana_liquida: 'Saldo Total em Conta',
    teto_orcamento: 'Limite Mensal de Gastos',
    serasa_score: 'Score de Crédito Serasa',
    guild_level: 'Status Financeiro',

    // Actions & Buttons
    novo_registro: 'Novo Lançamento',
    importar_ofx: 'Importar Extrato OFX',
    consultar_oraculo: 'Assistente Financeiro IA',
    gerenciar_membros: 'Gerenciar Membros',
    pagar_total: 'Pagar Fatura Integral',
    pagar_parcial: 'Pagar Valor Parcial',
    reset_boss: 'Restaurar Fatura Original',
    desconectar: 'Sair da Conta',

    // Boss & Faturas
    boss_title: 'Fatura do Cartão de Crédito',
    boss_subtitle: 'Controle de Vencimento e Limite de Cartão',
    fatura_mes: 'Fatura Mensal',
    hp_fatura: 'Valor a Pagar da Fatura',
    escudo_orcamento: 'Reserva do Orçamento',
    batalhas_concluidas: 'Faturas Pagas',
    bestiario_titulo: 'Histórico Anual',
    arena_titulo: 'Fatura Atual',
    vitoria_titulo: 'Vitória',

    // Transações & Grimório
    grimorio_titulo: 'Extrato de Transações Bancárias',
    grimorio_subtitulo: 'Registro de entradas, despesas e faturas conciliadas',
    loot_receita: 'Receitas / Entradas (+)',
    dano_despesa: 'Despesas / Saídas (-)',
    veneno_recorrente: 'Assinaturas & Fixos',
    dano_critico: 'Gastos Elevados (> R$ 500)',
    feitiço_lancamento: 'Lançamento',

    // Quests & Metas
    quests_titulo: 'Metas e Hábitos Financeiros',
    quests_subtitulo: 'Objetivos de economia para o crescimento da família',
    reivindicar_recompensa: 'Concluir Meta',

    // Inventário & Relíquias
    inventario_titulo: 'Contas Bancárias & Cartões',
    inventario_subtitulo: 'Gestão de instrumentos de pagamento e benefícios ativos',

    // Oráculo de IA
    oraculo_titulo: 'Assistente Financeiro com Inteligência Artificial',
    oraculo_subtitulo: 'Análise de hábitos, projeção de gastos e dicas de economia',
    oraculo_botao_chat: 'Falar com Assistente IA',
  },

  medio: {
    // Navigation Tabs
    tab_dashboard: 'Taverna (Início)',
    tab_membros: 'Guardiões (Membros)',
    tab_batalhas: 'Batalhas (Faturas)',
    tab_grimorio: 'Grimório (Extrato)',
    tab_oraculo: 'Oráculo (Análise IA)',
    tab_quests: 'Quests (Metas)',
    tab_inventario: 'Inventário (Cartões)',
    tab_arquitetura: 'Arquitetura (Sistema)',
    tab_configuracoes: 'Configurações (Ajustes)',

    // Header & Status
    sanctuary_title: 'Santuário Amorim Granja (Conta Conjunta)',
    party_members: 'Guardiões da Party (Titulares)',
    mana_liquida: 'Mana Líquida (Saldo em Conta)',
    teto_orcamento: 'Escudo Arcano (Limite Mensal)',
    serasa_score: 'Serasa Mystic Score (Score de Crédito)',
    guild_level: 'Nível da Guilda (Status Familiar)',

    // Actions & Buttons
    novo_registro: 'Conjurar Feitiço (Novo Lançamento)',
    importar_ofx: 'Importar OFX (Pergaminho)',
    consultar_oraculo: 'Consultar Oráculo Arcano (Assistente IA)',
    gerenciar_membros: 'Gerenciar Guardiões',
    pagar_total: 'Contra-Ataque (Quitar Fatura Total)',
    pagar_parcial: 'Golpe Parcial (Pagar Parcial)',
    reset_boss: 'Ressuscitar Boss (Restaurar)',
    desconectar: 'Desconectar da Guilda',

    // Boss & Faturas
    boss_title: 'Boss Fight (Fatura do Cartão)',
    boss_subtitle: 'Monstro mensal que drena os recursos do santuário',
    fatura_mes: 'Boss do Mês (Fatura Mensal)',
    hp_fatura: 'HP do Boss (Valor da Fatura)',
    escudo_orcamento: 'Escudo do Orçamento (Reserva)',
    batalhas_concluidas: 'Concluídas (Pagas)',
    bestiario_titulo: 'Bestiário (Histórico)',
    arena_titulo: 'Arena (Fatura Atual)',
    vitoria_titulo: 'Vitória (Paga)',

    // Transações & Grimório
    grimorio_titulo: 'Grimório Arcano (Extrato de Transações)',
    grimorio_subtitulo: 'Crônica de loots recebidos e danos orçamentários',
    loot_receita: 'Loot Arcano (Receitas +)',
    dano_despesa: 'Dano Recebido (Despesas -)',
    veneno_recorrente: 'Veneno Periódico (Assinaturas)',
    dano_critico: 'Dano Crítico (Gastos > R$ 500)',
    feitiço_lancamento: 'Feitiço (Lançamento)',

    // Quests & Metas
    quests_titulo: 'Quests & Contratos (Metas Financeiras)',
    quests_subtitulo: 'Missões ativas para expandir o tesouro da guilda',
    reivindicar_recompensa: 'Reivindicar Recompensa (Concluir Meta)',

    // Inventário & Relíquias
    inventario_titulo: 'Inventário de Relíquias (Cartões & Contas)',
    inventario_subtitulo: 'Artefatos financeiros equipados pela guilda',

    // Oráculo de IA
    oraculo_titulo: 'Oráculo Arcano (Assistente Financeiro IA)',
    oraculo_subtitulo: 'Inteligência mística que decifra padrões e prevê tempestades',
    oraculo_botao_chat: 'Consultar Oráculo Arcano',
  },

  dificil: {
    // Navigation Tabs
    tab_dashboard: 'Taverna',
    tab_membros: 'Guardiões',
    tab_batalhas: 'Batalhas',
    tab_grimorio: 'Grimório',
    tab_oraculo: 'Oráculo',
    tab_quests: 'Quests',
    tab_inventario: 'Inventário',
    tab_arquitetura: 'Arquitetura',
    tab_configuracoes: 'Configurações',

    // Header & Status
    sanctuary_title: 'Santuário Amorim Granja',
    party_members: 'Guardiões da Party',
    mana_liquida: 'Mana Líquida Total',
    teto_orcamento: 'Teto de Mana / Orçamento',
    serasa_score: 'Serasa Mystic Score',
    guild_level: 'Nível da Guilda',

    // Actions & Buttons
    novo_registro: 'Conjurar Registro',
    importar_ofx: 'Importar Extrato OFX',
    consultar_oraculo: 'Oráculo Arcano de IA',
    gerenciar_membros: 'Gerenciar Guardiões',
    pagar_total: 'Contra-Ataque Crítico (Pagar Total)',
    pagar_parcial: 'Golpe Rápido (Pagamento Parcial)',
    reset_boss: 'Ressuscitar Boss',
    desconectar: 'Desconectar Guardião',

    // Boss & Faturas
    boss_title: 'Batalha contra o Boss da Fatura',
    boss_subtitle: 'Titã voraz que desafia a estabilidade do santuário',
    fatura_mes: 'Boss do Mês',
    hp_fatura: 'HP do Boss',
    escudo_orcamento: 'Escudo do Orçamento',
    batalhas_concluidas: 'Batalhas Concluídas',
    bestiario_titulo: 'Bestiário dos 12 Titãs',
    arena_titulo: 'Arena de Combate',
    vitoria_titulo: 'Vitória Gloriosa! Boss Expurgado',

    // Transações & Grimório
    grimorio_titulo: 'Grimório Arcano de Feitiços',
    grimorio_subtitulo: 'Registro milenar de influxos de mana e danos elementais',
    loot_receita: 'Loot Arcano (+)',
    dano_despesa: 'Dano Sofrido (-)',
    veneno_recorrente: 'Veneno Periódico',
    dano_critico: 'Dano Crítico (> R$ 500)',
    feitiço_lancamento: 'Feitiço',

    // Quests & Metas
    quests_titulo: 'Missões & Contratos Arcanos',
    quests_subtitulo: 'Proezas heroicas que fortalecem o elo sagrado',
    reivindicar_recompensa: 'Reivindicar Recompensa',

    // Inventário & Relíquias
    inventario_titulo: 'Inventário de Relíquias',
    inventario_subtitulo: 'Artefatos lendários e auras arcanas desbloqueadas',

    // Oráculo de IA
    oraculo_titulo: 'Oráculo Arcano de Inteligência Artificial',
    oraculo_subtitulo: 'Entidade cosmológica que canaliza visões sobre o destino financeiro',
    oraculo_botao_chat: 'Invocar Oráculo Arcano',
  },
};

export const DIFFICULTY_STORAGE_KEY = 'tales_of_finance_difficulty';

export function getSavedDifficulty(): DifficultyLevel {
  try {
    const saved = localStorage.getItem(DIFFICULTY_STORAGE_KEY);
    if (saved === 'facil' || saved === 'medio' || saved === 'dificil') {
      return saved;
    }
  } catch (e) {
    console.error('Falha ao obter dificuldade:', e);
  }
  return 'medio'; // Default equilibrado recomendado
}

export function saveDifficulty(difficulty: DifficultyLevel): void {
  try {
    localStorage.setItem(DIFFICULTY_STORAGE_KEY, difficulty);
  } catch (e) {
    console.error('Falha ao salvar dificuldade:', e);
  }
}

export function getVocabulary(difficulty: DifficultyLevel = 'medio'): VocabularyTerms {
  return VOCABULARY[difficulty] || VOCABULARY.medio;
}

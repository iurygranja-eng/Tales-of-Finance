/**
 * Types & Database Model for Tales of Finance
 * Supabase Postgres Schema Entities & RPG Metaphors
 */

export type ElementType = 'SOLAR' | 'LUNAR' | 'ECLIPSE';

export type CharacterClass = 
  | 'Guerreiro Solar' 
  | 'Maga Lunar' 
  | 'Alquimista do Aporte' 
  | 'Guardião do Orçamento'
  | 'Clérigo da Reserva';

export type SpellType = 'DAMAGE' | 'LOOT' | 'MANA_TRANSFER' | 'POISON';

export type RpgCategory = 
  | 'Taverna & Suprimentos' 
  | 'Montaria & Teleporte' 
  | 'Arsenal & Loot' 
  | 'Veneno Periódico' 
  | 'Defesa de Castelo' 
  | 'Lazer & Festival'
  | 'Quest Principal'
  | 'Alquimia Passiva';

export type AccountType = 'CHECKING' | 'CREDIT_CARD' | 'SAVINGS' | 'INVESTMENT';

export type BossStatus = 'ACTIVE' | 'ENRAGED' | 'DEFEATED';

export type QuestType = 'BEHAVIORAL' | 'SAVINGS' | 'BOSS_STRIKE' | 'STREAK';

export type RelicRarity = 'COMUM' | 'RARO' | 'ÉPICO' | 'LENDÁRIO' | 'MÍTICO';

export type RelicType = 'FRAME' | 'CARD_SKIN' | 'AURA' | 'TROPHY' | 'SCENERY' | 'OUTFIT' | 'BONUS_TICKET';

// 1. Guild & Party
export interface Guild {
  id: string;
  name: string;
  sanctuary_name: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  total_net_mana: number; // Saldo líquido total (R$)
  monthly_budget_cap: number; // Teto de gastos (HP base)
  current_turn: number;
  cycle_name: string;
  serasa_mystic_score: number;
  created_at: string;
}

export interface Character {
  id: string;
  guild_id: string;
  user_id: string;
  username?: string;
  password?: string;
  email?: string;
  role?: string;
  name: string;
  class_name: CharacterClass;
  element: ElementType;
  title: string;
  avatar_url: string;
  level: number;
  xp: number;
  xp_max: number;
  contribution_percent: number;
  equipped_frame_id?: string;
  equipped_skin_id?: string;
  is_active: boolean;
  created_at?: string;
}

export interface InventoryAccount {
  id: string;
  guild_id: string;
  character_id: string;
  institution_name: string;
  account_type: AccountType;
  account_number_mask: string;
  balance: number;
  credit_limit?: number;
  skin_equipped?: string;
  created_at: string;
}

// 2. Dual-Layer Transaction Engine
export interface Transaction {
  id: string;
  guild_id: string;
  character_id: string;
  inventory_id: string;
  
  // Banking Raw Layer (Preserved for audit & OFX reconciliation)
  raw_fitid: string;
  raw_description: string;
  raw_amount: number;
  raw_date: string;
  raw_checknum?: string;
  
  // Visual RPG Editable Layer (Player customizable)
  custom_name: string;
  custom_tags: string[];
  spell_type: SpellType;
  rpg_category: RpgCategory;
  lore_note?: string;
  is_critical: boolean;
  is_recurring: boolean;
  is_reviewed: boolean;

  // Split between characters (Party proportion)
  caster_name: string;
  solar_share: number; // e.g. 0.58
  lunar_share: number; // e.g. 0.42

  created_at: string;
}

// 3. Boss Fight (Credit Card Invoices & Fixed Bills)
export interface BossFight {
  id: string;
  guild_id: string;
  inventory_id: string;
  boss_name: string;
  title: string;
  threat_level: number;
  avatar_url: string;
  defeated_avatar_url: string;
  
  total_invoice_amount: number;
  current_hp: number; // Starts at total_invoice_amount, goes to 0 as paid
  max_hp: number;
  budget_defense_hp: number; // Remaining budget health before berserk
  budget_defense_max: number;
  
  due_date: string;
  days_remaining: number;
  status: BossStatus;
  passive_curse: string;
  passive_rate: string;

  // Invoice breakdown
  solar_share_amount: number;
  lunar_share_amount: number;
  fixed_share_amount: number;
  top_critical_hits: {
    description: string;
    amount: number;
    category: string;
  }[];

  // Victory Rewards
  reward_xp: number;
  reward_serasa_score: number;
  reward_relic_id: string;

  // Monthly Calendar Alignment
  month_number?: number;
  month_name?: string;
  month_theme?: string;
  financial_origin?: string;
  sprite_archetype?: string;
  image_url?: string;
}

export interface DefeatedBattleRecord {
  id: string;
  boss_id: string;
  boss_name: string;
  title: string;
  month_name: string;
  month_number: number;
  threat_level: number;
  total_paid: number;
  defeated_at: string;
  strike_type: 'CRITICAL_STRIKE' | 'MANA_BURST';
  rewards_xp: number;
  rewards_serasa_score: number;
  image_url: string;
  cleared_by: string;
  note?: string;
}

export interface YearlyBoss extends BossFight {
  month_number: number;
  month_name: string;
  month_theme: string;
  financial_origin: string;
  sprite_archetype: 
    | 'january-tributossauro'
    | 'february-serpente-carnaval'
    | 'march-leao-irpf'
    | 'april-coelhimera-cacau'
    | 'may-matriarca-floral'
    | 'june-gargula-festajunina'
    | 'july-cerbero-ferias'
    | 'august-centauro-agosto'
    | 'september-fenix-primavera'
    | 'october-lorde-travessura'
    | 'november-titan-blackfriday'
    | 'december-krampus-decimoterceiro';
  image_url: string;
}

// 4. Quests & Loot
export interface Quest {
  id: string;
  guild_id: string;
  character_id?: string;
  title: string;
  quest_type: QuestType;
  description: string;
  current_progress: number;
  target_progress: number;
  progress_unit: string;
  reward_xp: number;
  reward_text: string;
  is_ready_to_claim: boolean;
  is_completed: boolean;
  expires_in_days: number;
}

// 5. Relics & Vanity Collectibles
export interface Relic {
  id: string;
  name: string;
  rarity: RelicRarity;
  type: RelicType;
  description: string;
  image_url: string;
  unlocked: boolean;
  is_equipped: boolean;
  requirement_lore: string;
  bonus_text: string;
  bonus_amount?: number;
  ticket_status?: 'AVAILABLE' | 'ACTIVATED' | 'USED';
  scenery_bg_url?: string;
  outfit_char_id?: string;
}

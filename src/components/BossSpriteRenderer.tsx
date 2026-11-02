import React from 'react';

interface BossSpriteRendererProps {
  archetype: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  isDefeated?: boolean;
  className?: string;
}

/**
 * Renders the Boss Character Sprite in retro pixel art style.
 * Displays the authentic creature artwork provided by the user with pixel-art styling,
 * soft shadows, defeat shaders, and fallback to vector sprite.
 */
export const BossSpriteRenderer: React.FC<BossSpriteRendererProps> = ({
  archetype,
  imageUrl,
  size = 'md',
  isDefeated = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-14 h-14 sm:w-16 sm:h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-40 h-40 sm:w-48 sm:h-48',
    hero: 'w-64 h-64 sm:w-80 sm:h-80',
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}>
      {/* Soft Ground Shadow Beneath Boss (Character Only) */}
      <div className="absolute -bottom-1 w-3/4 h-3 rounded-full bg-black/70 blur-xs pointer-events-none" />

      {/* Standalone Monster Character Sprite based on Month */}
      <div className={`w-full h-full flex items-center justify-center transition-transform duration-500 ${
        isDefeated ? 'grayscale-50 brightness-75 scale-95' : 'hover:scale-105'
      }`}>
        {imageUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imageUrl}
              alt={archetype}
              className={`w-full h-full object-cover rounded-2xl pixel-art border border-primary/30 shadow-[0_8px_24px_rgba(0,0,0,0.7)] transition-all duration-300 ${
                isDefeated ? 'grayscale contrast-75 brightness-75' : ''
              }`}
            />
            {isDefeated && (
              <div className="absolute inset-0 bg-black/55 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                <span className="font-title text-[9px] sm:text-xs text-error font-bold uppercase tracking-widest px-2.5 py-1 bg-surface-container-lowest/90 rounded-lg border border-error/50 shadow-md">
                  EXPURGADO
                </span>
              </div>
            )}
          </div>
        ) : (
          renderMonsterSprite(archetype, isDefeated)
        )}
      </div>
    </div>
  );
};

function renderMonsterSprite(archetype: string, isDefeated: boolean) {
  switch (archetype) {
    // 1. JANEIRO: Tributossauro dos Boletos Primordiais (IPVA & IPTU)
    case 'january-tributossauro':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full pixel-art filter drop-shadow-[0_4px_12px_rgba(255,80,80,0.4)]">
          {/* Stone Reptile Armor with Tax Seals */}
          <rect x="30" y="35" width="40" height="42" fill="#3a3f58" rx="4" />
          <rect x="26" y="45" width="48" height="26" fill="#2d3148" rx="3" />
          {/* Spikes / Granitic Horns */}
          <polygon points="25,25 35,38 20,38" fill="#5a6280" />
          <polygon points="75,25 65,38 80,38" fill="#5a6280" />
          <polygon points="50,18 43,30 57,30" fill="#f2bf50" />
          {/* Head & Jaws */}
          <rect x="32" y="24" width="36" height="22" fill="#474e6d" rx="3" />
          {/* Glowing Red Ocular Cores */}
          <rect x="38" y="30" width="7" height="5" fill="#ff4d4d" />
          <rect x="55" y="30" width="7" height="5" fill="#ff4d4d" />
          <rect x="40" y="31" width="3" height="3" fill="#ffffff" />
          <rect x="57" y="31" width="3" height="3" fill="#ffffff" />
          {/* Metallic Jaws with Steam Vents */}
          <rect x="34" y="40" width="32" height="6" fill="#1b1e34" />
          <rect x="37" y="39" width="3" height="4" fill="#ffffff" />
          <rect x="44" y="39" width="3" height="4" fill="#ffffff" />
          <rect x="53" y="39" width="3" height="4" fill="#ffffff" />
          <rect x="60" y="39" width="3" height="4" fill="#ffffff" />
          {/* Chest Carved IPTU/IPVA Seal */}
          <rect x="42" y="52" width="16" height="14" fill="#f5c253" rx="2" />
          <text x="44" y="62" fontSize="7" fill="#000" fontWeight="bold" fontFamily="monospace">IPVA</text>
          {/* Claws & Stone Tail Club */}
          <rect x="22" y="72" width="14" height="10" fill="#26283f" rx="2" />
          <rect x="64" y="72" width="14" height="10" fill="#26283f" rx="2" />
          <polygon points="12,58 24,52 24,64" fill="#5a6280" />
          <circle cx="12" cy="58" r="4" fill="#f5c253" />
        </svg>
      );

    // 2. FEVEREIRO: Serpente Foliã do Confete Ilusório (Carnaval)
    case 'february-serpente-carnaval':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full pixel-art filter drop-shadow-[0_4px_14px_rgba(0,238,252,0.5)]">
          {/* Coiled Serpent Body in Cyan & Gold Scales */}
          <path d="M 50,25 Q 75,35 65,55 Q 55,75 35,70 Q 20,65 30,50 Q 40,40 50,48 Q 60,56 50,78 Q 45,88 38,88" fill="none" stroke="#00eefc" strokeWidth="11" strokeLinecap="round" />
          <path d="M 50,25 Q 75,35 65,55 Q 55,75 35,70 Q 20,65 30,50 Q 40,40 50,48 Q 60,56 50,78 Q 45,88 38,88" fill="none" stroke="#f5c253" strokeWidth="4" strokeDasharray="3 4" strokeLinecap="round" />
          {/* Golden Harlequin Mask Head */}
          <rect x="40" y="16" width="22" height="18" fill="#ffd9e1" rx="4" />
          {/* Venetian Eye Mask with gems */}
          <polygon points="36,18 64,18 58,28 50,24 42,28" fill="#8f0045" />
          <circle cx="44" cy="22" r="3" fill="#00eefc" />
          <circle cx="56" cy="22" r="3" fill="#00eefc" />
          <circle cx="45" cy="22" r="1" fill="#fff" />
          <circle cx="57" cy="22" r="1" fill="#fff" />
          {/* Carnival Feather Plumes */}
          <polygon points="50,14 42,-2 48,12" fill="#ff4d88" />
          <polygon points="50,14 50,-6 53,12" fill="#ffd9e1" />
          <polygon points="50,14 58,-2 52,12" fill="#00dbe9" />
          {/* Confetti Spores */}
          <rect x="25" y="32" width="3" height="3" fill="#f5c253" />
          <rect x="75" y="42" width="3" height="3" fill="#ff4d88" />
          <rect x="35" y="78" width="4" height="2" fill="#00eefc" />
          <rect x="68" y="70" width="3" height="3" fill="#ffd9e1" />
          {/* Gold Shaker Rattle on Tail */}
          <circle cx="38" cy="88" r="5" fill="#f5c253" />
        </svg>
      );

    // 3. MARÇO: O Leão Devorador do IRPF (Imposto de Renda)
    case 'march-leao-irpf':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full pixel-art filter drop-shadow-[0_4px_16px_rgba(242,191,80,0.6)]">
          {/* Flaming Paper Mane of Tax Returns */}
          <circle cx="50" cy="45" r="26" fill="#6d5000" />
          <polygon points="50,12 56,26 44,26" fill="#f5c253" />
          <polygon points="76,32 64,40 68,26" fill="#ffdea1" />
          <polygon points="80,52 66,54 74,64" fill="#f5c253" />
          <polygon points="24,32 36,40 32,26" fill="#ffdea1" />
          <polygon points="20,52 34,54 26,64" fill="#f5c253" />
          <polygon points="34,70 48,64 42,78" fill="#ffd9e1" />
          <polygon points="66,70 52,64 58,78" fill="#ffd9e1" />
          {/* Lion Bronze Head */}
          <rect x="38" y="32" width="24" height="26" fill="#b38600" rx="4" />
          {/* Fierce Emerald & Gold Feline Eyes */}
          <polygon points="41,38 48,36 46,42" fill="#00eefc" />
          <polygon points="59,38 52,36 54,42" fill="#00eefc" />
          <rect x="43" y="38" width="2" height="2" fill="#fff" />
          <rect x="55" y="38" width="2" height="2" fill="#fff" />
          {/* Snout and Platinum Fangs */}
          <polygon points="46,46 54,46 50,51" fill="#402d00" />
          <polygon points="44,53 47,60 45,53" fill="#ffffff" />
          <polygon points="56,53 53,60 55,53" fill="#ffffff" />
          {/* Body & Massive Quills */}
          <rect x="36" y="58" width="28" height="24" fill="#8f6600" rx="3" />
          {/* Gold Fountain Pen Claws */}
          <polygon points="30,76 38,72 36,86" fill="#f5c253" />
          <polygon points="70,76 62,72 64,86" fill="#f5c253" />
          {/* Tax Seal Signet on Forehead */}
          <rect x="46" y="26" width="8" height="8" fill="#93000a" rx="1" />
          <text x="47.5" y="33" fontSize="6" fill="#fff" fontWeight="bold">RF</text>
        </svg>
      );

    // 4. ABRIL: Coelhimera do Cacau Sagrado (Páscoa)
    case 'april-coelhimera-cacau':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full pixel-art filter drop-shadow-[0_4px_12px_rgba(245,194,83,0.4)]">
          {/* Dark Chocolate Egg Body with Golden Shell Fragments */}
          <ellipse cx="50" cy="56" rx="20" ry="26" fill="#3b2314" />
          <path d="M 38,36 L 46,52 L 40,66 L 34,50 Z" fill="#f5c253" />
          <path d="M 62,38 L 54,50 L 64,62 L 68,48 Z" fill="#f5c253" />
          {/* Glowing Rune Cracks in Egg Shell */}
          <path d="M 46,52 L 56,58 L 52,70" stroke="#00eefc" strokeWidth="2" fill="none" />
          {/* Rabbit Ears with Ancient Chocolate Runes */}
          <polygon points="38,32 30,6 44,28" fill="#52321c" />
          <polygon points="38,30 33,10 42,26" fill="#ffd9e1" />
          <polygon points="62,32 70,6 56,28" fill="#52321c" />
          <polygon points="62,30 67,10 58,26" fill="#ffd9e1" />
          {/* Leporine Face & Ruby Optical Eyes */}
          <circle cx="44" cy="40" r="4" fill="#ff4d88" />
          <circle cx="56" cy="40" r="4" fill="#ff4d88" />
          <circle cx="45" cy="39" r="1.5" fill="#fff" />
          <circle cx="57" cy="39" r="1.5" fill="#fff" />
          <polygon points="48,46 52,46 50,49" fill="#ffd9e1" />
          {/* Golden Staff with Gourmet Bow */}
          <line x1="72" y1="28" x2="72" y2="82" stroke="#f5c253" strokeWidth="3" />
          <circle cx="72" cy="26" r="6" fill="#ffd9e1" />
          <rect x="68" y="32" width="8" height="4" fill="#ff4d88" rx="1" />
        </svg>
      );

    // 5. MAIO: Matriarca Floral dos Banquetes (Dia das Mães)
    case 'may-matriarca-floral':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full pixel-art filter drop-shadow-[0_4px_14px_rgba(255,181,200,0.5)]">
          {/* Rose Thorn Gown & Botanical Mantle */}
          <polygon points="50,38 28,84 72,84" fill="#a80053" />
          <polygon points="50,46 36,84 64,84" fill="#65002f" />
          <circle cx="50" cy="80" r="6" fill="#f5c253" />
          <circle cx="38" cy="74" r="5" fill="#ffb1c5" />
          <circle cx="62" cy="74" r="5" fill="#ffb1c5" />
          {/* Noble Head with Crown of Astral Orchids */}
          <rect x="43" y="24" width="14" height="16" fill="#ffd9e1" rx="3" />
          <polygon points="40,24 45,14 50,22 55,14 60,24" fill="#f5c253" />
          <circle cx="45" cy="14" r="2" fill="#00eefc" />
          <circle cx="55" cy="14" r="2" fill="#00eefc" />
          {/* Emerald Empress Eyes */}
          <rect x="46" y="29" width="3" height="3" fill="#00dbe9" />
          <rect x="52" y="29" width="3" height="3" fill="#00dbe9" />
          {/* Golden Banquet Chalice */}
          <polygon points="26,44 36,44 34,56 28,56" fill="#f5c253" />
          <line x1="31" y1="56" x2="31" y2="64" stroke="#f5c253" strokeWidth="2" />
          <line x1="27" y1="64" x2="35" y2="64" stroke="#f5c253" strokeWidth="2" />
          {/* Floating Petal Embers */}
          <circle cx="20" cy="30" r="2" fill="#ffb1c5" />
          <circle cx="78" cy="38" r="2" fill="#ff4d88" />
          <circle cx="74" cy="62" r="2.5" fill="#ffd9e1" />
        </svg>
      );

    // 6. JUNHO: Gárgula da Fogueira dos Namorados (São João)
    case 'june-gargula-festajunina':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full pixel-art filter drop-shadow-[0_4px_14px_rgba(255,140,0,0.6)]">
          {/* Stone Volcanic Gargoyle Wings */}
          <polygon points="50,42 12,28 26,62" fill="#2d3148" />
          <polygon points="50,42 88,28 74,62" fill="#2d3148" />
          {/* Mini Bunting Flags strung on Wings */}
          <polygon points="20,38 25,44 30,39" fill="#00eefc" />
          <polygon points="30,39 35,46 40,41" fill="#f5c253" />
          <polygon points="70,39 75,46 80,41" fill="#ff4d88" />
          {/* Gargoyle Torso & Flame Core */}
          <rect x="36" y="38" width="28" height="36" fill="#1b1e34" rx="4" />
          {/* Burning Heart Fire in Chest */}
          <path d="M 50,56 A 4,4 0 0,0 42,52 Q 42,62 50,68 Q 58,62 58,52 A 4,4 0 0,0 50,56 Z" fill="#ff5c00" />
          {/* Horned Head with Bonfire Flame */}
          <rect x="40" y="22" width="20" height="18" fill="#30334a" rx="2" />
          <polygon points="38,24 28,14 42,20" fill="#f5c253" />
          <polygon points="62,24 72,14 58,20" fill="#f5c253" />
          <rect x="44" y="27" width="4" height="3" fill="#ff9900" />
          <rect x="52" y="27" width="4" height="3" fill="#ff9900" />
          {/* Torch of Festive Corn Fire */}
          <line x1="74" y1="46" x2="74" y2="80" stroke="#8b5a2b" strokeWidth="4" />
          <polygon points="74,38 68,48 80,48" fill="#ff3300" />
          <polygon points="74,40 70,47 78,47" fill="#ffff00" />
        </svg>
      );

    // 7. JULHO: Cérbero das Férias de Meio de Ano (Viagens)
    case 'july-cerbero-ferias':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full pixel-art filter drop-shadow-[0_4px_14px_rgba(0,238,252,0.5)]">
          {/* Cybernetic Hound Body */}
          <rect x="28" y="52" width="44" height="28" fill="#1b1e34" rx="6" />
          {/* Left Head */}
          <circle cx="32" cy="38" r="12" fill="#26283f" />
          <rect x="24" y="34" width="8" height="4" fill="#00eefc" />
          {/* Center Head (Master) */}
          <circle cx="50" cy="32" r="14" fill="#30334a" />
          <rect x="42" y="28" width="16" height="5" fill="#f5c253" rx="1" />
          {/* Right Head */}
          <circle cx="68" cy="38" r="12" fill="#26283f" />
          <rect x="68" y="34" width="8" height="4" fill="#00eefc" />
          {/* Boarding Passes / Plane Tickets in Mouth */}
          <rect x="44" y="40" width="16" height="8" fill="#ffffff" transform="rotate(-6 52 44)" />
          <line x1="46" y1="42" x2="56" y2="42" stroke="#000" strokeWidth="1" transform="rotate(-6 52 44)" />
          <line x1="46" y1="45" x2="54" y2="45" stroke="#ff3300" strokeWidth="1" transform="rotate(-6 52 44)" />
          {/* Heavy Claws */}
          <rect x="26" y="78" width="12" height="10" fill="#f5c253" rx="2" />
          <rect x="62" y="78" width="12" height="10" fill="#f5c253" rx="2" />
          {/* Compass Rune Collar */}
          <circle cx="50" cy="54" r="5" fill="#00dbe9" />
        </svg>
      );

    // 8. AGOSTO: Centauro Patriarca do Mês Sem Fim (31 Dias Úteis)
    case 'august-centauro-agosto':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full pixel-art filter drop-shadow-[0_4px_14px_rgba(242,191,80,0.5)]">
          {/* Muscular Equine Lower Body */}
          <rect x="22" y="58" width="48" height="24" fill="#4a3728" rx="4" />
          <rect x="18" y="76" width="10" height="12" fill="#2d1e15" rx="1" />
          <rect x="58" y="76" width="10" height="12" fill="#2d1e15" rx="1" />
          {/* Armored Human Torso */}
          <rect x="42" y="34" width="24" height="28" fill="#5c4300" rx="3" />
          <rect x="46" y="38" width="16" height="18" fill="#f5c253" rx="2" />
          {/* Bearded Patriarch Head & Steel Helmet */}
          <rect x="46" y="18" width="16" height="18" fill="#e0c29e" rx="2" />
          <polygon points="44,20 54,8 64,20" fill="#9b8f7c" />
          <rect x="44" y="28" width="20" height="10" fill="#665241" rx="2" />
          <rect x="49" y="22" width="3" height="2" fill="#00eefc" />
          <rect x="56" y="22" width="3" height="2" fill="#00eefc" />
          {/* Infinite Hourglass in Left Hand */}
          <polygon points="26,38 36,38 31,46" fill="#f5c253" />
          <polygon points="26,54 36,54 31,46" fill="#f5c253" />
          <line x1="31" y1="46" x2="31" y2="52" stroke="#fff" strokeWidth="2" strokeDasharray="1 1" />
          {/* Great Smithing Sledgehammer */}
          <line x1="68" y1="20" x2="80" y2="76" stroke="#9b8f7c" strokeWidth="4" />
          <rect x="64" y="16" width="16" height="10" fill="#26283f" rx="1" />
        </svg>
      );

    // 9. SETEMBRO: Fênix da Primavera Consumista (Moda)
    case 'september-fenix-primavera':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full pixel-art filter drop-shadow-[0_4px_16px_rgba(0,238,150,0.5)]">
          {/* Vivid Emerald & Golden Plumage Wings */}
          <polygon points="50,45 8,24 28,64" fill="#00dbe9" />
          <polygon points="50,45 14,32 30,58" fill="#5cf2bd" />
          <polygon points="50,45 92,24 72,64" fill="#00dbe9" />
          <polygon points="50,45 86,32 70,58" fill="#5cf2bd" />
          {/* Bird Torso */}
          <ellipse cx="50" cy="54" rx="12" ry="20" fill="#f5c253" />
          {/* Crest & Ivory Beak */}
          <circle cx="50" cy="28" r="9" fill="#00eefc" />
          <polygon points="50,19 46,6 54,6" fill="#f5c253" />
          <polygon points="50,28 62,31 50,35" fill="#ffffff" />
          <circle cx="48" cy="26" r="2" fill="#8f0045" />
          {/* Long Floral Tail Feathers with Price Tags */}
          <path d="M 50,72 Q 44,92 36,96" stroke="#00dbe9" strokeWidth="3" fill="none" />
          <path d="M 50,72 Q 50,94 50,98" stroke="#f5c253" strokeWidth="3" fill="none" />
          <path d="M 50,72 Q 56,92 64,96" stroke="#ff4d88" strokeWidth="3" fill="none" />
          <rect x="62" y="86" width="8" height="6" fill="#ffffff" rx="1" />
          <text x="63" y="91" fontSize="4" fill="#000" fontWeight="bold">-50%</text>
        </svg>
      );

    // 10. OUTUBRO: Lorde Travessura dos Doces & Brinquedos (Halloween)
    case 'october-lorde-travessura':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full pixel-art filter drop-shadow-[0_4px_16px_rgba(255,102,0,0.6)]">
          {/* Bat Wings & Ragged Cape */}
          <polygon points="50,45 16,36 28,72 38,58" fill="#1b1e34" />
          <polygon points="50,45 84,36 72,72 62,58" fill="#1b1e34" />
          {/* Slender Skeletal Tuxedo */}
          <rect x="42" y="44" width="16" height="30" fill="#30334a" rx="2" />
          <polygon points="45,46 50,56 55,46" fill="#8f0045" />
          {/* Jack-O'-Lantern Pumpkin Head */}
          <circle cx="50" cy="28" r="15" fill="#ff6600" />
          <rect x="48" y="11" width="4" height="5" fill="#2d5a27" />
          {/* Glowing Spectral Cyan Eyes & Mouth */}
          <polygon points="42,24 47,24 44,29" fill="#00eefc" />
          <polygon points="58,24 53,24 56,29" fill="#00eefc" />
          <polygon points="44,34 46,31 48,34 50,31 52,34 54,31 56,34 50,38" fill="#00eefc" />
          {/* Magic Toy Sack full of Electronics */}
          <circle cx="70" cy="62" r="12" fill="#6d5000" />
          <rect x="66" y="52" width="8" height="6" fill="#ff4d4d" rx="1" />
          <rect x="70" y="58" width="6" height="6" fill="#00eefc" rx="1" />
        </svg>
      );

    // 11. NOVEMBRO: Titan da Fatura Implacável (Black Friday)
    case 'november-titan-blackfriday':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full pixel-art filter drop-shadow-[0_4px_18px_rgba(255,77,77,0.65)]">
          {/* Colossal Obsidian Automaton Torso */}
          <rect x="30" y="32" width="40" height="42" fill="#171a2f" rx="4" />
          <rect x="34" y="36" width="32" height="34" fill="#090c21" rx="2" />
          {/* Ruby Mist Steam Vents */}
          <rect x="22" y="38" width="8" height="16" fill="#4f4636" rx="2" />
          <rect x="70" y="38" width="8" height="16" fill="#4f4636" rx="2" />
          <polygon points="26,34 30,38 22,38" fill="#ff4d4d" />
          <polygon points="74,34 78,38 70,38" fill="#ff4d4d" />
          {/* Head with Horned Titanium Plates */}
          <rect x="36" y="16" width="28" height="18" fill="#1b1e34" rx="3" />
          <polygon points="32,16 38,4 42,16" fill="#f5c253" />
          <polygon points="68,16 62,4 58,16" fill="#f5c253" />
          {/* Glowing Optical Scanner Eye Line */}
          <rect x="40" y="22" width="20" height="4" fill="#ff1a1a" />
          <rect x="48" y="21" width="4" height="6" fill="#ffffff" />
          {/* Glowing Crimson Runes across Armor */}
          <line x1="38" y1="44" x2="62" y2="44" stroke="#ff4d4d" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="50" y1="44" x2="50" y2="64" stroke="#ff4d4d" strokeWidth="2" />
          {/* Black Credit Card Blade Sword with Gold Chip */}
          <rect x="76" y="14" width="12" height="64" fill="#000000" stroke="#f5c253" strokeWidth="1.5" rx="2" transform="rotate(15 76 14)" />
          <rect x="79" y="34" width="6" height="8" fill="#f5c253" rx="1" transform="rotate(15 76 14)" />
          {/* Heavy Gauntlet Legs */}
          <rect x="32" y="74" width="14" height="14" fill="#30334a" rx="2" />
          <rect x="54" y="74" width="14" height="14" fill="#30334a" rx="2" />
        </svg>
      );

    // 12. DEZEMBRO: Krampus do Décimo Terceiro & Dragão da Ceia (Natal & Réveillon)
    case 'december-krampus-decimoterceiro':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full pixel-art filter drop-shadow-[0_4px_20px_rgba(245,194,83,0.7)]">
          {/* Massive Ice Horns of Solstice Krampus */}
          <path d="M 40,24 Q 24,10 18,2 M 38,20 Q 28,14 26,8" stroke="#00eefc" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 60,24 Q 76,10 82,2 M 62,20 Q 72,14 74,8" stroke="#00eefc" strokeWidth="4" strokeLinecap="round" fill="none" />
          {/* Dragon Demon Torso with Festive Wreath */}
          <rect x="30" y="32" width="40" height="44" fill="#4a0024" rx="6" />
          <circle cx="50" cy="52" r="16" fill="none" stroke="#2d5a27" strokeWidth="5" />
          {/* Fairy Lights on Wreath */}
          <circle cx="44" cy="40" r="2" fill="#ff4d4d" />
          <circle cx="56" cy="40" r="2" fill="#f5c253" />
          <circle cx="64" cy="52" r="2" fill="#00eefc" />
          <circle cx="36" cy="52" r="2" fill="#ffffff" />
          <circle cx="50" cy="66" r="2.5" fill="#ff4d4d" />
          {/* Fearsome Krampus Face & Fangs */}
          <rect x="36" y="18" width="28" height="18" fill="#2d0016" rx="3" />
          <rect x="41" y="24" width="5" height="3" fill="#ffdd00" />
          <rect x="54" y="24" width="5" height="3" fill="#ffdd00" />
          <polygon points="44,32 46,36 48,32" fill="#ffffff" />
          <polygon points="52,32 54,36 56,32" fill="#ffffff" />
          {/* Chest of 13th Salary Overflowing with Gold Coins */}
          <rect x="34" y="68" width="32" height="16" fill="#8f6600" stroke="#f5c253" strokeWidth="2" rx="2" />
          <ellipse cx="50" cy="68" rx="14" ry="4" fill="#ffd700" />
          <circle cx="44" cy="66" r="2" fill="#fff" />
          <circle cx="52" cy="65" r="2.5" fill="#fff" />
          <circle cx="58" cy="67" r="2" fill="#fff" />
          <text x="40" y="80" fontSize="7" fill="#fff" fontWeight="bold">13º SAL</text>
        </svg>
      );

    default:
      return null;
  }
}

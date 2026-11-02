import { Transaction, SpellType, RpgCategory } from '../types/game';

/**
 * OFX (Open Financial Exchange) Parser for Tales of Finance
 * Handles both SGML and XML formatted OFX 1.0.2 / 2.0 files.
 * Preserves raw banking layer (FITID, MEMO/NAME, TRNAMT, DTPOSTED)
 * while assigning initial RPG game layer classification.
 */

export interface ParsedOfxTransaction {
  fitid: string;
  memo: string;
  amount: number;
  date: string;
  trntype: string;
  checknum?: string;
}

export interface OfxParseResult {
  bankId?: string;
  acctId?: string;
  currency?: string;
  transactions: ParsedOfxTransaction[];
}

export function parseOfxContent(ofxText: string): OfxParseResult {
  const transactions: ParsedOfxTransaction[] = [];

  // Match all <STMTTRN>...</STMTTRN> blocks
  const stmtTrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
  let match;

  while ((match = stmtTrnRegex.exec(ofxText)) !== null) {
    const block = match[1];

    const trntype = extractTagValue(block, 'TRNTYPE') || 'OTHER';
    const dtposted = extractTagValue(block, 'DTPOSTED') || '';
    const trnamt = parseFloat(extractTagValue(block, 'TRNAMT') || '0');
    const fitid = extractTagValue(block, 'FITID') || `gen-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const checknum = extractTagValue(block, 'CHECKNUM');
    const memo = extractTagValue(block, 'MEMO') || extractTagValue(block, 'NAME') || 'Transação Bancária';

    transactions.push({
      fitid,
      memo: memo.trim(),
      amount: trnamt,
      date: formatOfxDate(dtposted),
      trntype,
      checknum,
    });
  }

  // Fallback if no closing tags (old SGML format)
  if (transactions.length === 0) {
    const rawBlocks = ofxText.split(/<STMTTRN>/i);
    for (let i = 1; i < rawBlocks.length; i++) {
      const block = rawBlocks[i];
      const trntype = extractSgmlTagValue(block, 'TRNTYPE') || 'OTHER';
      const dtposted = extractSgmlTagValue(block, 'DTPOSTED') || '';
      const trnamt = parseFloat(extractSgmlTagValue(block, 'TRNAMT') || '0');
      const fitid = extractSgmlTagValue(block, 'FITID') || `gen-${Date.now()}-${i}`;
      const memo = extractSgmlTagValue(block, 'MEMO') || extractSgmlTagValue(block, 'NAME') || 'Transação Bancária';

      if (!isNaN(trnamt)) {
        transactions.push({
          fitid,
          memo: memo.trim(),
          amount: trnamt,
          date: formatOfxDate(dtposted),
          trntype,
        });
      }
    }
  }

  const bankId = extractTagValue(ofxText, 'BANKID') || extractSgmlTagValue(ofxText, 'BANKID');
  const acctId = extractTagValue(ofxText, 'ACCTID') || extractSgmlTagValue(ofxText, 'ACCTID');

  return {
    bankId,
    acctId,
    currency: 'BRL',
    transactions,
  };
}

function extractTagValue(xmlBlock: string, tagName: string): string | undefined {
  const match = new RegExp(`<${tagName}>([^<\\r\\n]+)`, 'i').exec(xmlBlock);
  return match ? match[1].trim() : undefined;
}

function extractSgmlTagValue(block: string, tagName: string): string | undefined {
  const match = new RegExp(`<${tagName}>([^\r\n<]+)`, 'i').exec(block);
  return match ? match[1].trim() : undefined;
}

function formatOfxDate(ofxDate: string): string {
  // OFX format: YYYYMMDDHHMMSS or YYYYMMDD
  if (!ofxDate || ofxDate.length < 8) return new Date().toISOString();
  const year = ofxDate.substring(0, 4);
  const month = ofxDate.substring(4, 6);
  const day = ofxDate.substring(6, 8);
  return `${year}-${month}-${day}T12:00:00Z`;
}

/**
 * Intelligent RPG classifier for raw bank strings
 * Translates merchant names to Sea of Stars fantasy equivalents!
 */
export function classifyRpgTransaction(
  raw: ParsedOfxTransaction, 
  guildId: string, 
  characterId: string, 
  inventoryId: string
): Transaction {
  const descUpper = raw.memo.toUpperCase();
  const isPositive = raw.amount > 0;

  let spell_type: SpellType = isPositive ? 'LOOT' : 'DAMAGE';
  let rpg_category: RpgCategory = 'Arsenal & Loot';
  let custom_name = raw.memo;
  const tags: string[] = [];

  if (isPositive) {
    if (descUpper.includes('SALAR') || descUpper.includes('PAGTO') || descUpper.includes('TED')) {
      custom_name = 'Provisão Real / Salário da Guilda';
      rpg_category = 'Quest Principal';
      tags.push('salario', 'provisao', 'mana');
    } else if (descUpper.includes('REND') || descUpper.includes('CDB') || descUpper.includes('JUROS')) {
      custom_name = 'Alquimia dos Juros (Rendimento)';
      rpg_category = 'Alquimia Passiva';
      tags.push('investimento', 'reserva');
    } else {
      custom_name = `Tesouro Conquistado (${raw.memo})`;
      rpg_category = 'Arsenal & Loot';
      tags.push('loot', 'ouro');
    }
  } else {
    // Expenses
    if (descUpper.includes('IFOOD') || descUpper.includes('RAPPI') || descUpper.includes('RESTAURANTE') || descUpper.includes('MERCAD') || descUpper.includes('PAO DE ACUCAR')) {
      custom_name = descUpper.includes('IFOOD') ? 'Teleporte de Banquete (iFood)' : 'Banquete na Taverna Local';
      rpg_category = 'Taverna & Suprimentos';
      tags.push('alimentacao', 'taverna');
    } else if (descUpper.includes('UBER') || descUpper.includes('99') || descUpper.includes('POSTO') || descUpper.includes('SHELL') || descUpper.includes('METRO')) {
      custom_name = 'Carruagem Astral (Transporte)';
      rpg_category = 'Montaria & Teleporte';
      tags.push('transporte', 'montaria');
    } else if (descUpper.includes('NETFLIX') || descUpper.includes('SPOTIFY') || descUpper.includes('AMAZON PRIME') || descUpper.includes('ASSINATURA')) {
      custom_name = `Veneno Contínuo: ${raw.memo}`;
      spell_type = 'POISON';
      rpg_category = 'Veneno Periódico';
      tags.push('assinatura', 'recorrente');
    } else if (descUpper.includes('ENEL') || descUpper.includes('LUZ') || descUpper.includes('AGUA') || descUpper.includes('CONDOMINIO') || descUpper.includes('ALUGUEL')) {
      custom_name = 'Defesa e Manutenção da Cidadela';
      rpg_category = 'Defesa de Castelo';
      tags.push('moradia', 'essencial');
    } else {
      custom_name = `Golpe do Mercador (${raw.memo})`;
      rpg_category = 'Arsenal & Loot';
      tags.push('compras');
    }
  }

  return {
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    guild_id: guildId,
    character_id: characterId,
    inventory_id: inventoryId,
    raw_fitid: raw.fitid,
    raw_description: raw.memo,
    raw_amount: raw.amount,
    raw_date: raw.date,
    raw_checknum: raw.checknum,
    custom_name,
    custom_tags: tags,
    spell_type,
    rpg_category,
    is_critical: Math.abs(raw.amount) >= 500,
    is_recurring: spell_type === 'POISON' || descUpper.includes('ASSINATURA'),
    is_reviewed: false,
    caster_name: 'Iury & Ray',
    solar_share: 0.5,
    lunar_share: 0.5,
    created_at: new Date().toISOString(),
  };
}

export const SAMPLE_OFX_FILE = `OFXHEADER:100
DATA:OFXSGML
VERSION:102
SECURITY:NONE
ENCODING:USASCII
CHARSET:1252
COMPRESSION:NONE
OLDFILEUID:NONE
NEWFILEUID:NONE

<OFX>
<SIGNONMSGSRSV1>
<SONRS>
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<DTSERVER>20261112120000
<LANGUAGE>POR
</SONRS>
</SIGNONMSGSRSV1>
<BANKMSGSRSV1>
<STMTTRNRS>
<TRNUID>1001
<STATUS>
<CODE>0
<SEVERITY>INFO
</STATUS>
<STMTRS>
<CURDEF>BRL
<BANKACCTFROM>
<BANKID>260
<ACCTID>0001-98765432-1
<ACCTTYPE>CHECKING
</BANKACCTFROM>
<BANKTRANLIST>
<DTSTART>20261101000000
<DTEND>20261112235959
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>20261105083000
<TRNAMT>4500.00
<FITID>20261105001923
<CHECKNUM>001
<MEMO>TED PAGAMENTO SALARIO EMPRESA TECH
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20261106193000
<TRNAMT>-84.90
<FITID>20261106002481
<MEMO>IFOOD *RESTAURANTE JAPONES LUA
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20261107141500
<TRNAMT>-45.00
<FITID>20261107003192
<MEMO>UBER *TRIP RIDE SAO PAULO
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20261108110000
<TRNAMT>-1250.00
<FITID>20261108004510
<MEMO>CONDOMINIO RESIDENCIAL SANTUARIO
</STMTTRN>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20261110091000
<TRNAMT>-55.90
<FITID>20261110005230
<MEMO>NETFLIX.COM MENSALIDADE
</STMTTRN>
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>20261111164500
<TRNAMT>120.40
<FITID>20261111006124
<MEMO>RENDIMENTO POUPANCA / CDB ASTRAL
</STMTTRN>
</BANKTRANLIST>
<LEDGERBAL>
<BALAMT>14850.00
<DTASOF>20261112235959
</LEDGERBAL>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>`;

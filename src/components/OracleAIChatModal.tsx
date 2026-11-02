/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Guild, Character, BossFight, Transaction } from '../types/game';
import { askFinanceOracle, ChatMessage, FinanceContext } from '../services/geminiChat';
import { sounds } from '../utils/soundEffects';

interface OracleAIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  guild: Guild;
  characters: Character[];
  boss: BossFight;
  transactions: Transaction[];
  initialPrompt?: string;
}

const QUICK_PROMPTS = [
  { label: '🔮 Analisar Vazamentos de Gastos', prompt: 'Analise meus padrões de gastos deste mês e aponte os principais pontos cegos ou vazamentos de mana.' },
  { label: '⚔️ Estratégia Contra o Boss Nubank', prompt: 'A fatura do Nubank está quase estourando o limite de defesa orçamentária. Qual o melhor plano tático para nós dois?' },
  { label: '🍲 Cortar Despesas de Alimentação', prompt: 'Como podemos reduzir gastos com Taverna, restaurantes e delivery sem perder a qualidade de vida?' },
  { label: '📈 Atingir 35% de Poupança', prompt: 'Nossa taxa de poupança atual é 29.7%. O que Ray e Iury podem fazer para alcançar a meta lendária de 35%?' },
  { label: '🛡️ Diagnóstico da Reserva', prompt: 'Nossa reserva de emergência de R$ 8.500 está adequada para nosso padrão de vida atual? Como expandi-la?' },
];

export const OracleAIChatModal: React.FC<OracleAIChatModalProps> = ({
  isOpen,
  onClose,
  guild,
  characters,
  boss,
  transactions,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'oracle',
      text: `Saudações, Guardiões do Santuário Solar-Lunar! 🌟\n\nEu sou o **Oráculo Arcano de Finanças**, sintonizado diretamente aos registros do Grimório da **Guilda Amorim Granja**.\n\nAtualmente observo:\n• **Mana Líquida:** R$ ${guild.total_net_mana.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n• **Taxa de Forja (Poupança):** 29.7% *(Meta: 35.0%)*\n• **Boss da Fatura:** ${boss.boss_name} (${boss.title}) com R$ ${boss.total_invoice_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} *(Alerta: Escudo de Defesa a 95%)*\n\nComo posso guiar a sabedoria financeira de **Ray** e a força estratégica de **Iury** hoje? Escolha uma consulta abaixo ou digite sua dúvida!`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const context: FinanceContext = {
    guild,
    characters,
    boss,
    transactions,
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Focus input and handle initialPrompt when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      if (initialPrompt) {
        handleSendMessage(initialPrompt);
      }
    }
  }, [isOpen, initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    sounds.playSelect();

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await askFinanceOracle(query, [...messages, userMessage], context);
      sounds.playSpell();

      const oracleMessage: ChatMessage = {
        id: `oracle-${Date.now()}`,
        sender: 'oracle',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, oracleMessage]);
    } catch (err) {
      console.error('Error fetching oracle response', err);
      const fallbackMsg: ChatMessage = {
        id: `oracle-err-${Date.now()}`,
        sender: 'oracle',
        text: 'As correntes de mana cósmica oscilaram momentaneamente, mas os preceitos fundamentais permanecem: mantenham a disciplina na taverna e preservem a reserva de emergência da guilda!',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    sounds.playSelect();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'oracle',
        text: `Memória do oráculo renovada nas fontes astrais! Estou pronto para analisar novas decisões financeiras e guiar a **Guilda Amorim Granja**.`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-xl h-[92vh] max-h-[820px] bg-[#0c1026] border-2 border-primary/50 rounded-3xl shadow-[0_0_50px_rgba(242,191,80,0.3)] flex flex-col overflow-hidden text-on-surface">
        
        {/* Celestial Background Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(0,238,252,0.12),transparent_70%),radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(245,194,83,0.1),transparent_70%)]" />

        {/* Header */}
        <div className="relative z-10 px-4 sm:px-5 py-3.5 bg-surface-container-high/90 border-b border-surface-container-highest flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-secondary/30 via-primary/20 to-surface-container border border-secondary/60 flex items-center justify-center shadow-[0_0_14px_rgba(0,238,252,0.35)] shrink-0">
              <span className="material-symbols-outlined text-secondary text-[22px] animate-pulse">
                psychology
              </span>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-[#0c1026] shadow-[0_0_6px_#f5c253]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-title text-base sm:text-lg font-bold text-on-surface tracking-wide">
                  Oráculo Arcano de IA
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/20 text-primary border border-primary/40 uppercase">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Análise Comportamental & Sugestões Financeiras em Tempo Real
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearHistory}
              title="Limpar Diálogo Cósmico"
              className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-xl transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[19px]">restart_alt</span>
            </button>
            <button
              onClick={() => { sounds.playSelect(); onClose(); }}
              title="Fechar Oráculo"
              className="p-1.5 text-on-surface-variant hover:text-white hover:bg-surface-container-highest rounded-xl transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Live Guild Mini-Banner */}
        <div className="relative z-10 px-4 py-2 bg-[#080b1e]/90 border-b border-surface-container-high/60 flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <span className="text-secondary font-bold">Ray & Iury</span>
            <span className="text-outline">•</span>
            <span className="text-on-surface-variant">Nív. {guild.level}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-primary font-bold">Poupança: 29.7%</span>
            <span className="text-error font-bold truncate max-w-[150px]">Fatura: R$ {boss.total_invoice_amount.toFixed(0)}</span>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="relative z-10 flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar Icon */}
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border shadow-sm ${
                    isUser
                      ? 'bg-primary/20 border-primary/50 text-primary'
                      : 'bg-secondary/20 border-secondary/50 text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isUser ? 'person' : 'auto_awesome'}
                  </span>
                </div>

                {/* Bubble Container */}
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-primary-container text-on-primary-container rounded-tr-none shadow-[0_2px_12px_rgba(245,194,83,0.25)] border border-primary/40'
                      : 'bg-surface-container-low text-on-surface rounded-tl-none shadow-md border border-surface-container-highest whitespace-pre-wrap'
                  }`}
                >
                  {/* Sender Header */}
                  <div className="flex items-center justify-between gap-2 mb-1 opacity-80 text-[10px] font-mono">
                    <span className="font-bold uppercase">
                      {isUser ? 'Guardião da Guilda' : 'Oráculo Arcano'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message Body with stylized formatting */}
                  <div className="space-y-1.5 font-body">
                    {msg.text.split('\n').map((line, idx) => {
                      if (!line.trim()) {
                        return <div key={idx} className="h-1.5" />;
                      }

                      // Check for bullet lists
                      if (line.startsWith('•') || line.startsWith('-')) {
                        return (
                          <div key={idx} className="flex items-start gap-1.5 pl-1">
                            <span className="text-secondary shrink-0">•</span>
                            <span>{renderFormattedText(line.replace(/^[•-]\s*/, ''))}</span>
                          </div>
                        );
                      }

                      // Check for numbered list
                      const numberedMatch = line.match(/^(\d+)\.\s*(.*)/);
                      if (numberedMatch) {
                        return (
                          <div key={idx} className="flex items-start gap-2 pl-1">
                            <span className="font-mono text-primary font-bold shrink-0">{numberedMatch[1]}.</span>
                            <span>{renderFormattedText(numberedMatch[2])}</span>
                          </div>
                        );
                      }

                      return <p key={idx}>{renderFormattedText(line)}</p>;
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-secondary/20 border border-secondary/50 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  hourglass_top
                </span>
              </div>
              <div className="bg-surface-container-low border border-surface-container-highest rounded-2xl rounded-tl-none p-3.5 shadow-md flex items-center gap-2">
                <span className="text-xs text-secondary font-mono">Consultando os astros e os registros do grimório...</span>
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="relative z-10 px-4 py-2 bg-[#090d22]/90 border-t border-surface-container-high/60 overflow-x-auto no-scrollbar flex items-center gap-2">
          {QUICK_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.prompt)}
              disabled={isLoading}
              className="shrink-0 px-2.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-bright active:scale-95 text-xs text-on-surface-variant hover:text-primary border border-surface-container-highest transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="relative z-10 p-3 sm:p-4 bg-surface-container-high/90 border-t border-surface-container-highest">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Pergunte ao Oráculo sobre hábitos, cortes ou metas..."
                disabled={isLoading}
                className="w-full bg-surface-container-lowest text-on-surface text-xs sm:text-sm rounded-2xl px-4 py-3 pl-10 border border-surface-container-highest focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary/50 placeholder:text-outline shadow-inner"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                chat_bubble
              </span>
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="h-11 px-4 rounded-2xl bg-gradient-to-r from-primary-container to-primary text-on-primary-container font-label-sm font-bold text-xs uppercase flex items-center gap-1.5 shadow-[0_0_16px_rgba(242,191,80,0.3)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:hover:scale-100"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span className="hidden sm:inline">Consultar</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

// Helper to format bold markdown-like text (**bold**)
function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

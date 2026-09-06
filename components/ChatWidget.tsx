'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

const GREETING =
  "Hi! I'm Kristy's assistant ✨ Ask me about our services, pricing, hours, or how to book an appointment!";

// ─── Main component ─────────────────────────────────────────────────────────

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'greeting', role: 'assistant', text: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Build history for API (exclude greeting, map to API format)
      const history = [...messages, userMsg]
        .filter((m) => m.id !== 'greeting')
        .map((m) => ({
          role: m.role === 'user' ? ('user' as const) : ('model' as const),
          text: m.text,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: history.slice(0, -1), // exclude the current message since it's sent separately
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          text: data.reply || "Sorry, I couldn't respond. Please try again!",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          text: "I'm having trouble connecting. Please try again, or call us at 095156 25554!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Chat Window ── */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '380px',
            maxWidth: 'calc(100vw - 40px)',
            height: '520px',
            maxHeight: 'calc(100vh - 140px)',
            backgroundColor: '#0a0a0a',
            border: '1px solid rgba(201,169,110,0.3)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 9999,
            boxShadow: '0 12px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,169,110,0.15)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#111111',
              borderBottom: '1px solid rgba(201,169,110,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c9a96e 0%, #a08040 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                }}
              >
                ✨
              </div>
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-heading), ui-serif, Georgia, serif',
                    fontSize: '16px',
                    color: '#ffffff',
                    fontWeight: 400,
                    lineHeight: 1.2,
                  }}
                >
                  Kristy&apos;s Assistant
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                    fontSize: '11px',
                    color: '#7ecf91',
                    letterSpacing: '0.04em',
                  }}
                >
                  ● Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#8e8886',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '4px 8px',
                lineHeight: 1,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#8e8886')}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius:
                      msg.role === 'user'
                        ? '14px 14px 4px 14px'
                        : '14px 14px 14px 4px',
                    backgroundColor:
                      msg.role === 'user'
                        ? 'rgba(201,169,110,0.2)'
                        : '#1a1a1a',
                    border: `1px solid ${
                      msg.role === 'user'
                        ? 'rgba(201,169,110,0.35)'
                        : 'rgba(180,174,172,0.12)'
                    }`,
                    fontFamily:
                      'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                    fontSize: '14px',
                    lineHeight: 1.55,
                    color: msg.role === 'user' ? '#f2f1ed' : '#e2dedb',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '12px 18px',
                    borderRadius: '14px 14px 14px 4px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(180,174,172,0.12)',
                    display: 'flex',
                    gap: '5px',
                    alignItems: 'center',
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: '#c9a96e',
                        opacity: 0.5,
                        animation: `chatBounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid rgba(180,174,172,0.15)',
              backgroundColor: '#111111',
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about services, hours, booking…"
              disabled={isLoading}
              style={{
                flex: 1,
                fontFamily: 'var(--font-body), ui-sans-serif, system-ui, sans-serif',
                fontSize: '14px',
                color: '#f2f1ed',
                backgroundColor: '#1a1a1a',
                border: '1px solid rgba(180,174,172,0.2)',
                borderRadius: '10px',
                padding: '10px 14px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = 'rgba(201,169,110,0.5)')
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = 'rgba(180,174,172,0.2)')
              }
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor:
                  isLoading || !input.trim()
                    ? 'rgba(201,169,110,0.2)'
                    : '#c9a96e',
                color:
                  isLoading || !input.trim() ? '#8e8886' : '#000000',
                cursor:
                  isLoading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
              aria-label="Send message"
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Bubble ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #c9a96e 0%, #a08040 100%)',
          color: '#000000',
          fontSize: '26px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9998,
          boxShadow: '0 6px 24px rgba(201,169,110,0.4), 0 2px 8px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow =
            '0 8px 32px rgba(201,169,110,0.5), 0 2px 8px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow =
            '0 6px 24px rgba(201,169,110,0.4), 0 2px 8px rgba(0,0,0,0.3)';
        }}
        aria-label={isOpen ? 'Close chat' : 'Open chat with Kristy\'s Assistant'}
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* ── Animations ── */}
      <style>{`
        @keyframes chatBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </>
  );
}

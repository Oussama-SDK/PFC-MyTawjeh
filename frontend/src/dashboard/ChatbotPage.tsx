import { useState, useEffect, useRef } from 'react';
import { User, ChatMessage, apiFetch } from './shared';
import { useTranslation } from '../i18n';

// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function renderMarkdown(text: string): string {
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // Italic (not inside bold)
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(124,58,237,0.08);padding:1px 5px;border-radius:4px;font-size:0.9em">$1</code>');

  // Process lines for headings and lists
  const lines = html.split('\n');
  const out: string[] = [];
  let listTag: 'ul' | 'ol' | null = null;

  const closeList = () => { if (listTag) { out.push(`</${listTag}>`); listTag = null; } };

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^#{1,3} /.test(trimmed)) {
      closeList();
      out.push(`<strong style="display:block;margin:10px 0 4px;font-size:1em">${trimmed.replace(/^#{1,3} /, '')}</strong>`);
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (listTag !== 'ol') { closeList(); out.push('<ol style="margin:6px 0 6px 18px;padding:0">'); listTag = 'ol'; }
      out.push(`<li style="margin:3px 0">${trimmed.replace(/^\d+\.\s+/, '')}</li>`);
    } else if (/^[-*]\s/.test(trimmed)) {
      if (listTag !== 'ul') { closeList(); out.push('<ul style="margin:6px 0 6px 18px;padding:0">'); listTag = 'ul'; }
      out.push(`<li style="margin:3px 0">${trimmed.replace(/^[-*]\s+/, '')}</li>`);
    } else if (trimmed === '') {
      closeList();
      out.push('<br/>');
    } else {
      closeList();
      out.push(line + '<br/>');
    }
  }
  closeList();
  // Trim leading/trailing <br/>
  return out.join('').replace(/^(<br\/>)+|(<br\/>)+$/g, '');
}

export default function ChatbotPage({ user }: { user: User }) {
  const t = useTranslation();
  const tc = t.dashboard.chatbot || {};

  const welcomeMsg: ChatMessage = {
    role: 'assistant',
    content: `${t.dashboard.labels.hello} ${user.nom} ! 👋 ${tc.welcomeMsg || ''}`,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMsg]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const speechSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const suggestions: string[] = tc.suggestionItems || [
    'Quelle CPGE me conseilles-tu ?',
    'Comment améliorer mes maths ?',
    'Quels concours dois-je préparer ?',
    'Quel métier correspond à mon profil ?',
  ];

  // Load persisted history on mount
  useEffect(() => {
    apiFetch('/chatbot/history')
      .then((data: { messages: ChatMessage[] }) => {
        if (data.messages && data.messages.length > 0) {
          setMessages([welcomeMsg, ...data.messages]);
        }
      })
      .catch(() => {})
      .finally(() => setHistoryLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!voiceError) return;
    const timer = setTimeout(() => setVoiceError(''), 5000);
    return () => clearTimeout(timer);
  }, [voiceError]);

  const resetConversation = async () => {
    try { await apiFetch('/chatbot/history', { method: 'DELETE' }); } catch (_) {}
    setMessages([welcomeMsg]);
  };

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const data = await apiFetch('/chatbot/message', {
        method: 'POST',
        body: JSON.stringify({ message: msg }),
      });
      setMessages(m => [...m, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: tc.errorMsg || "Désolé, une erreur s'est produite." }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoice = async () => {
    if (!speechSupported) return;
    setVoiceError('');
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    // Explicitly trigger browser "Allow / Block" microphone dialog
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
    } catch {
      setVoiceError('🚫 Microphone bloqué — clique sur "Autoriser" dans la fenêtre du navigateur.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'fr-FR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev + ' ' + transcript).trim());
      setListening(false);
    };
    recognition.onerror = (event: any) => {
      setListening(false);
      const errors: Record<string, string> = {
        'not-allowed':         '🚫 Microphone bloqué — autorise l\'accès dans les paramètres du navigateur.',
        'audio-capture':       '🎤 Aucun microphone détecté sur cet appareil.',
        'service-not-allowed': '🔒 Microphone indisponible (accès HTTPS requis ou service bloqué).',
        'network':             '🌐 Erreur réseau lors de la reconnaissance vocale.',
        'no-speech':           '🔇 Aucune voix détectée — réessaie.',
        'aborted':             '',
      };
      const msg = errors[event.error] ?? '⚠️ Microphone indisponible.';
      if (msg) setVoiceError(msg);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const downloadConversation = () => {
    const lines = messages.map(m => {
      const who = m.role === 'assistant' ? 'Mowajih AI' : user.nom;
      return `[${who}]\n${m.content}\n`;
    });
    const content = `Conversation Mowajih AI — ${new Date().toLocaleDateString('fr-FR')}\n${'='.repeat(50)}\n\n${lines.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mowajih-ai-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 130px)' }}>
      {/* Title */}
      <div style={{ marginBottom: 12, padding: '0 4px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f0c29', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>🤖</span> Mowajih AI
        </h2>
        <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>
          {tc.subtitle}
        </p>
      </div>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
        {messages.length > 1 && (
          <button onClick={downloadConversation} style={{
            fontSize: 12, color: '#7c3aed', background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, padding: '5px 12px',
            cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {tc.download || '⬇️ Télécharger'}
          </button>
        )}
        <button onClick={resetConversation} style={{
          fontSize: 12, color: '#94a3b8', background: 'rgba(255,255,255,0.8)',
          border: '1px solid #e2e8f0', borderRadius: 8, padding: '5px 12px',
          cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
        }}>
          {tc.newConversation || '🔄 Nouvelle conversation'}
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, paddingBottom: 8 }}>
        {historyLoading && (
          <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, padding: '8px 0' }}>
            Chargement de l'historique…
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700,
              background: msg.role === 'assistant' ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#f1f5f9',
              color: msg.role === 'assistant' ? '#fff' : '#64748b',
            }}>
              {msg.role === 'assistant' ? '🤖' : user.nom.charAt(0).toUpperCase()}
            </div>
            <div style={{
              maxWidth: '75%', padding: '12px 16px', fontSize: 13.5, lineHeight: 1.6,
              borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              background: msg.role === 'user' ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#fff',
              color: msg.role === 'user' ? '#fff' : '#1e293b',
              boxShadow: msg.role === 'user' ? '0 4px 12px rgba(124,58,237,0.3)' : '0 2px 8px rgba(15,12,41,0.06)',
              border: msg.role === 'assistant' ? '1px solid rgba(139,92,246,0.1)' : 'none',
            }}
              {...(msg.role === 'assistant'
                ? { dangerouslySetInnerHTML: { __html: renderMarkdown(msg.content) } }
                : { children: msg.content }
              )}
            />
          </div>
        ))}

        {showSuggestions && (
          <div style={{ padding: '4px 0' }}>
            <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>{tc.suggestionsLabel || 'Suggestions'}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  padding: '7px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  background: 'rgba(124,58,237,0.08)', color: '#7c3aed',
                  border: '1px solid rgba(124,58,237,0.2)', transition: 'all .15s',
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>🤖</div>
            <div style={{ background: '#fff', borderRadius: '18px 18px 18px 4px', padding: '14px 18px', border: '1px solid rgba(139,92,246,0.1)', display: 'flex', gap: 6, alignItems: 'center' }}>
              {[0, 150, 300].map(delay => (
                <span key={delay} style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa', display: 'inline-block', animation: 'bounce 1s infinite', animationDelay: `${delay}ms` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ paddingTop: 14, borderTop: '1px solid rgba(139,92,246,0.08)' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder={tc.placeholder || 'Posez votre question à Mowajih AI...'}
            className="dash-input"
            style={{ flex: 1 }}
            onFocus={e => (e.target.style.borderColor = '#7c3aed')}
            onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
          />
          {speechSupported && (
            <button
              onClick={toggleVoice}
              title={listening ? (tc.stopVoice || 'Arrêter') : (tc.startVoice || 'Parler')}
              style={{
                width: 44, height: 44, borderRadius: 12, border: 'none',
                cursor: 'pointer', flexShrink: 0, fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: listening ? 'linear-gradient(135deg,#dc2626,#ef4444)' : 'rgba(124,58,237,0.1)',
                color: listening ? '#fff' : '#7c3aed',
                animation: listening ? 'pulse 1.5s infinite' : 'none',
                transition: 'all .2s',
              }}
            >
              🎙️
            </button>
          )}
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              width: 44, height: 44, borderRadius: 12, border: 'none',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              background: input.trim() && !loading ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : '#e2e8f0',
              color: input.trim() && !loading ? '#fff' : '#94a3b8',
              fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'all .2s',
              boxShadow: input.trim() && !loading ? '0 4px 12px rgba(124,58,237,0.35)' : 'none',
            }}
          >↑</button>
        </div>
        <p style={{ fontSize: 11, color: voiceError ? '#dc2626' : '#94a3b8', marginTop: 8, textAlign: 'center', minHeight: 16 }}>
          {voiceError || (listening ? (tc.listening || '🎙️ Écoute en cours...') : `${tc.memoryHint || 'Se souvient de votre conversation'} · ${messages.length - 1} message${messages.length !== 2 ? 's' : ''}`)}
        </p>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, Database, RefreshCw } from 'lucide-react';
import Header from './components/Header.jsx';
import WelcomeSection from './components/WelcomeSection.jsx';
import SuggestedQuestions from './components/SuggestedQuestions.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';
import { askQuestion, fetchFaqs } from './services/api.js';

const suggestionIds = ['FAQ001', 'FAQ002', 'FAQ011', 'FAQ016'];

function makeMessage(role, text, details = {}) {
  return {
    id: crypto.randomUUID(),
    role,
    text,
    time: new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(new Date()),
    ...details,
  };
}

export default function App() {
  const [knowledgeBase, setKnowledgeBase] = useState(null);
  const [knowledgeError, setKnowledgeError] = useState('');
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState('');
  const [retryQuestion, setRetryQuestion] = useState('');
  const busyRef = useRef(false);

  async function loadKnowledgeBase() {
    setKnowledgeError('');
    try {
      setKnowledgeBase(await fetchFaqs());
    } catch (error) {
      setKnowledgeError(error.message);
    }
  }

  useEffect(() => { loadKnowledgeBase(); }, []);

  async function sendQuestion(text, { addUserMessage = true } = {}) {
    const trimmed = text.trim();
    if (!trimmed || busyRef.current) return;
    busyRef.current = true;
    setLoading(true);
    setRequestError('');
    setRetryQuestion(trimmed);
    if (addUserMessage) {
      setMessages((current) => [...current, makeMessage('user', trimmed)]);
      setQuestion('');
    }

    try {
      const result = await askQuestion(trimmed);
      setMessages((current) => [...current, makeMessage('assistant', result.answer, {
        sourceFaqIds: result.sourceFaqIds,
        answeredFromKnowledgeBase: result.answeredFromKnowledgeBase,
        mode: result.mode,
      })]);
      setRetryQuestion('');
    } catch (error) {
      setRequestError(error.message);
    } finally {
      busyRef.current = false;
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!question.trim()) return;
    sendQuestion(question);
  }

  function clearConversation() {
    setMessages([]);
    setQuestion('');
    setRequestError('');
    setRetryQuestion('');
  }

  const suggestions = knowledgeBase?.faqs.filter((faq) => suggestionIds.includes(faq.id)) ?? [];
  const hasMessages = messages.length > 0;

  return (
    <div className="app-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <Header onClear={clearConversation} hasMessages={hasMessages} />
      <main id="main" className="workspace">
        <aside className="intro-column">
          <div className="online-status"><span className="status-dot" /> KNOWLEDGE BASE {knowledgeBase ? 'CONNECTED' : 'CONNECTING'}</div>
          <WelcomeSection />
          <div className="knowledge-card">
            <div className="knowledge-icon"><Database size={17} /></div>
            <div className="knowledge-data">
              <div className="knowledge-title">Department FAQ</div>
              <div className="knowledge-count">{knowledgeBase ? `${knowledgeBase.faqCount} answers · ${knowledgeBase.metadata.categories.length} topics` : 'Loading knowledge base'}</div>
            </div>
            <span className="sample-pill">SAMPLE</span>
          </div>
          {knowledgeError && (
            <div className="knowledge-error" role="alert">
              <AlertCircle size={16} /> <span>{knowledgeError}</span>
              <button type="button" onClick={loadKnowledgeBase} aria-label="Retry loading FAQs"><RefreshCw size={14} /></button>
            </div>
          )}
          <div className="side-caption">NO GUESSWORK, JUST THE FAQ <span>✳</span></div>
        </aside>

        <section className="chat-panel" aria-label="College FAQ chat">
          <div className="chat-panel-head">
            <div className="panel-title-wrap">
              <span className="assistant-avatar">C</span>
              <div><h2>Ask the department</h2><p>Grounded in the sample FAQ</p></div>
            </div>
            <span className="secure-label"><span className="status-dot" /> READY</span>
          </div>

          {!hasMessages ? (
            <div className="empty-state">
              <div className="empty-mark" aria-hidden="true"><span>?</span></div>
              <p className="empty-title">What can I help you find?</p>
              <p className="empty-copy">Pick a prompt or type a question below.</p>
              {knowledgeError ? (
                <div className="suggestion-loading">Reconnect to load suggested questions.</div>
              ) : (
                <SuggestedQuestions faqs={suggestions} onSelect={sendQuestion} disabled={loading} />
              )}
            </div>
          ) : (
            <ChatWindow messages={messages} loading={loading} />
          )}

          <div className="composer-area">
            {requestError && (
              <div className="request-error" role="alert">
                <AlertCircle size={16} /><span>{requestError}</span>
                <button type="button" onClick={() => sendQuestion(retryQuestion, { addUserMessage: false })} disabled={loading}>
                  Retry <ArrowRight size={14} />
                </button>
              </div>
            )}
            <ChatInput value={question} onChange={setQuestion} onSubmit={handleSubmit} disabled={loading} loading={loading} />
            <div className="composer-foot"><span>Enter to send</span><span><kbd>500</kbd> character limit</span></div>
          </div>
        </section>
      </main>
      <footer className="page-footer"><span>COLLEGE DEPARTMENT ASSISTANT</span><span>SAMPLE DATA · VERIFY WITH YOUR INSTITUTION</span></footer>
    </div>
  );
}
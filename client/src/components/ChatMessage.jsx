import { Check, CircleHelp } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <article className={`message-row ${isUser ? 'user-row' : 'assistant-row'}`}>
      {!isUser && <span className="assistant-avatar small-avatar" aria-hidden="true">C</span>}
      <div className={`message-content ${isUser ? 'user-content' : ''}`}>
        <div className="message-meta">{isUser ? 'YOU' : 'CAMPUS FAQ'} <span>{message.time}</span></div>
        <div className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
          <p>{message.text}</p>
        </div>
        {!isUser && message.sourceFaqIds?.length > 0 && (
          <div className="source-note"><Check size={12} /> Matched FAQ {message.sourceFaqIds.join(', ')} <span>·</span> sample answer</div>
        )}
        {!isUser && message.mode === 'fallback' && (
          <div className="source-note fallback-note"><CircleHelp size={12} /> Not found in the FAQ</div>
        )}
      </div>
    </article>
  );
}
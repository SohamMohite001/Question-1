import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage.jsx';
import LoadingIndicator from './LoadingIndicator.jsx';

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  return (
    <section className="chat-window" aria-label="Conversation" aria-live="polite">
      {messages.map((message) => <ChatMessage key={message.id} message={message} />)}
      {loading && <LoadingIndicator />}
      <div ref={bottomRef} />
    </section>
  );
}
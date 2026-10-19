import { ArrowUp, LoaderCircle } from 'lucide-react';

export default function ChatInput({ value, onChange, onSubmit, disabled, loading }) {
  return (
    <form className="chat-form" onSubmit={onSubmit}>
      <label className="sr-only" htmlFor="question-input">Ask a question</label>
      <input
        id="question-input"
        name="question"
        type="text"
        maxLength={500}
        autoComplete="off"
        placeholder="Ask your question here..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
      />
      <button className="send-button" type="submit" aria-label="Send question" disabled={disabled || !value.trim()}>
        {loading ? <LoaderCircle className="spin" size={18} /> : <ArrowUp size={18} />}
      </button>
    </form>
  );
}
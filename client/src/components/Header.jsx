import { BookOpenCheck, CircleHelp, RotateCcw } from 'lucide-react';

export default function Header({ onClear, hasMessages }) {
  return (
    <header className="topbar">
      <a className="brand" href="#main" aria-label="Campus FAQ home">
        <span className="brand-mark"><BookOpenCheck size={19} strokeWidth={2.1} /></span>
        <span className="brand-name">campus<span>/</span>faq</span>
      </a>
      <div className="topbar-right">
        <span className="department-tag"><CircleHelp size={15} /> Department assistant</span>
        <button className="clear-button" type="button" onClick={onClear} disabled={!hasMessages} title="Clear conversation">
          <RotateCcw size={15} /> <span>Clear chat</span>
        </button>
      </div>
    </header>
  );
}
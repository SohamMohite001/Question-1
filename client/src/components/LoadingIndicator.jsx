export default function LoadingIndicator() {
  return (
    <div className="loading-row" role="status" aria-live="polite">
      <span className="assistant-avatar small-avatar">C</span>
      <div className="loading-bubble"><span /><span /><span /><span className="sr-only">Finding an answer</span></div>
    </div>
  );
}
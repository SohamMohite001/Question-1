import { ArrowUpRight } from 'lucide-react';

export default function SuggestedQuestions({ faqs, onSelect, disabled }) {
  if (!faqs?.length) return null;

  return (
    <section className="suggestions" aria-labelledby="suggested-title">
      <div className="section-label" id="suggested-title">A GOOD PLACE TO START <span>↘</span></div>
      <div className="suggestion-grid">
        {faqs.map((faq, index) => (
          <button className="suggestion" type="button" key={faq.id} onClick={() => onSelect(faq.question)} disabled={disabled}>
            <span className="suggestion-index">0{index + 1}</span>
            <span>{faq.question}</span>
            <ArrowUpRight size={15} className="suggestion-arrow" />
          </button>
        ))}
      </div>
    </section>
  );
}
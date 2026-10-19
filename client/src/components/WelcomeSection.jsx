import { Sparkles } from 'lucide-react';

export default function WelcomeSection() {
  return (
    <section className="welcome" aria-labelledby="welcome-title">
      <div className="eyebrow"><span className="eyebrow-line" /> YOUR DEPARTMENT, A LITTLE CLOSER</div>
      <h1 id="welcome-title">Good questions.<br /><span>Clear answers.</span></h1>
      <p className="welcome-copy">Ask about admissions, courses, campus support and more. Answers come from the department FAQ below.</p>
      <div className="sample-note"><Sparkles size={15} /><span>This is sample information. Verify important details with the college.</span></div>
    </section>
  );
}
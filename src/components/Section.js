import Reveal from './Reveal';
// `eyebrow` is accepted and ignored: kickers above headings are retired (docs/plans/site-revamp.md § 3.1).
export function Section({ id, h2, lead, children, className = '', center = false, as = 'h2' }) {
  const H = as;
  return (
    <section id={id} className={`section ${className}`}>
      <div className="wrap">
        {h2 && (
          <Reveal className={`${center ? 'mx-auto text-center' : ''} max-w-3xl`}>
            <H className="t-h1">{h2}</H>
            {lead && <p className="lead mt-5">{lead}</p>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
export function Card({ children, className = '', ...rest }) {
  return <div className={`glass p-6 ${className}`} {...rest}>{children}</div>;
}

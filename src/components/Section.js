import Reveal from './Reveal';
export function Section({ id, eyebrow, h2, lead, children, className = '', center = false, as = 'h2' }) {
  const H = as;
  return (
    <section id={id} className={`section ${className}`}>
      <div className="wrap">
        {(eyebrow || h2) && (
          <Reveal className={`${center ? 'mx-auto text-center' : ''} max-w-3xl`}>
            {eyebrow && <div className="eyebrow">{eyebrow}</div>}
            {h2 && <H className="t-h1 mt-3">{h2}</H>}
            {lead && <p className="lead mt-4">{lead}</p>}
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

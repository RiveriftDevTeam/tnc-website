/** A paper sticker: the assistant's note, shown working rather than described. Tilt is one of a small set (0..3).
 *  `note` is set in the hand face; `children` carry the UI (buttons, meta) in the reading face. Server-safe. */
export default function Sticker({ note, meta, children, tilt = 0, tape = false, as: Tag = 'div', className = '', ...rest }) {
  return (
    <Tag className={`sticker ${tape ? 'sticker-tape' : ''} ${className}`} data-tilt={tilt} {...rest}>
      {meta && <div className="text-[.8125rem] text-subtle">{meta}</div>}
      {note && <p className={`hand ${meta ? 'mt-1' : ''}`}>{note}</p>}
      {children}
    </Tag>
  );
}

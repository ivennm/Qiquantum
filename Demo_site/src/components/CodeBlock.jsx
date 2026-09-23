// CodeBlock — preformatted text with a small header line (filename, size).
export default function CodeBlock({ title, meta, children, maxHeight }) {
  return (
    <div className="code-block">
      {title || meta ? (
        <div className="code-block-head">
          <span>{title}</span>
          <span>{meta}</span>
        </div>
      ) : null}
      <pre style={maxHeight ? { maxHeight, overflow: 'auto' } : undefined}>{children}</pre>
    </div>
  );
}

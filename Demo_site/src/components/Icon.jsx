// Icon — a small set of inline SVG glyphs, 16×16 viewBox, stroke-based.
//
// No icon package is used. Each glyph is a hand-written path so the whole set
// is visible in one file and can be extended by adding a key below. Icons use
// `currentColor`, so they inherit the surrounding text colour.

const GLYPHS = {
  // navigation
  grid:    'M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z',
  flask:   'M6 2h4M7 2v4L3 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1L9 6V2M4.5 10h7',
  wave:    'M1 8c1.5 0 1.5-5 3-5s1.5 10 3 10 1.5-10 3-10 1.5 5 3 5h2',
  upload:  'M8 11V3M4.5 6.5L8 3l3.5 3.5M2 11v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2',
  align:   'M2 4h12M2 8h8M2 12h12M12 6.5v3',
  gate:    'M3 14V5l5-3 5 3v9M3 9h10M8 9v5',
  assay:   'M4 2v5l-2 6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l-2-6V2M4 2h8M6 10h4',
  chart:   'M2 14h12M4 11V7M7 11V4M10 11V8M13 11V5',
  package: 'M2 5l6-3 6 3v6l-6 3-6-3zM2 5l6 3 6-3M8 8v6',
  shield:  'M8 2l5 2v4c0 3-2 5-5 6-3-1-5-3-5-6V4z',
  // actions
  copy:    'M6 6h7v7H6zM3 10V3h7',
  check:   'M3 8.5l3 3 7-7',
  x:       'M4 4l8 8M12 4l-8 8',
  plus:    'M8 3v10M3 8h10',
  search:  'M7 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM11 11l3 3',
  filter:  'M2 3h12l-5 6v4l-2 1V9z',
  download:'M8 3v8M4.5 7.5L8 11l3.5-3.5M2 13h12',
  refresh: 'M13 8a5 5 0 1 1-1.5-3.5M13 2v3h-3',
  play:    'M4 2.5v11l9-5.5z',
  pause:   'M4 3v10M12 3v10',
  stop:    'M3 3h10v10H3z',
  sun:     'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3',
  moon:    'M13 9.5A5.5 5.5 0 0 1 6.5 3a5.5 5.5 0 1 0 6.5 6.5z',
  chevron: 'M5 6l3 3 3-3',
  chevronRight: 'M6 4l4 4-4 4',
  info:    'M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM8 7v4M8 5v.5',
  alert:   'M8 2l6.5 11h-13zM8 6.5v3M8 11.5v.5',
  lock:    'M4 7V5a4 4 0 0 1 8 0v2M3 7h10v7H3z',
  key:     'M10 6a3 3 0 1 0-2.8 3L2 14l1 1 1.5-1.5 1 1 1.5-1.5-1-1 1.5-1.5A3 3 0 0 0 10 6z',
  clock:   'M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM8 5v3l2 2',
  link:    'M6.5 9.5l3-3M5 11l-1 1a2.5 2.5 0 0 1-3.5-3.5l2-2A2.5 2.5 0 0 1 6 6M11 5l1-1a2.5 2.5 0 0 1 3.5 3.5l-2 2A2.5 2.5 0 0 1 10 10',
  file:    'M4 2h5l4 4v8H4zM9 2v4h4',
  edit:    'M3 13l1-3 7-7 2 2-7 7zM10 4l2 2',
  external:'M9 2h5v5M14 2L8 8M12 9v5H2V4h5',
  more:    'M4 8h.5M8 8h.5M12 8h.5',
  eye:     'M1 8s2.5-4 7-4 7 4 7 4-2.5 4-7 4-7-4-7-4zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  db:      'M8 5c3.3 0 6-.9 6-2s-2.7-2-6-2-6 .9-6 2 2.7 2 6 2zM2 3v10c0 1.1 2.7 2 6 2s6-.9 6-2V3M2 8c0 1.1 2.7 2 6 2s6-.9 6-2',
  user:    'M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 14a6 6 0 0 1 12 0',
  arrow:   'M2 8h12M9 3l5 5-5 5',
};

export default function Icon({ name, size = 14, className = '', title }) {
  const d = GLYPHS[name];
  if (!d) return null;
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : 'true'}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d={d} />
    </svg>
  );
}

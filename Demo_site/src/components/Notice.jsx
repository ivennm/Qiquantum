// Notice — banner for custody statements, disclaimers and blocking conditions.
//   kind: 'info' | 'warn' | 'fail'
import Icon from './Icon.jsx';

export default function Notice({ kind = 'info', title, children }) {
  const icon = kind === 'fail' ? 'alert' : kind === 'warn' ? 'alert' : 'info';
  return (
    <div className={`notice is-${kind}`} role={kind === 'fail' ? 'alert' : 'note'}>
      <Icon name={icon} />
      <div>
        {title ? <div className="notice-title">{title}</div> : null}
        <div>{children}</div>
      </div>
    </div>
  );
}

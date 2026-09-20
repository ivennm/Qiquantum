// DropZone — visual upload target for one data stream. Not wired.
import Icon from './Icon.jsx';

export default function DropZone({ title, formats, hint, state }) {
  return (
    <div className="dropzone" title="File upload is not wired in the baseline">
      <div className="row-between" style={{ width: '100%' }}>
        <span className="dropzone-title">{title}</span>
        {state ? state : null}
      </div>
      {hint ? <span className="muted small">{hint}</span> : null}
      <span className="dropzone-formats">{formats}</span>
      <div className="dropzone-actions">
        <button type="button" className="btn is-sm">
          <Icon name="upload" size={12} />
          Choose file
        </button>
      </div>
    </div>
  );
}

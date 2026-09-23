// StatusStrip — the 24px bar at the bottom of the shell. Shows emulator
// state, last ingest and connection. Values are fixtures.
import { emulator } from '../data/ingestion.js';

export default function StatusStrip() {
  return (
    <footer className="status-strip" aria-label="System status">
      <span className="status-item">
        <span className={`status-dot${emulator.running ? '' : ' is-off'}`} />
        EMULATOR {emulator.running ? 'RUNNING' : 'STOPPED'} · {emulator.profile}
      </span>
      <span className="status-item">LAST INGEST {emulator.lastIngest}</span>
      <span className="status-item">
        <span className="status-dot is-warn" />
        1 AMBIGUITY PENDING
      </span>
      <span className="spacer" />
      <span className="status-item">API localhost:8000 (mock)</span>
      <span className="status-item">
        <span className="status-dot" />
        CONNECTED
      </span>
    </footer>
  );
}

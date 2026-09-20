// Sign in — rendered outside the application shell. Visual only.
import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

export default function Login() {
  return (
    <div className="login-layout">
      <aside className="login-aside">
        <div>
          <div className="sidebar-wordmark">QI<span>Quantum</span></div>
          <div className="sidebar-sub">Experiment Data &amp; Quality Platform</div>
        </div>
        <div className="login-aside-body">
          <h2>An inspectable evidence chain for bioenergetics exposure experiments.</h2>
          <p className="muted">
            From waveform candidate to delivered signal to biological outcome, every file is checksummed, bound,
            validated and gated before it reaches an evidence package.
          </p>
          <div className="login-chain">
            {['Waveform candidate', 'Delivered signal', 'Exposure environment', 'Sample & replicate', 'Biological outcome'].map((s, i) => (
              <div className="login-chain-step" key={s}>
                <span className="num">{i + 1}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="login-aside-foot">
          UConn · Research use only. This software does not make clinical or causal determinations.
        </div>
      </aside>

      <main className="login-main">
        <form className="login-form" style={{ maxWidth: 360 }} onSubmit={(e) => e.preventDefault()}>
          <div>
            <div className="label">Sign in</div>
            <h1 style={{ marginTop: 'var(--space-1)' }}>QIQuantum Platform</h1>
          </div>

          <button type="button" className="btn is-primary" style={{ height: 34, justifyContent: 'center' }} title="Not wired in the baseline">
            <Icon name="key" /> Continue with institutional SSO
          </button>

          <div className="login-divider">or local account</div>

          <div className="field">
            <label className="field-label" htmlFor="login-email">Email</label>
            <input id="login-email" className="input" placeholder="name@uconn.edu" readOnly title="Not wired in the baseline" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="login-pw">Password</label>
            <input id="login-pw" className="input" type="password" placeholder="••••••••••" readOnly title="Not wired in the baseline" />
          </div>
          <div className="row-between">
            <label className="checkbox"><input type="checkbox" readOnly /> Remember this device</label>
            <a href="#" onClick={(e) => e.preventDefault()} className="small">Forgot password</a>
          </div>
          <button type="submit" className="btn" style={{ height: 34, justifyContent: 'center' }} title="Not wired in the baseline">
            Sign in
          </button>

          <p className="small muted">
            Baseline build: authentication is not wired. <Link to="/">Continue to the platform</Link>.
          </p>
        </form>
      </main>
    </div>
  );
}

import ThemeToggle from './ThemeToggle.jsx';

const FEATURES = [
  { icon: '\u{1F465}', title: 'Real-Time Collaboration', description: 'See every keystroke as it happens. Multiple users edit the same file simultaneously with zero lag.' },
  { icon: '\u25B6\uFE0F', title: 'Instant Code Execution', description: 'Run JavaScript directly in the browser with a secure sandboxed environment. Results appear instantly.' },
  { icon: '\u{1F512}', title: 'Secure Sandbox', description: 'Code runs in an isolated environment with memory and timeout limits. Safe by design.' },
  { icon: '\u{1F6AA}', title: 'Room-Based Sessions', description: 'Create or join rooms with a simple ID. Share the link and start coding together in seconds.' },
  { icon: '\u{1F464}', title: 'Guest Access', description: 'No account needed to get started. Jump in as a guest and begin collaborating immediately.' },
  { icon: '\u{1F3A8}', title: 'Dark & Light Themes', description: 'Switch between dark and light modes. Monaco Editor powers the experience with full IntelliSense.' }
];

export default function LandingPage({ onGetStarted, theme, onThemeToggle }) {
  return (
    <div className="min-h-dvh bg-surface text-content overflow-y-auto">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-surface border-b border-line">
        <div className="max-w-[1100px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">&#9889;</span>
            <span className="text-lg font-bold text-accent">LiveCode</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            <button onClick={onGetStarted}
              className="py-2 px-5 bg-transparent border border-accent rounded-md text-accent text-sm font-semibold cursor-pointer transition-all hover:bg-accent hover:text-white">
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 px-6 text-center max-sm:py-12 max-sm:px-4">
        <div className="max-w-[800px] mx-auto">
          <div className="inline-block py-1.5 px-4 bg-accent/10 border border-accent/30 rounded-2xl text-[13px] font-medium text-accent mb-6">
            Real-Time Collaborative Editor
          </div>
          <h1 className="text-5xl font-extrabold leading-tight mb-5 text-content max-md:text-3xl max-sm:text-[28px]">
            Code Together,<br />
            <span className="text-accent">Ship Faster</span>
          </h1>
          <p className="text-lg leading-relaxed text-content-muted max-w-[560px] mx-auto mb-9 max-md:text-base">
            Write, edit, and execute JavaScript code with your team in real-time.
            No setup required — just create a room and start coding.
          </p>
          <div className="flex items-center justify-center gap-4 mb-15 flex-wrap max-sm:flex-col">
            <button onClick={onGetStarted}
              className="py-3.5 px-8 bg-accent border-none rounded-md text-white text-base font-semibold cursor-pointer transition-opacity hover:opacity-90 max-sm:w-full max-sm:text-center">
              Get Started — It's Free
            </button>
            <a href="https://github.com/niteshpawar97/livecode-platform" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3.5 px-6 bg-transparent border border-line rounded-md text-content text-[15px] font-medium no-underline cursor-pointer transition-all hover:border-content-muted hover:bg-surface-alt max-sm:w-full max-sm:justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>

          {/* Code window mock */}
          <div className="max-w-[600px] mx-auto">
            <div className="bg-surface-alt border border-line rounded-xl overflow-hidden text-left font-mono">
              <div className="flex items-center gap-1.5 py-2.5 px-3.5 bg-surface-bar border-b border-line">
                <span className="w-2.5 h-2.5 rounded-full bg-danger" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#dcdcaa]" />
                <span className="w-2.5 h-2.5 rounded-full bg-ok" />
                <span className="ml-2 text-xs text-content-muted">room-abc123.js</span>
              </div>
              <div className="p-4 text-sm leading-7 max-sm:text-xs max-sm:p-3">
                <div className="whitespace-pre">
                  <span className="inline-block w-6 text-content-muted text-right mr-4 text-xs select-none">1</span>
                  <span className="code-keyword">const</span>{' '}
                  <span className="code-var">message</span>{' = '}
                  <span className="code-string">'Hello, Team!'</span>;
                </div>
                <div className="whitespace-pre">
                  <span className="inline-block w-6 text-content-muted text-right mr-4 text-xs select-none">2</span>
                  <span className="code-keyword">console</span>
                  <span className="code-punct">.</span>
                  <span className="code-func">log</span>
                  <span className="code-punct">(</span>
                  <span className="code-var">message</span>
                  <span className="code-punct">);</span>
                </div>
                <div className="whitespace-pre">
                  <span className="inline-block w-6 text-content-muted text-right mr-4 text-xs select-none">3</span>
                  <span className="animate-[cursor-blink_1s_step-end_infinite] text-accent font-thin">|</span>
                  <span className="code-comment">// Start collaborating...</span>
                </div>
              </div>
              <div className="py-2.5 px-3.5 bg-surface border-t border-line text-[13px] text-ok">
                <span className="text-content-muted mr-1.5">{'>'}</span> Hello, Team!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-surface-alt max-md:py-12 max-md:px-4">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-center text-3xl font-bold mb-3 text-content max-sm:text-2xl">Everything You Need to Code Together</h2>
          <p className="text-center text-base text-content-muted mb-12">Powerful features designed for seamless real-time collaboration</p>
          <div className="grid grid-cols-3 gap-6 max-md:grid-cols-2 max-sm:grid-cols-1">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-surface border border-line rounded-xl py-7 px-6 transition-colors hover:border-accent">
                <div className="text-[28px] mb-4">{f.icon}</div>
                <h3 className="text-base font-semibold mb-2 text-content">{f.title}</h3>
                <p className="text-sm leading-relaxed text-content-muted">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 max-md:py-12 max-md:px-4">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-center text-3xl font-bold mb-3 text-content max-sm:text-2xl">Up and Running in 3 Steps</h2>
          <p className="text-center text-base text-content-muted mb-12">From zero to collaborating in under a minute</p>
          <div className="flex items-start justify-center max-w-[900px] mx-auto max-sm:flex-col max-sm:items-center max-sm:gap-6">
            {[
              { n: '1', title: 'Sign In or Go Guest', desc: 'Create an account or jump in instantly as a guest. No credit card, no setup.' },
              { n: '2', title: 'Create or Join a Room', desc: 'Generate a room ID or enter an existing one. Share the link with your team.' },
              { n: '3', title: 'Code Together, Live', desc: 'Write JavaScript, see changes in real-time, and run code with one click.' },
            ].map((step, i) => (
              <div key={i} className="contents">
                {i > 0 && (
                  <div className="w-15 min-w-10 border-t-2 border-dashed border-line mt-6 shrink-0 max-sm:w-0.5 max-sm:h-6 max-sm:border-t-0 max-sm:border-l-2 max-sm:mt-0" />
                )}
                <div className="flex-1 text-center px-5">
                  <div className="w-12 h-12 rounded-full bg-accent text-white inline-flex items-center justify-center text-xl font-bold mb-4">{step.n}</div>
                  <h3 className="text-base font-semibold mb-2 text-content">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-content-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-line bg-surface-alt">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between flex-wrap gap-4 max-sm:flex-col max-sm:text-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">&#9889;</span>
            <span className="text-lg font-bold text-accent">LiveCode Platform</span>
          </div>
          <div className="flex gap-6">
            <a href="https://livecode.niketgroup.com" target="_blank" rel="noopener noreferrer" className="text-content-muted no-underline text-sm transition-colors hover:text-accent">Live Demo</a>
            <a href="https://github.com/niteshpawar97/livecode-platform" target="_blank" rel="noopener noreferrer" className="text-content-muted no-underline text-sm transition-colors hover:text-accent">GitHub</a>
          </div>
          <p className="text-[13px] text-content-muted">
            Built by <a href="https://github.com/niteshpawar97" target="_blank" rel="noopener noreferrer" className="text-content-muted no-underline transition-colors hover:text-accent">Nitesh Pawar</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

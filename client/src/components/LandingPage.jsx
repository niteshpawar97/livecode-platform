import ThemeToggle from './ThemeToggle.jsx';

/* ─── Data ─── */
const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'Real-Time Collaboration',
    desc: 'Multiple users edit the same code simultaneously. Every keystroke syncs instantly across all connected clients.',
    color: '#4ec9b0',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    title: 'Instant Code Execution',
    desc: 'Run JavaScript & SQL directly in the browser. Secure VM2 sandbox with timeout limits. Results in milliseconds.',
    color: '#569cd6',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    title: 'SQL Playground',
    desc: '7 tables, 30 challenges from basic to advanced. Practice JOINs, subqueries, GROUP BY with instant verification.',
    color: '#dcdcaa',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
    title: 'Secure Sandbox',
    desc: 'Code runs in isolated VM2 workers. Memory limits, execution timeouts, blocked dangerous operations.',
    color: '#ce9178',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
      </svg>
    ),
    title: 'Guest Access',
    desc: 'No signup required. Jump in as a guest and start coding in seconds. Registered accounts get 7-day sessions.',
    color: '#c586c0',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Monaco Editor',
    desc: 'VS Code-powered editor with IntelliSense, syntax highlighting, dark/light themes, and keyboard shortcuts.',
    color: '#9cdcfe',
  },
];

const LANGUAGES = [
  { name: 'JavaScript', status: 'live', icon: 'JS', color: '#F7DF1E' },
  { name: 'SQL', status: 'live', icon: 'SQL', color: '#007acc' },
  { name: 'Python', status: 'coming', icon: 'PY', color: '#3776AB' },
  { name: 'PHP', status: 'coming', icon: 'PHP', color: '#777BB4' },
  { name: 'HTML/CSS', status: 'coming', icon: 'HTML', color: '#E34F26' },
  { name: 'TypeScript', status: 'planned', icon: 'TS', color: '#3178C6' },
  { name: 'Go', status: 'planned', icon: 'GO', color: '#00ADD8' },
  { name: 'Rust', status: 'planned', icon: 'RS', color: '#DEA584' },
];

const ROADMAP = [
  { phase: 'Now', items: ['JavaScript real-time collab', 'SQL Playground + 30 challenges', 'Monaco Editor + themes', 'Guest & registered auth', 'Room-based sessions'] },
  { phase: 'Next', items: ['Python execution engine', 'Voice chat in rooms', 'Code history & snapshots', 'File tabs (multi-file)', 'Custom challenge builder'] },
  { phase: 'Future', items: ['PHP, TypeScript, Go, Rust', 'AI code assistant', 'GitHub integration', 'Team workspaces', 'Embed widget for blogs'] },
];

const STATS = [
  { value: '7', label: 'Languages' },
  { value: '30', label: 'SQL Challenges' },
  { value: '< 50ms', label: 'Sync Latency' },
  { value: '100%', label: 'Open Source' },
];

export default function LandingPage({ onGetStarted, theme, onThemeToggle }) {
  return (
    <div className="min-h-dvh bg-surface text-content overflow-y-auto">

      {/* ═══ NAV (glassmorphism) ═══ */}
      <nav className="sticky top-0 z-50 glass">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-sm">&#9889;</div>
            <span className="text-lg font-bold text-content">Live<span className="text-accent">Code</span></span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://github.com/niteshpawar97/livecode-platform" target="_blank" rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-content-muted text-sm no-underline hover:text-content transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
              GitHub
            </a>
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            <button onClick={onGetStarted}
              className="py-2 px-5 bg-accent border-none rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(0,122,204,0.4)] hover:scale-105 active:scale-95">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative py-24 px-6 text-center overflow-hidden hero-grid max-sm:py-16 max-sm:px-4">
        {/* Floating gradient orbs */}
        <div className="absolute top-10 left-[10%] w-72 h-72 bg-accent/20 rounded-full blur-[100px] animate-[glow-pulse_4s_ease-in-out_infinite] pointer-events-none" />
        <div className="absolute bottom-10 right-[10%] w-60 h-60 bg-ok/15 rounded-full blur-[80px] animate-[glow-pulse_5s_ease-in-out_infinite_1s] pointer-events-none" />

        <div className="relative max-w-[900px] mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 py-1.5 px-4 glass rounded-full text-[13px] font-medium text-accent mb-8 animate-[fade-up_0.6s_ease-out]">
            <span className="w-2 h-2 bg-ok rounded-full animate-[pulse-dot_2s_ease-in-out_infinite]" />
            Open Source &middot; Free Forever
          </div>

          {/* Title */}
          <h1 className="text-6xl font-extrabold leading-[1.1] mb-6 text-content animate-[fade-up_0.6s_ease-out_0.1s_both] max-lg:text-5xl max-md:text-4xl max-sm:text-3xl">
            Code Together.<br />
            <span className="bg-gradient-to-r from-accent via-ok to-accent bg-clip-text text-transparent bg-[length:200%] animate-[gradient-shift_3s_ease_infinite]">
              Build Faster.
            </span>
          </h1>

          <p className="text-xl leading-relaxed text-content-muted max-w-[640px] mx-auto mb-10 animate-[fade-up_0.6s_ease-out_0.2s_both] max-md:text-lg max-sm:text-base">
            Real-time collaborative code editor with instant execution.
            JavaScript, SQL Playground, and more — right in your browser.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 mb-16 flex-wrap animate-[fade-up_0.6s_ease-out_0.3s_both] max-sm:flex-col">
            <button onClick={onGetStarted}
              className="group py-4 px-10 bg-accent border-none rounded-xl text-white text-lg font-bold cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(0,122,204,0.5)] hover:scale-105 active:scale-95 max-sm:w-full">
              Start Coding
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
            </button>
            <a href="https://github.com/niteshpawar97/livecode-platform" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-4 px-8 glass rounded-xl text-content text-base font-semibold no-underline cursor-pointer transition-all hover:scale-105 max-sm:w-full max-sm:justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
              Star on GitHub
            </a>
          </div>

          {/* ─── 3D Code Window ─── */}
          <div className="max-w-[700px] mx-auto animate-[fade-up_0.8s_ease-out_0.4s_both]"
            style={{ perspective: '1200px' }}>
            <div className="glow-accent rounded-2xl transition-transform duration-500 hover:rotate-x-0"
              style={{ transform: 'rotateX(4deg) rotateY(-2deg)', transformStyle: 'preserve-3d' }}>
              <div className="bg-surface-alt border border-line rounded-2xl overflow-hidden text-left font-mono shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                {/* Title bar */}
                <div className="flex items-center gap-2 py-3 px-4 bg-surface-bar border-b border-line">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="flex-1 text-center text-xs text-content-muted">room-abc123 &middot; 3 users online</span>
                </div>
                {/* Editor body */}
                <div className="p-5 text-sm leading-8 max-sm:text-xs max-sm:p-3 max-sm:leading-7">
                  <div className="whitespace-pre">
                    <span className="inline-block w-7 text-content-muted text-right mr-4 text-xs select-none opacity-50">1</span>
                    <span className="code-keyword">const</span>{' '}
                    <span className="code-var">team</span>{' = ['}
                    <span className="code-string">'Alice'</span>{', '}
                    <span className="code-string">'Bob'</span>{', '}
                    <span className="code-string">'Charlie'</span>{'];'}
                  </div>
                  <div className="whitespace-pre">
                    <span className="inline-block w-7 text-content-muted text-right mr-4 text-xs select-none opacity-50">2</span>
                  </div>
                  <div className="whitespace-pre">
                    <span className="inline-block w-7 text-content-muted text-right mr-4 text-xs select-none opacity-50">3</span>
                    <span className="code-var">team</span>
                    <span className="code-punct">.</span>
                    <span className="code-func">forEach</span>
                    <span className="code-punct">{'((name) => {'}</span>
                  </div>
                  <div className="whitespace-pre">
                    <span className="inline-block w-7 text-content-muted text-right mr-4 text-xs select-none opacity-50">4</span>
                    {'  '}
                    <span className="code-keyword">console</span>
                    <span className="code-punct">.</span>
                    <span className="code-func">log</span>
                    <span className="code-punct">(</span>
                    <span className="code-string">`${'{'}</span>
                    <span className="code-var">name</span>
                    <span className="code-string">{'}'} is coding!`</span>
                    <span className="code-punct">);</span>
                    <span className="animate-[cursor-blink_1s_step-end_infinite] text-accent font-thin ml-px">|</span>
                  </div>
                  <div className="whitespace-pre">
                    <span className="inline-block w-7 text-content-muted text-right mr-4 text-xs select-none opacity-50">5</span>
                    <span className="code-punct">{'})'}</span><span className="code-punct">;</span>
                  </div>
                </div>
                {/* Output */}
                <div className="py-3 px-5 bg-surface border-t border-line text-[13px] max-sm:text-xs max-sm:px-3">
                  <div className="text-ok"><span className="text-content-muted opacity-50 mr-2">&gt;</span>Alice is coding!</div>
                  <div className="text-ok"><span className="text-content-muted opacity-50 mr-2">&gt;</span>Bob is coding!</div>
                  <div className="text-ok"><span className="text-content-muted opacity-50 mr-2">&gt;</span>Charlie is coding!</div>
                </div>
                {/* User bar */}
                <div className="flex items-center gap-2 py-2 px-4 bg-surface-bar border-t border-line text-[11px]">
                  <span className="flex items-center gap-1 text-ok"><span className="w-1.5 h-1.5 bg-ok rounded-full" />Alice</span>
                  <span className="flex items-center gap-1 text-[#ce9178]"><span className="w-1.5 h-1.5 bg-[#ce9178] rounded-full" />Bob</span>
                  <span className="flex items-center gap-1 text-[#c586c0]"><span className="w-1.5 h-1.5 bg-[#c586c0] rounded-full" />Charlie</span>
                  <span className="ml-auto text-content-muted">editing: <span className="text-accent">Bob</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <section className="py-6 border-y border-line bg-surface-alt">
        <div className="max-w-[900px] mx-auto px-6 grid grid-cols-4 gap-4 max-sm:grid-cols-2">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-extrabold text-accent">{s.value}</div>
              <div className="text-xs text-content-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="py-24 px-6 max-md:py-16 max-md:px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block py-1 px-3 glass rounded-full text-[11px] font-semibold text-accent uppercase tracking-wider mb-4">Features</div>
            <h2 className="text-4xl font-extrabold text-content mb-4 max-sm:text-2xl">Everything You Need</h2>
            <p className="text-base text-content-muted max-w-[500px] mx-auto">Built for developers who want to code together without the setup overhead.</p>
          </div>
          <div className="grid grid-cols-3 gap-5 max-md:grid-cols-2 max-sm:grid-cols-1">
            {FEATURES.map((f, i) => (
              <div key={i}
                className="group glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}20`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="text-[15px] font-bold text-content mb-2">{f.title}</h3>
                <p className="text-[13px] leading-relaxed text-content-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LANGUAGES ═══ */}
      <section className="py-24 px-6 bg-surface-alt max-md:py-16 max-md:px-4">
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block py-1 px-3 glass rounded-full text-[11px] font-semibold text-accent uppercase tracking-wider mb-4">Multi-Language</div>
            <h2 className="text-4xl font-extrabold text-content mb-4 max-sm:text-2xl">Languages & More Coming</h2>
            <p className="text-base text-content-muted">We're building a universal code playground. Here's our progress.</p>
          </div>
          <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2 max-sm:grid-cols-2">
            {LANGUAGES.map((l, i) => (
              <div key={i} className={`glass rounded-xl p-5 text-center transition-all hover:scale-105 ${l.status === 'live' ? 'ring-1 ring-ok/30' : ''}`}>
                <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-sm font-extrabold"
                  style={{ background: `${l.color}18`, color: l.color }}>
                  {l.icon}
                </div>
                <div className="text-sm font-semibold text-content mb-1">{l.name}</div>
                <div className={`inline-block text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-full
                  ${l.status === 'live' ? 'bg-ok/15 text-ok' : l.status === 'coming' ? 'bg-accent/15 text-accent' : 'bg-line text-content-muted'}`}>
                  {l.status === 'live' ? 'Live' : l.status === 'coming' ? 'Coming Soon' : 'Planned'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ROADMAP ═══ */}
      <section className="py-24 px-6 max-md:py-16 max-md:px-4">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block py-1 px-3 glass rounded-full text-[11px] font-semibold text-accent uppercase tracking-wider mb-4">Roadmap</div>
            <h2 className="text-4xl font-extrabold text-content mb-4 max-sm:text-2xl">What's Coming Next</h2>
            <p className="text-base text-content-muted">Building in public. Here's what we're working on.</p>
          </div>
          <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-1">
            {ROADMAP.map((phase, i) => (
              <div key={i} className="glass rounded-2xl p-6 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${i === 0 ? 'bg-ok' : i === 1 ? 'bg-accent' : 'bg-content-muted'}`} />
                <div className={`text-xs font-bold uppercase tracking-wider mb-4 ${i === 0 ? 'text-ok' : i === 1 ? 'text-accent' : 'text-content-muted'}`}>
                  {i === 0 && '● '}{phase.phase}
                </div>
                <ul className="flex flex-col gap-2.5">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-[13px] text-content leading-snug">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${i === 0 ? 'bg-ok' : i === 1 ? 'bg-accent' : 'bg-content-muted'}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-24 px-6 bg-surface-alt max-md:py-16 max-md:px-4">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block py-1 px-3 glass rounded-full text-[11px] font-semibold text-accent uppercase tracking-wider mb-4">3 Steps</div>
            <h2 className="text-4xl font-extrabold text-content mb-4 max-sm:text-2xl">Up and Running in Seconds</h2>
          </div>
          <div className="flex flex-col gap-6">
            {[
              { n: '01', title: 'Sign In or Go Guest', desc: 'No credit card, no setup. Create an account or jump in instantly. Your choice.', icon: '👤' },
              { n: '02', title: 'Create a Room', desc: 'Get a unique room ID, share the link. Anyone with the link can join and code together.', icon: '🔗' },
              { n: '03', title: 'Code & Execute', desc: 'Write JS or SQL, run it instantly, see results in real-time. All changes sync live across all users.', icon: '⚡' },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-5 glass rounded-2xl p-6 transition-all hover:scale-[1.02] max-sm:flex-col max-sm:text-center max-sm:items-center">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-2xl shrink-0">
                  {step.icon}
                </div>
                <div>
                  <div className="text-[11px] font-bold text-accent tracking-wider mb-1">STEP {step.n}</div>
                  <h3 className="text-lg font-bold text-content mb-1">{step.title}</h3>
                  <p className="text-sm text-content-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-24 px-6 text-center overflow-hidden hero-grid max-sm:py-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative max-w-[600px] mx-auto">
          <h2 className="text-4xl font-extrabold text-content mb-4 max-sm:text-2xl">Ready to Code Together?</h2>
          <p className="text-base text-content-muted mb-8">Free, open source, no setup. Start collaborating in seconds.</p>
          <button onClick={onGetStarted}
            className="group py-4 px-12 bg-accent border-none rounded-xl text-white text-lg font-bold cursor-pointer transition-all hover:shadow-[0_0_40px_rgba(0,122,204,0.5)] hover:scale-105 active:scale-95">
            Get Started — It's Free
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
          </button>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 px-6 border-t border-line bg-surface-alt">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between flex-wrap gap-4 max-sm:flex-col max-sm:text-center">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center text-white text-xs font-bold">&#9889;</div>
            <span className="text-sm font-bold text-content">Live<span className="text-accent">Code</span> Platform</span>
          </div>
          <div className="flex gap-6">
            <a href="https://livecode.niketgroup.com" target="_blank" rel="noopener noreferrer" className="text-content-muted no-underline text-sm hover:text-accent transition-colors">Live Demo</a>
            <a href="https://github.com/niteshpawar97/livecode-platform" target="_blank" rel="noopener noreferrer" className="text-content-muted no-underline text-sm hover:text-accent transition-colors">GitHub</a>
          </div>
          <p className="text-[13px] text-content-muted">
            Built with &#10084;&#65039; by <a href="https://github.com/niteshpawar97" target="_blank" rel="noopener noreferrer" className="text-accent no-underline hover:underline">Nitesh Kadve</a>
          </p>
        </div>
      </footer>
    </div>
  );
}

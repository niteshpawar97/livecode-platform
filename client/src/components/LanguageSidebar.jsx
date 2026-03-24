/* SVG icons for each language */
const icons = {
  javascript: (
    <svg width="22" height="22" viewBox="0 0 256 256" fill="none">
      <rect width="256" height="256" rx="28" fill="#F7DF1E"/>
      <path d="M67.3 213.9l19.1-11.6c3.7 6.5 7 12 15.1 12 7.7 0 12.6-3 12.6-14.8v-80h23.5v80.3c0 24.4-14.3 35.5-35.2 35.5-18.9 0-29.8-9.8-35.1-21.4zm83.2-2.5l19.1-11.1c5.1 8.3 11.6 14.4 23.3 14.4 9.8 0 16-4.9 16-11.6 0-8.1-6.4-10.9-17.2-15.6l-5.9-2.5c-17-7.3-28.4-16.4-28.4-35.6 0-17.7 13.5-31.2 34.6-31.2 15 0 25.8 5.2 33.6 18.9l-18.4 11.8c-4.1-7.3-8.4-10.1-15.2-10.1-6.9 0-11.3 4.4-11.3 10.1 0 7.1 4.4 9.9 14.5 14.3l5.9 2.5c20.1 8.6 31.4 17.4 31.4 37.1 0 21.3-16.7 32.9-39.1 32.9-21.9 0-36.1-10.4-43-24z" fill="#000"/>
    </svg>
  ),
  sql: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  python: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.868s-.109-3.402 3.346-3.402h5.765s3.24.052 3.24-3.134V3.057S18.29 0 11.914 0zM8.708 1.765a1.052 1.052 0 110 2.105 1.052 1.052 0 010-2.105z"/>
      <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826H20.1S24 18.211 24 12.031c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.868s.109 3.402-3.346 3.402H9.456s-3.24-.052-3.24 3.134v5.468S5.71 24 12.086 24zm3.206-1.765a1.052 1.052 0 110-2.105 1.052 1.052 0 010 2.105z"/>
    </svg>
  ),
  php: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 01-.455 1.073c-.187.27-.418.5-.69.677zm4.272-1.846l-.626 3.22h-1.378l.626-3.22c.056-.291.025-.502-.093-.633-.118-.131-.335-.196-.652-.196h-1.04l-.769 3.949H7.703l1.23-6.226h1.378l-.326 1.677h1.154c.728 0 1.222.159 1.481.477.259.318.302.79.128 1.415a3.36 3.36 0 01-.162.537zm5.092-1.084h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zm1.934 1.55a2.836 2.836 0 01-.455 1.073c-.187.27-.418.5-.69.677-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164h-1.181l-.327 1.681h-1.378l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752z"/>
    </svg>
  ),
  html: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.076-.757.076-.771.076-.758H5.793l.228 2.716.022.256h7.835l-.312 3.236-1.585.424-1.573-.42-.1-1.128H8.29l.2 2.22 3.487.93.012-.004.012.004 3.474-.928.477-5.305z"/>
    </svg>
  ),
};

export default function LanguageSidebar({ language, onLanguageChange, sqlMode, onSqlModeChange }) {
  const LANGUAGES = [
    { id: 'javascript', label: 'JavaScript', short: 'JS', ready: true },
    { id: 'sql', label: 'SQL', short: 'SQL', ready: true },
    { id: 'python', label: 'Python', short: 'PY', ready: false },
    { id: 'php', label: 'PHP', short: 'PHP', ready: false },
    { id: 'html', label: 'HTML/CSS', short: 'HTML', ready: false },
  ];

  return (
    <div className="flex flex-col w-14 bg-surface-alt border-r border-line shrink-0 items-center py-2 gap-1 max-md:flex-row max-md:w-full max-md:h-auto max-md:border-r-0 max-md:border-b max-md:py-0 max-md:px-2 max-md:gap-0 max-md:overflow-x-auto">
      {LANGUAGES.map(l => (
        <button
          key={l.id}
          onClick={() => l.ready && onLanguageChange(l.id)}
          disabled={!l.ready}
          title={l.ready ? l.label : `${l.label} (Coming Soon)`}
          className={`relative flex flex-col items-center justify-center w-11 h-11 rounded-lg cursor-pointer border-none transition-all
            max-md:flex-row max-md:gap-1.5 max-md:w-auto max-md:h-9 max-md:px-3 max-md:rounded-none max-md:shrink-0
            ${l.id === language
              ? 'bg-accent text-white'
              : 'bg-transparent text-content-muted hover:bg-surface-bar hover:text-content'}
            ${!l.ready ? 'opacity-25 cursor-not-allowed' : ''}`}
        >
          {icons[l.id]}
          {/* Label on mobile */}
          <span className="hidden max-md:inline text-[10px] font-semibold">{l.short}</span>
        </button>
      ))}

      {/* Divider */}
      <div className="w-8 border-t border-line my-1.5 max-md:w-px max-md:h-6 max-md:border-t-0 max-md:border-l max-md:my-0 max-md:mx-1" />

      {/* SQL sub-modes */}
      {language === 'sql' && (
        <>
          <button
            onClick={() => onSqlModeChange('playground')}
            title="SQL Playground — Free queries"
            className={`flex flex-col items-center justify-center w-11 h-10 rounded-md cursor-pointer border-none transition-all text-[9px] font-semibold leading-tight
              max-md:flex-row max-md:gap-1 max-md:w-auto max-md:h-8 max-md:px-2.5 max-md:text-[11px] max-md:rounded-none max-md:shrink-0
              ${sqlMode === 'playground' ? 'bg-accent/15 text-accent' : 'bg-transparent text-content-muted hover:bg-surface-bar'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 17l6-6-6-6" />
              <path d="M12 19h8" />
            </svg>
            <span>Play</span>
          </button>
          <button
            onClick={() => onSqlModeChange('challenges')}
            title="SQL Challenges — Practice questions"
            className={`flex flex-col items-center justify-center w-11 h-10 rounded-md cursor-pointer border-none transition-all text-[9px] font-semibold leading-tight
              max-md:flex-row max-md:gap-1 max-md:w-auto max-md:h-8 max-md:px-2.5 max-md:text-[11px] max-md:rounded-none max-md:shrink-0
              ${sqlMode === 'challenges' ? 'bg-accent/15 text-accent' : 'bg-transparent text-content-muted hover:bg-surface-bar'}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span>Quiz</span>
          </button>
        </>
      )}
    </div>
  );
}

import { useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, onCodeChange, theme, language = 'javascript', onRun, runLabel }) {
  const isRemoteUpdate = useRef(false);
  const editorRef = useRef(null);
  const debounceTimer = useRef(null);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [2048 | 3],
      run: () => {
        document.getElementById('run-btn')?.click();
      }
    });
  };

  const handleEditorChange = useCallback((value) => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      onCodeChange(value);
    }, 300);
  }, [onCodeChange]);

  const prevCodeRef = useRef(code);
  if (prevCodeRef.current !== code) {
    prevCodeRef.current = code;
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== code) {
        isRemoteUpdate.current = true;
        editorRef.current.setValue(code);
      }
    }
  }

  return (
    <div className="relative flex-3 min-h-0 min-w-0 border-r border-line max-md:flex-1 max-md:border-r-0 max-md:min-h-50">
      <Editor
        height="100%"
        language={language}
        theme={theme === 'light' ? 'light' : 'vs-dark'}
        defaultValue={code}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        options={{
          minimap: { enabled: false },
          fontSize: 16,
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          padding: { top: 12 }
        }}
      />

      {/* Floating Run Button */}
      {onRun && (
        <button
          id="run-btn"
          onClick={onRun}
          title="Ctrl+Enter"
          className="absolute bottom-4 right-4 flex items-center gap-2 py-2.5 px-5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.3)] cursor-pointer border-none text-sm font-semibold transition-all hover:scale-105 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] active:scale-95 z-10 bg-ok text-[#1e1e1e]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          {runLabel || 'Run'}
          <span className="text-[10px] opacity-60 font-normal max-sm:hidden">Ctrl+Enter</span>
        </button>
      )}
    </div>
  );
}

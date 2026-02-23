import { useRef, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

export default function CodeEditor({ code, onCodeChange, theme }) {
  const isRemoteUpdate = useRef(false);
  const editorRef = useRef(null);
  const debounceTimer = useRef(null);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;

    // Add Ctrl+Enter shortcut for running code
    editor.addAction({
      id: 'run-code',
      label: 'Run Code',
      keybindings: [2048 | 3], // Ctrl+Enter
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

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onCodeChange(value);
    }, 300);
  }, [onCodeChange]);

  // Update editor with remote code without triggering change event
  const updateFromRemote = useCallback((newCode) => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== newCode) {
        isRemoteUpdate.current = true;
        editorRef.current.setValue(newCode);
      }
    }
  }, []);

  // Expose updateFromRemote via ref pattern
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
    <div className="code-editor">
      <Editor
        height="100%"
        defaultLanguage="javascript"
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
    </div>
  );
}

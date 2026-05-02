/**
 * Code Editor - Monaco Editor 封装
 *
 * @module ui/components/code-editor
 */

import Editor from '@monaco-editor/react';

/**
 * @typedef {Object} CodeEditorProps
 * @property {string} value - 编辑器内容
 * @property {Function} onChange - 内容变化回调
 * @property {string} [language='javascript'] - 语言
 * @property {boolean} [readOnly=false] - 是否只读
 */

/**
 * Code Editor Component
 *
 * @param {CodeEditorProps} props - 属性
 * @return {JSX.Element}
 */
function CodeEditor({ value, onChange, language = 'javascript', readOnly = false }) {
    /**
     * 编辑器选项
     *
     * @type {Object}
     */
    const options = {
        minimap: { enabled: false },
        fontSize: 14,
        fontFamily: "'Fira Code', Consolas, 'Courier New', monospace",
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
        wordWrap: 'on',
        readOnly: readOnly,
        padding: { top: 16, bottom: 16 }
    };

    /**
     * 编辑器主题
     *
     * @param {Object} theme - 主题
     */
    const handleEditorWillMount = (monaco) => {
        monaco.editor.defineTheme('code-novel-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6A9955' },
                { token: 'keyword', foreground: 'C586C0' },
                { token: 'string', foreground: 'CE9178' },
                { token: 'number', foreground: 'B5CEA8' },
                { token: 'type', foreground: '4EC9B0' }
            ],
            colors: {
                'editor.background': '#1a1a2e',
                'editor.foreground': '#e4e4e7',
                'editor.lineHighlightBackground': '#2d2d44',
                'editor.selectionBackground': '#3d3d5c',
                'editorCursor.foreground': '#f472b6',
                'editorLineNumber.foreground': '#6b7280'
            }
        });
    };

    return (
        <Editor
            height="100%"
            language={language}
            value={value}
            onChange={onChange}
            theme="code-novel-dark"
            beforeMount={handleEditorWillMount}
            options={options}
            loading={
                <div className="flex items-center justify-center h-full text-gray-400">
                    加载编辑器...
                </div>
            }
        />
    );
}

export { CodeEditor };
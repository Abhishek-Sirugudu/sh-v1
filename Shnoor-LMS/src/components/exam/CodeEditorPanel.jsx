import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Settings, Maximize2, Play, Save, Send, Terminal, List } from 'lucide-react';

const CodeEditorPanel = ({ 
    question, // { id, title, description, testCases }
    startCode, 
    language, 
    onLanguageChange, 
    onCodeChange, 
    onRun, 
    onSubmit, 
    isRunning, 
    consoleOutput = []
}) => {
    const [activeTab, setActiveTab] = useState('testcases'); // testcases | console

    return (
        <div className="flex flex-col h-full bg-[#1e1e1e] text-white border-l border-[#333]">
            {/* Editor Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-medium">LANGUAGE:</span>
                        <select
                            value={language}
                            onChange={(e) => onLanguageChange && onLanguageChange(e.target.value)}
                            className="bg-transparent text-sm font-bold text-blue-400 focus:outline-none cursor-pointer hover:text-blue-300"
                        >
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                            <option value="cpp">C++</option>
                        </select>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-[#333] rounded text-gray-400 hover:text-white transition-colors" title="Settings">
                        <Settings size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-[#333] rounded text-gray-400 hover:text-white transition-colors" title="Fullscreen">
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-0">
                <Editor
                    height="100%"
                    defaultLanguage="javascript"
                    language={language || 'javascript'}
                    value={startCode}
                    onChange={onCodeChange}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 16, bottom: 16 },
                        fontFamily: "'Fira Code', 'Consolas', monospace",
                        renderLineHighlight: 'all', // nice visual touch
                    }}
                />
            </div>

            {/* Bottom Panel (Console/Tests) */}
            <div className="h-48 flex flex-col border-t border-[#333] bg-[#1e1e1e]">
                {/* Tabs */}
                <div className="flex border-b border-[#333]">
                    <button 
                        onClick={() => setActiveTab('testcases')}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase border-t-2 transition-colors ${activeTab === 'testcases' ? 'border-blue-500 text-white bg-[#252526]' : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-[#252526]'}`}
                    >
                        <List size={14} /> Test Cases
                    </button>
                    <button 
                        onClick={() => setActiveTab('console')}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase border-t-2 transition-colors ${activeTab === 'console' ? 'border-blue-500 text-white bg-[#252526]' : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-[#252526]'}`}
                    >
                        <Terminal size={14} /> Console
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
                    {activeTab === 'testcases' && (
                        <div className="space-y-4">
                            {(question?.testCases || []).filter(tc => tc.isPublic).map((tc, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="text-xs text-gray-500 font-bold">CASE {idx + 1}</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#2d2d2d] p-2 rounded border border-[#333]">
                                            <div className="text-xs text-gray-500 mb-1">Input</div>
                                            <div className="text-gray-300">{tc.input}</div>
                                        </div>
                                        <div className="bg-[#2d2d2d] p-2 rounded border border-[#333]">
                                            <div className="text-xs text-gray-500 mb-1">Expected Output</div>
                                            <div className="text-green-400">{tc.output}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(question?.testCases || []).length === 0 && (
                                <div className="text-gray-500 italic">No public test cases available.</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'console' && (
                        <div className="space-y-1">
                            {consoleOutput.length === 0 && <div className="text-gray-500 italic">Run your code to see output...</div>}
                            {consoleOutput.map((log, i) => (
                                <div key={i} className={`flex gap-2 ${log.type === 'error' ? 'text-red-400' : 'text-gray-300'}`}>
                                    <span className="opacity-50 select-none">&gt;</span>
                                    <span>{log.msg}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Footer */}
            <div className="p-3 bg-[#252526] border-t border-[#333] flex justify-between items-center">
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-[#333] rounded hover:bg-[#444]">
                    <Save size={14} /> Save
                </button>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onRun} 
                        disabled={isRunning}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isRunning ? 'Running...' : <><Play size={14} /> Run Code</>}
                    </button>
                    <button 
                        onClick={onSubmit}
                        className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-green-600 hover:bg-green-500 rounded transition-colors"
                    >
                        <Send size={14} /> Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodeEditorPanel;
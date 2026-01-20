import React from 'react';

const ProblemDescription = ({ question }) => {
    return (
        <div className="p-6 text-sm leading-relaxed text-gray-300 font-sans">
            <h2 className="text-xl font-bold text-white mb-4">{question.title}</h2>
            
            <div className="flex gap-2 mb-6">
                <span className="px-2 py-0.5 rounded bg-green-900/30 text-green-400 text-xs border border-green-800">
                    {question.difficulty || 'Easy'}
                </span>
                <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 text-xs border border-gray-700">
                    {question.marks || 10} Points
                </span>
            </div>

            <div className="prose prose-invert max-w-none mb-8">
                <p>{question.text}</p>
            </div>

            {question.testCases?.filter(tc => tc.isPublic).map((tc, idx) => (
                <div key={idx} className="mb-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Example {idx + 1}</h3>
                    <div className="bg-[#2d2d2d] rounded-lg border border-[#333] overflow-hidden">
                        <div className="p-3 border-b border-[#333] flex gap-4">
                            <span className="text-gray-500 w-12 font-mono text-xs">Input:</span>
                            <code className="text-white font-mono">{tc.input}</code>
                        </div>
                        <div className="p-3 flex gap-4">
                            <span className="text-gray-500 w-12 font-mono text-xs">Output:</span>
                            <code className="text-white font-mono">{tc.output}</code>
                        </div>
                    </div>
                </div>
            ))}

            {question.constraints && (
                <div className="mt-8 pt-6 border-t border-[#333]">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Constraints</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400">
                        <li>{question.constraints}</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProblemDescription;
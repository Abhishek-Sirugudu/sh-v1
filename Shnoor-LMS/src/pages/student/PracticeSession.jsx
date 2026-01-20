import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ProblemDescription from '../../components/exam/ProblemDescription';
import CodeEditorPanel from '../../components/exam/CodeEditorPanel';
import { getStudentData } from '../../utils/studentData';

const PracticeSession = () => {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [code, setCode] = useState('');

    useEffect(() => {
        // Simulate fetching data
        setTimeout(() => {
            const data = getStudentData();
            const found = data.practiceChallenges?.find(c => c.id === challengeId);
            if (found) {
                setQuestion(found);
                setCode(found.starterCode || '// Write code here');
            }
        }, 500);
    }, [challengeId]);

    if (!question) return (
        <div className="h-screen bg-[#1e1e1e] flex items-center justify-center text-white">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-400">Loading Challenge...</span>
            </div>
        </div>
    );

    return (
        <div className="h-screen flex flex-col bg-[#1e1e1e] text-gray-300 overflow-hidden">
            {/* Header */}
            <header className="h-12 bg-[#252526] border-b border-[#333] flex items-center px-4 shrink-0 justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/student/practice')}
                        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={14} /> PROBLEM LIST
                    </button>
                    <div className="h-4 w-px bg-[#444]"></div>
                    <h1 className="text-sm font-bold text-white">{question.title}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${question.difficulty === 'Easy' ? 'text-green-400 border-green-900 bg-green-900/20' : question.difficulty === 'Medium' ? 'text-yellow-400 border-yellow-900 bg-yellow-900/20' : 'text-red-400 border-red-900 bg-red-900/20'}`}>
                        {question.difficulty}
                    </span>
                </div>
            </header>

            {/* Split Layout (CSS Grid) */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#333]">
                
                {/* Left Panel: Problem Description */}
                <div className="h-full overflow-y-auto bg-[#1e1e1e] custom-scrollbar">
                    <ProblemDescription question={question} />
                </div>
                
                {/* Right Panel: Code Editor */}
                <div className="h-full overflow-hidden flex flex-col relative">
                    <CodeEditorPanel 
                        question={question}
                        startCode={code}
                        onCodeChange={setCode}
                        onRun={() => console.log('Run triggered')}
                        onSubmit={() => console.log('Submit triggered')}
                    />
                </div>
            </div>
        </div>
    );
};

export default PracticeSession;
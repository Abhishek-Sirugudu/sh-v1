import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, Trophy, XCircle } from 'lucide-react';
import { getStudentData, saveStudentData } from '../../utils/studentData';
import { awardXP } from '../../utils/gamification';
import { auth } from '../../auth/firebase';
// Ensure you have this component or remove the import if integrated
import PracticeSession from './PracticeSession'; 

// Mock Data
const MOCK_EXAM_DATA = {
    id: 'exam_demo',
    title: 'React.js Certification Exam',
    duration: 45, // minutes
    passScore: 60,
    questions: [
        { id: 1, type: 'mcq', text: 'Which hook handles side effects?', options: ['useState', 'useEffect', 'useReducer'], correctAnswer: 'useEffect', marks: 10 },
        { id: 2, type: 'mcq', text: 'What is the Virtual DOM?', options: ['Real DOM copy', 'Lightweight JS object', 'Browser API'], correctAnswer: 'Lightweight JS object', marks: 10 },
        { id: 3, type: 'descriptive', text: 'Explain the concept of "Lifting State Up".', marks: 20 },
    ]
};

const ExamRunner = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating fetch
        setTimeout(() => {
            const data = getStudentData();
            let foundExam = (data.exams || []).find(e => e.id === examId) || MOCK_EXAM_DATA;
            setExam(foundExam);
            if (foundExam.duration > 0) setTimeLeft(foundExam.duration * 60);
            setLoading(false);
        }, 500);
    }, [examId]);

    // Timer Logic
    useEffect(() => {
        if (!exam || isSubmitted || timeLeft <= 0 || exam.duration === 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, isSubmitted, exam]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleAnswer = (val) => {
        setAnswers(prev => ({ ...prev, [currentQIndex]: val }));
    };

    const handleSubmit = async () => {
        if (window.confirm("Are you sure you want to submit?")) {
            // Simplified grading logic
            let gained = 0;
            let total = 0;
            exam.questions.forEach((q, i) => {
                total += q.marks || 0;
                if (q.type === 'mcq' && answers[i] === q.correctAnswer) gained += q.marks;
                // Auto-grade descriptive simply by length for mock purposes
                if (q.type === 'descriptive' && answers[i]?.length > 20) gained += q.marks;
            });

            const percentage = Math.round((gained / total) * 100);
            const passed = percentage >= exam.passScore;
            
            setResult({ percentage, passed });
            setIsSubmitted(true);
            
            if (passed && auth.currentUser) {
                awardXP(auth.currentUser.uid, 50, 'Passed Exam');
            }
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600"></div></div>;

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center">
                    {result.passed ? (
                        <>
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trophy size={40} className="text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Assessment Passed!</h2>
                            <p className="text-slate-500 mb-6">Great job demonstrating your skills.</p>
                            <div className="text-5xl font-bold text-green-600 mb-8">{result.percentage}%</div>
                            <button onClick={() => navigate('/student/dashboard')} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                                Return to Dashboard
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <XCircle size={40} className="text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Assessment Failed</h2>
                            <p className="text-slate-500 mb-6">Don't worry, review the material and try again.</p>
                            <div className="text-5xl font-bold text-red-600 mb-8">{result.percentage}%</div>
                            <button onClick={() => navigate('/student/dashboard')} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">
                                Return to Dashboard
                            </button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    const currentQ = exam.questions[currentQIndex];

    return (
        <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
            {/* Exam Header */}
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-bold text-slate-900">{exam.title}</h1>
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                        Question {currentQIndex + 1} of {exam.questions.length}
                    </span>
                </div>
                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-2 text-lg font-mono font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
                        <Clock size={20} />
                        {formatTime(timeLeft)}
                    </div>
                    <button 
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                    >
                        Finish Exam
                    </button>
                </div>
            </header>

            {/* Main Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="w-64 bg-white border-r border-slate-200 p-4 overflow-y-auto hidden lg:block">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Question Map</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {exam.questions.map((_, idx) => {
                            const isActive = idx === currentQIndex;
                            const isAnswered = !!answers[idx];
                            return (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQIndex(idx)}
                                    className={`
                                        h-10 rounded-lg text-sm font-bold transition-all border
                                        ${isActive ? 'bg-brand-600 text-white border-brand-600' : 
                                          isAnswered ? 'bg-brand-50 text-brand-700 border-brand-200' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'}
                                    `}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className="mt-8 space-y-2 text-xs text-slate-500">
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-brand-600"></div> Current</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-brand-50 border border-brand-200"></div> Answered</div>
                        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-slate-50 border border-slate-200"></div> Unvisited</div>
                    </div>
                </aside>

                {/* Question Area */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px] flex flex-col">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-xl font-medium text-slate-900 leading-relaxed">
                                    {currentQ.text}
                                </h2>
                                <span className="shrink-0 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-600">
                                    {currentQ.marks} Marks
                                </span>
                            </div>

                            {/* Render based on type */}
                            <div className="flex-1">
                                {currentQ.type === 'mcq' && (
                                    <div className="space-y-3">
                                        {currentQ.options.map((opt, i) => (
                                            <label 
                                                key={i}
                                                className={`
                                                    flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                                                    ${answers[currentQIndex] === opt 
                                                        ? 'border-brand-500 bg-brand-50 shadow-inner' 
                                                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}
                                                `}
                                            >
                                                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${answers[currentQIndex] === opt ? 'border-brand-500' : 'border-slate-300'}`}>
                                                    {answers[currentQIndex] === opt && <div className="w-2.5 h-2.5 rounded-full bg-brand-500"></div>}
                                                </div>
                                                <input 
                                                    type="radio" 
                                                    name={`q-${currentQ.id}`} 
                                                    value={opt} 
                                                    checked={answers[currentQIndex] === opt} 
                                                    onChange={() => handleAnswer(opt)} 
                                                    className="hidden" 
                                                />
                                                <span className={`text-base ${answers[currentQIndex] === opt ? 'text-brand-900 font-medium' : 'text-slate-700'}`}>{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {currentQ.type === 'descriptive' && (
                                    <textarea
                                        value={answers[currentQIndex] || ''}
                                        onChange={(e) => handleAnswer(e.target.value)}
                                        placeholder="Type your answer here..."
                                        className="w-full h-64 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none text-slate-700 leading-relaxed"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Navigation Footer */}
                        <div className="flex justify-between items-center mt-8">
                            <button
                                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQIndex === 0}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                            >
                                <ChevronLeft size={20} /> Previous
                            </button>

                            {currentQIndex < exam.questions.length - 1 ? (
                                <button
                                    onClick={() => setCurrentQIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
                                    className="flex items-center gap-2 px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-lg shadow-brand-200 transition-all"
                                >
                                    Next Question <ChevronRight size={20} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition-all"
                                >
                                    Submit Exam <CheckCircle size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ExamRunner;
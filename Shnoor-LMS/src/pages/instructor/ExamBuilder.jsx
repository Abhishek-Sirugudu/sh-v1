import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Plus, Trash2, Code, List, AlignLeft, Settings } from 'lucide-react';
import { auth, db } from '../../auth/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

const ExamBuilder = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('config'); // config | questions
    const [formData, setFormData] = useState({
        title: '',
        duration: 60,
        passScore: 70,
        questions: []
    });

    const addQuestion = (type) => {
        const newQ = {
            id: Date.now(),
            type,
            text: '',
            marks: 10,
            options: type === 'mcq' ? ['', '', '', ''] : [],
            correctAnswer: ''
        };
        setFormData(prev => ({...prev, questions: [...prev.questions, newQ]}));
    };

    const updateQuestion = (id, field, value) => {
        const updated = formData.questions.map(q => q.id === id ? { ...q, [field]: value } : q);
        setFormData({...formData, questions: updated});
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Exam Builder</h1>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('config')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'config' ? 'bg-white shadow-sm text-brand-700' : 'text-slate-500'}`}
                    >
                        Configuration
                    </button>
                    <button 
                        onClick={() => setActiveTab('questions')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'questions' ? 'bg-white shadow-sm text-brand-700' : 'text-slate-500'}`}
                    >
                        Questions ({formData.questions.length})
                    </button>
                </div>
            </div>

            {activeTab === 'config' && (
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Exam Title</label>
                        <input 
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg" 
                            placeholder="e.g. Final React Assessment"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Duration (mins)</label>
                            <input 
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Pass Score (%)</label>
                            <input 
                                type="number"
                                value={formData.passScore}
                                onChange={(e) => setFormData({...formData, passScore: e.target.value})}
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg" 
                            />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'questions' && (
                <div className="space-y-6">
                    {/* Toolbar */}
                    <div className="flex gap-4 justify-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <button onClick={() => addQuestion('mcq')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm font-medium text-sm">
                            <List size={16} /> Add MCQ
                        </button>
                        <button onClick={() => addQuestion('coding')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm font-medium text-sm">
                            <Code size={16} /> Add Code Challenge
                        </button>
                        <button onClick={() => addQuestion('descriptive')} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm font-medium text-sm">
                            <AlignLeft size={16} /> Add Descriptive
                        </button>
                    </div>

                    {formData.questions.map((q, idx) => (
                        <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {idx + 1} • {q.type.toUpperCase()}</span>
                                <button onClick={() => setFormData(prev => ({...prev, questions: prev.questions.filter(item => item.id !== q.id)}))} className="text-slate-400 hover:text-red-500">
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <textarea 
                                value={q.text}
                                onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none mb-4"
                                placeholder="Enter question text..."
                                rows={2}
                            />

                            {q.type === 'mcq' && (
                                <div className="space-y-2">
                                    {q.options.map((opt, optIdx) => (
                                        <div key={optIdx} className="flex items-center gap-3">
                                            <input 
                                                type="radio" 
                                                name={`correct-${q.id}`} 
                                                checked={q.correctAnswer === opt && opt !== ''}
                                                onChange={() => updateQuestion(q.id, 'correctAnswer', opt)}
                                            />
                                            <input 
                                                value={opt}
                                                onChange={(e) => {
                                                    const newOpts = [...q.options];
                                                    newOpts[optIdx] = e.target.value;
                                                    updateQuestion(q.id, 'options', newOpts);
                                                }}
                                                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-md text-sm"
                                                placeholder={`Option ${optIdx + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500">Marks:</span>
                                    <input 
                                        type="number" 
                                        value={q.marks} 
                                        onChange={(e) => updateQuestion(q.id, 'marks', parseInt(e.target.value))}
                                        className="w-16 px-2 py-1 border border-slate-200 rounded text-center text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-40 flex justify-end">
                <button className="px-8 py-2.5 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 shadow-lg">Save Exam</button>
            </div>
        </div>
    );
};

export default ExamBuilder;
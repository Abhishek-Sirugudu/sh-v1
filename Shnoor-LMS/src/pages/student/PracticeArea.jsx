import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, CheckCircle2, Filter, Zap, Lock } from 'lucide-react';
import { getStudentData } from '../../utils/studentData';

const PracticeArea = () => {
    const navigate = useNavigate();
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        // Simulating data fetch
        setTimeout(() => {
            const data = getStudentData(); // Ensure this utility returns an object with practiceChallenges array
            // Fallback mock data if utility returns empty
            const mockChallenges = [
                { id: 'c1', title: 'Two Sum', difficulty: 'Easy', status: 'Solved', points: 10, tags: ['Arrays', 'Hash Map'] },
                { id: 'c2', title: 'Reverse Linked List', difficulty: 'Medium', status: 'Unsolved', points: 20, tags: ['Linked List'] },
                { id: 'c3', title: 'Merge K Sorted Lists', difficulty: 'Hard', status: 'Locked', points: 50, tags: ['Heap'] },
            ];
            setChallenges(data.practiceChallenges || mockChallenges);
            setLoading(false);
        }, 500);
    }, []);

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const filteredChallenges = filter === 'All' ? challenges : challenges.filter(c => c.difficulty === filter);

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Code2 className="text-brand-600" /> Practice Arena
                    </h1>
                    <p className="text-slate-500 mt-1">Sharpen your coding skills with algorithmic challenges.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer"
                        >
                            <option value="All">All Levels</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Challenge Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChallenges.map((challenge) => (
                    <div 
                        key={challenge.id}
                        onClick={() => challenge.status !== 'Locked' && navigate(`/student/practice/session/${challenge.id}`)}
                        className={`
                            group relative bg-white rounded-xl border border-slate-200 p-6 shadow-sm transition-all duration-300
                            ${challenge.status === 'Locked' ? 'opacity-75 cursor-not-allowed bg-slate-50' : 'hover:shadow-md hover:border-brand-300 cursor-pointer'}
                        `}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getDifficultyColor(challenge.difficulty)}`}>
                                {challenge.difficulty}
                            </span>
                            {challenge.status === 'Solved' && <CheckCircle2 className="text-green-500" size={20} />}
                            {challenge.status === 'Locked' && <Lock className="text-slate-400" size={20} />}
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
                            {challenge.title}
                        </h3>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {challenge.tags?.map((tag, i) => (
                                <span key={i} className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex items-center text-xs font-bold text-brand-600">
                                <Zap size={14} className="mr-1 fill-current" />
                                {challenge.points} XP
                            </div>
                            <span className={`text-sm font-medium ${challenge.status === 'Locked' ? 'text-slate-400' : 'text-brand-600 group-hover:underline'}`}>
                                {challenge.status === 'Locked' ? 'Locked' : 'Solve Challenge ->'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredChallenges.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                        <Filter className="text-slate-400" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No challenges found</h3>
                    <p className="text-slate-500">Try adjusting your filters.</p>
                </div>
            )}
        </div>
    );
};

export default PracticeArea;
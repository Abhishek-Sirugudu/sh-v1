import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, AlertCircle, CheckCircle, TrendingUp, Mail } from 'lucide-react';

const StudentPerformance = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Mock Data
    const students = [
        { id: 1, name: "Alice Johnson", course: "React Basics", progress: 85, score: 92, status: "Excellent" },
        { id: 2, name: "Bob Smith", course: "React Basics", progress: 45, score: 78, status: "Good" },
        { id: 3, name: "Charlie Brown", course: "Adv. Node.js", progress: 20, score: 55, status: "At Risk" },
        { id: 4, name: "Diana Prince", course: "UI/UX Design", progress: 95, score: 98, status: "Excellent" },
        { id: 5, name: "Evan Wright", course: "Python Intro", progress: 10, score: 40, status: "At Risk" },
    ];

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Excellent': return 'bg-green-100 text-green-700 border-green-200';
            case 'Good': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'At Risk': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <button onClick={() => navigate(-1)} className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-2 transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Back
                    </button>
                    <h1 className="text-2xl font-bold text-slate-900">Student Performance</h1>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search student or course..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none w-full md:w-64"
                    />
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Enrolled</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">{students.length}</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><TrendingUp size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">High Performers</p>
                        <h3 className="text-2xl font-bold text-green-600 mt-1">{students.filter(s => s.status === 'Excellent').length}</h3>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={24} /></div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Students At Risk</p>
                        <h3 className="text-2xl font-bold text-red-600 mt-1">{students.filter(s => s.status === 'At Risk').length}</h3>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg"><AlertCircle size={24} /></div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Progress</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredStudents.map(student => (
                            <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{student.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{student.course}</td>
                                <td className="px-6 py-4 whitespace-nowrap w-48">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${student.progress < 30 ? 'bg-red-500' : 'bg-brand-600'}`} 
                                                style={{ width: `${student.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-slate-500 w-8">{student.progress}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-700">{student.score}%</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(student.status)}`}>
                                        {student.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <button 
                                        onClick={() => navigate('/instructor/chat')}
                                        className="text-slate-400 hover:text-brand-600 transition-colors" 
                                        title="Message"
                                    >
                                        <Mail size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentPerformance;
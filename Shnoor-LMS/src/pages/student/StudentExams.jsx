import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, CheckCircle, PlayCircle, Clock, Lock } from 'lucide-react';
import { getStudentData } from '../../utils/studentData';

const StudentExams = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating fetch
        setTimeout(() => {
            const data = getStudentData();
            // Mock if empty
            const mockExams = [
                { id: 'exam1', title: 'React Certification', duration: 60, status: 'passed', score: 92 },
                { id: 'exam2', title: 'JavaScript Advanced', duration: 45, status: 'available' },
                { id: 'exam3', title: 'Backend Architecture', duration: 90, status: 'locked', prerequisite: 'Node.js Course' }
            ];
            setExams(data.exams?.length ? data.exams : mockExams);
            setLoading(false);
        }, 500);
    }, []);

    const ExamCard = ({ exam }) => {
        const isPassed = exam.status === 'passed';
        const isLocked = exam.status === 'locked';

        return (
            <div className={`bg-white rounded-xl border p-6 shadow-sm flex flex-col transition-all ${isLocked ? 'border-slate-100 bg-slate-50 opacity-70' : 'border-slate-200 hover:shadow-md hover:border-brand-300'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg ${isPassed ? 'bg-green-100 text-green-600' : isLocked ? 'bg-slate-200 text-slate-500' : 'bg-brand-50 text-brand-600'}`}>
                        {isPassed ? <CheckCircle size={24} /> : isLocked ? <Lock size={24} /> : <ClipboardList size={24} />}
                    </div>
                    {isPassed && <span className="text-2xl font-bold text-green-600">{exam.score}%</span>}
                </div>

                <h3 className="font-bold text-slate-900 text-lg mb-2">{exam.title}</h3>
                
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    <span className="flex items-center gap-1"><Clock size={14} /> {exam.duration} mins</span>
                    <span>•</span>
                    <span>{isPassed ? 'Completed' : '15 Questions'}</span>
                </div>

                <div className="mt-auto">
                    {isPassed ? (
                        <button className="w-full py-2 bg-green-50 text-green-700 font-bold rounded-lg border border-green-200 cursor-default">
                            Passed
                        </button>
                    ) : isLocked ? (
                        <div className="text-xs text-center text-slate-500 bg-slate-100 py-2 rounded-lg border border-slate-200">
                            Locked (Complete: {exam.prerequisite})
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate(`/student/exam/${exam.id}`)}
                            className="w-full py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <PlayCircle size={18} /> Start Exam
                        </button>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading assessments...</div>;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Assessments</h1>
                <p className="text-slate-500">Prove your skills and earn certifications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map(exam => <ExamCard key={exam.id} exam={exam} />)}
            </div>
        </div>
    );
};

export default StudentExams;
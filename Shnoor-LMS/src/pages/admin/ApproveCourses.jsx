import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, FileText, PlayCircle, Eye } from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../auth/firebase';

const ApproveCourses = () => {
    const [pendingCourses, setPendingCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingCourses();
    }, []);

    const fetchPendingCourses = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "courses"), where("status", "==", "pending"));
            const querySnapshot = await getDocs(q);
            const courses = [];
            querySnapshot.forEach((doc) => {
                courses.push({ id: doc.id, ...doc.data() });
            });
            setPendingCourses(courses);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching courses:", error);
            setLoading(false);
        }
    };

    const handleAction = async (status) => {
        if (!selectedCourse) return;
        const confirmMsg = status === 'published' ? 'APPROVE and PUBLISH' : 'REJECT';
        if (!window.confirm(`Are you sure you want to ${confirmMsg} this course?`)) return;

        try {
            await updateDoc(doc(db, "courses", selectedCourse.id), {
                status: status,
                verifiedAt: new Date().toISOString()
            });
            setPendingCourses(prev => prev.filter(c => c.id !== selectedCourse.id));
            setSelectedCourse(null);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading requests...</div>;

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">
            {/* List Sidebar */}
            <div className="w-1/3 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-bold text-slate-700">Pending Requests ({pendingCourses.length})</h2>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {pendingCourses.length === 0 && <div className="p-4 text-center text-slate-400 text-sm">No pending courses.</div>}
                    {pendingCourses.map(course => (
                        <div 
                            key={course.id}
                            onClick={() => setSelectedCourse(course)}
                            className={`p-3 rounded-lg cursor-pointer border transition-all ${selectedCourse?.id === course.id ? 'bg-brand-50 border-brand-200 ring-1 ring-brand-300' : 'bg-white border-slate-200 hover:border-brand-200'}`}
                        >
                            <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{course.title}</h3>
                            <p className="text-xs text-slate-500 mt-1">{course.instructorName || 'Instructor'}</p>
                            <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded">{course.category}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Preview Panel */}
            <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                {selectedCourse ? (
                    <>
                        <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{selectedCourse.title}</h2>
                                <p className="text-slate-500 mt-1">{selectedCourse.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => handleAction('rejected')}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
                                >
                                    <XCircle size={18} /> Reject
                                </button>
                                <button 
                                    onClick={() => handleAction('published')}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm"
                                >
                                    <CheckCircle size={18} /> Approve
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-slate-400"/> Curriculum Content
                            </h3>
                            <div className="space-y-3">
                                {selectedCourse.modules?.map((mod, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded border border-slate-200 text-slate-500">
                                                {mod.type === 'video' ? <PlayCircle size={16}/> : <FileText size={16}/>}
                                            </div>
                                            <span className="font-medium text-sm text-slate-700">{mod.title}</span>
                                        </div>
                                        {mod.url && (
                                            <a 
                                                href={mod.url} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
                                            >
                                                <Eye size={12} /> View
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <FileText size={48} className="mb-4 opacity-20" />
                        <p>Select a course to review details.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApproveCourses;
import React, { useState, useEffect } from 'react';
import { Check, Search, UserPlus, BookOpen } from 'lucide-react';
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../auth/firebase';

const AssignCourse = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Students
                const userSnapshot = await getDocs(query(collection(db, "users"), where("role", "==", "student")));
                setStudents(userSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

                // Fetch Courses
                const courseSnapshot = await getDocs(query(collection(db, "courses"), where("status", "==", "published")));
                setCourses(courseSnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching assignment data:", error);
            }
        };
        fetchData();
    }, []);

    const handleAssign = async (e) => {
        e.preventDefault();
        if (selectedStudents.length === 0 || selectedCourses.length === 0) return;

        if (window.confirm(`Enroll ${selectedStudents.length} student(s) into ${selectedCourses.length} course(s)?`)) {
            try {
                const promises = selectedStudents.map(studentId => {
                    const studentRef = doc(db, "users", studentId);
                    return updateDoc(studentRef, { enrolledCourses: arrayUnion(...selectedCourses) });
                });
                await Promise.all(promises);
                alert("Enrollment successful!");
                setSelectedStudents([]);
                setSelectedCourses([]);
            } catch (err) {
                alert("Assignment failed.");
            }
        }
    };

    // FIXED: Safely check for properties before calling toLowerCase()
    const filteredStudents = students.filter(s => {
        const name = s.displayName || '';
        const email = s.email || '';
        const term = searchTerm.toLowerCase();
        return name.toLowerCase().includes(term) || email.toLowerCase().includes(term);
    });

    const toggleSelection = (id, list, setList) => {
        setList(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading data...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-20">
            <h1 className="text-2xl font-bold text-slate-900">Bulk Enrollment</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
                
                {/* Students Column */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <UserPlus size={18} /> Select Students
                            </h3>
                            <span className="text-xs font-bold bg-brand-100 text-brand-700 px-2 py-1 rounded-full">
                                {selectedStudents.length} Selected
                            </span>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search students..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredStudents.map(student => (
                            <div 
                                key={student.id}
                                onClick={() => toggleSelection(student.id, selectedStudents, setSelectedStudents)}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${selectedStudents.includes(student.id) ? 'bg-brand-50 border border-brand-200' : 'hover:bg-slate-50 border border-transparent'}`}
                            >
                                <div>
                                    <div className="font-medium text-sm text-slate-900">{student.displayName || 'No Name'}</div>
                                    <div className="text-xs text-slate-500">{student.email}</div>
                                </div>
                                {selectedStudents.includes(student.id) && <Check size={18} className="text-brand-600" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Courses Column */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <BookOpen size={18} /> Select Courses
                        </h3>
                        <span className="text-xs font-bold bg-brand-100 text-brand-700 px-2 py-1 rounded-full">
                            {selectedCourses.length} Selected
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {courses.map(course => (
                            <div 
                                key={course.id}
                                onClick={() => toggleSelection(course.id, selectedCourses, setSelectedCourses)}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${selectedCourses.includes(course.id) ? 'bg-brand-50 border border-brand-200' : 'hover:bg-slate-50 border border-transparent'}`}
                            >
                                <div>
                                    <div className="font-medium text-sm text-slate-900">{course.title}</div>
                                    <div className="text-xs text-slate-500">Instructor: {course.instructorName}</div>
                                </div>
                                {selectedCourses.includes(course.id) && <Check size={18} className="text-brand-600" />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-40 flex justify-center">
                <button 
                    onClick={handleAssign}
                    disabled={selectedStudents.length === 0 || selectedCourses.length === 0}
                    className="px-8 py-3 bg-brand-600 text-white rounded-xl font-bold shadow-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                    <Check size={20} />
                    Confirm Enrollment
                </button>
            </div>
        </div>
    );
};

export default AssignCourse;
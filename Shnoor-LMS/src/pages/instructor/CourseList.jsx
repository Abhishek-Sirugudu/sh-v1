import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  FileEdit, 
  Trash2, 
  Eye, 
  Filter 
} from 'lucide-react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../auth/firebase';

const CourseList = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all | published | draft

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        if (!auth.currentUser) return;
        try {
            setLoading(true);
            const q = query(collection(db, "courses"), where("instructorId", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            const courseList = [];
            querySnapshot.forEach((doc) => {
                courseList.push({ id: doc.id, ...doc.data() });
            });
            setCourses(courseList);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching courses:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('Delete this course? Action cannot be undone.')) {
            try {
                await deleteDoc(doc(db, "courses", courseId));
                setCourses(courses.filter(c => c.id !== courseId));
            } catch (error) {
                console.error("Error deleting course:", error);
            }
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            published: "bg-green-100 text-green-700 border-green-200",
            draft: "bg-slate-100 text-slate-700 border-slate-200",
            pending: "bg-amber-100 text-amber-700 border-amber-200",
            rejected: "bg-red-100 text-red-700 border-red-200"
        };
        const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Draft';
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.draft}`}>
                {label}
            </span>
        );
    };

    // Filter Logic
    const filteredCourses = courses.filter(course => 
        filter === 'all' ? true : course.status === filter
    );

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">My Courses</h2>
                    <p className="text-slate-500 text-sm mt-1">Manage your content library and enrollments.</p>
                </div>
                <button 
                    onClick={() => navigate('/instructor/add-course')}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Create Course
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search by course title..." 
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter size={16} className="text-slate-500" />
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2"
                    >
                        <option value="all">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Drafts</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Course Title</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Modules</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredCourses.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                    No courses found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            filteredCourses.map((course) => (
                                <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{course.title}</div>
                                        <div className="text-xs text-slate-500">Created: {new Date(course.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-700">{course.category || 'General'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={course.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {course.modules?.length || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                                onClick={() => navigate(`/instructor/add-course?edit=${course.id}`, { state: { courseData: course } })}
                                                className="text-slate-400 hover:text-brand-600 transition-colors" 
                                                title="Edit"
                                            >
                                                <FileEdit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(course.id)}
                                                className="text-slate-400 hover:text-red-600 transition-colors" 
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseList;
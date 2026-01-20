import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Clock, BarChart, Filter, PlayCircle } from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db, auth } from '../../../auth/firebase';

const StudentCourses = () => {
    const navigate = useNavigate();
    const [allCourses, setAllCourses] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('my-learning');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Published Courses
                const q = query(collection(db, "courses"), where("status", "==", "published"));
                const querySnapshot = await getDocs(q);
                const fetchedCourses = [];
                querySnapshot.forEach((doc) => {
                    fetchedCourses.push({ id: doc.id, ...doc.data() });
                });
                setAllCourses(fetchedCourses);

                // Fetch User Enrollments
                if (auth.currentUser) {
                    const userRef = doc(db, "users", auth.currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setEnrolledIds(userSnap.data().enrolledCourses || []);
                    }
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEnroll = async (courseId) => {
        if (!auth.currentUser) return;
        try {
            const userRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userRef, {
                enrolledCourses: arrayUnion(courseId)
            });
            setEnrolledIds(prev => [...prev, courseId]);
            // Optional: Toast success
        } catch (error) {
            console.error("Error enrolling:", error);
        }
    };

    const getDisplayCourses = () => {
        let filtered = allCourses;

        if (activeTab === 'my-learning') {
            filtered = allCourses.filter(c => enrolledIds.includes(c.id));
        }

        if (searchTerm) {
            filtered = filtered.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(c => c.category === selectedCategory);
        }

        return filtered;
    };

    const displayCourses = getDisplayCourses();
    const categories = ['All', ...new Set(allCourses.map(c => c.category).filter(Boolean))];

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-primary-900">
                        {activeTab === 'my-learning' ? 'My Learning' : 'Course Catalog'}
                    </h2>
                    <p className="text-primary-500 text-sm mt-1">
                        {activeTab === 'my-learning' ? 'Continue your progress.' : 'Find your next skill.'}
                    </p>
                </div>
                
                <div className="flex p-1 bg-primary-100 rounded-lg">
                    <button 
                        onClick={() => setActiveTab('my-learning')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'my-learning' ? 'bg-white text-primary-900 shadow-sm' : 'text-primary-500 hover:text-primary-900'}`}
                    >
                        My Learning
                    </button>
                    <button 
                        onClick={() => setActiveTab('explore')}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'explore' ? 'bg-white text-primary-900 shadow-sm' : 'text-primary-500 hover:text-primary-900'}`}
                    >
                        Explore
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search courses..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-brand-light focus:border-brand transition-all text-sm"
                    />
                </div>
                <div className="relative w-full md:w-64">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 bg-white border border-primary-200 rounded-xl focus:ring-2 focus:ring-brand-light focus:border-brand transition-all text-sm appearance-none cursor-pointer"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            {/* Course Grid */}
            {displayCourses.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-primary-200">
                    <BookOpen size={48} className="mx-auto text-primary-300 mb-4" />
                    <h3 className="text-lg font-bold text-primary-900">No courses found</h3>
                    <p className="text-primary-500">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayCourses.map((course, index) => {
                        const isEnrolled = enrolledIds.includes(course.id);
                        // Randomized gradients for visual appeal since we don't have real images yet
                        const gradients = [
                            'bg-gradient-to-br from-blue-500 to-indigo-600',
                            'bg-gradient-to-br from-emerald-500 to-teal-600',
                            'bg-gradient-to-br from-orange-400 to-red-500',
                            'bg-gradient-to-br from-purple-500 to-indigo-500',
                        ];
                        const bgClass = gradients[index % gradients.length];

                        return (
                            <div key={course.id} className="group bg-white rounded-xl border border-primary-200 overflow-hidden hover:shadow-lg hover:border-primary-300 transition-all duration-300 flex flex-col h-full">
                                {/* Thumbnail */}
                                <div className={`h-40 ${bgClass} relative flex items-center justify-center`}>
                                    <BookOpen className="text-white/20 w-16 h-16 transform group-hover:scale-110 transition-transform duration-500" />
                                    {isEnrolled && (
                                        <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] font-bold text-primary-900 uppercase tracking-wide">
                                            Enrolled
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="px-2 py-0.5 rounded bg-primary-50 text-brand text-[10px] font-bold uppercase tracking-wider">
                                            {course.category || 'General'}
                                        </span>
                                        <div className="flex items-center text-xs text-primary-400">
                                            <BarChart size={12} className="mr-1" /> {course.level || 'All Levels'}
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-primary-900 text-lg leading-tight mb-2 line-clamp-2 group-hover:text-brand transition-colors">
                                        {course.title}
                                    </h3>
                                    
                                    <p className="text-xs text-primary-500 mb-4">By {course.instructorName || 'Instructor'}</p>

                                    <div className="mt-auto pt-4 border-t border-primary-50 flex items-center justify-between">
                                        <div className="flex items-center text-xs text-primary-400">
                                            <Clock size={14} className="mr-1" />
                                            <span>{course.duration || '2h 15m'}</span>
                                        </div>
                                        
                                        {isEnrolled ? (
                                            <button 
                                                onClick={() => navigate(`/student/course/${course.id}`)}
                                                className="text-sm font-bold text-primary-900 hover:text-brand flex items-center gap-1 transition-colors"
                                            >
                                                Continue <PlayCircle size={16} />
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleEnroll(course.id)}
                                                className="text-sm font-bold text-brand hover:text-brand-hover transition-colors"
                                            >
                                                Enroll Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StudentCourses;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  CheckCircle, 
  User, 
  Clock, 
  Calendar, 
  Star, 
  Globe, 
  Award, 
  ArrowLeft, 
  Check, 
  BookOpen, 
  ShieldCheck,
  Video
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../auth/firebase';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
            setIsEnrolled(enrolledCourses.includes(courseId));

            // --- Mock Logic ---
            if (courseId.startsWith('mock')) {
                setTimeout(() => {
                    setCourse({
                        id: courseId,
                        title: 'Mastering React & Tailwind CSS',
                        description: 'A complete guide to building professional, responsive web applications using the modern React ecosystem. Learn hooks, context, and advanced styling patterns.',
                        category: 'Web Development',
                        level: 'Intermediate',
                        rating: 4.8,
                        reviews: 1240,
                        lastUpdated: 'March 2024',
                        instructor: {
                            name: 'Sarah Johnson',
                            bio: 'Senior Software Engineer with 10+ years of experience in full-stack development. Passionate about teaching.',
                        },
                        modules: new Array(8).fill({ title: 'Introduction to Hooks', duration: '15m' }),
                        price: 'Free'
                    });
                    setLoading(false);
                }, 500);
                return;
            }
            // --- End Mock Logic ---

            try {
                const docRef = doc(db, "courses", courseId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setCourse({
                        id: docSnap.id,
                        ...data,
                        instructor: {
                            name: data.instructorName || 'Expert Instructor',
                            bio: 'Industry Professional',
                        }
                    });
                }
            } catch (error) {
                console.error("Error loading course:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    const handleEnroll = () => {
        const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
        if (!enrolledCourses.includes(courseId)) {
            const newEnrolled = [...enrolledCourses, courseId];
            localStorage.setItem('enrolledCourses', JSON.stringify(newEnrolled));
            setIsEnrolled(true);
            // Optional: Add toast notification here
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand"></div>
        </div>
    );

    if (!course) return <div className="p-8">Course not found.</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Dark Hero Section */}
            <div className="bg-primary-900 text-white pt-10 pb-12 lg:pb-24">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
                    <button 
                        onClick={() => navigate('/student/courses')} 
                        className="flex items-center text-primary-300 hover:text-white mb-6 transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Back to Courses
                    </button>

                    <div className="lg:w-2/3 pr-0 lg:pr-12">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-brand/20 text-brand-light text-xs font-bold uppercase tracking-wider border border-brand/20">
                                {course.category || 'Development'}
                            </span>
                            <span className="flex items-center text-yellow-400 text-sm font-semibold">
                                <Star size={14} className="fill-current mr-1" /> 
                                {course.rating || '4.9'} <span className="text-primary-400 ml-1 font-normal">({course.reviews || 0} reviews)</span>
                            </span>
                        </div>

                        <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
                            {course.title}
                        </h1>
                        <p className="text-lg text-primary-200 mb-6 leading-relaxed">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap gap-6 text-sm text-primary-300">
                            <div className="flex items-center gap-2">
                                <User size={16} /> <span>Created by <span className="text-white underline decoration-dotted underline-offset-4">{course.instructor?.name}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar size={16} /> <span>Last updated {course.lastUpdated || 'Recently'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe size={16} /> <span>{course.level || 'All Levels'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-20 -mt-8 lg:-mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* What you'll learn */}
                        <div className="bg-white rounded-xl border border-primary-200 p-6 lg:p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-primary-900 mb-6">What you'll learn</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['Master core concepts', 'Build real projects', 'Industry best practices', 'Certification of completion'].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <Check size={18} className="text-success mt-0.5 flex-shrink-0" />
                                        <span className="text-primary-700 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Content List */}
                        <div className="bg-white rounded-xl border border-primary-200 p-6 lg:p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-primary-900 mb-6">Course Content</h2>
                            <div className="space-y-0 border rounded-lg border-primary-200 overflow-hidden">
                                {course.modules?.map((module, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-white border-b border-primary-100 last:border-0 hover:bg-primary-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500">
                                                {module.type === 'video' ? <Video size={14} /> : <BookOpen size={14} />}
                                            </div>
                                            <span className="text-primary-700 font-medium text-sm">{module.title}</span>
                                        </div>
                                        <span className="text-xs text-primary-400">{module.duration || '10m'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Instructor */}
                        <div className="bg-white rounded-xl border border-primary-200 p-6 lg:p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-primary-900 mb-4">Instructor</h2>
                            <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-full bg-primary-200 flex items-center justify-center text-primary-500 text-xl font-bold">
                                    {course.instructor?.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-primary-900 text-lg">{course.instructor?.name}</h3>
                                    <p className="text-primary-500 text-sm mb-3">Senior Instructor</p>
                                    <p className="text-primary-600 text-sm leading-relaxed">
                                        {course.instructor?.bio}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Enrollment Card */}
                    <div className="lg:col-span-1 relative">
                        <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-primary-200 overflow-hidden">
                            {/* Preview Image/Video Area */}
                            <div className="h-48 bg-gray-900 relative group cursor-pointer flex items-center justify-center">
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-primary-900 shadow-lg group-hover:scale-110 transition-transform z-10">
                                    <Play size={24} className="ml-1 fill-current" />
                                </div>
                                <span className="absolute bottom-4 text-white font-semibold text-sm z-10">Preview this course</span>
                            </div>

                            <div className="p-6">
                                <div className="text-3xl font-bold text-primary-900 mb-6">
                                    {course.price === 'Free' ? 'Free' : `$${course.price}`}
                                </div>

                                {isEnrolled ? (
                                    <button 
                                        onClick={() => navigate(`/student/course/${courseId}/learn`)}
                                        className="w-full py-3.5 bg-primary-900 text-white rounded-xl font-bold hover:bg-primary-800 transition-all shadow-lg shadow-primary-900/20 mb-3"
                                    >
                                        Continue Learning
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleEnroll}
                                        className="w-full py-3.5 bg-brand text-white rounded-xl font-bold hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 mb-3"
                                    >
                                        Enroll Now
                                    </button>
                                )}

                                <p className="text-center text-xs text-primary-400 mb-6">30-Day Money-Back Guarantee</p>

                                <div className="space-y-4">
                                    <h4 className="font-bold text-primary-900 text-sm">This course includes:</h4>
                                    <div className="space-y-3 text-sm text-primary-600">
                                        <div className="flex items-center gap-3"><Video size={16} className="text-primary-400"/> {course.modules?.length * 15 || 60} mins on-demand video</div>
                                        <div className="flex items-center gap-3"><ShieldCheck size={16} className="text-primary-400"/> Full lifetime access</div>
                                        <div className="flex items-center gap-3"><Globe size={16} className="text-primary-400"/> Access on mobile and TV</div>
                                        <div className="flex items-center gap-3"><Award size={16} className="text-primary-400"/> Certificate of completion</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
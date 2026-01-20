import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { 
  CheckCircle, 
  PlayCircle, 
  FileText, 
  ChevronLeft, 
  Menu, 
  Download, 
  MessageSquare,
  Award,
  Lock
} from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../auth/firebase';
import { awardXP } from '../../utils/gamification';

const CoursePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [currentModule, setCurrentModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedModuleIds, setCompletedModuleIds] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview | resources

    useEffect(() => {
        const fetchCourse = async () => {
            // --- Keep your Mock Logic ---
            if (courseId.startsWith('mock')) {
                setTimeout(() => {
                    const mockData = {
                        id: courseId,
                        title: 'Mock Course Demo',
                        modules: [
                            { id: 'm1', title: 'Welcome to the Course', type: 'video', url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ', duration: '5m' },
                            { id: 'm2', title: 'Chapter 1: Basics', type: 'video', url: 'https://www.youtube.com/watch?v=dGcsHMXbSOA', duration: '15m' },
                            { id: 'm3', title: 'Reading Material', type: 'pdf', url: '#', duration: '10m', notes: "Please read pages 1-10." }
                        ]
                    };
                    setCourse(mockData);
                    setCurrentModule(mockData.modules[0]);
                    setLoading(false);
                }, 500);
                return;
            }
            // --- End Mock Logic ---

            try {
                const docRef = doc(db, "courses", courseId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const courseData = docSnap.data();
                    setCourse({ id: docSnap.id, ...courseData });
                    if (courseData.modules && courseData.modules.length > 0) {
                        setCurrentModule(courseData.modules[0]);
                    }
                }
            } catch (error) {
                console.error("Error loading course:", error);
            } finally {
                setLoading(false);
            }
        };

        const storedProgress = JSON.parse(localStorage.getItem(`progress_${courseId}`)) || [];
        setCompletedModuleIds(storedProgress);
        fetchCourse();
    }, [courseId]);

    const handleMarkComplete = (moduleId) => {
        const idToMark = moduleId || currentModule?.id;
        if (!idToMark) return;

        if (!completedModuleIds.includes(idToMark)) {
            const newCompleted = [...completedModuleIds, idToMark];
            setCompletedModuleIds(newCompleted);
            localStorage.setItem(`progress_${courseId}`, JSON.stringify(newCompleted));
            if (auth.currentUser) {
                awardXP(auth.currentUser.uid, 10, 'Completed Lesson');
            }
        }
    };

    // Auto-complete video when it ends
    const handleVideoEnded = () => {
        handleMarkComplete();
    };

    const isModuleCompleted = (id) => completedModuleIds.includes(id);
    const getProgress = () => {
        if (!course?.modules?.length) return 0;
        return Math.round((completedModuleIds.length / course.modules.length) * 100);
    };

    if (loading) return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
        </div>
    );
    
    if (!course) return <div className="p-8">Course not found.</div>;

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="h-16 bg-white border-b border-primary-200 flex items-center justify-between px-4 z-20 shadow-sm flex-shrink-0">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/student/courses')} 
                        className="p-2 hover:bg-primary-50 rounded-full text-primary-500 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h1 className="text-sm md:text-base font-semibold text-primary-900 line-clamp-1">
                        {course.title}
                    </h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end mr-2">
                        <span className="text-xs text-primary-500">Your Progress</span>
                        <div className="w-32 h-2 bg-primary-100 rounded-full mt-1">
                            <div 
                                className="h-full bg-success rounded-full transition-all duration-500" 
                                style={{ width: `${getProgress()}%` }} 
                            />
                        </div>
                    </div>
                    <button 
                        className="md:hidden p-2 text-primary-500"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Main Content Area (Video + Details) */}
                <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-white">
                    {/* Theater Mode Video Container */}
                    <div className="w-full bg-black relative aspect-video max-h-[70vh] flex items-center justify-center">
                        {currentModule?.type === 'video' ? (
                            <ReactPlayer
                                url={currentModule.url}
                                width="100%"
                                height="100%"
                                controls={true}
                                playing={true}
                                onEnded={handleVideoEnded}
                                config={{
                                    youtube: { playerVars: { showinfo: 0 } }
                                }}
                            />
                        ) : (
                            <div className="text-center text-white p-8">
                                <FileText size={48} className="mx-auto mb-4 text-primary-400" />
                                <h3 className="text-xl font-bold">Document Lesson</h3>
                                <p className="text-primary-400 mb-6">This lesson involves reading material.</p>
                                <a 
                                    href={currentModule?.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-6 py-2 bg-brand hover:bg-brand-hover text-white rounded-lg font-medium transition-colors"
                                >
                                    Open Document
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Lesson Details & Tabs */}
                    <div className="max-w-4xl mx-auto w-full p-6">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-primary-900 mb-2">{currentModule?.title}</h2>
                                <p className="text-primary-500 text-sm">
                                    Lesson {course.modules.findIndex(m => m.id === currentModule.id) + 1} of {course.modules.length}
                                </p>
                            </div>
                            <button
                                onClick={() => handleMarkComplete()}
                                disabled={isModuleCompleted(currentModule.id)}
                                className={`
                                    flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all
                                    ${isModuleCompleted(currentModule.id) 
                                        ? 'bg-success/10 text-success cursor-default' 
                                        : 'bg-primary-900 text-white hover:bg-primary-800 shadow-lg shadow-primary-900/20'}
                                `}
                            >
                                {isModuleCompleted(currentModule.id) ? (
                                    <><CheckCircle size={18} /> Completed</>
                                ) : (
                                    <>Mark Complete</>
                                )}
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-primary-200 mb-6">
                            <div className="flex gap-6">
                                <button 
                                    onClick={() => setActiveTab('overview')}
                                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-brand text-brand' : 'border-transparent text-primary-500 hover:text-primary-900'}`}
                                >
                                    Overview
                                </button>
                                <button 
                                    onClick={() => setActiveTab('resources')}
                                    className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'resources' ? 'border-brand text-brand' : 'border-transparent text-primary-500 hover:text-primary-900'}`}
                                >
                                    Resources
                                </button>
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="prose prose-slate max-w-none">
                            {activeTab === 'overview' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2">
                                    <h3 className="text-lg font-semibold text-primary-900 mb-2">About this lesson</h3>
                                    <p className="text-primary-600 leading-relaxed">
                                        {currentModule?.description || "No description provided for this lesson."}
                                    </p>
                                    {currentModule?.notes && (
                                        <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
                                            <h4 className="flex items-center gap-2 text-sm font-bold text-primary-900 uppercase tracking-wide mb-2">
                                                <MessageSquare size={16} /> Instructor Notes
                                            </h4>
                                            <p className="text-primary-700 text-sm">{currentModule.notes}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'resources' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                                    {currentModule?.pdfUrl ? (
                                        <a href={currentModule.pdfUrl} target="_blank" rel="noreferrer" className="flex items-center p-4 bg-white border border-primary-200 rounded-xl hover:border-brand hover:shadow-md transition-all group">
                                            <div className="p-3 bg-red-50 text-red-600 rounded-lg group-hover:bg-red-100 transition-colors">
                                                <FileText size={24} />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h4 className="font-semibold text-primary-900">Lesson Material</h4>
                                                <p className="text-sm text-primary-500">PDF Document</p>
                                            </div>
                                            <Download size={20} className="text-primary-400 group-hover:text-brand" />
                                        </a>
                                    ) : (
                                        <div className="text-center py-8 text-primary-400 bg-primary-50 rounded-xl border border-dashed border-primary-200">
                                            No downloadable resources for this lesson.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Right Sidebar (Curriculum) */}
                <aside className={`
                    absolute inset-y-0 right-0 z-30 w-80 bg-white border-l border-primary-200 transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
                    lg:relative lg:translate-x-0 lg:block flex flex-col
                `}>
                    <div className="p-5 border-b border-primary-200 bg-primary-50/50">
                        <h3 className="font-bold text-primary-900">Course Content</h3>
                        <p className="text-xs text-primary-500 mt-1">
                            {completedModuleIds.length} / {course.modules?.length} Completed
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {course.modules?.map((module, index) => {
                            const isActive = currentModule?.id === module.id;
                            const isCompleted = isModuleCompleted(module.id);

                            return (
                                <button
                                    key={module.id}
                                    onClick={() => {
                                        setCurrentModule(module);
                                        // On mobile, close sidebar after selection
                                        if (window.innerWidth < 1024) setSidebarOpen(false);
                                    }}
                                    className={`
                                        w-full flex items-start gap-3 p-4 border-b border-primary-100 text-left transition-colors hover:bg-primary-50
                                        ${isActive ? 'bg-primary-50 border-l-4 border-l-brand' : 'border-l-4 border-l-transparent'}
                                    `}
                                >
                                    <div className="mt-0.5">
                                        {isCompleted ? (
                                            <CheckCircle size={18} className="text-success" />
                                        ) : isActive ? (
                                            <PlayCircle size={18} className="text-brand" />
                                        ) : (
                                            <div className="w-[18px] h-[18px] rounded-full border-2 border-primary-300" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium mb-1 ${isActive ? 'text-primary-900' : 'text-primary-600'}`}>
                                            {index + 1}. {module.title}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-primary-400">
                                            {module.type === 'video' ? <PlayCircle size={12} /> : <FileText size={12} />}
                                            <span>{module.duration}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-primary-200 bg-primary-50">
                         <button
                            onClick={() => navigate(`/student/exam/final_${courseId}`)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-brand text-brand font-bold rounded-lg hover:bg-brand hover:text-white transition-all shadow-sm"
                        >
                            <Award size={18} />
                            Take Final Exam
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CoursePlayer;
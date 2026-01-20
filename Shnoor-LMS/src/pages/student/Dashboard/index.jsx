import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Flame, 
  Clock, 
  Calendar, 
  ChevronRight, 
  BookOpen,
  Award,
  Zap
} from 'lucide-react';
import { auth, db } from '../../../auth/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { checkDailyStreak, getRank, getNextLevelProgress } from '../../../utils/gamification';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [enrolledCount, setEnrolledCount] = useState(0);
    const [lastCourse, setLastCourse] = useState(null);
    const [gamification, setGamification] = useState({
        xp: 0,
        rank: 'Novice',
        streak: 0,
        progress: 0,
        nextLevelXP: 100
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            const enrolled = JSON.parse(localStorage.getItem('enrolledCourses')) || [];
            setEnrolledCount(enrolled.length);

            // Simulate "Last Accessed" course
            if (enrolled.length > 0) {
                setLastCourse({
                    id: enrolled[enrolled.length - 1],
                    title: 'Advanced React Patterns', // In real app, fetch this title
                    category: 'Web Development',
                    progress: 45,
                    totalLessons: 12,
                    completedLessons: 5
                });
            }

            if (auth.currentUser) {
                try {
                    const userRef = doc(db, "users", auth.currentUser.uid);
                    const currentStreak = await checkDailyStreak(auth.currentUser.uid);
                    const docSnap = await getDoc(userRef);
                    
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const currentXP = data.xp || 0;
                        const rankObj = getRank(currentXP);
                        const levelProgress = getNextLevelProgress(currentXP);

                        setGamification({
                            xp: currentXP,
                            rank: rankObj.name,
                            streak: currentStreak,
                            progress: levelProgress.progress,
                            nextLevelXP: levelProgress.nextLevelXP
                        });
                    }
                } catch (e) {
                    console.log("Error fetching stats", e);
                }
            }
        };

        fetchDashboardData();
    }, []);

    const studentName = auth.currentUser?.displayName || 'Student';

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900">Welcome back, {studentName}! 👋</h1>
                    <p className="text-primary-500 mt-1">You have {enrolledCount} active courses in progress.</p>
                </div>
            </div>

            {/* Hero Section: Resume Learning */}
            {lastCourse ? (
                <div className="relative overflow-hidden rounded-2xl bg-primary-900 text-white shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800/50 z-0"></div>
                    <div className="absolute right-0 top-0 h-full w-1/3 bg-brand/10 skew-x-12 transform origin-top-right"></div>
                    
                    <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-brand-light backdrop-blur-sm border border-white/10">
                                <Zap size={12} className="fill-current" />
                                <span>Continue where you left off</span>
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-2">{lastCourse.title}</h2>
                                <p className="text-primary-300">{lastCourse.category} • {lastCourse.progress}% Complete</p>
                            </div>
                            
                            <div className="w-full max-w-md h-2 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-brand rounded-full" style={{ width: `${lastCourse.progress}%` }}></div>
                            </div>
                            
                            <button 
                                onClick={() => navigate(`/student/course/${lastCourse.id}/learn`)}
                                className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold transition-all shadow-lg shadow-brand/20"
                            >
                                <Play size={18} className="fill-current" /> Resume Lesson
                            </button>
                        </div>
                        
                        <div className="hidden md:flex items-center justify-center w-32 h-32 rounded-full bg-white/5 border-4 border-white/10 backdrop-blur-sm relative">
                            <Play size={40} className="ml-2 text-white fill-current" />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-8 rounded-2xl bg-white border border-primary-200 text-center shadow-sm">
                    <BookOpen size={48} className="mx-auto text-primary-300 mb-4" />
                    <h3 className="text-xl font-bold text-primary-900">Start your learning journey</h3>
                    <p className="text-primary-500 mb-6 max-w-md mx-auto">Explore our catalog of professional courses and start building your skills today.</p>
                    <button 
                        onClick={() => navigate('/student/courses')}
                        className="px-6 py-2 bg-brand text-white rounded-lg font-medium hover:bg-brand-hover transition-colors"
                    >
                        Browse Courses
                    </button>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-primary-200 shadow-sm flex items-center justify-between hover:border-brand-light transition-colors group">
                    <div>
                        <p className="text-sm font-medium text-primary-500">Daily Streak</p>
                        <h3 className="text-2xl font-bold text-primary-900 mt-1">{gamification.streak} Days</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                        <Flame size={24} className={gamification.streak > 0 ? "fill-current" : ""} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-primary-200 shadow-sm flex items-center justify-between hover:border-brand-light transition-colors group">
                    <div>
                        <p className="text-sm font-medium text-primary-500">Current Rank</p>
                        <h3 className="text-2xl font-bold text-primary-900 mt-1">{gamification.rank}</h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                        <Award size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-primary-200 shadow-sm hover:border-brand-light transition-colors group">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm font-medium text-primary-500">Level Progress</p>
                        <span className="text-xs font-bold text-brand">{gamification.xp} / {gamification.nextLevelXP} XP</span>
                    </div>
                    <div className="w-full h-2 bg-primary-100 rounded-full overflow-hidden mt-3">
                        <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width: `${gamification.progress}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Deadlines & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-primary-900 text-lg">Upcoming Deadlines</h3>
                        <button className="text-sm text-brand font-medium hover:underline">View Calendar</button>
                    </div>
                    <div className="space-y-3">
                        {[
                            { title: 'React Final Project', subject: 'Web Development', due: 'Tomorrow', urgent: true },
                            { title: 'DevOps Quiz', subject: 'DevOps', due: 'Jan 15', urgent: false },
                            { title: 'UX Case Study', subject: 'Design', due: 'Jan 20', urgent: false }
                        ].map((task, i) => (
                            <div key={i} className="flex items-center p-4 bg-white border border-primary-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${task.urgent ? 'bg-red-50 text-red-500' : 'bg-primary-50 text-primary-500'}`}>
                                    {task.urgent ? <Clock size={20} /> : <Calendar size={20} />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-primary-900 text-sm">{task.title}</h4>
                                    <p className="text-xs text-primary-500">{task.subject}</p>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded-md ${task.urgent ? 'bg-red-100 text-red-700' : 'bg-primary-100 text-primary-700'}`}>
                                    {task.due}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-primary-900 text-lg">My Learning Paths</h3>
                        <button className="text-sm text-brand font-medium hover:underline">View All</button>
                    </div>
                    <div className="bg-white border border-primary-200 rounded-xl p-1 shadow-sm">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-8 bg-primary-200 rounded md:w-16 md:h-10"></div> {/* Placeholder for thumbnail */}
                                    <div>
                                        <h4 className="font-medium text-primary-900 text-sm group-hover:text-brand transition-colors">Full Stack Bootcamp</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="w-16 h-1.5 bg-primary-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-success w-2/3"></div>
                                            </div>
                                            <span className="text-[10px] text-primary-500">65%</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-primary-300 group-hover:text-brand" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
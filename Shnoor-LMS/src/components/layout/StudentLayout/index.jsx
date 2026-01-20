import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import { useSocket } from '../../../context/SocketContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Award, 
  Trophy, 
  MessageSquare, 
  Code, 
  Menu, 
  LogOut, 
  Bell,
  Search,
  Zap,
  Star
} from 'lucide-react';
import markLogo from '../../../assets/just_logo.jpeg';
import { db } from '../../../auth/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getRank } from '../../../utils/gamification';

const StudentLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, logout } = useAuth();
    const [xp, setXp] = useState(0);
    const [rank, setRank] = useState('Novice');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Socket / Unread Logic
    const { unreadCounts = {} } = useSocket() || {};
    const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                try {
                    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setXp(data.xp || 0);
                        const rankObj = getRank(data.xp || 0);
                        setRank(rankObj.name);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };
        fetchUserData();
    }, [currentUser]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const studentName = currentUser?.displayName || "Student";

    const NavItem = ({ path, icon: Icon, label, badge }) => {
        const isActive = location.pathname.includes(path);
        return (
            <button
                onClick={() => {
                    navigate(`/student/${path}`);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`
                    flex items-center w-full gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group
                    ${isActive 
                        ? 'bg-brand-light text-brand-hover' 
                        : 'text-primary-500 hover:bg-primary-50 hover:text-primary-900'}
                `}
            >
                <div className="relative">
                    <Icon size={20} className={isActive ? 'text-brand-hover' : 'text-primary-400 group-hover:text-primary-900'} />
                    {badge > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                            {badge}
                        </span>
                    )}
                </div>
                <span>{label}</span>
            </button>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background font-sans">
            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-primary-200 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:relative lg:translate-x-0
            `}>
                <div className="flex flex-col h-full">
                    {/* Brand */}
                    <div className="flex items-center gap-3 px-6 h-16 border-b border-primary-100">
                        <img src={markLogo} alt="Logo" className="w-8 h-8 rounded-md object-cover" />
                        <div>
                            <h1 className="text-lg font-bold text-primary-900 leading-tight">SHNOOR</h1>
                            <p className="text-[10px] font-semibold text-primary-400 tracking-wider uppercase">Learning Hub</p>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
                        <div>
                            <p className="px-4 mb-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">Menu</p>
                            <div className="space-y-1">
                                <NavItem path="dashboard" icon={LayoutDashboard} label="Dashboard" />
                                <NavItem path="courses" icon={BookOpen} label="My Courses" />
                                <NavItem path="chat" icon={MessageSquare} label="Messages" badge={totalUnread} />
                            </div>
                        </div>

                        <div>
                            <p className="px-4 mb-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">Growth</p>
                            <div className="space-y-1">
                                <NavItem path="practice" icon={Code} label="Practice Arena" />
                                <NavItem path="exams" icon={Award} label="Exams" />
                                <NavItem path="certificates" icon={Trophy} label="Certificates" />
                            </div>
                        </div>
                    </nav>

                    {/* User Footer */}
                    <div className="p-4 border-t border-primary-100">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50">
                            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-hover font-bold text-lg">
                                {studentName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-primary-900 truncate">{studentName}</p>
                                <p className="text-xs text-primary-500 truncate">{currentUser?.email}</p>
                            </div>
                            <button onClick={handleLogout} className="text-primary-400 hover:text-danger transition-colors">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-primary-200 flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 text-primary-500 hover:bg-primary-50 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        {/* Gamification Pill */}
                        <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-primary-50 rounded-full border border-primary-100">
                            <div className="flex items-center gap-2 text-xs font-bold text-primary-700 uppercase tracking-wider border-r border-primary-200 pr-4">
                                <Trophy size={14} className="text-amber-500" />
                                {rank}
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold text-primary-900">
                                <Star size={14} className="text-yellow-400 fill-current" />
                                {xp} XP
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                className="pl-10 pr-4 py-2 bg-primary-50 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-brand-light transition-all"
                            />
                        </div>
                        <button className="relative p-2 text-primary-400 hover:text-primary-600 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-8">
                    <Outlet context={{ studentName, xp }} />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import { useSocket } from '../../../context/SocketContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  Bell, 
  Search 
} from 'lucide-react';
import markLogo from '../../../assets/just_logo.jpeg';

const InstructorLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, logout } = useAuth();
    const { unreadCounts } = useSocket() || {}; 
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const totalUnread = unreadCounts ? Object.values(unreadCounts).reduce((a, b) => a + b, 0) : 0;
    const instructorName = currentUser?.displayName || "Instructor";

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const NavItem = ({ path, icon: Icon, label, badge }) => {
        const isActive = location.pathname.includes(path);
        return (
            <button
                onClick={() => {
                    navigate(`/instructor/${path}`);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`
                    flex items-center w-full gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg group
                    ${isActive 
                        ? 'bg-brand-50 text-brand-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
            >
                <div className="relative">
                    <Icon size={18} className={isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'} />
                    {badge > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                            {badge}
                        </span>
                    )}
                </div>
                <span>{label}</span>
            </button>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:relative lg:translate-x-0
            `}>
                <div className="flex flex-col h-full">
                    {/* Brand */}
                    <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100">
                        <img src={markLogo} alt="Logo" className="w-8 h-8 rounded-md object-cover" />
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">SHNOOR</h1>
                            <p className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">Instructor Console</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
                        <div>
                            <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Overview</p>
                            <div className="space-y-1">
                                <NavItem path="dashboard" icon={LayoutDashboard} label="Dashboard" />
                                <NavItem path="performance" icon={Users} label="Student Analytics" />
                            </div>
                        </div>

                        <div>
                            <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Course Management</p>
                            <div className="space-y-1">
                                <NavItem path="courses" icon={BookOpen} label="My Courses" />
                                <NavItem path="exams" icon={FileText} label="Exam Builder" />
                                <NavItem path="chat" icon={MessageSquare} label="Messages" badge={totalUnread} />
                            </div>
                        </div>

                        <div>
                            <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">System</p>
                            <div className="space-y-1">
                                <NavItem path="settings" icon={Settings} label="Settings" />
                            </div>
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
                                {instructorName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{instructorName}</p>
                                <p className="text-xs text-slate-500 truncate">Instructor</p>
                            </div>
                            <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="text-lg font-semibold text-slate-800">Workspace</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search courses or students..." 
                                className="pl-9 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-brand-500 transition-all"
                            />
                        </div>
                        <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default InstructorLayout;
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
// Using Lucide React for a cleaner, thin-stroke look
import { 
  LayoutDashboard, 
  Users, 
  FileCheck, 
  GraduationCap, 
  Award, 
  Settings, 
  UserPlus, 
  Menu, 
  LogOut, 
  Search,
  Bell
} from 'lucide-react';
import markLogo from '../../../assets/just_logo.jpeg';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentUser, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop

    const adminName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Admin';

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const NavItem = ({ path, icon: Icon, label }) => {
        const isActive = location.pathname.includes(path);
        return (
            <button
                onClick={() => navigate(`/admin/${path}`)}
                className={`
                    flex items-center w-full gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg group
                    ${isActive 
                        ? 'bg-brand-light text-brand-hover' 
                        : 'text-primary-500 hover:bg-primary-50 hover:text-primary-900'}
                `}
            >
                <Icon size={20} className={isActive ? 'text-brand-hover' : 'text-primary-400 group-hover:text-primary-900'} />
                <span>{label}</span>
            </button>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            
            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-primary-200 transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:relative lg:translate-x-0
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo Area */}
                    <div className="flex items-center gap-3 px-6 h-16 border-b border-primary-100">
                        <img src={markLogo} alt="Logo" className="w-8 h-8 rounded-md object-cover" />
                        <div>
                            <h1 className="text-lg font-bold text-primary-900 leading-tight">SHNOOR</h1>
                            <p className="text-[10px] font-semibold text-primary-400 tracking-wider uppercase">Admin Console</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
                        <div>
                            <p className="px-4 mb-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">Overview</p>
                            <div className="space-y-1">
                                <NavItem path="dashboard" icon={LayoutDashboard} label="Dashboard" />
                                <NavItem path="add-instructor" icon={UserPlus} label="Add Instructor" />
                            </div>
                        </div>

                        <div>
                            <p className="px-4 mb-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">Management</p>
                            <div className="space-y-1">
                                <NavItem path="manage-users" icon={Users} label="Users" />
                                <NavItem path="approve-courses" icon={FileCheck} label="Approve Courses" />
                                <NavItem path="assign-course" icon={GraduationCap} label="Assign Courses" />
                                <NavItem path="certificates" icon={Award} label="Certificates" />
                            </div>
                        </div>

                        <div>
                            <p className="px-4 mb-2 text-xs font-semibold text-primary-400 uppercase tracking-wider">System</p>
                            <div className="space-y-1">
                                <NavItem path="settings" icon={Settings} label="Settings" />
                            </div>
                        </div>
                    </nav>

                    {/* User Profile Footer */}
                    <div className="p-4 border-t border-primary-100">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary-50">
                            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-hover font-bold text-lg">
                                {adminName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-primary-900 truncate">{adminName}</p>
                                <p className="text-xs text-primary-500 truncate">Super Admin</p>
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
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-primary-200 flex items-center justify-between px-4 lg:px-8">
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 text-primary-500 hover:bg-primary-50 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Search Bar (Visual Only for Phase 1) */}
                    <div className="hidden lg:flex items-center flex-1 max-w-lg mx-4">
                        <div className="relative w-full group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400 group-focus-within:text-brand-hover transition-colors" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search users, courses, or settings..." 
                                className="w-full pl-10 pr-4 py-2 bg-primary-50 border-none rounded-lg focus:ring-2 focus:ring-brand-light focus:bg-white transition-all text-sm text-primary-900 placeholder-primary-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-primary-400 hover:text-primary-600 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
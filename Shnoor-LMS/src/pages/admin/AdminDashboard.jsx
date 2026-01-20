import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShieldCheck, BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../auth/firebase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingInstructors: 0,
        activeCourses: 0,
        pendingCourses: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Parallel fetching for speed
                const [usersSnap, pendingUsersSnap, coursesSnap, pendingCoursesSnap] = await Promise.all([
                    getDocs(collection(db, "users")),
                    getDocs(query(collection(db, "users"), where("accountStatus", "==", "pending"))),
                    getDocs(collection(db, "courses")),
                    getDocs(query(collection(db, "courses"), where("status", "==", "pending")))
                ]);

                setStats({
                    totalUsers: usersSnap.size,
                    pendingInstructors: pendingUsersSnap.size,
                    activeCourses: coursesSnap.size,
                    pendingCourses: pendingCoursesSnap.size
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Mock Chart Data
    const data = [
        { name: 'Mon', users: 120 },
        { name: 'Tue', users: 132 },
        { name: 'Wed', users: 101 },
        { name: 'Thu', users: 134 },
        { name: 'Fri', users: 190 },
        { name: 'Sat', users: 230 },
        { name: 'Sun', users: 210 },
    ];

    if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard 
                    label="Total Users" 
                    value={stats.totalUsers} 
                    icon={Users} 
                    color="blue" 
                />
                <StatCard 
                    label="Pending Approvals" 
                    value={stats.pendingInstructors} 
                    icon={ShieldCheck} 
                    color="amber" 
                    onClick={() => navigate('/admin/approve-users')}
                />
                <StatCard 
                    label="Active Courses" 
                    value={stats.activeCourses} 
                    icon={BookOpen} 
                    color="purple" 
                />
                <StatCard 
                    label="Content Review" 
                    value={stats.pendingCourses} 
                    icon={AlertCircle} 
                    color="red" 
                    onClick={() => navigate('/admin/approve-courses')}
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Chart - FIXED: Added explicit height to container */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">Platform Growth</h3>
                    <div className="h-[300px] w-full"> 
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip />
                                <Area type="monotone" dataKey="users" stroke="#8884d8" fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                    <h3 className="font-bold text-slate-800 mb-4">System Health</h3>
                    <div className="space-y-4">
                        <HealthItem label="Database Status" status="Healthy" />
                        <HealthItem label="Storage Service" status="Operational" />
                        <HealthItem label="Auth Gateway" status="Operational" />
                        <HealthItem label="API Latency" status="24ms" />
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <button 
                            onClick={() => navigate('/admin/add-instructor')}
                            className="w-full py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
                        >
                            Add New Instructor
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color, onClick }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        purple: 'bg-purple-50 text-purple-600',
        red: 'bg-red-50 text-red-600'
    };

    return (
        <div 
            onClick={onClick}
            className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all ${onClick ? 'cursor-pointer hover:border-slate-300 hover:shadow-md' : ''}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-500 text-sm font-medium">{label}</p>
                    <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colors[color]}`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};

const HealthItem = ({ label, status }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-slate-600">{label}</span>
        <div className="flex items-center gap-2 text-green-600 font-medium">
            <CheckCircle size={14} /> {status}
        </div>
    </div>
);

export default AdminDashboard;
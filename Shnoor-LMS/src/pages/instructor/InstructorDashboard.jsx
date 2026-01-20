import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Star, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { auth, db } from '../../auth/firebase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    myCourses: 0,
    totalStudents: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Instructor');

  // Mock Data for the Chart (Replace with real analytics later)
  const chartData = [
    { name: 'Mon', students: 40 },
    { name: 'Tue', students: 65 },
    { name: 'Wed', students: 50 },
    { name: 'Thu', students: 85 },
    { name: 'Fri', students: 100 },
    { name: 'Sat', students: 120 },
    { name: 'Sun', students: 140 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      if (!auth.currentUser) return;
      setUserName(auth.currentUser.displayName || "Instructor");

      try {
        const q = query(collection(db, "courses"), where("instructorId", "==", auth.currentUser.uid));
        const snapshot = await getCountFromServer(q);
        
        setStats({
          myCourses: snapshot.data().count,
          totalStudents: 142, // Mock for now, would require sub-collection query
          avgRating: 4.8
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Welcome back, {userName}. Here is your daily briefing.</p>
        </div>
        <button 
          onClick={() => navigate('/instructor/add-course')}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-brand-200"
        >
          <Plus size={18} />
          Create New Course
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Total Students" 
          value={stats.totalStudents} 
          icon={Users} 
          trend="+12% this week"
          color="blue"
        />
        <StatCard 
          label="Active Courses" 
          value={stats.myCourses} 
          icon={BookOpen} 
          trend="2 Pending Approval"
          color="indigo"
        />
        <StatCard 
          label="Average Rating" 
          value={stats.avgRating} 
          icon={Star} 
          trend="Based on 45 reviews"
          color="amber"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-900">Student Engagement</h3>
            <select className="bg-slate-50 border-none text-sm rounded-md px-3 py-1 text-slate-600 focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last Month</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0B2F4E" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0B2F4E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="students" stroke="#0B2F4E" strokeWidth={2} fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Recent */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button onClick={() => navigate('/instructor/exams')} className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                <span className="text-sm font-medium text-slate-700">Create Assessment</span>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-brand-600" />
              </button>
              <button onClick={() => navigate('/instructor/chat')} className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                <span className="text-sm font-medium text-slate-700">Broadcast Message</span>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-brand-600" />
              </button>
              <button onClick={() => navigate('/instructor/performance')} className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors group">
                <span className="text-sm font-medium text-slate-700">Download Reports</span>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-brand-600" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, trend, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    amber: 'bg-amber-50 text-amber-600'
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs font-medium text-slate-500">
        <TrendingUp size={14} className="mr-1 text-green-500" />
        {trend}
      </div>
    </div>
  );
};

export default InstructorDashboard;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, User, BookOpen, ArrowLeft, Loader2 } from 'lucide-react';

const AddInstructor = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', subject: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API
        setTimeout(() => {
            alert(`Instructor invite sent to ${formData.email}`);
            setLoading(false);
            navigate('/admin/dashboard');
        }, 1000);
    };

    return (
        <div className="max-w-xl mx-auto pt-10">
            <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 text-sm font-medium transition-colors">
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50">
                    <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 mb-4">
                        <UserPlus size={24} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Add New Instructor</h2>
                    <p className="text-slate-500 text-sm mt-1">Send an invitation to a new faculty member.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="Dr. Jane Smith"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="instructor@university.edu"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Subject / Department</label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                required
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                placeholder="Computer Science"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Send Invitation'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddInstructor;
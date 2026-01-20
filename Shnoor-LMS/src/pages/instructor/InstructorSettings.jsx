import React, { useState, useEffect } from 'react';
import { User, Lock, Save, Camera, Mail, Phone, BookOpen, AlertCircle } from 'lucide-react';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../../auth/firebase';

const InstructorSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        displayName: '',
        bio: '',
        email: '',
        phone: '',
        specialization: ''
    });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        if (auth.currentUser) {
            setProfile({
                displayName: auth.currentUser.displayName || 'Instructor',
                bio: 'Experienced educator passionate about technology.',
                email: auth.currentUser.email,
                phone: '+1 (555) 000-0000',
                specialization: 'Computer Science'
            });
            setLoading(false);
        }
    }, []);

    const handleSave = () => {
        alert("Profile updated successfully!");
    };

    const handlePasswordChange = async () => {
        if (passwords.new !== passwords.confirm) return alert("Passwords do not match");
        try {
            const credential = EmailAuthProvider.credential(auth.currentUser.email, passwords.current);
            await reauthenticateWithCredential(auth.currentUser, credential);
            await updatePassword(auth.currentUser, passwords.new);
            alert("Password updated!");
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (e) {
            alert("Failed to update password. Check current password.");
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-500">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <h1 className="text-2xl font-bold text-slate-900">Instructor Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="space-y-1">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <User size={18} /> Public Profile
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Lock size={18} /> Security
                    </button>
                </div>

                {/* Content */}
                <div className="md:col-span-3">
                    {activeTab === 'profile' && (
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center text-2xl font-bold text-brand-600">
                                        {profile.displayName.charAt(0)}
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-1.5 bg-white border border-slate-200 rounded-full text-slate-600 shadow-sm hover:text-brand-600">
                                        <Camera size={14} />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{profile.displayName}</h3>
                                    <p className="text-sm text-slate-500">Instructor</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Display Name</label>
                                    <input value={profile.displayName} onChange={e => setProfile({...profile, displayName: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Specialization</label>
                                    <div className="relative">
                                        <BookOpen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input value={profile.specialization} onChange={e => setProfile({...profile, specialization: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input disabled value={profile.email} className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-sm text-slate-500 cursor-not-allowed" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Bio</label>
                                    <textarea rows={3} value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors">
                                    <Save size={18} /> Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                            <h3 className="font-bold text-slate-900">Change Password</h3>
                            <div className="space-y-4 max-w-md">
                                <input type="password" placeholder="Current Password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                <input type="password" placeholder="New Password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                <input type="password" placeholder="Confirm New Password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" />
                                <button onClick={handlePasswordChange} className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors text-sm">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InstructorSettings;
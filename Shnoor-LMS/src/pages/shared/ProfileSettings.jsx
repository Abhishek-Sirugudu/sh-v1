import React, { useState, useEffect } from 'react';
import { User, Mail, Link as LinkIcon, Github, Linkedin, Save, Camera, Lock, Bell } from 'lucide-react';
import { auth, db } from '../../auth/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ProfileSettings = () => {
    const [activeTab, setActiveTab] = useState('general'); // general | social | security
    const [userData, setUserData] = useState({
        displayName: '',
        email: '',
        bio: '',
        headline: '',
        linkedin: '',
        github: '',
        role: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!auth.currentUser) return;
            try {
                const docRef = doc(db, "users", auth.currentUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserData({
                        displayName: data.displayName || auth.currentUser.displayName || '',
                        email: auth.currentUser.email || '',
                        role: data.role || 'User',
                        bio: data.bio || '',
                        headline: data.headline || '',
                        linkedin: data.linkedin || '',
                        github: data.github || ''
                    });
                }
            } catch (error) {
                console.error("Error loading profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!auth.currentUser) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                displayName: userData.displayName,
                bio: userData.bio,
                headline: userData.headline,
                linkedin: userData.linkedin,
                github: userData.github,
                updatedAt: new Date().toISOString()
            });
            // Simulate delay for UX
            setTimeout(() => setSaving(false), 800);
        } catch (error) {
            console.error("Error saving profile:", error);
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-3 space-y-1">
                    <button 
                        onClick={() => setActiveTab('general')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'general' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <User size={18} /> General
                    </button>
                    <button 
                        onClick={() => setActiveTab('social')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'social' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <LinkIcon size={18} /> Social Links
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${activeTab === 'security' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                        <Lock size={18} /> Security
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-9 space-y-6">
                    
                    {/* General Tab */}
                    {activeTab === 'general' && (
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-full bg-brand-100 flex items-center justify-center text-2xl font-bold text-brand-600">
                                        {userData.displayName?.charAt(0) || 'U'}
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-1.5 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition-colors shadow-sm">
                                        <Camera size={14} />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{userData.displayName || 'User'}</h3>
                                    <p className="text-sm text-slate-500">{userData.role}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input 
                                        name="displayName" 
                                        value={userData.displayName} 
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
                                    <input 
                                        name="headline" 
                                        value={userData.headline} 
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" 
                                        placeholder="e.g. Senior Developer"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Bio</label>
                                    <textarea 
                                        name="bio" 
                                        value={userData.bio} 
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none" 
                                        placeholder="Tell us a bit about yourself..."
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                    <div className="flex items-center px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-sm">
                                        <Mail size={16} className="mr-2" />
                                        {userData.email}
                                        <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Social Tab */}
                    {activeTab === 'social' && (
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4">Social Profiles</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">GitHub Profile</label>
                                    <div className="relative">
                                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            name="github" 
                                            value={userData.github} 
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" 
                                            placeholder="https://github.com/username"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn Profile</label>
                                    <div className="relative">
                                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            name="linkedin" 
                                            value={userData.linkedin} 
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none" 
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab Placeholder */}
                    {activeTab === 'security' && (
                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-4">Security Settings</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div>
                                        <h4 className="font-medium text-slate-900 text-sm">Password</h4>
                                        <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                                    </div>
                                    <button className="px-3 py-1.5 bg-white border border-slate-300 rounded text-xs font-medium hover:bg-slate-50">Change</button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div>
                                        <h4 className="font-medium text-slate-900 text-sm">Two-Factor Authentication</h4>
                                        <p className="text-xs text-slate-500">Add an extra layer of security</p>
                                    </div>
                                    <button className="px-3 py-1.5 bg-brand-600 text-white border border-brand-600 rounded text-xs font-medium hover:bg-brand-700">Enable</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save Button Footer */}
                    <div className="flex justify-end pt-4">
                        <button 
                            onClick={handleSave} 
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-all shadow-sm disabled:opacity-70"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
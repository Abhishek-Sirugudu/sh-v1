import React from 'react';
import { Settings, Globe, Shield, Database, Bell } from 'lucide-react';

const ProfileManagement = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                    <Shield size={32} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">System Administration</h1>
                    <p className="text-slate-500">Manage global platform settings and preferences.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* General Settings */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Globe className="text-slate-400" />
                        <h3 className="font-bold text-slate-800">Regional Settings</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Timezone</label>
                            <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                                <option>Asia/Kolkata (GMT+05:30)</option>
                                <option>UTC (GMT+00:00)</option>
                                <option>America/New_York (GMT-05:00)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Language</label>
                            <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                                <option>English (US)</option>
                                <option>Hindi</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* System Health */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Database className="text-slate-400" />
                        <h3 className="font-bold text-slate-800">System Status</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-green-50 border border-green-100 rounded-lg">
                            <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Database Connection
                            </div>
                            <span className="text-xs text-green-700 font-bold">HEALTHY</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-green-50 border border-green-100 rounded-lg">
                            <div className="flex items-center gap-2 text-sm font-medium text-green-800">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Storage Service
                            </div>
                            <span className="text-xs text-green-700 font-bold">OPERATIONAL</span>
                        </div>
                    </div>
                </div>

                {/* Notification Config */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <Bell className="text-slate-400" />
                        <h3 className="font-bold text-slate-800">Notification Defaults</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['New User Registration', 'Course Submission', 'System Alerts'].map((item) => (
                            <label key={item} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-brand-600 rounded focus:ring-brand-500" />
                                <span className="text-sm font-medium text-slate-700">{item}</span>
                            </label>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <button className="px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors shadow-sm">
                            Save Changes
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProfileManagement;
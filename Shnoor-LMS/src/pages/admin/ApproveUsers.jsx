import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../auth/firebase';
import { UserCheck, UserX, Clock, Search, ShieldCheck } from 'lucide-react';

const ApproveUsers = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            const q = query(
                collection(db, "users"),
                where("accountStatus", "==", "pending")
            );
            const querySnapshot = await getDocs(q);
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push({ id: doc.id, ...doc.data() });
            });
            // Client-side sort by date (newest first)
            users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPendingUsers(users);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching pending users:", error);
            setLoading(false);
        }
    };

    const handleAction = async (userId, action, userName) => {
        const confirmMessage = action === 'active' 
            ? `Approve access for ${userName}?` 
            : `Reject access for ${userName}?`;

        if (!window.confirm(confirmMessage)) return;

        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                accountStatus: action === 'active' ? 'active' : 'rejected'
            });
            setPendingUsers(prev => prev.filter(user => user.id !== userId));
        } catch (error) {
            console.error(`Error ${action} user:`, error);
            alert("Failed to update user status.");
        }
    };

    const filteredUsers = pendingUsers.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="text-brand-600" /> User Approvals
                    </h1>
                    <p className="text-slate-500 mt-1">Review pending account requests.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none w-full md:w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role Requested</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Clock size={32} className="text-slate-300" />
                                        <span>No pending requests found.</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-900">{user.name || 'Unknown'}</span>
                                            <span className="text-xs text-slate-500">{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                                            user.role === 'instructor' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleAction(user.id, 'rejected', user.name)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Reject"
                                            >
                                                <UserX size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleAction(user.id, 'active', user.name)}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                title="Approve"
                                            >
                                                <UserCheck size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ApproveUsers;
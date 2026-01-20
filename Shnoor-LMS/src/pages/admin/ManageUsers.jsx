import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../auth/firebase';
import { Search, Ban, CheckCircle, Shield, GraduationCap, Briefcase, Filter } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const q = query(collection(db, "users"), orderBy("email"));
            const snapshot = await getDocs(q);
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(list);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, newStatus) => {
        if (!window.confirm(`Change status to ${newStatus}?`)) return;
        try {
            await updateDoc(doc(db, "users", userId), { accountStatus: newStatus });
            setUsers(users.map(u => u.id === userId ? { ...u, accountStatus: newStatus } : u));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              user.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const RoleBadge = ({ role }) => {
        const styles = {
            admin: 'bg-purple-100 text-purple-700',
            instructor: 'bg-blue-100 text-blue-700',
            student: 'bg-green-100 text-green-700',
            company: 'bg-orange-100 text-orange-700'
        };
        const icons = {
            admin: <Shield size={12} />,
            instructor: <Briefcase size={12} />,
            student: <GraduationCap size={12} />,
            company: <Briefcase size={12} />
        };
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${styles[role] || 'bg-slate-100 text-slate-700'}`}>
                {icons[role]} {role}
            </span>
        );
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading users...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-full md:w-64"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select 
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none cursor-pointer"
                        >
                            <option value="all">All Roles</option>
                            <option value="student">Students</option>
                            <option value="instructor">Instructors</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 mr-3">
                                            {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">{user.displayName || 'No Name'}</div>
                                            <div className="text-xs text-slate-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <RoleBadge role={user.role} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.accountStatus === 'active' ? 'text-green-700 bg-green-50' : user.accountStatus === 'suspended' ? 'text-red-700 bg-red-50' : 'text-amber-700 bg-amber-50'}`}>
                                        {user.accountStatus || 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {user.accountStatus === 'suspended' ? (
                                        <button onClick={() => handleStatusChange(user.id, 'active')} className="text-green-600 hover:text-green-800 font-medium text-xs flex items-center gap-1 ml-auto">
                                            <CheckCircle size={14} /> Activate
                                        </button>
                                    ) : (
                                        <button onClick={() => handleStatusChange(user.id, 'suspended')} className="text-red-600 hover:text-red-800 font-medium text-xs flex items-center gap-1 ml-auto" disabled={user.role === 'admin'}>
                                            <Ban size={14} /> Suspend
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
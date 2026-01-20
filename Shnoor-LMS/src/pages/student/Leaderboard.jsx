import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../auth/firebase';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            // Mocking for visual demo if DB empty
            const mockLeaders = [
                { id: '1', displayName: 'Sarah J.', xp: 2400 },
                { id: '2', displayName: 'Mike R.', xp: 2150 },
                { id: '3', displayName: 'Jessica T.', xp: 1980 },
                { id: '4', displayName: 'David B.', xp: 1750 },
                { id: '5', displayName: 'Emily W.', xp: 1600 },
            ];
            
            try {
                const q = query(collection(db, "users"), where("role", "==", "student"), orderBy("xp", "desc"), limit(10));
                const snapshot = await getDocs(q);
                const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                setLeaders(fetched.length > 0 ? fetched : mockLeaders);
            } catch (e) {
                setLeaders(mockLeaders);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const PodiumStep = ({ user, place }) => {
        if (!user) return null;
        const height = place === 1 ? 'h-40' : place === 2 ? 'h-32' : 'h-24';
        const color = place === 1 ? 'bg-yellow-400' : place === 2 ? 'bg-slate-300' : 'bg-amber-600';
        const icon = place === 1 ? <Crown className="text-yellow-500 mb-2" size={32} /> : null;

        return (
            <div className="flex flex-col items-center justify-end">
                {icon}
                <div className="mb-2 text-center">
                    <div className="font-bold text-slate-800 text-sm">{user.displayName}</div>
                    <div className="text-xs text-slate-500 font-mono">{user.xp} XP</div>
                </div>
                <div className={`w-24 ${height} ${color} rounded-t-lg shadow-lg flex items-start justify-center pt-2 text-white font-bold text-2xl border-t border-white/30`}>
                    {place}
                </div>
            </div>
        );
    };

    if (loading) return <div className="p-8 text-center">Loading rankings...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Student Leaderboard</h1>
                <p className="text-slate-500">Top performers this semester</p>
            </div>

            {/* Podium */}
            <div className="flex justify-center items-end gap-4 pb-8 border-b border-slate-200">
                <PodiumStep user={leaders[1]} place={2} />
                <PodiumStep user={leaders[0]} place={1} />
                <PodiumStep user={leaders[2]} place={3} />
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {leaders.slice(3).map((user, idx) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-8 text-center font-bold text-slate-400">#{idx + 4}</div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">
                                    {user.displayName?.[0]}
                                </div>
                                <span className="font-medium text-slate-700">{user.displayName}</span>
                            </div>
                        </div>
                        <div className="font-mono font-bold text-brand-600 text-sm">{user.xp} XP</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;
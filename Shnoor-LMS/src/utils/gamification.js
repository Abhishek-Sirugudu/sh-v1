import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../auth/firebase';

export const RANKS = [
    { name: 'Novice', minXP: 0, color: 'text-slate-600', bg: 'bg-slate-100', icon: '🌱' },
    { name: 'Apprentice', minXP: 100, color: 'text-blue-600', bg: 'bg-blue-100', icon: '🚀' },
    { name: 'Scholar', minXP: 500, color: 'text-indigo-600', bg: 'bg-indigo-100', icon: '💻' },
    { name: 'Master', minXP: 1000, color: 'text-purple-600', bg: 'bg-purple-100', icon: '⚙️' },
    { name: 'Grandmaster', minXP: 2500, color: 'text-yellow-600', bg: 'bg-yellow-100', icon: '👑' }
];

export const getRank = (xp) => {
    // Find the highest rank where xp >= minXP
    return RANKS.slice().reverse().find(r => xp >= r.minXP) || RANKS[0];
};

export const getNextLevelProgress = (xp) => {
    const currentRank = getRank(xp);
    const currentIndex = RANKS.findIndex(r => r.name === currentRank.name);
    const nextRank = RANKS[currentIndex + 1];

    if (!nextRank) return { progress: 100, nextLevelXP: 'Max' };

    const xpNeeded = nextRank.minXP - currentRank.minXP;
    const xpGained = xp - currentRank.minXP;
    const progress = Math.min(Math.round((xpGained / xpNeeded) * 100), 100);

    return { progress, nextLevelXP: nextRank.minXP };
};

export const awardXP = async (userId, amount, reason) => {
    if (!userId) return;
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            xp: increment(amount),
            lastXPAward: new Date().toISOString()
        });
        console.log(`🏆 Awarded ${amount} XP: ${reason}`);
        return true;
    } catch (error) {
        console.error("Error awarding XP:", error);
        return false;
    }
};

export const checkDailyStreak = async (userId) => {
    if (!userId) return 0;
    try {
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            const lastLogin = data.lastLoginDate;
            const today = new Date().toDateString();
            
            // Already logged in today
            if (lastLogin === today) return data.streak || 0;

            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            let currentStreak = data.streak || 0;
            
            if (lastLogin === yesterday.toDateString()) {
                currentStreak += 1;
            } else {
                currentStreak = 1; // Reset streak if missed a day
            }

            await updateDoc(userRef, {
                lastLoginDate: today,
                streak: currentStreak
            });

            return currentStreak;
        }
    } catch (error) {
        console.error("Error checking streak:", error);
    }
    return 0;
};
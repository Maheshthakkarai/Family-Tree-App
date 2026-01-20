import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, History, AlertCircle, Layout, Sparkles, Heart } from 'lucide-react';
import { useFamilyStore } from '../store/useFamilyStore';
import { parseISO } from 'date-fns';

interface DashboardProps {
    onViewTree: () => void;
    onViewRegistry: () => void;
    onAddMember: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewTree, onViewRegistry, onAddMember }) => {
    const activeFamily = useFamilyStore((state: any) =>
        state.families.find((f: any) => f.id === state.activeFamilyId) || state.families[0]
    );
    const people = activeFamily?.people || [];
    const familyName = activeFamily?.name || "Family";

    // Logic to find happy moments for living kin
    const happyMoment = useMemo(() => {
        const today = new Date();
        const livingPeople = people.filter((p: any) => p.lifeStatus === 'living');

        if (livingPeople.length === 0) return null;

        // 1. Check for Birthdays today
        const birthdayToday = livingPeople.find((p: any) => {
            if (!p.birthDate) return false;
            const bday = parseISO(p.birthDate);
            return bday.getMonth() === today.getMonth() && bday.getDate() === today.getDate();
        });

        if (birthdayToday) {
            return {
                type: 'birthday',
                person: birthdayToday,
                title: `${birthdayToday.firstName}'s Birthday`,
                description: `Today we celebrate ${birthdayToday.firstName} ${birthdayToday.lastName}! A perfect day to reach out and share a memory.`,
                icon: <Sparkles className="text-[#FFC107]" size={24} />
            };
        }

        // 2. Fallback: Living Spotlight (Randomly highlight a living relative)
        // We use a pseudo-random pick based on the day to keep it stable for 24 hours
        const seed = today.getFullYear() + today.getMonth() + today.getDate();
        const randomIndex = seed % livingPeople.length;
        const spotlighted = livingPeople[randomIndex];

        return {
            type: 'spotlight',
            person: spotlighted,
            title: `Generations Spotlight: ${spotlighted.firstName}`,
            description: `${spotlighted.firstName} is a vital part of the ${familyName} tapestry. ${spotlighted.bio ? spotlighted.bio.substring(0, 100) + '...' : 'Preserve more of their story today.'}`,
            icon: <Heart className="text-[#FFC107]" size={24} />
        };
    }, [people, familyName]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-serif text-[#FFC107] mb-2">Welcome Home, Curator.</h1>
                <p className="text-[#94a3b8]">The {familyName} archive currently preserves {people.length} life stories.</p>
            </header>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4 h-auto md:h-[600px]"
            >
                {/* Box 1: Large - Happy Moment / Spotlight */}
                <motion.div
                    variants={item}
                    className="md:col-span-2 md:row-span-2 glass-gold rounded-[32px] p-8 relative overflow-hidden group cursor-pointer"
                    onClick={onViewTree}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC107]/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-[#FFC107]/10 transition-colors" />

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="flex items-center gap-3 text-[#FFC107] mb-6">
                            {happyMoment?.icon || <History size={24} />}
                            <span className="uppercase tracking-[0.2em] text-xs font-bold">
                                {happyMoment?.type === 'birthday' ? 'Celebration' : 'Heritage Glimpse'}
                            </span>
                        </div>

                        {happyMoment ? (
                            <div className="mt-4">
                                <h2 className="text-5xl font-display mb-6 leading-tight">{happyMoment.title}</h2>
                                <p className="text-xl text-[#94a3b8] max-w-lg leading-relaxed italic font-serif">
                                    "{happyMoment.description}"
                                </p>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <h2 className="text-5xl font-display mb-4">Begin the Legacy</h2>
                                <p className="text-xl text-[#94a3b8] max-w-lg leading-relaxed">
                                    Your family archive is empty. Found your first connection and watch the tree grow.
                                </p>
                            </div>
                        )}

                        <div className="mt-auto flex items-center gap-4">
                            {happyMoment ? (
                                <>
                                    <div className="w-14 h-14 rounded-full border-2 border-[#FFC107] bg-[#1a1a1a] flex items-center justify-center text-[#FFC107] font-bold text-xl shadow-lg">
                                        {happyMoment.person.firstName[0]}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{happyMoment.person.firstName} {happyMoment.person.lastName}</p>
                                        <p className="text-white/40 text-xs tracking-widest uppercase">Living Kin</p>
                                    </div>
                                </>
                            ) : (
                                <button onClick={onAddMember} className="flex items-center gap-2 text-[#FFC107] font-bold text-sm uppercase tracking-widest border-b border-[#FFC107]/20 pb-1">
                                    Add First Member
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Box 2: Medium - Stats / Registry */}
                <motion.div
                    variants={item}
                    className="glass rounded-[32px] p-6 relative overflow-hidden group cursor-pointer"
                    onClick={onViewRegistry}
                >
                    <div className="flex items-center gap-3 text-blue-400 mb-4">
                        <Users size={20} />
                        <span className="uppercase tracking-[0.2em] text-xs font-bold">Registry Stats</span>
                    </div>
                    <div className="mb-6">
                        <div className="text-4xl font-display text-white mb-1">{people.length}</div>
                        <p className="text-xs text-[#94a3b8] uppercase tracking-widest">Total Members</p>
                    </div>
                    <div className="flex justify-between items-end">
                        <div className="flex -space-x-3">
                            {people.slice(0, 4).map((p: any) => (
                                <div key={p.id} className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">
                                    {p.firstName[0]}
                                </div>
                            ))}
                            {people.length > 4 && (
                                <div className="w-10 h-10 rounded-full border-2 border-[#1a1a1a] bg-white/10 flex items-center justify-center text-[10px] font-bold text-[#FFC107]">
                                    +{people.length - 4}
                                </div>
                            )}
                        </div>
                        <button className="text-xs uppercase tracking-widest text-[#FFC107] font-bold border-b border-[#FFC107]/30 pb-1">
                            Registry
                        </button>
                    </div>
                </motion.div>

                {/* Box 3: Small - Preservation */}
                <motion.div
                    variants={item}
                    className="glass-gold rounded-[32px] p-6 border-white/5 group cursor-pointer"
                    onClick={onAddMember}
                >
                    <div className="flex items-center gap-3 text-amber-400/60 mb-4">
                        <AlertCircle size={20} />
                        <span className="uppercase tracking-[0.2em] text-xs font-bold">Task</span>
                    </div>
                    <h3 className="text-lg font-serif mb-2">Chronicle More</h3>
                    <p className="text-xs text-[#94a3b8] leading-relaxed italic">
                        "Every memory added is a story saved for the future."
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-[#FFC107] text-sm font-semibold">
                        Add Relative <Layout size={14} />
                    </div>
                </motion.div>
            </motion.div>

            {/* Quick Actions */}
            <div className="mt-12 flex flex-wrap gap-4">
                <button
                    onClick={onViewTree}
                    className="px-8 py-4 bg-[#FFC107] text-[#1a1a1a] rounded-2xl font-bold flex items-center gap-3 hover:shadow-[0_0_15px_rgba(255,193,7,0.3)] transition-all"
                >
                    <Layout size={20} /> Open Visualizer
                </button>
                <button
                    onClick={onViewRegistry}
                    className="px-8 py-4 glass text-[#FFC107] rounded-2xl font-bold flex items-center gap-3 hover:bg-white/5 transition-all"
                >
                    <BookOpen size={20} /> Family Registry
                </button>
            </div>
        </div>
    );
};

export default Dashboard;


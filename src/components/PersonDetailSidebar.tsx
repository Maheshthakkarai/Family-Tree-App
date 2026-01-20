import { X, Calendar, Briefcase, Trash2, Edit3, Heart } from 'lucide-react';
import { useFamilyStore } from '../store/useFamilyStore';
import { format, parseISO } from 'date-fns';

interface PersonDetailSidebarProps {
    personId: string | null;
    onClose: () => void;
    onEdit: (id: string) => void;
}

const PersonDetailSidebar = ({ personId, onClose, onEdit }: PersonDetailSidebarProps) => {
    const { families, activeFamilyId, deletePerson } = useFamilyStore();
    const activeFamily = families.find(f => f.id === activeFamilyId) || families[0];
    const people = activeFamily?.people || [];
    const person = people.find((p) => p.id === personId);

    if (!person) return null;

    const handleDelete = () => {
        if (confirm(`Are you sure you want to remove ${person.firstName} from the family tree?`)) {
            deletePerson(person.id);
            onClose();
        }
    };

    const getInitials = () => {
        return `${person.firstName?.[0] || ''}${person.lastName?.[0] || ''}`.toUpperCase();
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full lg:max-w-md h-full glass border-l border-white/10 shadow-2xl p-6 lg:p-10 flex flex-col animate-in slide-in-from-right duration-500">
                <div className="flex items-center justify-between mb-10 shrink-0">
                    <h3 className="uppercase tracking-[0.3em] text-[10px] font-bold text-[#FFC107]">Personal Record</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(person.id)}
                            className="p-2 glass text-white/60 hover:text-[#FFC107] transition-all rounded-full"
                        >
                            <Edit3 size={18} />
                        </button>
                        <button onClick={onClose} className="p-2 glass text-white/60 hover:text-white transition-all rounded-full">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center text-center mb-10">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-full bg-[#FFC107]/20 blur-2xl" />
                        <div className="relative w-32 h-32 rounded-full border-4 border-[#FFC107]/20 flex items-center justify-center bg-[#1a1a1a] shadow-2xl overflow-hidden">
                            {person.photoUrl ? (
                                <img src={person.photoUrl} alt={person.firstName} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl font-display font-bold text-[#FFC107]">{getInitials()}</span>
                            )}
                        </div>
                    </div>

                    <h2 className="text-4xl font-display text-white mb-2">
                        {person.firstName} {person.lastName}
                    </h2>

                    <div className="flex items-center gap-2 mt-2">
                        <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${person.lifeStatus === 'demised' ? 'bg-white/5 text-gray-400 border-white/10' : 'bg-[#FFC107]/10 text-[#FFC107] border-[#FFC107]/20'}`}>
                            {person.lifeStatus}
                        </div>
                        {person.occupation && (
                            <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white/5 text-white/40 border border-white/10">
                                {person.occupation}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="glass-gold rounded-3xl p-6">
                        <div className="flex items-center gap-3 text-[#FFC107] mb-6">
                            <Calendar size={18} />
                            <span className="font-bold text-[11px] uppercase tracking-[0.2em]">Sacred Timeline</span>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-black text-white/30 tracking-tighter">Born</span>
                                <span className="text-lg font-serif">
                                    {person.birthDate ? format(parseISO(person.birthDate), 'MMM d, yyyy') : 'Unknown'}
                                </span>
                            </div>
                            {person.lifeStatus === 'demised' && (
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] uppercase font-black text-white/30 tracking-tighter">Ascended</span>
                                    <span className="text-lg font-serif">
                                        {person.deathDate ? format(parseISO(person.deathDate), 'MMM d, yyyy') : 'Unknown'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="glass rounded-3xl p-6">
                        <div className="flex items-center gap-3 text-white/60 mb-4">
                            <Briefcase size={18} />
                            <span className="font-bold text-[11px] uppercase tracking-[0.2em]">Biography</span>
                        </div>
                        <p className="text-white/60 text-[15px] leading-relaxed font-serif italic">
                            "{person.bio || "The story of this life is yet to be fully preserved in our archives."}"
                        </p>
                    </div>

                    <div className="glass rounded-3xl p-6 border-transparent">
                        <div className="flex items-center gap-3 text-white/60 mb-4">
                            <Heart size={18} />
                            <span className="font-bold text-[11px] uppercase tracking-[0.2em]">Connections</span>
                        </div>
                        <p className="text-[12px] text-white/40 leading-relaxed">
                            View this member's lineage in the visualizer to explore their direct impact on the {activeFamily?.name || 'family'} history.
                        </p>
                    </div>
                </div>

                <div className="mt-auto pt-8 flex gap-4">
                    <button
                        onClick={handleDelete}
                        className="flex-1 flex items-center justify-center gap-2 text-white/20 hover:text-red-400 py-4 px-4 rounded-2xl font-bold transition-all text-sm uppercase tracking-widest hover:bg-red-400/5 group"
                    >
                        <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                        Erase Record
                    </button>
                    <button
                        onClick={() => onEdit(person.id)}
                        className="flex-[2] bg-[#FFC107] text-[#1a1a1a] py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:shadow-[#FFC107]/20 transition-all hover:scale-[1.02]"
                    >
                        Edit archive
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PersonDetailSidebar;


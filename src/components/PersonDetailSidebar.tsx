import { X, Calendar, Briefcase, Info, Trash2, Edit3 } from 'lucide-react';
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end pointer-events-none">
            <div
                className="absolute inset-0 bg-black/5 backdrop-blur-[2px] pointer-events-auto"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm h-full bg-white/95 backdrop-blur-2xl shadow-2xl p-8 flex flex-col pointer-events-auto animate-in slide-in-from-right duration-500 ease-out border-l border-white/20">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => onEdit(person.id)}
                        className="flex items-center gap-2 text-[#0071E3] font-semibold hover:bg-[#0071E3]/5 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <Edit3 size={18} />
                        Edit Profile
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-xl mb-4 group relative">
                        {person.photoUrl ? (
                            <img src={person.photoUrl} alt={person.firstName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                <Info size={40} />
                            </div>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-[#1D1D1F]">
                        {person.firstName} {person.lastName}
                    </h2>
                    <div className={`mt-2 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit mx-auto ${person.lifeStatus === 'demised' ? 'bg-gray-50 text-gray-500 border-gray-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {person.lifeStatus}
                    </div>
                    <span className="text-sm font-medium text-[#86868B] mt-2 italic leading-none block">
                        {person.occupation || 'Family Member'}
                    </span>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto">
                    <div className="bg-[#F5F5F7]/80 rounded-2xl p-5 border border-white">
                        <div className="flex items-center gap-3 text-[#1D1D1F] mb-3">
                            <Calendar size={18} className="text-[#0071E3]" />
                            <span className="font-bold text-[13px] uppercase tracking-wider">Timeline</span>
                        </div>
                        <div className="ml-7 flex flex-col gap-1">
                            <span className="text-[15px] font-medium text-[#1D1D1F]">Born</span>
                            <span className="text-sm text-[#86868B]">
                                {person.birthDate ? format(parseISO(person.birthDate), 'MMMM do, yyyy') : 'Unknown'}
                            </span>
                            {person.deathDate && (
                                <>
                                    <span className="text-[15px] font-medium text-[#1D1D1F] mt-2">Died</span>
                                    <span className="text-sm text-[#86868B]">{format(parseISO(person.deathDate), 'MMMM do, yyyy')}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-[#F5F5F7]/80 rounded-2xl p-5 border border-white">
                        <div className="flex items-center gap-3 text-[#1D1D1F] mb-3">
                            <Briefcase size={18} className="text-[#0071E3]" />
                            <span className="font-bold text-[13px] uppercase tracking-wider">Bio</span>
                        </div>
                        <p className="text-[#86868B] ml-7 text-[14px] leading-relaxed">
                            {person.bio || "No biography provided for this family member."}
                        </p>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-3">
                    <button
                        onClick={handleDelete}
                        className="flex items-center justify-center gap-2 w-full text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={18} />
                        Remove from Tree
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PersonDetailSidebar;

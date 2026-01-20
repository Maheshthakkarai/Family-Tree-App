import { useState, useEffect } from 'react';
import { X, UserPlus, AlertCircle, Plus } from 'lucide-react';
import { useFamilyStore } from '../store/useFamilyStore';
import type { RelationshipType, Person, Gender, LifeStatus } from '../types';
import { parseISO, isBefore } from 'date-fns';

interface AddPersonModalProps {
    isOpen: boolean;
    onClose: () => void;
    editModeId?: string | null;
}

const AddPersonModal = ({ isOpen, onClose, editModeId }: AddPersonModalProps) => {
    const { families, activeFamilyId, addPerson, updatePerson, connectPeople, updateRelationshipStatus } = useFamilyStore();
    const activeFamily = families.find((f: any) => f.id === activeFamilyId) || families[0];
    const people = activeFamily?.people || [];
    const relationships = activeFamily?.relationships || [];
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        gender: 'not_specified' as Gender,
        birthDate: '',
        deathDate: '',
        photoUrl: '',
        bio: '',
        occupation: '',
        lifeStatus: 'living' as LifeStatus,
        relationship: {
            relatedTo: '',
            type: 'child' as RelationshipType,
            status: 'married' as 'married' | 'divorced' | 'separated'
        }
    });

    useEffect(() => {
        if (editModeId) {
            const person = people.find((p: any) => p.id === editModeId);
            if (person) {
                const spouseRel = relationships.find((r: any) =>
                    r.type === 'spouse' && (r.source === editModeId || r.target === editModeId)
                );

                setFormData({
                    firstName: person.firstName,
                    lastName: person.lastName,
                    gender: person.gender || 'not_specified',
                    birthDate: person.birthDate || '',
                    deathDate: person.deathDate || '',
                    photoUrl: person.photoUrl || '',
                    bio: person.bio || '',
                    occupation: person.occupation || '',
                    lifeStatus: person.lifeStatus || 'living',
                    relationship: {
                        relatedTo: spouseRel ? (spouseRel.source === editModeId ? spouseRel.target : spouseRel.source) : '',
                        type: 'spouse',
                        status: spouseRel?.status || 'married'
                    }
                });
            }
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                gender: 'not_specified',
                birthDate: '',
                deathDate: '',
                photoUrl: '',
                bio: '',
                occupation: '',
                lifeStatus: 'living',
                relationship: { relatedTo: '', type: 'child', status: 'married' }
            });
        }
        setError(null);
    }, [editModeId, people, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const personData: Omit<Person, 'id'> = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            gender: formData.gender,
            birthDate: formData.birthDate || undefined,
            deathDate: formData.deathDate || undefined,
            photoUrl: formData.photoUrl || undefined,
            bio: formData.bio || undefined,
            occupation: formData.occupation || undefined,
            lifeStatus: formData.lifeStatus,
        };

        if (editModeId) {
            updatePerson(editModeId, personData);

            const spouseRel = relationships.find((r: any) =>
                r.type === 'spouse' && (r.source === editModeId || r.target === editModeId)
            );
            if (spouseRel && formData.relationship.status) {
                updateRelationshipStatus(spouseRel.id, formData.relationship.status);
            }
        } else {
            if (formData.relationship.relatedTo && formData.birthDate) {
                const anchor = people.find((p: any) => p.id === formData.relationship.relatedTo);
                if (anchor && anchor.birthDate) {
                    const newBirth = parseISO(formData.birthDate);
                    const anchorBirth = parseISO(anchor.birthDate);

                    if (['father', 'mother', 'parent'].includes(formData.relationship.type) && isBefore(anchorBirth, newBirth)) {
                        setError("Conflict: A parent must be older than their child.");
                        return;
                    }
                    if (['son', 'daughter', 'child'].includes(formData.relationship.type) && isBefore(newBirth, anchorBirth)) {
                        setError("Conflict: A child must be younger than their parent.");
                        return;
                    }
                }
            }

            const personId = addPerson(personData);
            if (formData.relationship.relatedTo) {
                const status = formData.relationship.type === 'spouse' ? formData.relationship.status : undefined;
                connectPeople(personId, formData.relationship.relatedTo, formData.relationship.type, status);
            }
        }

        onClose();
    };

    const relOptions: { label: string, value: RelationshipType, group: string }[] = [
        { label: 'Father', value: 'father', group: 'Parent' },
        { label: 'Mother', value: 'mother', group: 'Parent' },
        { label: 'Son', value: 'son', group: 'Child' },
        { label: 'Daughter', value: 'daughter', group: 'Child' },
        { label: 'Brother', value: 'brother', group: 'Sibling' },
        { label: 'Sister', value: 'sister', group: 'Sibling' },
        { label: 'Spouse', value: 'spouse', group: 'Partner' },
    ];

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center lg:justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full lg:max-w-md h-full glass border-l border-white/10 shadow-2xl p-6 lg:p-10 flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-[#FFC107] shrink-0 border-[#FFC107]/20 shadow-xl">
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <h3 className="uppercase tracking-[0.3em] text-[10px] font-bold text-[#FFC107]">Records Department</h3>
                            <h2 className="text-2xl font-display text-white truncate">
                                {editModeId ? 'Annotate Record' : 'Append Lineage'}
                            </h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 glass text-white/40 hover:text-white transition-all rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 text-red-400 rounded-2xl flex items-center gap-3 text-sm font-medium border border-red-500/20 animate-in fade-in slide-in-from-top-4">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-white/40 mb-2 uppercase tracking-widest">First Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-5 py-3.5 glass border-transparent focus:border-[#FFC107]/50 rounded-2xl focus:ring-0 transition-all text-white placeholder-white/20"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-white/40 mb-2 uppercase tracking-widest">Last Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-5 py-3.5 glass border-transparent focus:border-[#FFC107]/50 rounded-2xl focus:ring-0 transition-all text-white placeholder-white/20"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[11px] font-bold text-white/40 mb-3 uppercase tracking-widest">Gender</label>
                                <div className="flex gap-2">
                                    {(['male', 'female'] as const).map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, gender: g })}
                                            className={`flex-1 py-3 px-3 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all ${formData.gender === g
                                                ? 'bg-[#FFC107] text-[#1a1a1a] border-[#FFC107] shadow-lg shadow-[#FFC107]/20'
                                                : 'glass border-transparent text-white/60 hover:border-white/20'
                                                }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-white/40 mb-3 uppercase tracking-widest">Status</label>
                                <div className="flex gap-2">
                                    {(['living', 'demised'] as const).map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, lifeStatus: s })}
                                            className={`flex-1 py-3 px-3 rounded-xl border text-[11px] font-bold uppercase tracking-widest transition-all ${formData.lifeStatus === s
                                                ? 'bg-[#FFC107] text-[#1a1a1a] border-[#FFC107] shadow-lg shadow-[#FFC107]/20'
                                                : 'glass border-transparent text-white/60 hover:border-white/20'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-bold text-white/40 mb-2 uppercase tracking-widest">Date of Birth</label>
                                <input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                    className="w-full px-5 py-3.5 glass border-transparent focus:border-[#FFC107]/50 rounded-2xl focus:ring-0 transition-all text-white inverted-calendar-icon"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-white/40 mb-2 uppercase tracking-widest">Occupation</label>
                                <input
                                    type="text"
                                    value={formData.occupation}
                                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                    className="w-full px-5 py-3.5 glass border-transparent focus:border-[#FFC107]/50 rounded-2xl focus:ring-0 transition-all text-white placeholder-white/20"
                                    placeholder="e.g. Architect"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold text-white/40 mb-2 uppercase tracking-widest flex justify-between items-center">
                                Profile Photo URL
                                <span className="text-[9px] text-[#FFC107]/40 tracking-normal opacity-60">Optional</span>
                            </label>
                            <input
                                type="url"
                                value={formData.photoUrl}
                                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                placeholder="https://images.unsplash.com/..."
                                className="w-full px-5 py-3.5 glass border-transparent focus:border-[#FFC107]/50 rounded-2xl focus:ring-0 transition-all text-white placeholder-white/20 text-sm"
                            />
                        </div>

                        {
                            editModeId && formData.relationship.relatedTo && (
                                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                                    <label className="block text-[11px] font-bold text-white/40 mb-3 uppercase tracking-widest">
                                        Marriage Status
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['married', 'divorced', 'separated'] as const).map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    relationship: { ...formData.relationship, status: s }
                                                })}
                                                className={`py-3 px-3 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all ${formData.relationship.status === s
                                                    ? 'bg-[#FFC107] text-[#1a1a1a] border-[#FFC107] shadow-lg shadow-[#FFC107]/10'
                                                    : 'glass border-transparent text-white/40 hover:border-white/10'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )
                        }

                        {
                            !editModeId && people.length > 0 && (
                                <>
                                    <div className="h-px bg-white/5 w-full my-8" />
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-black text-[#FFC107] uppercase tracking-[0.3em]">Lineage Blueprint</h3>

                                        <div>
                                            <label className="block text-[11px] font-bold text-white/40 mb-2 uppercase tracking-widest">Existing Kin</label>
                                            <div className="relative">
                                                <select
                                                    value={formData.relationship.relatedTo}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        relationship: { ...formData.relationship, relatedTo: e.target.value }
                                                    })}
                                                    className="w-full px-5 py-3.5 glass border-transparent focus:border-[#FFC107]/50 rounded-2xl focus:ring-0 transition-all text-white appearance-none"
                                                >
                                                    <option value="" className="bg-[#1a1a1a]">Select relative...</option>
                                                    {people.map((p: any) => (
                                                        <option key={p.id} value={p.id} className="bg-[#1a1a1a]">{p.firstName} {p.lastName}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                                    <Plus size={16} />
                                                </div>
                                            </div>
                                        </div>

                                        {formData.relationship.relatedTo && (
                                            <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
                                                <div>
                                                    <label className="block text-[11px] font-bold text-white/40 mb-3 uppercase tracking-widest">
                                                        Kinship Type
                                                    </label>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {relOptions.map((opt) => (
                                                            <button
                                                                key={opt.value}
                                                                type="button"
                                                                onClick={() => setFormData({
                                                                    ...formData,
                                                                    relationship: { ...formData.relationship, type: opt.value }
                                                                })}
                                                                className={`flex flex-col items-center justify-center py-4 rounded-xl border transition-all ${formData.relationship.type === opt.value
                                                                    ? 'bg-[#FFC107]/10 text-[#FFC107] border-[#FFC107]/40 shadow-xl'
                                                                    : 'glass border-transparent text-white/30 hover:border-white/10'
                                                                    }`}
                                                            >
                                                                <span className="text-[12px] font-bold">{opt.label}</span>
                                                                <span className="text-[9px] font-black uppercase tracking-tighter opacity-40 mt-1">{opt.group}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {formData.relationship.type === 'spouse' && (
                                                    <div className="animate-in fade-in slide-in-from-top-4">
                                                        <label className="block text-[11px] font-bold text-white/40 mb-3 uppercase tracking-widest">
                                                            Marriage Status
                                                        </label>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {(['married', 'divorced', 'separated'] as const).map(s => (
                                                                <button
                                                                    key={s}
                                                                    type="button"
                                                                    onClick={() => setFormData({
                                                                        ...formData,
                                                                        relationship: { ...formData.relationship, status: s }
                                                                    })}
                                                                    className={`py-3 px-3 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] transition-all ${formData.relationship.status === s
                                                                        ? 'bg-[#FFC107] text-[#1a1a1a] border-[#FFC107] shadow-lg shadow-[#FFC107]/10'
                                                                        : 'glass border-transparent text-white/40 hover:border-white/10'
                                                                        }`}
                                                                >
                                                                    {s}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )
                        }

                        <div>
                            <label className="block text-[11px] font-bold text-white/40 mb-2 uppercase tracking-widest">Archival Biography</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={4}
                                className="w-full px-5 py-3.5 glass border-transparent focus:border-[#FFC107]/50 rounded-2xl focus:ring-0 transition-all text-white placeholder-white/20 resize-none font-serif italic text-sm"
                                placeholder="Chronicle their journey, birthplace, and significant contributions..."
                            />
                        </div>
                    </div >

                    <div className="mt-10 pb-8 shrink-0">
                        <button
                            type="submit"
                            className="w-full bg-[#FFC107] text-[#1a1a1a] py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:shadow-[#FFC107]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {editModeId ? 'Update Archives' : 'Seal the Record'}
                        </button>
                    </div>
                </form >
            </div >
        </div >
    );
};

export default AddPersonModal;


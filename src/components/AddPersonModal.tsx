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
    const activeFamily = families.find(f => f.id === activeFamilyId) || families[0];
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
            status: 'married' as 'married' | 'divorced' | 'separated' | 'demised'
        }
    });

    useEffect(() => {
        if (editModeId) {
            const person = people.find(p => p.id === editModeId);
            if (person) {
                const spouseRel = relationships.find(r =>
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

            // If we have a spouse relationship, update its status
            const spouseRel = relationships.find(r =>
                r.type === 'spouse' && (r.source === editModeId || r.target === editModeId)
            );
            if (spouseRel && formData.relationship.status) {
                updateRelationshipStatus(spouseRel.id, formData.relationship.status);
            }
        } else {
            // Logic for new person
            if (formData.relationship.relatedTo && formData.birthDate) {
                const anchor = people.find(p => p.id === formData.relationship.relatedTo);
                if (anchor && anchor.birthDate) {
                    const newBirth = parseISO(formData.birthDate);
                    const anchorBirth = parseISO(anchor.birthDate);

                    // Simple generational checks
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
        <div className="fixed inset-0 z-50 flex items-center justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md h-full bg-white shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0071E3] rounded-xl flex items-center justify-center text-white">
                            <UserPlus size={22} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1D1D1F]">
                            {editModeId ? 'Edit Profile' : 'Add Person'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2">
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#1D1D1F] mb-1.5">First Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-[#F5F5F7] border-none rounded-xl focus:ring-2 focus:ring-[#0071E3] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1D1D1F] mb-1.5">Last Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-[#F5F5F7] border-none rounded-xl focus:ring-2 focus:ring-[#0071E3] transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1D1D1F] mb-1.5">Gender</label>
                            <div className="flex gap-2">
                                {(['male', 'female'] as const).map(g => (
                                    <button
                                        key={g}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, gender: g })}
                                        className={`flex-1 py-2 px-3 rounded-xl border-2 text-sm font-bold transition-all ${formData.gender === g
                                            ? 'bg-[#0071E3] text-white border-blue-500'
                                            : 'bg-white text-[#1D1D1F] border-gray-100 hover:border-gray-200'
                                            }`}
                                    >
                                        {g.charAt(0).toUpperCase() + g.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1D1D1F] mb-1.5">Life Status</label>
                            <div className="flex gap-2">
                                {(['living', 'demised'] as const).map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, lifeStatus: s })}
                                        className={`flex-1 py-2 px-3 rounded-xl border-2 text-sm font-bold transition-all ${formData.lifeStatus === s
                                            ? 'bg-[#0071E3] text-white border-blue-500'
                                            : 'bg-white text-[#1D1D1F] border-gray-100 hover:border-gray-200'
                                            }`}
                                    >
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#1D1D1F] mb-1.5">Date of Birth</label>
                                <input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-[#F5F5F7] border-none rounded-xl focus:ring-2 focus:ring-[#0071E3] transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-[#1D1D1F] mb-1.5">Occupation</label>
                                <input
                                    type="text"
                                    value={formData.occupation}
                                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-[#F5F5F7] border-none rounded-xl focus:ring-2 focus:ring-[#0071E3] transition-all"
                                    placeholder="e.g. Architect"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1D1D1F] mb-1.5 flex justify-between items-center">
                                Profile Photo URL
                                <span className="text-[10px] text-[#86868B] font-bold uppercase tracking-tight">Optional</span>
                            </label>
                            <div className="relative group">
                                <input
                                    type="url"
                                    value={formData.photoUrl}
                                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                                    placeholder="https://example.com/photo.jpg"
                                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F7] border-none rounded-xl focus:ring-2 focus:ring-[#0071E3] transition-all text-sm"
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0071E3] transition-colors">
                                    <Plus size={18} />
                                </div>
                            </div>
                        </div>

                        {
                            editModeId && formData.relationship.relatedTo && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="block text-sm font-semibold text-[#1D1D1F] mb-3">
                                        Relationship Status
                                    </label>
                                    <div className="flex gap-2">
                                        {(['married', 'divorced', 'separated', 'demised'] as const).map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    relationship: { ...formData.relationship, status: s }
                                                })}
                                                className={`flex-1 py-2 px-3 rounded-xl border-2 text-[11px] font-black uppercase tracking-wider transition-all ${formData.relationship.status === s
                                                    ? 'bg-[#0071E3] text-white border-blue-500 shadow-md'
                                                    : 'bg-white text-[#1D1D1F] border-gray-100 hover:border-gray-200'
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
                                    <hr className="border-gray-100" />
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-[#86868B] uppercase tracking-wider">Lineage Mapping</h3>

                                        <div>
                                            <label className="block text-sm font-semibold text-[#1D1D1F] mb-1.5">Relative in Registry</label>
                                            <select
                                                value={formData.relationship.relatedTo}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    relationship: { ...formData.relationship, relatedTo: e.target.value }
                                                })}
                                                className="w-full px-4 py-2.5 bg-[#F5F5F7] border-none rounded-xl focus:ring-2 focus:ring-[#0071E3] transition-all appearance-none"
                                            >
                                                <option value="">Select family member...</option>
                                                {people.map(p => (
                                                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {formData.relationship.relatedTo && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-[#1D1D1F] mb-3">
                                                        This person is the...
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
                                                                className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-[13px] font-bold transition-all ${formData.relationship.type === opt.value
                                                                    ? 'bg-[#0071E3]/5 text-[#0071E3] border-[#0071E3]'
                                                                    : 'bg-[#F5F5F7] text-[#1D1D1F] border-transparent hover:border-gray-200'
                                                                    }`}
                                                            >
                                                                {opt.label}
                                                                <span className="text-[10px] text-[#86868B] uppercase opacity-60">{opt.group}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {formData.relationship.type === 'spouse' && (
                                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <label className="block text-sm font-semibold text-[#1D1D1F] mb-3">
                                                            Relationship Status
                                                        </label>
                                                        <div className="flex gap-2">
                                                            {(['married', 'divorced', 'separated', 'demised'] as const).map(s => (
                                                                <button
                                                                    key={s}
                                                                    type="button"
                                                                    onClick={() => setFormData({
                                                                        ...formData,
                                                                        relationship: { ...formData.relationship, status: s }
                                                                    })}
                                                                    className={`flex-1 py-2 px-3 rounded-xl border-2 text-[11px] font-black uppercase tracking-wider transition-all ${formData.relationship.status === s
                                                                        ? 'bg-[#0071E3] text-white border-blue-500 shadow-md'
                                                                        : 'bg-white text-[#1D1D1F] border-gray-100 hover:border-gray-200'
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
                            <label className="block text-sm font-semibold text-[#1D1D1F] mb-1.5">Biography</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 bg-[#F5F5F7] border-none rounded-xl focus:ring-2 focus:ring-[#0071E3] transition-all resize-none"
                                placeholder="Birthplace, key life events..."
                            />
                        </div>
                    </div >

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <button
                            type="submit"
                            className="w-full bg-[#0071E3] text-white py-4 rounded-2xl font-bold hover:bg-[#0077ED] transition-all shadow-lg active:scale-[0.98]"
                        >
                            {editModeId ? 'Save Changes' : 'Build Connection'}
                        </button>
                    </div>
                </form >
            </div >
        </div >
    );
};

export default AddPersonModal;

import { useFamilyStore } from '../store/useFamilyStore';
import { Edit2, Trash2, Plus, Users, Heart, Skull } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { calculateDepths } from '../utils/depthUtils';

interface RegistryViewProps {
    onEdit: (id: string) => void;
    onCreateFamily: () => void;
    onAddMember: () => void;
}

const RegistryView = ({ onEdit, onCreateFamily, onAddMember }: RegistryViewProps) => {
    const { families, activeFamilyId, deletePerson } = useFamilyStore();
    const activeFamily = families.find(f => f.id === activeFamilyId) || families[0];
    const people = activeFamily?.people || [];
    const relationships = activeFamily?.relationships || [];

    const simpleRels = relationships.map(r => ({
        id: r.id,
        source: r.source,
        target: r.target,
        type: r.type
    }));

    const depthMap = calculateDepths(people, simpleRels);

    const peopleWithMetadata = people.map(p => {
        // 1. Spouse Info
        const spouseRels = relationships.filter(r =>
            r.type === 'spouse' && (r.source === p.id || r.target === p.id)
        );

        let spouseLabel = '';
        if (spouseRels.length > 0) {
            spouseLabel = spouseRels.map(rel => {
                const spouseId = rel.source === p.id ? rel.target : rel.source;
                const spouse = people.find(sp => sp.id === spouseId);
                if (!spouse) return null;

                const spouseFullName = `${spouse.firstName} ${spouse.lastName}`;
                const statusSuffix = rel.status && rel.status !== 'married' ? ` (${rel.status})` : '';
                if (p.gender === 'male') return `Husband of ${spouseFullName}${statusSuffix}`;
                if (p.gender === 'female') return `Wife of ${spouseFullName}${statusSuffix}`;
                return `Partner of ${spouseFullName}${statusSuffix}`;
            }).filter(Boolean).join('; ');
        }
        const spouseId = spouseRels.length > 0 ? (spouseRels[0].source === p.id ? spouseRels[0].target : spouseRels[0].source) : null;

        // 2. Parent Info
        const directParentRels = relationships.filter(r => r.type === 'parent' && r.target === p.id);
        let parentLabel = '';

        if (directParentRels.length > 0) {
            const parentIds = new Set(directParentRels.map(r => r.source));
            const fullParentPool = new Set<string>();
            parentIds.forEach(pid => {
                fullParentPool.add(pid);
                const parentSpouseRel = relationships.find(r =>
                    r.type === 'spouse' && (r.source === pid || r.target === pid)
                );
                if (parentSpouseRel) {
                    fullParentPool.add(parentSpouseRel.source === pid ? parentSpouseRel.target : parentSpouseRel.source);
                }
            });

            const parentNames = people
                .filter(prev => fullParentPool.has(prev.id))
                .map(parent => `${parent.firstName} ${parent.lastName}`);

            if (parentNames.length > 0) {
                parentLabel = `Child of ${parentNames.join(' & ')}`;
            }
        }

        return {
            ...p,
            depth: depthMap[p.id] || 0,
            spouseId,
            spouseLabel,
            parentLabel
        };
    });

    const getGroupedData = (genIndex: number) => {
        const genPeople = peopleWithMetadata.filter(p => (genIndex === 4 ? p.depth >= genIndex : p.depth === genIndex));
        const processed = new Set<string>();
        const pairedList: (typeof peopleWithMetadata[0])[] = [];

        genPeople.forEach(p => {
            if (processed.has(p.id)) return;
            pairedList.push(p);
            processed.add(p.id);
            if (p.spouseId) {
                const spouseObj = genPeople.find(sp => sp.id === p.spouseId);
                if (spouseObj && !processed.has(spouseObj.id)) {
                    pairedList.push(spouseObj);
                    processed.add(spouseObj.id);
                }
            }
        });
        return pairedList;
    };

    const renderGenerationColumn = (label: string, genIndex: number, isWide: boolean = false) => {
        const group = getGroupedData(genIndex);
        const colorStyles = [
            'bg-[#7B61FF] border-[#5A45D1]', // Grandparents
            'bg-[#00C48C] border-[#009B6F]', // 1st Gen
            'bg-[#0071E3] border-[#005BB7]', // 2nd Gen
            'bg-[#97D700] border-[#7BAF00]', // 3rd Gen
            'bg-[#F59E0B] border-[#B45309]'  // 4th Gen
        ][Math.min(genIndex, 4)];

        return (
            <div className={`flex flex-col h-full ${isWide ? 'w-full' : 'min-w-[300px]'}`}>
                <div className={`p-4 font-black text-center rounded-t-[22px] border-b-4 shadow-md uppercase tracking-[0.25em] text-[12px] text-white ${colorStyles}`}>
                    {label}
                </div>
                <div className="bg-white border-x border-b border-gray-100 rounded-b-[22px] shadow-xl min-h-[300px] flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto max-h-[500px]">
                        <div className="divide-y divide-gray-50">
                            {group.length === 0 ? (
                                <div className="px-6 py-12 text-center text-gray-400 italic text-sm">No members documented in this tier</div>
                            ) : (
                                group.map(person => (
                                    <div key={person.id} className="p-5 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <span className="font-black text-[#1D1D1F] text-[16px] block leading-tight mb-1 truncate">
                                                {person.firstName} {person.lastName}
                                                {person.lifeStatus === 'demised' && <Skull size={14} className="inline-block ml-2 text-gray-400" />}
                                            </span>
                                            <div className="flex flex-col gap-1.5 pt-1">
                                                {person.birthDate && (
                                                    <div className="text-[10px] text-[#0071E3] font-black uppercase tracking-widest bg-blue-50 w-fit px-2 py-0.5 rounded-full border border-blue-100/50">
                                                        Born {format(parseISO(person.birthDate), 'yyyy')}
                                                    </div>
                                                )}

                                                {person.parentLabel && (
                                                    <div className="flex items-start gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-tighter leading-tight mt-1">
                                                        <Users size={12} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                                        <span className="break-words">{person.parentLabel}</span>
                                                    </div>
                                                )}

                                                {person.spouseLabel && (
                                                    <div className="flex items-start gap-2 text-[10px] font-black text-[#5A45D1] uppercase tracking-tighter leading-tight">
                                                        <Heart size={12} className="text-pink-500 fill-pink-500 flex-shrink-0 mt-0.5" />
                                                        <span className="break-words">{person.spouseLabel}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 shrink-0">
                                            <button
                                                onClick={() => onEdit(person.id)}
                                                className="w-10 h-10 flex items-center justify-center text-blue-600 bg-white shadow-md border border-gray-100 rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                                                title="Edit Profile"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => deletePerson(person.id)}
                                                className="w-10 h-10 flex items-center justify-center text-red-600 bg-white shadow-md border border-gray-100 rounded-xl hover:bg-red-600 hover:text-white transition-all active:scale-90"
                                                title="Delete Entry"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onAddMember}
                        className="w-full py-5 text-gray-400 hover:text-[#0071E3] hover:bg-blue-50/50 flex items-center justify-center gap-3 border-t border-dashed border-gray-100 transition-all font-bold uppercase text-[11px] tracking-widest"
                    >
                        <Plus size={18} />
                        Add to {label}
                    </button>
                </div>
            </div>
        );
    };

    if (people.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center px-6 animate-premium">
                <div className="w-24 h-24 bg-gradient-to-br from-[#007AFF] to-[#00C7FF] rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 mb-8 mx-auto">
                    <Users size={40} strokeWidth={2.5} />
                </div>
                <h2 className="text-5xl font-black text-[#1D1D1F] tracking-tight mb-4 font-display italic">
                    Begin Your <span className="text-[#007AFF]">Legacy</span>
                </h2>
                <p className="text-lg text-[#86868B] mb-12 max-w-lg mx-auto font-medium leading-relaxed">
                    Every history starts with a single name. Create your first family collection and document the stories that matter most.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={onAddMember}
                        className="flex items-center gap-3 bg-[#0071E3] px-8 py-4 rounded-2xl font-black text-white hover:bg-[#0077ED] transition-all shadow-xl shadow-blue-500/20 text-sm uppercase tracking-widest active:scale-95"
                    >
                        <Plus size={20} /> Add First Member
                    </button>
                    <button
                        onClick={onCreateFamily}
                        className="flex items-center gap-3 bg-white px-8 py-4 rounded-2xl font-black text-[#1D1D1F] border border-[#F5F5F7] hover:bg-gray-50 transition-all shadow-sm text-sm uppercase tracking-widest active:scale-95"
                    >
                        New Collection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto p-12 animate-premium overflow-y-auto h-full">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-16 px-2">
                <div className="flex flex-col gap-2">
                    <h2 className="text-5xl font-black text-[#1D1D1F] tracking-tight font-display italic uppercase">
                        Lineage <span className="text-[#007AFF]">Registry</span>
                    </h2>
                    <p className="text-[#86868B] text-xs font-black uppercase tracking-[0.4em]">Institutional Heritage Archives & Documentation</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onAddMember}
                        className="flex items-center gap-2 bg-[#F5F5F7] px-6 py-3 rounded-xl font-bold text-[#1D1D1F] hover:bg-gray-200 transition-all text-[11px] uppercase tracking-widest"
                    >
                        <Plus size={16} /> Add Member
                    </button>
                    <button
                        onClick={onCreateFamily}
                        className="flex items-center gap-2 bg-[#0071E3] px-6 py-3 rounded-xl font-bold text-white hover:bg-[#0077ED] transition-all shadow-lg shadow-blue-500/20 text-[11px] uppercase tracking-widest"
                    >
                        <Users size={16} /> New Collection
                    </button>
                </div>
            </div>

            {/* Row 1: Grand Parents (The Origin) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                <div className="lg:col-start-2">
                    {renderGenerationColumn("Original Ancestors", 0, true)}
                </div>
            </div>

            {/* Row 2: Future Generations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {renderGenerationColumn("1st Generation", 1)}
                {renderGenerationColumn("2nd Generation", 2)}
                {renderGenerationColumn("3rd Generation", 3)}
                {renderGenerationColumn("4th Generation", 4)}
            </div>
        </div>
    );
};

export default RegistryView;

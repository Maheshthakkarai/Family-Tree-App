import { useFamilyStore } from '../store/useFamilyStore';
import { Edit2, Trash2, Plus, Users, Heart, Skull, BookOpen } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { calculateDepths } from '../utils/depthUtils';

interface RegistryViewProps {
    onEdit: (id: string) => void;
    onCreateFamily: () => void;
    onAddMember: () => void;
}

const RegistryView = ({ onEdit, onCreateFamily, onAddMember }: RegistryViewProps) => {
    const { families, activeFamilyId, deletePerson } = useFamilyStore();
    const activeFamily = families.find((f: any) => f.id === activeFamilyId) || families[0];
    const people = activeFamily?.people || [];
    const relationships = activeFamily?.relationships || [];

    const simpleRels = relationships.map((r: any) => ({
        id: r.id,
        source: r.source,
        target: r.target,
        type: r.type
    }));

    const depthMap = calculateDepths(people, simpleRels);

    const peopleWithMetadata = people.map((p: any) => {
        const spouseRels = relationships.filter((r: any) =>
            r.type === 'spouse' && (r.source === p.id || r.target === p.id)
        );

        let spouseLabel = '';
        if (spouseRels.length > 0) {
            spouseLabel = spouseRels.map((rel: any) => {
                const spouseId = rel.source === p.id ? rel.target : rel.source;
                const spouse = people.find((sp: any) => sp.id === spouseId);
                if (!spouse) return null;

                const spouseFullName = `${spouse.firstName} ${spouse.lastName}`;
                const statusSuffix = rel.status && rel.status !== 'married' ? ` (${rel.status})` : '';
                if (p.gender === 'male') return `Husband of ${spouseFullName}${statusSuffix}`;
                if (p.gender === 'female') return `Wife of ${spouseFullName}${statusSuffix}`;
                return `Partner of ${spouseFullName}${statusSuffix}`;
            }).filter(Boolean).join('; ');
        }
        const spouseId = spouseRels.length > 0 ? (spouseRels[0].source === p.id ? spouseRels[0].target : spouseRels[0].source) : null;

        const directParentRels = relationships.filter((r: any) => r.type === 'parent' && r.target === p.id);
        let parentLabel = '';

        if (directParentRels.length > 0) {
            const parentIds = new Set(directParentRels.map((r: any) => r.source));
            const fullParentPool = new Set<string>();
            parentIds.forEach((pid: any) => {
                fullParentPool.add(pid);
                const parentSpouseRel = relationships.find((r: any) =>
                    r.type === 'spouse' && (r.source === pid || r.target === pid)
                );
                if (parentSpouseRel) {
                    fullParentPool.add(parentSpouseRel.source === pid ? parentSpouseRel.target : parentSpouseRel.source);
                }
            });

            const parentNames = people
                .filter((prev: any) => fullParentPool.has(prev.id))
                .map((parent: any) => `${parent.firstName} ${parent.lastName}`);

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

        return (
            <div className={`flex flex-col h-full flex-shrink-0 ${isWide ? 'w-full' : 'min-w-[420px]'}`}>
                <div className={`p-4 font-black text-center rounded-t-3xl border-b border-white/5 bg-white/5 uppercase tracking-[0.25em] text-[10px] text-[#FFC107]`}>
                    {label}
                </div>
                <div className="glass border-t-0 rounded-b-3xl min-h-[300px] flex flex-col overflow-hidden shadow-2xl">
                    <div className="flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
                        <div className="divide-y divide-white/5">
                            {group.length === 0 ? (
                                <div className="px-6 py-12 text-center text-white/20 italic text-sm">No members documented in this tier</div>
                            ) : (
                                group.map(person => (
                                    <div key={person.id} className="p-8 flex items-start justify-between gap-6 hover:bg-white/5 transition-all group">
                                        <div className="flex-1 min-w-0">
                                            <span className="font-display text-white text-2xl xl:text-3xl block leading-tight mb-3 group-hover:text-[#FFC107] transition-colors">
                                                {person.firstName} {person.lastName}
                                                {person.lifeStatus === 'demised' && <Skull size={20} className="inline-block ml-3 text-white/20" />}
                                            </span>
                                            <div className="flex flex-col gap-3 pt-2">
                                                {person.birthDate && (
                                                    <div className="text-xs text-[#FFC107] font-black uppercase tracking-widest bg-[#FFC107]/10 w-fit px-3 py-1 rounded border border-[#FFC107]/20">
                                                        Anno {format(parseISO(person.birthDate), 'yyyy')}
                                                    </div>
                                                )}

                                                {person.parentLabel && (
                                                    <div className="flex items-start gap-2 text-xs font-semibold text-white/40 uppercase tracking-wider leading-relaxed">
                                                        <Users size={14} className="text-white/20 flex-shrink-0 mt-0.5" />
                                                        <span className="break-words">{person.parentLabel}</span>
                                                    </div>
                                                )}

                                                {person.spouseLabel && (
                                                    <div className="flex items-start gap-2 text-xs font-semibold text-white/40 uppercase tracking-wider leading-relaxed">
                                                        <Heart size={14} className="text-[#FFC107]/40 flex-shrink-0 mt-0.5" />
                                                        <span className="break-words">{person.spouseLabel}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEdit(person.id)}
                                                className="w-10 h-10 flex items-center justify-center text-[#FFC107] glass rounded-full hover:bg-[#FFC107] hover:text-[#1a1a1a] transition-all active:scale-90"
                                                title="Edit Profile"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => deletePerson(person.id)}
                                                className="w-10 h-10 flex items-center justify-center text-white/20 glass rounded-full hover:bg-red-500/20 hover:text-red-400 transition-all active:scale-90"
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
                        className="w-full py-6 text-white/20 hover:text-[#FFC107] hover:bg-white/5 flex items-center justify-center gap-3 border-t border-dashed border-white/5 transition-all font-black uppercase text-[10px] tracking-[0.2em]"
                    >
                        <Plus size={16} />
                        Append to {label}
                    </button>
                </div>
            </div>
        );
    };

    if (people.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center px-6">
                <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center text-[#FFC107] shadow-2xl mb-10 mx-auto border-[#FFC107]/20">
                    <BookOpen size={40} strokeWidth={1.5} />
                </div>
                <h2 className="text-5xl font-display text-white tracking-tight mb-6">
                    A Blank Heritage
                </h2>
                <p className="text-lg text-white/40 mb-12 max-w-lg mx-auto font-serif italic leading-relaxed">
                    "Every history starts with a single name. Create your first family collection and document the stories that matter most."
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={onAddMember}
                        className="flex items-center gap-3 bg-[#FFC107] px-10 py-4 rounded-2xl font-black text-[#1a1a1a] hover:shadow-[0_0_20px_rgba(255,193,7,0.3)] transition-all text-sm uppercase tracking-widest active:scale-95"
                    >
                        <Plus size={20} /> Add First Member
                    </button>
                    <button
                        onClick={onCreateFamily}
                        className="flex items-center gap-3 glass px-10 py-4 rounded-2xl font-black text-white hover:bg-white/5 transition-all text-sm uppercase tracking-widest active:scale-95"
                    >
                        New Collection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-y-auto custom-scrollbar p-6 lg:p-12">
            <div className="max-w-[1800px] mx-auto block pb-20">
                {/* Header Area */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 lg:mb-20 px-2 gap-8">
                    <div className="flex flex-col gap-4">
                        <h2 className="text-4xl lg:text-7xl font-display text-white leading-tight">
                            Lineage <span className="text-[#FFC107]">Registry</span>
                        </h2>
                        <p className="text-[#FFC107]/40 text-[10px] lg:text-[11px] font-black uppercase tracking-[0.4em]">Integrated Heritage Archives</p>
                    </div>
                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                        <button
                            onClick={onAddMember}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 glass px-8 py-4 rounded-2xl font-bold text-white/80 hover:text-white hover:bg-white/5 transition-all text-[11px] uppercase tracking-widest whitespace-nowrap"
                        >
                            <Plus size={16} /> Add Member
                        </button>
                        <button
                            onClick={onCreateFamily}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-[#FFC107] px-8 py-4 rounded-2xl font-black text-[#1a1a1a] hover:shadow-[0_0_15px_rgba(255,193,7,0.3)] transition-all text-[11px] uppercase tracking-widest whitespace-nowrap"
                        >
                            <Users size={16} /> New Collection
                        </button>
                    </div>
                </div>

                {/* Row 1: Grand Parents (The Origin) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 lg:mb-20">
                    <div className="lg:col-start-2">
                        {renderGenerationColumn("Original Ancestors", 0, true)}
                    </div>
                </div>

                {/* Row 2: Future Generations Grid - Horizontal Scroll for many columns */}
                <div className="overflow-x-auto pb-20 custom-scrollbar">
                    <div className="flex gap-8 min-w-max">
                        {renderGenerationColumn("1st Generation", 1)}
                        {renderGenerationColumn("2nd Generation", 2)}
                        {renderGenerationColumn("3rd Generation", 3)}
                        {renderGenerationColumn("4th Generation", 4)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistryView;


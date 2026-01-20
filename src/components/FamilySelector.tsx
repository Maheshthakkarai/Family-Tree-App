import { useState } from 'react';
import { useFamilyStore } from '../store/useFamilyStore';
import { Plus, ChevronDown, Check, Trash2, Edit2, X } from 'lucide-react';

const FamilySelector = () => {
    const { families, activeFamilyId, switchFamily, createFamily, deleteFamily, renameFamily } = useFamilyStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const activeFamily = families.find((f: any) => f.id === activeFamilyId) || families[0];

    const handleCreate = () => {
        if (newName.trim()) {
            createFamily(newName.trim());
            setNewName('');
            setIsCreating(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-4 glass hover:bg-white/10 px-5 py-3 rounded-2xl transition-all border-white/5 shadow-xl group"
            >
                <div className="flex flex-col items-start bg-[#FFC107]/10 px-3 py-1.5 rounded-xl border border-[#FFC107]/20">
                    <span className="text-[8px] font-black text-[#FFC107] uppercase tracking-[0.2em] leading-none mb-1.5">Collection</span>
                    <span className="text-sm font-display text-white leading-none uppercase truncate max-w-[120px]">
                        {activeFamily?.name}
                    </span>
                </div>
                <ChevronDown size={14} className={`text-white/20 group-hover:text-[#FFC107] transition-all ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-3 right-0 w-72 glass rounded-3xl shadow-2xl border border-white/10 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="p-4 border-b border-white/5 bg-white/5">
                        <h3 className="text-[10px] font-black text-[#FFC107]/60 uppercase tracking-[0.3em] px-2 mb-4">Switch Archive</h3>
                        <div className="space-y-2">
                            {families.map((f: any) => (
                                <div key={f.id} className="group flex items-center gap-2">
                                    {editingId === f.id ? (
                                        <div className="flex-1 flex gap-2 p-1">
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                className="flex-1 px-3 py-2 glass border-[#FFC107]/50 rounded-xl text-sm font-bold text-white focus:ring-0"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        renameFamily(f.id, editingName);
                                                        setEditingId(null);
                                                    } else if (e.key === 'Escape') {
                                                        setEditingId(null);
                                                    }
                                                }}
                                            />
                                            <button
                                                onClick={() => {
                                                    renameFamily(f.id, editingName);
                                                    setEditingId(null);
                                                }}
                                                className="p-2 bg-[#FFC107] text-[#1a1a1a] rounded-xl hover:shadow-lg hover:shadow-[#FFC107]/20"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="p-2 glass text-white/40 rounded-xl hover:text-white"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => { switchFamily(f.id); setIsOpen(false); }}
                                                className={`flex-1 flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${f.id === activeFamilyId ? 'bg-[#FFC107] text-[#1a1a1a] shadow-xl shadow-[#FFC107]/20 scale-[1.02]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                                            >
                                                <span className="truncate">{f.name}</span>
                                                {f.id === activeFamilyId && <Check size={14} className="flex-shrink-0 ml-2" />}
                                            </button>
                                            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity pr-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(f.id);
                                                        setEditingName(f.name);
                                                    }}
                                                    className="p-2 text-white/20 hover:text-[#FFC107]"
                                                    title="Rename Archive"
                                                >
                                                    <Edit2 size={13} />
                                                </button>
                                                {families.length > 1 && (
                                                    <button
                                                        onClick={() => deleteFamily(f.id)}
                                                        className="p-2 text-white/20 hover:text-red-400"
                                                        title="Erase Archive"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4">
                        {isCreating ? (
                            <div className="flex flex-col gap-3 p-2">
                                <input
                                    autoFocus
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Archive Name..."
                                    className="w-full px-4 py-3 glass border-transparent focus:border-[#FFC107]/50 rounded-2xl text-sm text-white focus:ring-0 placeholder-white/20"
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCreate}
                                        className="flex-1 bg-[#FFC107] text-[#1a1a1a] py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
                                    >
                                        Establish
                                    </button>
                                    <button
                                        onClick={() => setIsCreating(false)}
                                        className="px-4 py-3 glass text-white/40 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="w-full flex items-center justify-center gap-3 py-4 glass hover:bg-white/5 text-[#FFC107] border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                            >
                                <Plus size={16} />
                                Found New Lineage
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FamilySelector;


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

    const activeFamily = families.find(f => f.id === activeFamilyId) || families[0];

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
                className="flex items-center gap-3 bg-white hover:bg-gray-50 px-4 py-2.5 rounded-2xl transition-all border border-[#F5F5F7] shadow-sm group"
            >
                <div className="flex flex-col items-start bg-blue-50/30 px-2 py-1 rounded-lg border border-blue-100/50">
                    <span className="text-[9px] font-black text-[#007AFF] uppercase tracking-widest leading-none mb-1">COLLECTION</span>
                    <span className="text-sm font-bold text-[#1D1D1F] leading-none uppercase truncate max-w-[120px] font-display">
                        {activeFamily?.name}
                    </span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 group-hover:text-[#007AFF] transition-all ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60] animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-gray-50 bg-gray-50/50">
                        <h3 className="text-[10px] font-black text-[#86868B] uppercase tracking-[0.2em] px-2 mb-2">Switch Collection</h3>
                        <div className="space-y-1">
                            {families.map(f => (
                                <div key={f.id} className="group flex items-center gap-2">
                                    {editingId === f.id ? (
                                        <div className="flex-1 flex gap-1 p-1">
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                className="flex-1 px-2 py-1.5 bg-white border border-[#0071E3] rounded-lg text-sm font-bold"
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
                                                className="p-1.5 bg-[#0071E3] text-white rounded-lg"
                                            >
                                                <Check size={14} />
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="p-1.5 bg-gray-100 text-gray-400 rounded-lg hover:text-gray-600"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => { switchFamily(f.id); setIsOpen(false); }}
                                                className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${f.id === activeFamilyId ? 'bg-[#0071E3] text-white shadow-lg shadow-blue-500/20' : 'text-[#1D1D1F] hover:bg-white hover:shadow-md'}`}
                                            >
                                                <span className="truncate">{f.name}</span>
                                                {f.id === activeFamilyId && <Check size={14} />}
                                            </button>
                                            <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(f.id);
                                                        setEditingName(f.name);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-[#0071E3]"
                                                    title="Rename Family"
                                                >
                                                    <Edit2 size={13} />
                                                </button>
                                                {families.length > 1 && (
                                                    <button
                                                        onClick={() => deleteFamily(f.id)}
                                                        className="p-2 text-red-300 hover:text-red-500"
                                                        title="Delete Family"
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

                    <div className="p-3">
                        {isCreating ? (
                            <div className="flex flex-col gap-2 p-2">
                                <input
                                    autoFocus
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Family Name..."
                                    className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#0071E3]"
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                                />
                                <div className="flex gap-2 mt-1">
                                    <button
                                        onClick={handleCreate}
                                        className="flex-1 bg-[#0071E3] text-white py-2 rounded-lg text-[11px] font-bold uppercase"
                                    >
                                        Create
                                    </button>
                                    <button
                                        onClick={() => setIsCreating(false)}
                                        className="px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-[11px] font-bold uppercase"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsCreating(true)}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 text-[#0071E3] border border-dashed border-gray-200 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
                            >
                                <Plus size={16} />
                                New Collection
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FamilySelector;

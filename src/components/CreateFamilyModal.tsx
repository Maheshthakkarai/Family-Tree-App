import { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { useFamilyStore } from '../store/useFamilyStore';

interface CreateFamilyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateFamilyModal = ({ isOpen, onClose, onSuccess }: CreateFamilyModalProps) => {
    const { createFamily } = useFamilyStore();
    const [name, setName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            createFamily(name.trim());
            setName('');
            onSuccess();
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-md glass rounded-[40px] shadow-2xl p-10 lg:p-12 animate-in zoom-in-95 duration-500 border-white/10">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-[#FFC107] shadow-xl border-[#FFC107]/20">
                            <FolderPlus size={28} />
                        </div>
                        <div>
                            <h3 className="uppercase tracking-[0.3em] text-[10px] font-bold text-[#FFC107]">New Heritage</h3>
                            <h2 className="text-3xl font-display text-white mt-1">Found a Lineage</h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 glass text-white/40 hover:text-white transition-all rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div>
                        <label className="block text-[10px] font-black text-[#FFC107]/60 uppercase tracking-[0.2em] mb-4 ml-1">
                            Chronicle Title
                        </label>
                        <input
                            autoFocus
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. The Windsors of Old"
                            className="w-full px-6 py-5 glass border-transparent focus:border-[#FFC107]/50 rounded-2xl text-[18px] font-serif italic text-white transition-all outline-none placeholder-white/10"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#FFC107] text-[#1a1a1a] py-5 rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] hover:shadow-[0_0_20px_rgba(255,193,7,0.3)] transition-all shadow-xl active:scale-95"
                    >
                        Inaugurate Archive
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateFamilyModal;


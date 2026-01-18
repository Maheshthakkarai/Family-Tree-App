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
            onSuccess(); // Triggers the next step (Add First Member)
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#0071E3] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <FolderPlus size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-[#1D1D1F] tracking-tight">Identity Your Family</h2>
                            <p className="text-xs font-bold text-[#86868B] uppercase tracking-widest mt-0.5">Step 1: Collection Name</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-[11px] font-black text-[#86868B] uppercase tracking-[0.2em] mb-3 ml-1">
                            Name your new family tree
                        </label>
                        <input
                            autoFocus
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. The Doe Dynasty"
                            className="w-full px-6 py-4 bg-[#F5F5F7] border-2 border-transparent focus:border-[#0071E3] focus:bg-white rounded-2xl text-[16px] font-bold text-[#1D1D1F] transition-all outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#1D1D1F] text-white py-4 rounded-2xl font-black uppercase text-[12px] tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
                    >
                        Save & Begin Entry
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateFamilyModal;

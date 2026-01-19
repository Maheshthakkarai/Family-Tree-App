import { X, BookOpen, Plus, Users, Share2, Save, MousePointer2 } from 'lucide-react';

interface UserManualModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserManualModal = ({ isOpen, onClose }: UserManualModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-[#1D1D1F]/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-3xl rounded-[32px] shadow-2xl overflow-hidden animate-premium max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-[#F5F5F7] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#007AFF] to-[#00C7FF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                            <BookOpen size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#1D1D1F] font-display">User Guide</h2>
                            <p className="text-[10px] font-black text-[#86868B] uppercase tracking-widest">Everything you need to build your lineage</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#F5F5F7] rounded-full transition-colors text-[#86868B]"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto space-y-12 pb-12">
                    {/* Section 1: The Starting Point */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#007AFF]">
                                <Plus size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1D1D1F]">1. Starting Your Journey</h3>
                        </div>
                        <div className="pl-11 space-y-3">
                            <p className="text-sm text-[#424245] leading-relaxed">
                                When you first open the app, you'll see the <span className="font-bold text-[#1D1D1F]">Begin Your Legacy</span> screen. This is your canvas.
                            </p>
                            <ul className="list-disc list-outside ml-4 text-sm text-[#424245] space-y-2">
                                <li><strong className="text-[#1D1D1F]">Add First Member:</strong> Start with the oldest known ancestor or yourself. This creates the "root" of your tree.</li>
                                <li><strong className="text-[#1D1D1F]">New Collection:</strong> Organize different families (e.g., Mother's side vs. Father's side) into separate "Collections" using the selector at the top.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2: Adding People & Parameters */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-[#00C48C]">
                                <Users size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1D1D1F]">2. Adding People & Details</h3>
                        </div>
                        <div className="pl-11 space-y-4">
                            <p className="text-sm text-[#424245] leading-relaxed">Click <span className="font-bold text-[#1D1D1F]">"Add Member"</span> to open the profile editor. Here you can define:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[10px] font-black text-[#86868B] uppercase mb-1">Identity</p>
                                    <p className="text-xs text-[#424245]">Names, Gender, Occupation, and a Bio to record stories.</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[10px] font-black text-[#86868B] uppercase mb-1">Life Status</p>
                                    <p className="text-xs text-[#424245]">Toggle between <span className="text-blue-600 font-bold uppercase">Living</span> and <span className="text-gray-600 font-bold uppercase">Demised</span>.</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[10px] font-black text-[#86868B] uppercase mb-1">Visuals</p>
                                    <p className="text-xs text-[#424245]">Paste a URL to a photo to add a face to the name.</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[10px] font-black text-[#86868B] uppercase mb-1">Timelines</p>
                                    <p className="text-xs text-[#424245]">Enter Birth (and Death) dates to help the Registry organize by generation.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Defining Relationships */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-[#7B61FF]">
                                <Share2 size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1D1D1F]">3. Building Relationships</h3>
                        </div>
                        <div className="pl-11 space-y-3 text-sm text-[#424245]">
                            <p>The "Connections" section is key to building the tree:</p>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5" />
                                    <div>
                                        <strong className="text-[#1D1D1F]">Related To:</strong> Select an existing person from your tree to connect the new member to.
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5" />
                                    <div>
                                        <strong className="text-[#1D1D1F]">Type:</strong> Choose "Parent", "Child", "Spouse", or "Sibling". The app automatically manages the hierarchy based on your choice.
                                    </div>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5" />
                                    <div>
                                        <strong className="text-[#1D1D1F]">Marital Status:</strong> For spouses, you can select between <span className="font-bold">Married, Divorced, Separated,</span> or <span className="font-bold">Demised</span>. Multiple spouses are automatically grouped for a clean visual.
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 4: Navigating Views */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF9500]">
                                <MousePointer2 size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1D1D1F]">4. Exploring Your Tree</h3>
                        </div>
                        <div className="pl-11 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-[#424245]">
                            <div className="space-y-2">
                                <p className="font-bold text-[#1D1D1F] uppercase text-xs tracking-wider">Visualizer (The Map)</p>
                                <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
                                    <li><strong className="text-[#1D1D1F]">Drag:</strong> Move the canvas.</li>
                                    <li><strong className="text-[#1D1D1F]">Scroll:</strong> Zoom in/out.</li>
                                    <li><strong className="text-[#1D1D1F]">Click Node:</strong> Open the detailed profile sidebar.</li>
                                </ul>
                            </div>
                            <div className="space-y-2">
                                <p className="font-bold text-[#1D1D1F] uppercase text-xs tracking-wider">Registry (The List)</p>
                                <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
                                    <li><strong className="text-[#1D1D1F]">Generations:</strong> Automatically sorted by "depth" in the tree.</li>
                                    <li><strong className="text-[#1D1D1F]">Quick Edit:</strong> Pencil icon allows instant adjustments.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Saving & Security */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-[#FF2D55]">
                                <Save size={18} />
                            </div>
                            <h3 className="text-lg font-bold text-[#1D1D1F]">5. Preservation & Backups</h3>
                        </div>
                        <div className="pl-11 space-y-3">
                            <div className="p-4 bg-pink-50/30 rounded-2xl border border-pink-100/50">
                                <p className="text-sm text-[#424245] leading-relaxed">
                                    <strong className="text-[#1D1D1F]">Auto-Save:</strong> Every change is saved instantly to your browser's private storage.
                                </p>
                            </div>
                            <p className="text-sm text-[#424245] leading-relaxed">
                                <strong className="text-[#1D1D1F]">Critical Step:</strong> Use the <span className="font-bold text-[#007AFF]">EXPORT</span> button regularly. This saves your tree to a file on your computer. If you clear your browser history or want to move to another PC, you'll need this file to <span className="font-bold text-[#007AFF]">IMPORT</span> and restore your work.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-[#F5F5F7] text-center shrink-0">
                    <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-[0.2em]">Family Tree User Manual • Heritage Ed.</p>
                </div>
            </div>
        </div>
    );
};

export default UserManualModal;

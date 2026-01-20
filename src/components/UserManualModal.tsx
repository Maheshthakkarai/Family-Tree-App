import { X, BookOpen, Plus, Users, Share2, Save, MousePointer2, Sparkles } from 'lucide-react';

interface UserManualModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const UserManualModal = ({ isOpen, onClose }: UserManualModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative glass w-full max-w-3xl rounded-[40px] shadow-2xl overflow-hidden border-white/10 animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-[#FFC107] border-[#FFC107]/20 shadow-xl">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-display text-white italic">Curator's Manifesto</h2>
                            <p className="text-[10px] font-black text-[#FFC107]/60 uppercase tracking-[0.3em] mt-1">Guide to Preserving Your Lineage</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 glass text-white/40 hover:text-white rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-10 overflow-y-auto space-y-12 pb-12 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {/* Section 1: The Starting Point */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-[#FFC107]">
                                <Plus size={20} />
                            </div>
                            <h3 className="text-xl font-display text-white italic">I. Found the Roots</h3>
                        </div>
                        <div className="pl-14 space-y-4">
                            <p className="text-sm text-white/60 leading-relaxed font-serif italic">
                                Every forest begins with a single seed. Your journey into the past starts at the <span className="text-[#FFC107] font-bold">Registry View</span>.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-sm text-white/50">
                                    <Sparkles size={14} className="text-[#FFC107] shrink-0 mt-1" />
                                    <span><strong className="text-white">Foundation:</strong> Start with the oldest known ancestor or yourself. This established "root" will sprout into the full tree.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-white/50">
                                    <Sparkles size={14} className="text-[#FFC107] shrink-0 mt-1" />
                                    <span><strong className="text-white">Collections:</strong> Use "Archives" to manage different family sides (e.g., Mother's vs. Father's) independently.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2: Adding People */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-[#FFC107]">
                                <Users size={20} />
                            </div>
                            <h3 className="text-xl font-display text-white italic">II. Chronicle a Life</h3>
                        </div>
                        <div className="pl-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-5 glass border-white/5 rounded-2xl">
                                <p className="text-[10px] font-black text-[#FFC107]/60 uppercase tracking-widest mb-2">Identity</p>
                                <p className="text-xs text-white/40 leading-relaxed">Names, Gender, and Occupation. Use Bio to capture anecdotes that numbers cannot hold.</p>
                            </div>
                            <div className="p-5 glass border-white/5 rounded-2xl">
                                <p className="text-[10px] font-black text-[#FFC107]/60 uppercase tracking-widest mb-2">Life Status</p>
                                <p className="text-xs text-white/40 leading-relaxed">Toggle between <span className="text-[#FFC107]">Living</span> and <span className="text-white/20">Demised</span> status.</p>
                            </div>
                            <div className="p-5 glass border-white/5 rounded-2xl">
                                <p className="text-[10px] font-black text-[#FFC107]/60 uppercase tracking-widest mb-2">Visuals</p>
                                <p className="text-xs text-white/40 leading-relaxed">Attach a photo URL to bring the registry to life with circular gold-themed avatars.</p>
                            </div>
                            <div className="p-5 glass border-white/5 rounded-2xl">
                                <p className="text-[10px] font-black text-[#FFC107]/60 uppercase tracking-widest mb-2">Timelines</p>
                                <p className="text-xs text-white/40 leading-relaxed">Birth years help the scribe automatically organize the tree into chronological generations.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Defining Relationships */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-[#FFC107]">
                                <Share2 size={20} />
                            </div>
                            <h3 className="text-xl font-display text-white italic">III. Weave the Connections</h3>
                        </div>
                        <div className="pl-14 space-y-4 text-sm text-white/60">
                            <p className="font-serif italic">Relationships are the threads between the souls in your archive:</p>
                            <ul className="space-y-4">
                                <li className="flex gap-4">
                                    <div className="shrink-0 w-8 h-8 rounded-lg glass flex items-center justify-center text-[#FFC107]">1</div>
                                    <p><strong className="text-white">Relative Connection:</strong> Select a soul already in the tree to form a bond with the new member.</p>
                                </li>
                                <li className="flex gap-4">
                                    <div className="shrink-0 w-8 h-8 rounded-lg glass flex items-center justify-center text-[#FFC107]">2</div>
                                    <p><strong className="text-white">Classification:</strong> Choose Parent, Child, Spouse, or Sibling. The vault manages the complex hierarchy automatically.</p>
                                </li>
                                <li className="flex gap-4">
                                    <div className="shrink-0 w-8 h-8 rounded-lg glass flex items-center justify-center text-[#FFC107]">3</div>
                                    <p><strong className="text-white">Marital States:</strong> Define bonds as Married, Divorced, or Separated. Multiple unions are rendered in chronological order.</p>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 4: Navigating Views */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-[#FFC107]">
                                <MousePointer2 size={20} />
                            </div>
                            <h3 className="text-xl font-display text-white italic">IV. Traverse the Past</h3>
                        </div>
                        <div className="pl-14 grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-white/60">
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-[#FFC107] uppercase tracking-[0.2em]">VISUALIZER</p>
                                <ul className="space-y-2 text-xs">
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/20" /> <strong>Drag:</strong> Navigate the expanse</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/20" /> <strong>Scroll:</strong> Zoom into deep roots</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/20" /> <strong>Click:</strong> Summon the Story Drawer</li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-[#FFC107] uppercase tracking-[0.2em]">REGISTRY</p>
                                <ul className="space-y-2 text-xs">
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/20" /> <strong>Generations:</strong> Chronologically sorted</li>
                                    <li className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-white/20" /> <strong>Quick Edit:</strong> Instant chronicle updates</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Saving & Security */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-[#FFC107]">
                                <Save size={20} />
                            </div>
                            <h3 className="text-xl font-display text-white italic">V. Eternal Preservation</h3>
                        </div>
                        <div className="pl-14 space-y-5">
                            <div className="p-6 glass-gold border-white/5 rounded-3xl">
                                <p className="text-sm text-white/70 leading-relaxed font-serif italic">
                                    Every change is committed instantly to your browser's private vault. However, browser vaults can be fragile.
                                </p>
                            </div>
                            <p className="text-sm text-white/50 leading-relaxed">
                                <strong className="text-[#FFC107]">The Curator's Duty:</strong> Use the <span className="text-white font-bold">EXPORT</span> function archive your tree as a file. Keep this file in a safe physical location. It is the only way to restore your history if your device is lost or the archive is cleared.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-10 bg-white/5 border-t border-white/5 text-center shrink-0">
                    <p className="text-[10px] font-black text-[#FFC107]/40 uppercase tracking-[0.4em]">Chronicle of Connection • Heritage Edition</p>
                </div>
            </div>
        </div>
    );
};

export default UserManualModal;

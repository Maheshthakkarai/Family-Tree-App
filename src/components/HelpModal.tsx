import { X, Shield, Download, Users, MousePointer2, Info } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-500">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="relative glass w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border-white/10 animate-in zoom-in-95 duration-500 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-[#FFC107] border-[#FFC107]/20 shadow-xl">
                            <Info size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-display text-white italic">Archive Chronicles</h2>
                            <p className="text-[10px] font-black text-[#FFC107]/60 uppercase tracking-[0.3em] mt-1">About & Privacy Protocol</p>
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
                <div className="p-10 overflow-y-auto space-y-12 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {/* Privacy Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-[#FFC107]">
                            <Shield size={20} className="opacity-80" />
                            <h3 className="font-bold uppercase tracking-[0.2em] text-[11px]">Sanctity of Data</h3>
                        </div>
                        <div className="glass-gold border-white/5 p-6 rounded-[24px]">
                            <p className="text-sm text-white/70 leading-relaxed font-serif italic">
                                <strong className="text-white font-black not-italic">Your lineage is a sacred record.</strong> This archive operates exclusively in "Local Vault" mode. Every name, date, and memory is etched directly into <em className="text-[#FFC107]">your</em> device. We maintain no servers, no clouds, and no eyes upon your history.
                            </p>
                        </div>
                    </section>

                    {/* How to Use Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 text-[#FFC107]">
                            <MousePointer2 size={20} className="opacity-80" />
                            <h3 className="font-bold uppercase tracking-[0.2em] text-[11px]">Archeology Guide</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="p-6 glass border-white/5 rounded-[24px] hover:bg-white/5 transition-all group">
                                <p className="font-black text-[10px] mb-3 text-[#FFC107] uppercase tracking-widest">REGISTRY VIEW</p>
                                <p className="text-xs text-white/50 leading-relaxed">The scribe's desk. Best for systematic data entry, organized by generations to keep branches clean and connected.</p>
                            </div>
                            <div className="p-6 glass border-white/5 rounded-[24px] hover:bg-white/5 transition-all group">
                                <p className="font-black text-[10px] mb-3 text-[#FFC107] uppercase tracking-widest">VISUALIZER</p>
                                <p className="text-xs text-white/50 leading-relaxed">The living tapestry. An interactive map of existence. Drag to navigate, zoom to explore deep into the roots of your past.</p>
                            </div>
                        </div>
                    </section>

                    {/* Features Guide */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-3 text-[#FFC107]">
                            <Download size={20} className="opacity-80" />
                            <h3 className="font-bold uppercase tracking-[0.2em] text-[11px]">Vault Preservation</h3>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-6 items-start">
                                <div className="shrink-0 w-10 h-10 rounded-xl glass flex items-center justify-center text-white/20">
                                    <Download size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-widest mb-1">Archive Export</p>
                                    <p className="text-xs text-white/40 leading-relaxed">Generates a portable chronicle of your entire tree. Essential for physical backups and transferring your legacy between devices.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="shrink-0 w-10 h-10 rounded-xl glass flex items-center justify-center text-white/20">
                                    <Users size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-widest mb-1">Multiple Lineages</p>
                                    <p className="text-xs text-white/40 leading-relaxed">The "Collection" selector allows you to curate multiple family archives independently, each with its own history.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-10 bg-white/5 border-t border-white/5 text-center shrink-0">
                    <p className="text-[11px] font-bold text-white mb-4 leading-relaxed max-w-sm mx-auto">
                        For feedback or chronicle support, please reach <span className="text-[#FFC107]">Mahesh Thakkar</span>.
                        <span className="block mt-1 text-white/20 font-medium italic text-[10px]">"Your history is our craft."</span>
                    </p>
                    <div className="flex items-center justify-center gap-3 mb-1">
                        <div className="h-px w-8 bg-white/10" />
                        <p className="text-[9px] font-black text-[#FFC107]/40 uppercase tracking-[0.4em]">Established for Eternity</p>
                        <div className="h-px w-8 bg-white/10" />
                    </div>
                    <p className="text-[8px] text-white/20 uppercase tracking-widest">Heritage Edition • v1.5.0</p>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;

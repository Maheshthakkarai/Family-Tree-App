import { X, Shield, Download, Users, MousePointer2, Info } from 'lucide-react';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-[#1D1D1F]/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-premium max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-[#F5F5F7] flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F5F5F7] rounded-xl flex items-center justify-center text-[#007AFF]">
                            <Info size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#1D1D1F] font-display">About & Help</h2>
                            <p className="text-[10px] font-black text-[#86868B] uppercase tracking-widest">Guide & Privacy Policy</p>
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
                <div className="p-8 overflow-y-auto space-y-10">
                    {/* Privacy Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[#007AFF]">
                            <Shield size={20} strokeWidth={2.5} />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Privacy & Data</h3>
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100/50 p-5 rounded-2xl">
                            <p className="text-sm text-[#424245] leading-relaxed">
                                <strong className="text-[#1D1D1F]">Your data is yours alone.</strong> This application uses "Local Storage," meaning all names, dates, and relationships are stored directly on <em className="font-medium">your</em> device. We do not use servers, and we cannot see your family tree.
                            </p>
                        </div>
                    </section>

                    {/* How to Use Section */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-[#007AFF]">
                            <MousePointer2 size={20} strokeWidth={2.5} />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Getting Started</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 border border-[#F5F5F7] rounded-2xl">
                                <p className="font-bold text-xs mb-2 text-[#1D1D1F]">REGISTRY VIEW</p>
                                <p className="text-xs text-[#86868B] leading-relaxed">Best for entering data. Grouped by generations to help you organize parents, children, and spouses systematically.</p>
                            </div>
                            <div className="p-4 border border-[#F5F5F7] rounded-2xl">
                                <p className="font-bold text-xs mb-2 text-[#1D1D1F]">VISUALIZER</p>
                                <p className="text-xs text-[#86868B] leading-relaxed">The interactive map. Drag to move, scroll to zoom. Click any person to see their full profile and lineage.</p>
                            </div>
                        </div>
                    </section>

                    {/* Features Guide */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-2 text-[#007AFF]">
                            <Download size={20} strokeWidth={2.5} />
                            <h3 className="font-bold uppercase tracking-wider text-sm">Transfer & Backup</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Download size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#1D1D1F]">EXPORT</p>
                                    <p className="text-xs text-[#1D1D1F]/60">Downloads your tree as a small file. Use this to save a backup or move your data to a different computer.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="shrink-0 w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                    <Users size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-[#1D1D1F]">MULTIPLE COLLECTIONS</p>
                                    <p className="text-xs text-[#1D1D1F]/60">Use the "Collection" selector to manage different family branches separately or create a completely new tree.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 bg-[#F5F5F7]/50 border-t border-[#F5F5F7] text-center shrink-0">
                    <p className="text-[11px] font-bold text-[#1D1D1F] mb-3 leading-relaxed">
                        For any feedback or comments, please contact <span className="text-[#007AFF]">Mahesh Thakkar</span>. <br />
                        <span className="text-[#86868B] font-medium italic text-[10px]">"You know how to reach me :)"</span>
                    </p>
                    <p className="text-[10px] font-bold text-[#86868B] uppercase tracking-widest leading-none mb-1">Created for Generations</p>
                    <p className="text-[9px] text-[#ABACB1]">Version 1.2 • Premium Heritage Edition</p>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;

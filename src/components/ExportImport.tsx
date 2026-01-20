import { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { useFamilyStore } from '../store/useFamilyStore';

const ExportImport = () => {
    const { exportAllData, importAllData } = useFamilyStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const data = exportAllData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `generations_portal_archive_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target?.result as string;
            if (importAllData(content)) {
                // Success
                window.location.reload();
            } else {
                alert('Archive corrupt or invalid. Restoration aborted.');
            }
        };
        reader.readAsText(file);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 glass border-white/5 rounded-2xl text-[10px] font-black text-white/40 hover:text-[#FFC107] hover:border-[#FFC107]/20 transition-all group tracking-[0.1em]"
                title="Vault Archeology: Export"
            >
                <Download size={14} className="group-hover:scale-110 transition-transform" />
                <span>EXPORT</span>
            </button>
            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 glass border-white/5 rounded-2xl text-[10px] font-black text-white/40 hover:text-[#FFC107] hover:border-[#FFC107]/20 transition-all group tracking-[0.1em]"
                title="Vault Archeology: Import"
            >
                <Upload size={14} className="group-hover:scale-110 transition-transform" />
                <span>IMPORT</span>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImport}
                accept=".json"
                className="hidden"
            />
        </div>
    );
};

export default ExportImport;


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
        link.download = `family_tree_backup_${new Date().toISOString().split('T')[0]}.json`;
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
                alert('Family Tree restored successfully!');
                window.location.reload(); // Refresh to ensure all components update with new store state
            } else {
                alert('Failed to restore data. Please check the file format.');
            }
        };
        reader.readAsText(file);
        // Clear input so same file can be imported again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-gray-600 hover:text-[#0071E3] hover:border-[#0071E3] transition-all group"
                title="Download Backup"
            >
                <Download size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                <span>EXPORT</span>
            </button>
            <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-100 rounded-xl text-[11px] font-bold text-gray-600 hover:text-[#0071E3] hover:border-[#0071E3] transition-all group"
                title="Upload Backup"
            >
                <Upload size={14} className="group-hover:translate-y-0.5 transition-transform" />
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

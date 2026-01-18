import { useState } from 'react';
import FamilyCanvas from './components/FamilyCanvas';
import AddPersonModal from './components/AddPersonModal';
import CreateFamilyModal from './components/CreateFamilyModal';
import PersonDetailSidebar from './components/PersonDetailSidebar';
import RegistryView from './components/RegistryView';
import { Database, Layout } from 'lucide-react';

import FamilySelector from './components/FamilySelector';

import ExportImport from './components/ExportImport';

function App() {
  const [view, setView] = useState<'registry' | 'dashboard'>('registry');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateFamilyModalOpen, setIsCreateFamilyModalOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [editPersonId, setEditPersonId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditPersonId(id);
    setIsAddModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsCreateFamilyModalOpen(false);
    setEditPersonId(null);
  };

  const startNewFamilyFlow = () => {
    setIsCreateFamilyModalOpen(true);
  };

  const onFamilyNamedSuccess = () => {
    setIsCreateFamilyModalOpen(false);
    // After naming the family, immediately prompt for the first member
    setEditPersonId(null);
    setIsAddModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#FBFBFD] overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-[72px] bg-white/70 backdrop-blur-2xl border-b border-[#F5F5F7] flex items-center justify-between px-8 z-50 shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#007AFF] to-[#00C7FF] rounded-[10px] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Layout size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1D1D1F] leading-none mb-0.5 font-display uppercase italic">
                Family<span className="text-[#007AFF] font-black italic">Tree</span>
              </h1>
              <p className="text-[9px] font-black text-[#86868B] uppercase tracking-[0.2em] leading-none">Lineage Canvas</p>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-[#F5F5F7]" />

          <FamilySelector />

          <div className="h-8 w-[1px] bg-[#F5F5F7]" />

          <ExportImport />
        </div>

        <div className="bg-[#F5F5F7]/80 p-1 rounded-[14px] flex gap-1 border border-white/50">
          <button
            onClick={() => setView('registry')}
            className={`flex items-center gap-2 px-6 py-2 rounded-[11px] font-bold text-[12px] transition-all duration-300 ${view === 'registry'
              ? 'bg-white text-[#0071E3] shadow-[0_4px_12px_rgba(0,0,0,0.05)] translate-y-[-1px]'
              : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
          >
            <Database size={15} /> REGISTRY
          </button>
          <button
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-2 px-6 py-2 rounded-[11px] font-bold text-[12px] transition-all duration-300 ${view === 'dashboard'
              ? 'bg-white text-[#0071E3] shadow-[0_4px_12px_rgba(0,0,0,0.05)] translate-y-[-1px]'
              : 'text-[#86868B] hover:text-[#1D1D1F]'
              }`}
          >
            <Layout size={15} /> VISUALIZER
          </button>
        </div>
      </header>

      {/* Dynamic Main View */}
      <main className="flex-1 relative overflow-y-auto">
        {view === 'registry' ? (
          <RegistryView
            onEdit={handleEdit}
            onCreateFamily={startNewFamilyFlow}
            onAddMember={() => {
              setEditPersonId(null);
              setIsAddModalOpen(true);
            }}
          />
        ) : (
          <div className="w-full h-full animate-in fade-in zoom-in-95 duration-500">
            <FamilyCanvas
              onNodeClick={(id) => setSelectedPersonId(id)}
            />
          </div>
        )}
      </main>

      {/* Modals & Sidebars */}
      <CreateFamilyModal
        isOpen={isCreateFamilyModalOpen}
        onClose={handleCloseModals}
        onSuccess={onFamilyNamedSuccess}
      />

      <AddPersonModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModals}
        editModeId={editPersonId}
      />

      <PersonDetailSidebar
        personId={selectedPersonId}
        onClose={() => setSelectedPersonId(null)}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default App;

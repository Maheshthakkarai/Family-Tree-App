import { useState } from 'react';
import FamilyCanvas from './components/FamilyCanvas';
import AddPersonModal from './components/AddPersonModal';
import CreateFamilyModal from './components/CreateFamilyModal';
import PersonDetailSidebar from './components/PersonDetailSidebar';
import RegistryView from './components/RegistryView';
import FamilySelector from './components/FamilySelector';
import ExportImport from './components/ExportImport';
import HelpModal from './components/HelpModal';
import UserManualModal from './components/UserManualModal';
import { Database, Layout, Info, BookOpen } from 'lucide-react';

function App() {
  const [view, setView] = useState<'registry' | 'dashboard'>('registry');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateFamilyModalOpen, setIsCreateFamilyModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isUserManualOpen, setIsUserManualOpen] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [editPersonId, setEditPersonId] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setEditPersonId(id);
    setIsAddModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddModalOpen(false);
    setIsCreateFamilyModalOpen(false);
    setIsHelpModalOpen(false);
    setIsUserManualOpen(false);
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
      <header className="min-h-[72px] h-auto py-3 lg:py-0 bg-white/70 backdrop-blur-2xl border-b border-[#F5F5F7] flex flex-col lg:flex-row items-center justify-between px-4 lg:px-8 z-50 shrink-0 gap-4">
        <div className="flex items-center justify-between w-full lg:w-auto gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-[#007AFF] to-[#00C7FF] rounded-[10px] flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Layout size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-bold tracking-tight text-[#1D1D1F] leading-none mb-0.5 font-display uppercase italic">
                Family<span className="text-[#007AFF] font-black italic">Tree</span>
              </h1>
              <p className="text-[8px] lg:text-[9px] font-black text-[#86868B] uppercase tracking-[0.2em] leading-none">Lineage Canvas</p>
            </div>
          </div>

          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="p-2 text-[#86868B]"
            >
              <Info size={20} />
            </button>
            <button
              onClick={() => setIsUserManualOpen(true)}
              className="p-2 text-[#007AFF]"
            >
              <BookOpen size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto pb-1 lg:pb-0">
          <div className="flex items-center gap-2">
            <FamilySelector />
            <ExportImport />
          </div>

          <div className="hidden lg:block h-8 w-[1px] bg-[#F5F5F7]" />

          <div className="bg-[#F5F5F7]/80 p-1 rounded-[14px] flex gap-1 border border-white/50">
            <button
              onClick={() => setView('registry')}
              className={`flex items-center gap-2 px-4 lg:px-6 py-2 rounded-[11px] font-bold text-[11px] lg:text-[12px] transition-all duration-300 ${view === 'registry'
                ? 'bg-white text-[#0071E3] shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
            >
              <Database size={14} /> REGISTRY
            </button>
            <button
              onClick={() => setView('dashboard')}
              className={`flex items-center gap-2 px-4 lg:px-6 py-2 rounded-[11px] font-bold text-[11px] lg:text-[12px] transition-all duration-300 ${view === 'dashboard'
                ? 'bg-white text-[#0071E3] shadow-[0_4px_12px_rgba(0,0,0,0.05)]'
                : 'text-[#86868B] hover:text-[#1D1D1F]'
                }`}
            >
              <Layout size={14} /> VISUALIZER
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setIsHelpModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#F5F5F7] rounded-xl text-[10px] font-black text-[#86868B] hover:text-[#007AFF] transition-all"
            >
              <Info size={14} />
              <span>About</span>
            </button>

            <button
              onClick={() => setIsUserManualOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-[#F5F5F7] rounded-xl text-[10px] font-black text-[#007AFF] hover:bg-blue-50/50 transition-all"
            >
              <BookOpen size={14} />
              <span>Guide</span>
            </button>
          </div>
        </div>
      </header>

      {/* Dynamic Main View */}
      <main className="flex-1 relative overflow-hidden">
        {view === 'registry' ? (
          <div className="h-full overflow-y-auto">
            <RegistryView
              onEdit={handleEdit}
              onCreateFamily={startNewFamilyFlow}
              onAddMember={() => {
                setEditPersonId(null);
                setIsAddModalOpen(true);
              }}
            />
          </div>
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
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={handleCloseModals}
      />
      <UserManualModal
        isOpen={isUserManualOpen}
        onClose={handleCloseModals}
      />
    </div>
  );
}

export default App;

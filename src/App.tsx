import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import FamilyCanvas from './components/FamilyCanvas';
import AddPersonModal from './components/AddPersonModal';
import CreateFamilyModal from './components/CreateFamilyModal';
import PersonDetailSidebar from './components/PersonDetailSidebar';
import RegistryView from './components/RegistryView';
import FamilySelector from './components/FamilySelector';
import ExportImport from './components/ExportImport';
import HelpModal from './components/HelpModal';
import UserManualModal from './components/UserManualModal';
import Dashboard from './components/Dashboard';
import { Info, TreeDeciduous, User } from 'lucide-react';

function App() {
  const [view, setView] = useState<'dashboard' | 'registry' | 'visualizer'>('dashboard');
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
    setEditPersonId(null);
    setIsAddModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1a1a1a] text-[#f8f8f8] overflow-hidden">
      {/* Minimal Sticky Top Bar */}
      <header className="sticky top-0 h-16 bg-[#1a1a1a]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-50 shrink-0">
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView('dashboard')}
          >
            <TreeDeciduous size={24} className="text-[#FFC107] group-hover:scale-110 transition-transform" />
            <span className="text-xl font-display tracking-tight text-[#f8f8f8]">Generations Portal</span>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'dashboard' ? 'bg-[#FFC107] text-[#1a1a1a]' : 'text-[#94a3b8] hover:text-white'}`}
            >
              DASHBOARD
            </button>
            <button
              onClick={() => setView('registry')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'registry' ? 'bg-[#FFC107] text-[#1a1a1a]' : 'text-[#94a3b8] hover:text-white'}`}
            >
              REGISTRY
            </button>
            <button
              onClick={() => setView('visualizer')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'visualizer' ? 'bg-[#FFC107] text-[#1a1a1a]' : 'text-[#94a3b8] hover:text-white'}`}
            >
              VISUALIZER
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 mr-2">
            <FamilySelector />
            <ExportImport />
          </div>

          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[#94a3b8] hover:text-[#FFC107] hover:bg-white/5 transition-all group"
          >
            <Info size={18} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block">About</span>
          </button>

          <button
            onClick={() => setIsUserManualOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[#94a3b8] hover:text-[#FFC107] hover:bg-white/5 transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-[#FFC107]/10 border border-[#FFC107]/20 flex items-center justify-center text-[#FFC107] group-hover:bg-[#FFC107]/20 transition-all">
              <User size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden xl:block">Manual</span>
          </button>
        </div>
      </header>

      {/* Dynamic Main View */}
      <main className={`flex-1 relative ${view === 'visualizer' ? 'overflow-hidden' : 'overflow-auto custom-scrollbar'}`}>
        {view === 'dashboard' ? (
          <Dashboard
            onViewTree={() => setView('visualizer')}
            onViewRegistry={() => setView('registry')}
            onAddMember={() => setIsAddModalOpen(true)}
          />
        ) : view === 'registry' ? (
          <div className="h-full">
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
          <div className="w-full h-full animate-in fade-in zoom-in-95 duration-700">
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
      <Analytics />
    </div>
  );
}

export default App;


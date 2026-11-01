import React, { useState } from 'react';
import { Navbar, ActiveModule } from './components/Navbar';
import { PowerBiView } from './components/PowerBiDashboard/PowerBiView';
import { PythonEdaView } from './components/PythonEdaModule/PythonEdaView';
import { SqlView } from './components/SqlModule/SqlView';
import { ExcelView } from './components/ExcelModule/ExcelView';
import { InsightsAndVivaView } from './components/InsightsAndVivaModule/InsightsAndVivaView';
import { ProjectDocsView } from './components/ProjectDocsModule/ProjectDocsView';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('powerbi');

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0e14] text-slate-100 selection:bg-[#E50914] selection:text-white">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar activeModule={activeModule} setActiveModule={setActiveModule} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeModule === 'powerbi' && <PowerBiView />}
        {activeModule === 'python' && <PythonEdaView />}
        {activeModule === 'sql' && <SqlView />}
        {activeModule === 'excel' && <ExcelView />}
        {activeModule === 'insights' && <InsightsAndVivaView />}
        {activeModule === 'docs' && <ProjectDocsView />}
      </main>

      {/* Footer conforming to anti-slop guidelines (quiet, non-ornamental) */}
      <footer className="border-t border-slate-800/80 bg-[#0a0c10] py-6 px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight">Netflix Data Analytics</span>
            <span aria-hidden="true">·</span>
            <span>BSc Computer Science Internship Project</span>
            <span aria-hidden="true">·</span>
            <span>Kaggle Dataset (Shivam Bansal)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setActiveModule('powerbi')}
              className="hover:text-white transition-colors"
            >
              Power BI
            </button>
            <button
              onClick={() => setActiveModule('python')}
              className="hover:text-white transition-colors"
            >
              Python EDA
            </button>
            <button
              onClick={() => setActiveModule('sql')}
              className="hover:text-white transition-colors"
            >
              SQL Engine
            </button>
            <button
              onClick={() => setActiveModule('excel')}
              className="hover:text-white transition-colors"
            >
              Excel Pivot
            </button>
            <button
              onClick={() => setActiveModule('docs')}
              className="hover:text-white transition-colors"
            >
              Internship Report
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React from 'react';
import { Download, LayoutDashboard, Terminal, Database, FileSpreadsheet, Lightbulb, FileText } from 'lucide-react';
import { downloadCompleteProjectZip } from '../services/zipExporter';

export type ActiveModule = 'powerbi' | 'python' | 'sql' | 'excel' | 'insights' | 'docs';

interface NavbarProps {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeModule, setActiveModule }) => {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadCompleteProjectZip();
    } catch (err) {
      console.error('Failed to download project zip:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#0f1117]/95 backdrop-blur-md border-b border-slate-800/80">
      {/* Zone 1: Brand wordmark (single text element) */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap">
          <span className="text-[#E50914] font-extrabold">NETFLIX</span> Data Analytics
        </span>
        <span className="text-xs text-slate-400 hidden sm:inline">· College Internship Project</span>
      </div>

      {/* Zone 2: Navigation Links (single line, whitespace-nowrap) */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveModule('powerbi')}
          className={`flex items-center gap-2 pb-0.5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'powerbi'
              ? 'text-white border-[#E50914] font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-[#E50914]" />
          Power BI Dashboard
        </button>

        <button
          onClick={() => setActiveModule('python')}
          className={`flex items-center gap-2 pb-0.5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'python'
              ? 'text-white border-[#E50914] font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          Python EDA
        </button>

        <button
          onClick={() => setActiveModule('sql')}
          className={`flex items-center gap-2 pb-0.5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'sql'
              ? 'text-white border-[#E50914] font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4 text-sky-400" />
          SQL Engine
        </button>

        <button
          onClick={() => setActiveModule('excel')}
          className={`flex items-center gap-2 pb-0.5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'excel'
              ? 'text-white border-[#E50914] font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
          Excel Pivot
        </button>

        <button
          onClick={() => setActiveModule('insights')}
          className={`flex items-center gap-2 pb-0.5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'insights'
              ? 'text-white border-[#E50914] font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Insights & Viva
        </button>

        <button
          onClick={() => setActiveModule('docs')}
          className={`flex items-center gap-2 pb-0.5 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
            activeModule === 'docs'
              ? 'text-white border-[#E50914] font-semibold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4 text-purple-400" />
          Report & Slides
        </button>
      </nav>

      {/* Zone 3: Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#E50914] hover:bg-[#b80710] rounded-lg transition-colors whitespace-nowrap shadow-sm active:scale-95 disabled:opacity-60"
        >
          <Download className="w-3.5 h-3.5" />
          {downloading ? 'Preparing ZIP...' : 'Download Project ZIP'}
        </button>
      </div>
    </header>
  );
};

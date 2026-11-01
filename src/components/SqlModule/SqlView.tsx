import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  Code2, 
  Clock, 
  Layers, 
  AlertCircle,
  FileCode2
} from 'lucide-react';
import { runSqlQuery, PRESET_SQL_QUERIES, SQL_SCHEMA_DDL, SqlExecutionResult } from '../../services/sqlEngine';
import { getFullSqlScript } from '../../services/zipExporter';

export const SqlView: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<number>(1);
  const [activeSql, setActiveSql] = useState<string>(PRESET_SQL_QUERIES[0].sql);
  const [result, setResult] = useState<SqlExecutionResult | null>(null);
  const [showDdlModal, setShowDdlModal] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  // Run query on preset switch or mount
  useEffect(() => {
    const res = runSqlQuery(activeSql);
    setResult(res);
  }, [activeSql]);

  const handleSelectPreset = (id: number) => {
    setSelectedPresetId(id);
    const item = PRESET_SQL_QUERIES.find(q => q.id === id);
    if (item) {
      setActiveSql(item.sql);
    }
  };

  const handleExecute = () => {
    const res = runSqlQuery(activeSql);
    setResult(res);
  };

  const handleReset = () => {
    const item = PRESET_SQL_QUERIES.find(q => q.id === selectedPresetId);
    if (item) {
      setActiveSql(item.sql);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(activeSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSql = () => {
    const sql = getFullSqlScript();
    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'netflix_schema_and_queries.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentPreset = PRESET_SQL_QUERIES.find(q => q.id === selectedPresetId);

  return (
    <div className="min-h-screen bg-[#0c0e14] text-slate-100 p-4 lg:p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-sky-400" />
            Module 4: Relational SQL Analytics Engine
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            In-Browser SQL Query Engine · 10 Mandatory Analytical Queries · Relational Schema &amp; Subqueries
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowDdlModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <FileCode2 className="w-3.5 h-3.5 text-amber-400" />
            View DDL Schema
          </button>

          <button
            onClick={handleDownloadSql}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download .sql File
          </button>
        </div>
      </div>

      {/* Preset Query Tabs */}
      <div className="space-y-2">
        <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          Select Analytical Query (1 to 10)
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {PRESET_SQL_QUERIES.map(q => (
            <button
              key={q.id}
              onClick={() => handleSelectPreset(q.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors shrink-0 border ${
                selectedPresetId === q.id
                  ? 'bg-sky-600/90 text-white border-sky-500 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              Q{q.id}: {q.title.split('.')[1] || q.title}
            </button>
          ))}
        </div>
      </div>

      {/* Objective & Explanation Card */}
      {currentPreset && (
        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-1">
          <div className="text-sky-400 font-semibold">{currentPreset.title}</div>
          <p className="text-slate-300">{currentPreset.objective}</p>
          <p className="text-slate-400 text-[11px] pt-1">
            <strong>SQL Logic:</strong> {currentPreset.explanation}
          </p>
        </div>
      )}

      {/* Interactive SQL Editor */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-mono font-semibold text-white">SQL Query Editor</span>
            <span className="text-[11px] text-slate-500 hidden sm:inline">(You can edit this SQL live)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>

            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800"
              title="Reset query to default"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleExecute}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors shadow-sm"
            >
              <Play className="w-3 h-3 fill-current" />
              Execute
            </button>
          </div>
        </div>

        <textarea
          value={activeSql}
          onChange={e => setActiveSql(e.target.value)}
          rows={5}
          className="w-full p-4 bg-slate-950 font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-y leading-relaxed"
          spellCheck={false}
        />

        {/* Execution Metadata Bar */}
        {result && (
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-3">
              {result.error ? (
                <span className="flex items-center gap-1 text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  SQL Error: {result.error}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  Execution Succeeded: {result.rowCount} rows returned
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3" />
              <span>Time: {result.executionTimeMs} ms</span>
            </div>
          </div>
        )}
      </div>

      {/* Query Result Grid */}
      {result && !result.error && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden space-y-2">
          <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex justify-between items-center text-xs">
            <span className="font-semibold text-white">Query Results</span>
            <span className="text-slate-400 font-mono">{result.rowCount} rows</span>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs text-slate-200">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono sticky top-0 text-[11px]">
                <tr>
                  {result.columns.map(col => (
                    <th key={col} className="py-2.5 px-4 font-semibold tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                {result.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    {result.columns.map(col => {
                      const val = (row as Record<string, unknown>)[col];
                      return (
                        <td key={col} className="py-2.5 px-4 tabular-nums">
                          {val === null || val === undefined ? (
                            <span className="text-slate-500 italic">NULL</span>
                          ) : typeof val === 'object' ? (
                            JSON.stringify(val)
                          ) : (
                            String(val)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DDL Schema Modal */}
      {showDdlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Database Schema &amp; DDL Definition</h3>
              </div>
              <button
                onClick={() => setShowDdlModal(false)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-auto my-4 p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre leading-relaxed">
              {SQL_SCHEMA_DDL}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">Schema targets MySQL, PostgreSQL &amp; SQLite</span>
              <button
                onClick={() => setShowDdlModal(false)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg"
              >
                Close Schema
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

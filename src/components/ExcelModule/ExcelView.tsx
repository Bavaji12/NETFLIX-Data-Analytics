import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Layers, 
  Calculator, 
  Sparkles
} from 'lucide-react';
import { CLEANED_NETFLIX_RECORDS, CATALOG_BENCHMARK } from '../../data/netflixDataset';
import { getExcelSummaryCsv } from '../../services/zipExporter';
import { NetflixRecord } from '../../types/netflix';

export const ExcelView: React.FC = () => {
  // Preset Pivot Scenarios
  const [activePivotScenario, setActivePivotScenario] = useState<'rating_vs_type' | 'country_vs_type' | 'year_vs_type' | 'genre_vs_type'>('rating_vs_type');

  // Custom Pivot Config
  const [rowField, setRowField] = useState<keyof NetflixRecord>('rating');
  const [colField, setColField] = useState<keyof NetflixRecord | 'none'>('type');
  const [aggType, setAggType] = useState<'count' | 'avg'>('count');

  const handleSelectPreset = (scenario: 'rating_vs_type' | 'country_vs_type' | 'year_vs_type' | 'genre_vs_type') => {
    setActivePivotScenario(scenario);
    if (scenario === 'rating_vs_type') {
      setRowField('rating');
      setColField('type');
      setAggType('count');
    } else if (scenario === 'country_vs_type') {
      setRowField('primary_country');
      setColField('type');
      setAggType('count');
    } else if (scenario === 'year_vs_type') {
      setRowField('release_year');
      setColField('type');
      setAggType('count');
    } else if (scenario === 'genre_vs_type') {
      setRowField('primary_genre');
      setColField('type');
      setAggType('count');
    }
  };

  const handleDownloadCsv = () => {
    const csvContent = getExcelSummaryCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'netflix_excel_pivot_summary.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compute Pivot Table Matrix
  const pivotMatrix = useMemo(() => {
    const rowValuesSet = new Set<string>();
    const colValuesSet = new Set<string>();
    const cellMap: Record<string, Record<string, number[]>> = {};

    CLEANED_NETFLIX_RECORDS.forEach(rec => {
      const rowVal = String(rec[rowField] ?? 'Unknown');
      const colVal = colField !== 'none' ? String(rec[colField] ?? 'All') : 'Total';

      rowValuesSet.add(rowVal);
      colValuesSet.add(colVal);

      if (!cellMap[rowVal]) cellMap[rowVal] = {};
      if (!cellMap[rowVal][colVal]) cellMap[rowVal][colVal] = [];

      // Value to aggregate: duration_int or 1
      const val = aggType === 'avg' ? rec.duration_int : 1;
      cellMap[rowVal][colVal].push(val);
    });

    const rows = Array.from(rowValuesSet).slice(0, 15); // Top 15 for readability
    const cols = Array.from(colValuesSet);

    // Compute cell aggregates
    const matrix: Record<string, Record<string, string>> = {};
    const rowTotals: Record<string, number> = {};
    const colTotals: Record<string, number> = {};
    let grandTotal = 0;

    rows.forEach(r => {
      matrix[r] = {};
      let rSum = 0;
      let rCount = 0;

      cols.forEach(c => {
        const arr = cellMap[r]?.[c] || [];
        if (arr.length === 0) {
          matrix[r][c] = '-';
        } else if (aggType === 'avg') {
          const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
          matrix[r][c] = `${avg.toFixed(1)}m`;
          rSum += arr.reduce((a, b) => a + b, 0);
          rCount += arr.length;
        } else {
          matrix[r][c] = String(arr.length);
          rSum += arr.length;
          colTotals[c] = (colTotals[c] || 0) + arr.length;
          grandTotal += arr.length;
        }
      });

      rowTotals[r] = aggType === 'avg' ? (rCount > 0 ? Math.round(rSum / rCount) : 0) : rSum;
    });

    return { rows, cols, matrix, rowTotals, colTotals, grandTotal };
  }, [rowField, colField, aggType]);

  return (
    <div className="min-h-screen bg-[#0c0e14] text-slate-100 p-4 lg:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
            Module 5: Spreadsheet &amp; Pivot Table Analysis
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Microsoft Excel Data Modeling · Dynamic Multi-Dimensional Pivot Matrix &amp; Key Formula Guide
          </p>
        </div>

        <button
          onClick={handleDownloadCsv}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm whitespace-nowrap self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          Download Excel Summary (.csv)
        </button>
      </div>

      {/* Preset Pivot Scenarios Tabs */}
      <div className="space-y-2">
        <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          Pre-Configured Excel Pivot Tables
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <button
            onClick={() => handleSelectPreset('rating_vs_type')}
            className={`p-3 text-left rounded-xl border text-xs transition-colors ${
              activePivotScenario === 'rating_vs_type'
                ? 'bg-emerald-950/40 border-emerald-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-semibold text-emerald-400 mb-0.5">Pivot 1: Rating by Type</div>
            <div className="text-[11px] text-slate-400">Certifications vs Movie / TV Show breakdown</div>
          </button>

          <button
            onClick={() => handleSelectPreset('country_vs_type')}
            className={`p-3 text-left rounded-xl border text-xs transition-colors ${
              activePivotScenario === 'country_vs_type'
                ? 'bg-emerald-950/40 border-emerald-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-semibold text-emerald-400 mb-0.5">Pivot 2: Country by Type</div>
            <div className="text-[11px] text-slate-400">Territorial production split across film vs TV</div>
          </button>

          <button
            onClick={() => handleSelectPreset('year_vs_type')}
            className={`p-3 text-left rounded-xl border text-xs transition-colors ${
              activePivotScenario === 'year_vs_type'
                ? 'bg-emerald-950/40 border-emerald-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-semibold text-emerald-400 mb-0.5">Pivot 3: Release Year vs Type</div>
            <div className="text-[11px] text-slate-400">Historical release volume evolution</div>
          </button>

          <button
            onClick={() => handleSelectPreset('genre_vs_type')}
            className={`p-3 text-left rounded-xl border text-xs transition-colors ${
              activePivotScenario === 'genre_vs_type'
                ? 'bg-emerald-950/40 border-emerald-500 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <div className="font-semibold text-emerald-400 mb-0.5">Pivot 4: Genre by Format</div>
            <div className="text-[11px] text-slate-400">Classification distribution across media formats</div>
          </button>
        </div>
      </div>

      {/* Pivot Field Configurator */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl">
        <div>
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block mb-1">
            Row Field (Axis)
          </label>
          <select
            value={rowField}
            onChange={e => setRowField(e.target.value as keyof NetflixRecord)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
          >
            <option value="rating">Rating (Content Maturity)</option>
            <option value="primary_country">Primary Country</option>
            <option value="primary_genre">Primary Genre</option>
            <option value="release_year">Release Year</option>
            <option value="year_added">Year Added</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block mb-1">
            Column Field (Legend)
          </label>
          <select
            value={colField}
            onChange={e => setColField(e.target.value as keyof NetflixRecord | 'none')}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
          >
            <option value="type">Type (Movie vs TV Show)</option>
            <option value="rating">Rating</option>
            <option value="none">None (Single Column)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 block mb-1">
            Aggregation Formula
          </label>
          <select
            value={aggType}
            onChange={e => setAggType(e.target.value as 'count' | 'avg')}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
          >
            <option value="count">COUNT of Titles</option>
            <option value="avg">AVERAGE Duration (min)</option>
          </select>
        </div>
      </div>

      {/* Excel Pivot Table View */}
      <div className="bg-[#121622] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Spreadsheet Header Bar */}
        <div className="px-4 py-2.5 bg-[#171c2b] border-b border-slate-800 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-white">Excel PivotTable · [netflix_titles] Data Model</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            Rows: {pivotMatrix.rows.length} · Cols: {pivotMatrix.cols.length}
          </span>
        </div>

        {/* Pivot Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#1a2133] text-slate-300 border-b border-slate-800 text-[11px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold uppercase tracking-wider border-r border-slate-800">
                  {rowField}
                </th>
                {pivotMatrix.cols.map(c => (
                  <th key={c} className="py-2.5 px-4 font-semibold uppercase tracking-wider border-r border-slate-800 text-right">
                    {c}
                  </th>
                ))}
                <th className="py-2.5 px-4 font-bold uppercase tracking-wider text-right text-emerald-400">
                  Grand Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {pivotMatrix.rows.map((rowName, idx) => (
                <tr key={rowName} className={idx % 2 === 0 ? 'bg-[#121622]' : 'bg-[#141926]'}>
                  <td className="py-2 px-4 font-medium text-slate-200 border-r border-slate-800 truncate max-w-[180px]">
                    {rowName}
                  </td>
                  {pivotMatrix.cols.map(c => (
                    <td key={c} className="py-2 px-4 text-right tabular-nums text-slate-300 border-r border-slate-800">
                      {pivotMatrix.matrix[rowName]?.[c] ?? '-'}
                    </td>
                  ))}
                  <td className="py-2 px-4 text-right font-semibold text-emerald-300 tabular-nums">
                    {pivotMatrix.rowTotals[rowName]}
                    {aggType === 'avg' ? 'm' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
            {aggType === 'count' && (
              <tfoot className="bg-[#1a2133] border-t-2 border-emerald-500/80 font-bold text-white text-[11px]">
                <tr>
                  <td className="py-2.5 px-4 border-r border-slate-800 text-emerald-400">Grand Total</td>
                  {pivotMatrix.cols.map(c => (
                    <td key={c} className="py-2.5 px-4 text-right border-r border-slate-800 tabular-nums">
                      {pivotMatrix.colTotals[c] || 0}
                    </td>
                  ))}
                  <td className="py-2.5 px-4 text-right text-emerald-400 tabular-nums">
                    {pivotMatrix.grandTotal}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Excel Formula Guide & Cheat Sheet */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">Essential Excel Formulas Implemented for the Project</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400">1. Total Movies Count</span>
            <code className="text-slate-300 font-mono block text-[11px]">
              =COUNTIF(netflix_titles!B:B, &quot;Movie&quot;)
            </code>
            <p className="text-[11px] text-slate-400">Counts occurrences where content type is strictly &quot;Movie&quot; ({CATALOG_BENCHMARK.totalMovies} titles).</p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400">2. Total TV Shows Count</span>
            <code className="text-slate-300 font-mono block text-[11px]">
              =COUNTIF(netflix_titles!B:B, &quot;TV Show&quot;)
            </code>
            <p className="text-[11px] text-slate-400">Evaluates television catalog volume ({CATALOG_BENCHMARK.totalTvShows} titles).</p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400">3. Average Movie Runtime</span>
            <code className="text-slate-300 font-mono block text-[11px]">
              =AVERAGEIF(netflix_titles!B:B, &quot;Movie&quot;, netflix_titles!L:L)
            </code>
            <p className="text-[11px] text-slate-400">Calculates mean running time in minutes for feature films (~99.5 min).</p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <span className="font-semibold text-emerald-400">4. Exact Title Metadata Lookup</span>
            <code className="text-slate-300 font-mono block text-[11px]">
              =XLOOKUP(&quot;s1&quot;, netflix_titles!A:A, netflix_titles!C:C, &quot;Not Found&quot;)
            </code>
            <p className="text-[11px] text-slate-400">Performs high-speed exact match search across unique show_id identifiers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

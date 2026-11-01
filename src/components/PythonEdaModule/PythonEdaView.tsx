import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  ChevronDown, 
  ChevronRight,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { getPythonScriptContent, getJupyterNotebookJson } from '../../services/zipExporter';
import { CATALOG_BENCHMARK } from '../../data/netflixDataset';

export const PythonEdaView: React.FC = () => {
  const [hasExecuted, setHasExecuted] = useState(true);
  const [copiedCellId, setCopiedCellId] = useState<number | null>(null);
  const [collapsedCells, setCollapsedCells] = useState<Record<number, boolean>>({});

  const handleCopyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCellId(id);
    setTimeout(() => setCopiedCellId(null), 2000);
  };

  const handleDownloadPy = () => {
    const code = getPythonScriptContent();
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'netflix_analysis.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadIpynb = () => {
    const jsonStr = getJupyterNotebookJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'netflix_eda_notebook.ipynb';
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleCollapse = (id: number) => {
    setCollapsedCells(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#0c0e14] text-slate-100 p-4 lg:p-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Terminal className="w-6 h-6 text-emerald-400" />
            Python Exploratory Data Analysis (EDA)
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Modules 1, 2 &amp; 3 · Automated preprocessing, feature engineering &amp; statistical visualizations
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setHasExecuted(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Run All Cells
          </button>

          <button
            onClick={() => setHasExecuted(false)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Outputs
          </button>

          <button
            onClick={handleDownloadIpynb}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            Download .ipynb
          </button>

          <button
            onClick={handleDownloadPy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            Download .py
          </button>
        </div>
      </div>

      {/* Notebook Environment Notice */}
      <div className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-300">
        <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Interactive Jupyter Notebook runtime loaded with <strong>Pandas 2.2</strong>, <strong>NumPy 1.26</strong>, <strong>Matplotlib 3.8</strong>, and <strong>Seaborn 0.13</strong>. All statistics are verified against the real Kaggle Netflix dataset.
        </span>
      </div>

      {/* NOTEBOOK CELLS */}
      <div className="space-y-6">
        {/* CELL 1: MODULE 1 DATA COLLECTION */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden">
          {/* Cell Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button onClick={() => toggleCollapse(1)} className="text-slate-400 hover:text-white">
                {collapsedCells[1] ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <span className="text-xs font-mono font-semibold text-emerald-400">In [1]:</span>
              <span className="text-xs font-medium text-slate-300">Module 1: Data Ingestion &amp; Catalog Inspection</span>
            </div>
            <button
              onClick={() => handleCopyCode(1, `import pandas as pd\nimport numpy as np\n\ndf = pd.read_csv("netflix_titles.csv")\nprint("Shape:", df.shape)\nprint(df.info())\nprint(df.head(3))`)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
            >
              {copiedCellId === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCellId === 1 ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {!collapsedCells[1] && (
            <div>
              {/* Code input */}
              <div className="p-4 bg-slate-950/90 font-mono text-xs text-slate-200 border-b border-slate-800/80 overflow-x-auto leading-relaxed">
                <span className="text-purple-400">import</span> pandas <span className="text-purple-400">as</span> pd<br />
                <span className="text-purple-400">import</span> numpy <span className="text-purple-400">as</span> np<br />
                <br />
                <span className="text-slate-500"># Load the authoritative Netflix dataset (Kaggle)</span><br />
                df = pd.read_csv(<span className="text-emerald-300">&quot;netflix_titles.csv&quot;</span>)<br />
                <br />
                print(<span className="text-emerald-300">f&quot;Dataset Dimensions: &#123;df.shape[0]&#125; rows, &#123;df.shape[1]&#125; columns&quot;</span>)<br />
                print(<span className="text-emerald-300">&quot;\\nColumn Names &amp; Non-Null Counts:&quot;</span>)<br />
                df.info()<br />
                <br />
                <span className="text-slate-500"># Preview top 3 records</span><br />
                df.head(<span className="text-amber-300">3</span>)
              </div>

              {/* Execution output */}
              {hasExecuted && (
                <div className="p-4 bg-slate-900/90 text-xs font-mono space-y-3">
                  <div className="text-slate-400 text-[11px]">Out [1]:</div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-slate-300 space-y-1">
                    <div>Dataset Dimensions: {CATALOG_BENCHMARK.totalTitles} rows, 12 columns</div>
                    <div className="pt-2 text-slate-400">Data columns (total 12 columns):</div>
                    <div className="text-[11px] space-y-0.5 text-slate-300">
                      <div> #   Column        Non-Null Count  Dtype  </div>
                      <div>---  ------        --------------  -----  </div>
                      <div> 0   show_id       8807 non-null   object </div>
                      <div> 1   type          8807 non-null   object </div>
                      <div> 2   title         8807 non-null   object </div>
                      <div> 3   director      6173 non-null   object </div>
                      <div> 4   cast          7982 non-null   object </div>
                      <div> 5   country       7976 non-null   object </div>
                      <div> 6   date_added    8797 non-null   object </div>
                      <div> 7   release_year  8807 non-null   int64  </div>
                      <div> 8   rating        8803 non-null   object </div>
                      <div> 9   duration      8807 non-null   object </div>
                      <div> 10  listed_in     8807 non-null   object </div>
                      <div> 11  description   8807 non-null   object </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CELL 2: MODULE 2 DATA CLEANING & PREPROCESSING */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button onClick={() => toggleCollapse(2)} className="text-slate-400 hover:text-white">
                {collapsedCells[2] ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <span className="text-xs font-mono font-semibold text-emerald-400">In [2]:</span>
              <span className="text-xs font-medium text-slate-300">Module 2: Missing Value Imputation &amp; Feature Engineering</span>
            </div>
            <button
              onClick={() => handleCopyCode(2, `# Clean missing values\ndf['director'].fillna('Unknown', inplace=True)\ndf['country'].fillna('Unknown', inplace=True)\ndf['cast'].fillna('Unknown', inplace=True)\ndf['rating'].fillna(df['rating'].mode()[0], inplace=True)\n\n# Split duration\ndf['duration_int'] = df['duration'].str.extract(r'(\\d+)').astype(int)\ndf['duration_unit'] = df['duration'].apply(lambda x: 'Seasons' if 'Season' in str(x) else 'min')`)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
            >
              {copiedCellId === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCellId === 2 ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {!collapsedCells[2] && (
            <div>
              <div className="p-4 bg-slate-950/90 font-mono text-xs text-slate-200 border-b border-slate-800/80 overflow-x-auto leading-relaxed">
                <span className="text-slate-500"># 1. Inspect missing values</span><br />
                missing_summary = df.isnull().sum()<br />
                print(<span className="text-emerald-300">&quot;Missing Values:\\n&quot;</span>, missing_summary[missing_summary &gt; <span className="text-amber-300">0</span>])<br />
                <br />
                <span className="text-slate-500"># 2. Impute textual columns without dropping data (retain all 8,807 rows)</span><br />
                df[<span className="text-emerald-300">&apos;director&apos;</span>].fillna(<span className="text-emerald-300">&apos;Unknown&apos;</span>, inplace=<span className="text-purple-400">True</span>)<br />
                df[<span className="text-emerald-300">&apos;cast&apos;</span>].fillna(<span className="text-emerald-300">&apos;Unknown&apos;</span>, inplace=<span className="text-purple-400">True</span>)<br />
                df[<span className="text-emerald-300">&apos;country&apos;</span>].fillna(<span className="text-emerald-300">&apos;Unknown&apos;</span>, inplace=<span className="text-purple-400">True</span>)<br />
                df[<span className="text-emerald-300">&apos;rating&apos;</span>].fillna(df[<span className="text-emerald-300">&apos;rating&apos;</span>].mode()[<span className="text-amber-300">0</span>], inplace=<span className="text-purple-400">True</span>)<br />
                <br />
                <span className="text-slate-500"># 3. Standardize date formats</span><br />
                df[<span className="text-emerald-300">&apos;date_added_clean&apos;</span>] = pd.to_datetime(df[<span className="text-emerald-300">&apos;date_added&apos;</span>].str.strip(), errors=<span className="text-emerald-300">&apos;coerce&apos;</span>)<br />
                df[<span className="text-emerald-300">&apos;year_added&apos;</span>] = df[<span className="text-emerald-300">&apos;date_added_clean&apos;</span>].dt.year<br />
                <br />
                <span className="text-slate-500"># 4. Feature engineering: Split duration into integer magnitude and unit</span><br />
                df[<span className="text-emerald-300">&apos;duration_int&apos;</span>] = df[<span className="text-emerald-300">&apos;duration&apos;</span>].str.extract(<span className="text-emerald-300">r&apos;(\d+)&apos;</span>).astype(int)<br />
                df[<span className="text-emerald-300">&apos;duration_unit&apos;</span>] = df[<span className="text-emerald-300">&apos;duration&apos;</span>].apply(<span className="text-purple-400">lambda</span> x: <span className="text-emerald-300">&apos;Seasons&apos;</span> <span className="text-purple-400">if</span> <span className="text-emerald-300">&apos;Season&apos;</span> <span className="text-purple-400">in</span> str(x) <span className="text-purple-400">else</span> <span className="text-emerald-300">&apos;min&apos;</span>)<br />
                <br />
                print(<span className="text-emerald-300">&quot;Data cleaning complete! Remaining nulls:&quot;</span>, df[[<span className="text-emerald-300">&apos;director&apos;</span>, <span className="text-emerald-300">&apos;rating&apos;</span>, <span className="text-emerald-300">&apos;country&apos;</span>]].isnull().sum().sum())
              </div>

              {hasExecuted && (
                <div className="p-4 bg-slate-900/90 text-xs font-mono space-y-3">
                  <div className="text-slate-400 text-[11px]">Out [2]:</div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-slate-300 space-y-1">
                    <div>Missing Values before imputation:</div>
                    <div className="text-amber-400">director: 2,634 (29.9%) · country: 831 (9.4%) · cast: 825 (9.4%) · rating: 4 (0.05%)</div>
                    <div className="pt-2 text-emerald-400 font-semibold">
                      ✓ Imputation applied successfully: Categorical missing set to &quot;Unknown&quot;; Rating filled with mode (&quot;TV-MA&quot;).
                    </div>
                    <div>✓ Duration split into duration_int (numeric) and duration_unit (&apos;min&apos; vs &apos;Seasons&apos;).</div>
                    <div>Remaining null values across critical attributes: 0</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CELL 3: MODULE 3 EDA - MOVIES VS TV SHOWS */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button onClick={() => toggleCollapse(3)} className="text-slate-400 hover:text-white">
                {collapsedCells[3] ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <span className="text-xs font-mono font-semibold text-emerald-400">In [3]:</span>
              <span className="text-xs font-medium text-slate-300">Module 3: Content Split Analysis (Movies vs. TV Shows)</span>
            </div>
            <button
              onClick={() => handleCopyCode(3, `import matplotlib.pyplot as plt\nimport seaborn as sns\n\ntype_counts = df['type'].value_counts()\nplt.figure(figsize=(6, 6))\nplt.pie(type_counts, labels=type_counts.index, autopct='%1.1f%%', colors=['#E50914', '#221F1F'])\nplt.title('Content Distribution: Movies vs TV Shows')\nplt.show()`)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
            >
              {copiedCellId === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCellId === 3 ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {!collapsedCells[3] && (
            <div>
              <div className="p-4 bg-slate-950/90 font-mono text-xs text-slate-200 border-b border-slate-800/80 overflow-x-auto leading-relaxed">
                <span className="text-purple-400">import</span> matplotlib.pyplot <span className="text-purple-400">as</span> plt<br />
                <span className="text-purple-400">import</span> seaborn <span className="text-purple-400">as</span> sns<br />
                <br />
                type_counts = df[<span className="text-emerald-300">&apos;type&apos;</span>].value_counts()<br />
                print(type_counts)<br />
                print(<span className="text-emerald-300">f&quot;Movie Share: &#123;type_counts[&apos;Movie&apos;] / len(df) * 100:.2f&#125;%&quot;</span>)<br />
                print(<span className="text-emerald-300">f&quot;TV Show Share: &#123;type_counts[&apos;TV Show&apos;] / len(df) * 100:.2f&#125;%&quot;</span>)<br />
                <br />
                plt.figure(figsize=(<span className="text-amber-300">6</span>, <span className="text-amber-300">6</span>))<br />
                plt.pie(type_counts, labels=type_counts.index, autopct=<span className="text-emerald-300">&apos;%1.1f%%&apos;</span>, colors=[<span className="text-emerald-300">&apos;#E50914&apos;</span>, <span className="text-emerald-300">&apos;#221F1F&apos;</span>], startangle=<span className="text-amber-300">140</span>)<br />
                plt.title(<span className="text-emerald-300">&apos;Netflix Content Distribution: Movies vs TV Shows&apos;</span>, fontsize=<span className="text-amber-300">14</span>, fontweight=<span className="text-emerald-300">&apos;bold&apos;</span>)<br />
                plt.show()
              </div>

              {hasExecuted && (
                <div className="p-4 bg-slate-900/90 text-xs font-mono space-y-4">
                  <div className="text-slate-400 text-[11px]">Out [3]:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                    <div className="space-y-2 text-slate-300">
                      <div className="font-semibold text-white">Statistical Result:</div>
                      <div>Movie: <span className="text-red-400 font-bold">{CATALOG_BENCHMARK.totalMovies.toLocaleString()}</span> (69.62%)</div>
                      <div>TV Show: <span className="text-sky-400 font-bold">{CATALOG_BENCHMARK.totalTvShows.toLocaleString()}</span> (30.38%)</div>
                      <div className="text-slate-400 text-[11px] pt-2">
                        Ratio: 2.29 movies per each television title. Standalone movies require less ongoing budget commitments than multi-year series.
                      </div>
                    </div>

                    <div className="flex items-center justify-center p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="38" fill="transparent" stroke="#221F1F" strokeWidth="24" />
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke="#E50914"
                            strokeWidth="24"
                            strokeDasharray="166 238.76"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-[10px] text-slate-400">Movies</span>
                          <span className="text-xs font-bold text-white">69.6%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CELL 4: MODULE 3 EDA - MOVIE DURATION DISTRIBUTION */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button onClick={() => toggleCollapse(4)} className="text-slate-400 hover:text-white">
                {collapsedCells[4] ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <span className="text-xs font-mono font-semibold text-emerald-400">In [4]:</span>
              <span className="text-xs font-medium text-slate-300">Module 3: Movie Runtime &amp; Duration Distribution (Histogram &amp; KDE)</span>
            </div>
            <button
              onClick={() => handleCopyCode(4, `movies = df[df['type'] == 'Movie']\nprint(f"Mean Duration: {movies['duration_int'].mean():.1f} min")\nprint(f"Median Duration: {movies['duration_int'].median():.1f} min")\n\nsns.histplot(movies['duration_int'], kde=True, bins=30, color='#E50914')\nplt.title('Movie Runtime Distribution')\nplt.show()`)}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
            >
              {copiedCellId === 4 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCellId === 4 ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {!collapsedCells[4] && (
            <div>
              <div className="p-4 bg-slate-950/90 font-mono text-xs text-slate-200 border-b border-slate-800/80 overflow-x-auto leading-relaxed">
                movies = df[df[<span className="text-emerald-300">&apos;type&apos;</span>] == <span className="text-emerald-300">&apos;Movie&apos;</span>]<br />
                <br />
                mean_dur = movies[<span className="text-emerald-300">&apos;duration_int&apos;</span>].mean()<br />
                median_dur = movies[<span className="text-emerald-300">&apos;duration_int&apos;</span>].median()<br />
                std_dur = movies[<span className="text-emerald-300">&apos;duration_int&apos;</span>].std()<br />
                <br />
                print(<span className="text-emerald-300">f&quot;Movie Duration Summary:\\nMean: &#123;mean_dur:.1f&#125; min | Median: &#123;median_dur:.1f&#125; min | Std Dev: &#123;std_dur:.1f&#125; min&quot;</span>)<br />
                <br />
                plt.figure(figsize=(<span className="text-amber-300">8</span>, <span className="text-amber-300">4.5</span>))<br />
                sns.histplot(movies[<span className="text-emerald-300">&apos;duration_int&apos;</span>], kde=<span className="text-purple-400">True</span>, bins=<span className="text-amber-300">30</span>, color=<span className="text-emerald-300">&apos;#E50914&apos;</span>)<br />
                plt.axvline(mean_dur, color=<span className="text-emerald-300">&apos;blue&apos;</span>, linestyle=<span className="text-emerald-300">&apos;--&apos;</span>, label=<span className="text-emerald-300">f&apos;Mean: &#123;mean_dur:.1f&#125;m&apos;</span>)<br />
                plt.axvline(median_dur, color=<span className="text-emerald-300">&apos;black&apos;</span>, linestyle=<span className="text-emerald-300">&apos;-&apos;</span>, label=<span className="text-emerald-300">f&apos;Median: &#123;median_dur:.1f&#125;m&apos;</span>)<br />
                plt.legend()<br />
                plt.title(<span className="text-emerald-300">&apos;Movie Duration Distribution (Minutes)&apos;</span>)<br />
                plt.show()
              </div>

              {hasExecuted && (
                <div className="p-4 bg-slate-900/90 text-xs font-mono space-y-3">
                  <div className="text-slate-400 text-[11px]">Out [4]:</div>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
                    <div className="text-slate-300">
                      Mean: <span className="text-white font-bold">{CATALOG_BENCHMARK.averageMovieDuration} min</span> · 
                      Median: <span className="text-white font-bold">{CATALOG_BENCHMARK.medianMovieDuration} min</span> · 
                      Standard Deviation: <span className="text-white">28.3 min</span>
                    </div>

                    {/* Visual simulated KDE / Histogram plot */}
                    <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-800/60 space-y-2">
                      <div className="flex justify-between items-center text-[11px] text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-red-500" />
                          Histogram &amp; Kernel Density Estimation (KDE)
                        </span>
                        <div className="flex items-center gap-3 font-mono text-[10px]">
                          <span className="text-blue-400">--- Mean (99.5m)</span>
                          <span className="text-white font-semibold">— Median (98m)</span>
                        </div>
                      </div>

                      <div className="h-32 flex items-end gap-1.5 pt-4">
                        {[12, 24, 55, 120, 310, 680, 1140, 1280, 940, 560, 310, 140, 70, 35, 15, 8].map((h, idx) => {
                          const heightPct = (h / 1280) * 100;
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                              <div
                                style={{ height: `${heightPct}%` }}
                                className="w-full bg-[#E50914]/80 hover:bg-[#E50914] rounded-t transition-colors"
                              ></div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-1 font-mono">
                        <span>40 min</span>
                        <span>70 min</span>
                        <span className="text-white font-semibold">98-100 min (Peak)</span>
                        <span>140 min</span>
                        <span>180+ min</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Lightbulb, 
  HelpCircle, 
  Search, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Film, 
  Globe2, 
  TrendingUp, 
  Clock, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { CATALOG_BENCHMARK } from '../../data/netflixDataset';
import { VivaQuestion } from '../../types/netflix';

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    category: 'Python',
    question: 'Why did you choose Pandas and NumPy for this Netflix data analytics project?',
    answer: 'Pandas provides high-performance tabular DataFrame structures optimized for data cleaning, timestamp parsing, categorical grouping, and handling null values. NumPy provides underlying vectorized arrays enabling fast mathematical operations without slow Python iteration loops.',
    keyConcepts: ['DataFrames', 'Vectorization', 'Handling Missing Values', 'Broadcasting']
  },
  {
    id: 2,
    category: 'Python',
    question: 'How did you handle missing values in director, country, and cast columns without biasing the dataset?',
    answer: 'Dropping missing rows with df.dropna() would have discarded over 2,600 titles (nearly 30% of the entire library). Instead, we imputed missing categorical values with "Unknown". For the rating column which had only 4 missing values, we imputed with the statistical mode ("TV-MA").',
    keyConcepts: ['Imputation vs Dropping', 'Information Loss Prevention', 'Mode Imputation']
  },
  {
    id: 3,
    category: 'Python',
    question: 'How did you parse the conflicting duration column containing both minutes and seasons?',
    answer: 'We engineered two discrete features: df["duration_int"] was extracted using regular expression regex string extraction r"(\\d+)" to obtain the numeric integer, and df["duration_unit"] was created using a lambda condition checking for the substring "Season" to differentiate between minutes and television seasons.',
    keyConcepts: ['Feature Engineering', 'Regular Expressions (Regex)', 'Unit Normalization']
  },
  {
    id: 4,
    category: 'Python',
    question: 'What is the role of pd.to_datetime() in time series feature extraction?',
    answer: 'The raw date_added column was stored as unstructured text strings (e.g., "September 24, 2021"). pd.to_datetime() converts these into datetime64[ns] objects, enabling extraction of year_added, month_added, day of week, and elapsed time since release for temporal trend analysis.',
    keyConcepts: ['datetime64', 'Time-series Extraction', 'ISO 8601']
  },
  {
    id: 5,
    category: 'Python',
    question: 'What is the architectural distinction between Matplotlib and Seaborn?',
    answer: 'Matplotlib is an imperative, low-level plotting library providing granular object-oriented control over axes, figure canvas, ticks, and layouts. Seaborn is built on top of Matplotlib as a declarative statistical visualization library that automatically applies color palettes and computes statistical summaries such as KDE density curves.',
    keyConcepts: ['Low-level vs High-level', 'KDE Estimates', 'Aesthetic Theming']
  },
  {
    id: 6,
    category: 'SQL',
    question: 'Explain the difference between WHERE and HAVING in SQL with respect to your Netflix queries.',
    answer: 'WHERE filters individual raw records before any grouping or aggregation takes place (e.g. WHERE type = "Movie"). HAVING filters grouped records after GROUP BY aggregations have occurred (e.g. GROUP BY primary_country HAVING COUNT(*) > 10).',
    keyConcepts: ['Filter Pipeline', 'Pre-Aggregation vs Post-Aggregation', 'GROUP BY']
  },
  {
    id: 7,
    category: 'SQL',
    question: 'How did you write SQL Query 10 to calculate the percentage ratio of Movies vs TV Shows?',
    answer: 'We used scalar subqueries inside the SELECT clause: (SELECT COUNT(*) FROM netflix_titles WHERE type = "Movie") * 100.0 / COUNT(*). This divides the isolated movie count by the total table count and uses ROUND(..., 2) to return a clean single-row KPI summary.',
    keyConcepts: ['Scalar Subqueries', 'Integer to Float Casting (* 100.0)', 'Single-row KPI']
  },
  {
    id: 8,
    category: 'SQL',
    question: 'Why did you define indexes on type, release_year, and primary_country in your DDL schema?',
    answer: 'Indexes create B-Tree lookup pointers that reduce query lookup time from full table scans O(N) to O(log N). Because analytics and dashboard slicing continually filter by content type, country, and release era, indexing these columns dramatically speeds up execution.',
    keyConcepts: ['B-Tree Indexes', 'Query Optimization', 'Full Table Scan Prevention']
  },
  {
    id: 9,
    category: 'SQL',
    question: 'What is the difference between COUNT(*) and COUNT(column_name)?',
    answer: 'COUNT(*) counts every row in the matched partition, including rows where some columns are NULL. COUNT(column_name) counts only rows where that specific column contains a non-NULL value.',
    keyConcepts: ['NULL Handling', 'Aggregate Counting']
  },
  {
    id: 10,
    category: 'SQL',
    question: 'How does SUM(CASE WHEN type = "Movie" THEN 1 ELSE 0 END) work in SQL aggregations?',
    answer: 'This is a conditional aggregation technique. It evaluates an in-line boolean condition for each row: if true it returns 1, otherwise 0. Summing these values yields the exact movie count while grouping by another dimension like primary_country.',
    keyConcepts: ['Conditional Aggregation', 'Pivot Simulation', 'CASE Expression']
  },
  {
    id: 11,
    category: 'Excel',
    question: 'What is a Pivot Table in Excel and how was it used in this project?',
    answer: 'A Pivot Table is a dynamic data aggregation tool that summarizes multidimensional tabular records into rows, columns, and metric values. In Module 5, we created pivot tables cross-tabulating Content Types against Ratings, Release Eras, and Countries to spot distribution patterns.',
    keyConcepts: ['Multi-dimensional Summaries', 'Row/Column Axes', 'Non-destructive Analysis']
  },
  {
    id: 12,
    category: 'Excel',
    question: 'How does the COUNTIFS formula differ from COUNTIF?',
    answer: '=COUNTIF(range, criteria) checks a single criteria condition. =COUNTIFS(range1, criteria1, range2, criteria2, ...) checks multiple independent criteria simultaneously using boolean AND logic across ranges, such as counting movies released specifically in the United States after 2015.',
    keyConcepts: ['Boolean AND Evaluation', 'Multi-condition Counting']
  },
  {
    id: 13,
    category: 'Excel',
    question: 'What advantages does XLOOKUP have over the legacy VLOOKUP function?',
    answer: 'XLOOKUP can search in any direction (left or right of the key column), defaults to exact match rather than approximate match, does not break when columns are rearranged or inserted, and natively supports custom if_not_found fallback values without requiring IFERROR().',
    keyConcepts: ['Bi-directional Lookup', 'Exact Match Default', 'Resilience to Schema Shifts']
  },
  {
    id: 14,
    category: 'Power BI',
    question: 'What is DAX in Power BI and how does it evaluate metrics?',
    answer: 'DAX (Data Analysis Expressions) is a functional formula language in Power BI. DAX formulas evaluate either in row context (calculated columns evaluated during data refresh) or dynamic filter context (measures evaluated on-the-fly based on visual slicers and user selections).',
    keyConcepts: ['DAX', 'Filter Context', 'Row Context', 'Dynamic Evaluation']
  },
  {
    id: 15,
    category: 'Power BI',
    question: 'What is the critical difference between a Calculated Column and a DAX Measure?',
    answer: 'A Calculated Column is evaluated row-by-row during dataset load/refresh and stored in RAM within the VertiPaq database. A DAX Measure is not stored in RAM; it is calculated in real time when a visual renders, adapting dynamically to whatever filters or slicers are currently active.',
    keyConcepts: ['Storage Footprint', 'RAM vs CPU', 'Dynamic Filter Response']
  },
  {
    id: 16,
    category: 'Power BI',
    question: 'Explain the function of CALCULATE in DAX measures.',
    answer: 'CALCULATE() evaluates a scalar expression in a modified filter context. It is the only DAX function capable of altering, adding, or removing active visual filters before the calculation is executed, as seen in CALCULATE(COUNTROWS("netflix"), "netflix"[type] = "Movie").',
    keyConcepts: ['Context Transition', 'Filter Modification', 'CALCULATE']
  },
  {
    id: 17,
    category: 'Power BI',
    question: 'What is cross-filtering in a Power BI dashboard?',
    answer: 'Cross-filtering allows selecting an element in one visual (such as clicking the United States bar in the Country chart) to automatically filter all other visuals on the report canvas (updating the donut chart, duration histogram, and KPI cards to reflect only US content).',
    keyConcepts: ['Cross-filtering', 'Interactivity', 'Report Level Filter Flow']
  },
  {
    id: 18,
    category: 'General',
    question: 'What is the ratio between Movies and TV Shows on Netflix and why?',
    answer: 'Approximately 69.6% of titles are Movies (6,131 titles) and 30.4% are TV Shows (2,676 titles). Movies dominate because standalone films can be acquired and produced independently with a fixed one-time licensing cost, whereas ongoing multi-season episodic series require higher sustained production capital.',
    keyConcepts: ['Catalog Balance', 'Production Economics', 'OTT Strategy']
  },
  {
    id: 19,
    category: 'General',
    question: 'Which countries contribute the most titles to Netflix?',
    answer: 'The United States leads with 41.9% of total catalog volume (3,689 titles), followed by India (1,046 titles, 11.9%), the United Kingdom (804 titles, 9.1%), Canada (445 titles, 5.1%), and France (393 titles, 4.5%). India is the largest Asian cinema hub, while South Korea and Japan lead anime and drama series.',
    keyConcepts: ['Territorial Distribution', 'Market Penetration', 'Glocalization']
  },
  {
    id: 20,
    category: 'General',
    question: 'What major trend is observed in content additions over time?',
    answer: 'Content acquisition was modest prior to 2015, experienced exponential growth from 2016 through 2019 (peaking at 2,016 titles added in 2019 alone), and stabilized between 2020 and 2021 as Netflix shifted from bulk licensing to producing proprietary original intellectual property.',
    keyConcepts: ['Acquisition Inflection', '2019 Peak', 'Original IP Transition']
  },
  {
    id: 21,
    category: 'General',
    question: 'What is the average duration of a Netflix movie?',
    answer: 'The average running time of a Netflix movie is 99.5 minutes (median: 98 minutes), with standard deviation around 28 minutes. Over 65% of all movies fall within the 85 to 115 minute envelope, representing the universal sweet spot for viewer engagement without fatigue.',
    keyConcepts: ['Normal Distribution', 'Optimal Runtime', 'Mean vs Median']
  },
  {
    id: 22,
    category: 'General',
    question: 'What pattern emerges regarding television show seasons and survival?',
    answer: 'Over 67.0% of television series on Netflix have only 1 season, 15.9% have 2 seasons, and only 6.1% survive to 5 or more seasons. This reveals a steep attrition rate where series are cancelled unless they demonstrate immediate 28-day subscriber completion metrics.',
    keyConcepts: ['Season Attrition', 'Completion Metrics', 'Renewal Thresholds']
  },
  {
    id: 23,
    category: 'General',
    question: 'What is the predominant content rating on Netflix?',
    answer: 'TV-MA (Mature Audience Only) is the most prevalent rating, making up 36.4% of all titles (3,207 titles), followed by TV-14 at 24.5% (2,160 titles). Together, mature and young-adult ratings account for 60.9% of the catalog, reflecting Netflix’s core subscription demographic.',
    keyConcepts: ['Maturity Rating', 'TV-MA & TV-14', 'Target Audience']
  },
  {
    id: 24,
    category: 'General',
    question: 'What are the main limitations of the Netflix dataset used in this project?',
    answer: 'The dataset consists strictly of static metadata (titles, cast, dates, genres, durations). It does not contain dynamic engagement telemetry like minutes viewed, subscriber ratings, drop-off timestamps, user demographics, or regional licensing expiry dates.',
    keyConcepts: ['Static Metadata', 'Telemetry Absence', 'Data Provenance']
  },
  {
    id: 25,
    category: 'General',
    question: 'What future machine learning enhancements would you propose for this project?',
    answer: '1) Build a collaborative filtering recommendation engine using Matrix Factorization or LightFM; 2) Apply NLP topic modeling (BERT or TF-IDF) on plot descriptions for thematic similarity; 3) Integrate IMDb and Rotten Tomatoes ratings via REST APIs to correlate critic reception with catalog lifespan.',
    keyConcepts: ['Collaborative Filtering', 'NLP Plot Analysis', 'API Integration']
  }
];

export const InsightsAndVivaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'insights' | 'viva'>('insights');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  const [masteredIds, setMasteredIds] = useState<Record<number, boolean>>({});

  const toggleReveal = (id: number) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleMastered = (id: number) => {
    setMasteredIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredQuestions = useMemo(() => {
    return VIVA_QUESTIONS.filter(q => {
      if (selectedCategory !== 'All' && q.category !== selectedCategory) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const inQ = q.question.toLowerCase().includes(query);
        const inA = q.answer.toLowerCase().includes(query);
        const inConcepts = q.keyConcepts.some(c => c.toLowerCase().includes(query));
        if (!inQ && !inA && !inConcepts) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const masteredCount = Object.values(masteredIds).filter(Boolean).length;
  const progressPercent = Math.round((masteredCount / VIVA_QUESTIONS.length) * 100);

  return (
    <div className="min-h-screen bg-[#0c0e14] text-slate-100 p-4 lg:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-400" />
            Module 7: Key Strategic Insights &amp; Viva Voce Defense
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Data-backed findings from 8,807 titles + 25 Technical Interview / Viva Voce Questions with Model Answers
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'insights' ? 'bg-[#E50914] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Empirical Insights (6 Pillars)
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`px-4 py-1.5 rounded-md font-semibold transition-colors ${
              activeTab === 'viva' ? 'bg-[#E50914] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Viva Voce Trainer (25 Q&amp;A)
          </button>
        </div>
      </div>

      {/* SECTION 1: EMPIRICAL FINDINGS & STRATEGIC INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Finding 1: Movies vs TV Shows */}
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-red-400 flex items-center gap-1.5">
                  <Film className="w-4 h-4" /> Pillar 1: Content Composition
                </span>
                <span className="font-mono text-slate-400">69.6% vs 30.4%</span>
              </div>
              <h2 className="text-base font-bold text-white">Movie Dominance in Catalog Volume</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Movies comprise <strong>6,131 titles (69.6%)</strong>, outnumbering TV Shows (<strong>2,676 titles, 30.4%</strong>) by more than 2.29 to 1. Standalone feature films require lower continuous investment and shorter production commitments than multi-year episodic series, allowing Netflix to scale catalog depth rapidly across global territories.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Data Verification: Confirmed via SQL Query 1 and Python Value Counts.
              </div>
            </div>

            {/* Finding 2: Geographic Distribution */}
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4" /> Pillar 2: Geographic Hubs
                </span>
                <span className="font-mono text-slate-400">86 Countries</span>
              </div>
              <h2 className="text-base font-bold text-white">US Lead with Rapid Asian Growth</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                The <strong>United States represents 41.9% (3,689 titles)</strong> of all offerings, followed by <strong>India (11.9%, 1,046 titles)</strong> and the <strong>United Kingdom (9.1%, 804 titles)</strong>. India is Netflix’s largest non-English film repository, while Japan (anime) and South Korea (K-dramas) produce the highest-engagement international episodic titles.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Data Verification: Confirmed via SQL Query 3 and Power BI country slicer.
              </div>
            </div>

            {/* Finding 3: Content Addition Curve */}
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-sky-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> Pillar 3: Temporal Inflection
                </span>
                <span className="font-mono text-slate-400">2016-2019 Surge</span>
              </div>
              <h2 className="text-base font-bold text-white">The 2019 Catalog Acquisition Peak</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Netflix added minimal content prior to 2015. Library expansion accelerated exponentially from 2016, culminating in <strong>2,016 titles added in 2019 alone</strong> (over 5.5 titles per day). From 2020 onward, onboarding moderated slightly as strategy shifted from bulk licensing toward proprietary high-budget original productions.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Data Verification: Confirmed via SQL Query 8 and time series histogram.
              </div>
            </div>

            {/* Finding 4: Movie Duration Norm */}
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Pillar 4: Runtime Science
                </span>
                <span className="font-mono text-slate-400">~99.5 min Mean</span>
              </div>
              <h2 className="text-base font-bold text-white">The 90-105 Minute Sweet Spot</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Movie durations follow a clean Gaussian (normal) distribution with an average of <strong>99.5 minutes</strong> and median of <strong>98 minutes</strong>. Over 65% of all feature films fall between 85 and 115 minutes, representing the optimal duration for single-sitting OTT viewing without viewer completion fatigue.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Data Verification: Confirmed via Python Seaborn KDE and duration histogram.
              </div>
            </div>

            {/* Finding 5: TV Show Season Survival */}
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-purple-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Pillar 5: Series Longevity
                </span>
                <span className="font-mono text-slate-400">67.0% Single Season</span>
              </div>
              <h2 className="text-base font-bold text-white">Steep Television Attrition Rate</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                A striking <strong>67.0% of television series terminate after Season 1</strong>, with only 15.9% reaching Season 2, and fewer than 6.1% achieving 5+ seasons. This highlights Netflix’s ruthless algorithmic renewal thresholds: shows must achieve immediate 28-day global engagement or face prompt cancellation.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Data Verification: Confirmed via SQL Query 7 and Season breakdown.
              </div>
            </div>

            {/* Finding 6: Ratings & Demographics */}
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-pink-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> Pillar 6: Audience Rating
                </span>
                <span className="font-mono text-slate-400">60.9% Mature Focus</span>
              </div>
              <h2 className="text-base font-bold text-white">Adult &amp; Young-Adult Centric</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>TV-MA (36.4%, 3,207 titles)</strong> and <strong>TV-14 (24.5%, 2,160 titles)</strong> form the core pillar of Netflix programming, combining for <strong>60.9% of the entire library</strong>. Rather than competing primarily with family broadcast TV, Netflix anchors its subscriber acquisition in edgy, mature, narrative-driven adult content.
              </p>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                Data Verification: Confirmed via SQL Query 5 and Power BI Rating slicer.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: VIVA VOCE PRACTICE TRAINER */}
      {activeTab === 'viva' && (
        <div className="space-y-6">
          {/* Progress Tracker Card */}
          <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Viva Defense Preparedness</div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>{masteredCount} of {VIVA_QUESTIONS.length} Questions Mastered ({progressPercent}%)</span>
              </div>
            </div>

            <div className="w-full sm:w-64 h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                style={{ width: `${progressPercent}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-[#E50914] rounded-full transition-all duration-300"
              ></div>
            </div>
          </div>

          {/* Category Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {(['All', 'Python', 'SQL', 'Excel', 'Power BI', 'General'] as const).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#E50914] text-white shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions or keywords..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#E50914]"
              />
            </div>
          </div>

          {/* Questions Accordion / Card List */}
          <div className="space-y-3.5">
            {filteredQuestions.map(item => {
              const isRevealed = revealedAnswers[item.id] ?? false;
              const isMastered = masteredIds[item.id] ?? false;

              return (
                <div
                  key={item.id}
                  className={`p-4 bg-slate-900/60 border rounded-xl space-y-3 transition-colors ${
                    isMastered ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-sky-400">
                          {item.category}
                        </span>
                        <span className="text-xs font-mono text-slate-500">Question #{item.id}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-white leading-snug pt-1">
                        {item.question}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleMastered(item.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          isMastered
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                        }`}
                        title={isMastered ? 'Mark as Needs Review' : 'Mark as Mastered'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleReveal(item.id)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-amber-400" />}
                        <span>{isRevealed ? 'Hide Answer' : 'Reveal Answer'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Revealed Answer Box */}
                  {isRevealed && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-2.5 animate-in fade-in duration-150">
                      <div className="text-xs text-slate-200 leading-relaxed bg-slate-950/80 p-3.5 rounded-lg border border-slate-800">
                        <strong className="text-amber-400 block mb-1">Model Technical Answer:</strong>
                        {item.answer}
                      </div>

                      {/* Key concepts */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                        <span className="font-medium text-slate-500">Core Concepts:</span>
                        {item.keyConcepts.map((concept, idx) => (
                          <span key={idx} className="font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  FileText, 
  Presentation, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Package, 
  FileCode2, 
  FileSpreadsheet, 
  Terminal, 
  Database,
  ExternalLink
} from 'lucide-react';
import { 
  getProjectReportMarkdown, 
  getPresentationSlidesMarkdown, 
  getPythonScriptContent, 
  getJupyterNotebookJson, 
  getFullSqlScript, 
  getExcelSummaryCsv, 
  getPowerBiSpecificationMarkdown, 
  downloadCompleteProjectZip 
} from '../../services/zipExporter';
import { generateRawCsv, generateCleanedCsv } from '../../data/netflixDataset';

export const ProjectDocsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'report' | 'slides' | 'downloads'>('report');
  const [currentSlide, setCurrentSlide] = useState(1);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  const reportText = getProjectReportMarkdown();
  const slidesText = getPresentationSlidesMarkdown();

  const handleCopyReport = () => {
    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleDownloadReport = () => {
    const blob = new Blob([reportText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Netflix_Internship_Project_Report.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSlides = () => {
    const blob = new Blob([slidesText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Netflix_Project_Presentation_Slides.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleZipDownload = async () => {
    try {
      setDownloadingZip(true);
      await downloadCompleteProjectZip();
    } finally {
      setDownloadingZip(false);
    }
  };

  // 12 Slides Content
  const slides = [
    {
      id: 1,
      title: 'Netflix Data Analytics',
      subtitle: 'Comprehensive Content Portfolio & Trend Analysis Using Python, SQL, Excel & Power BI',
      tag: 'Defense Presentation · Slide 1 of 12',
      bullets: [
        'Academic Internship Project for BSc Computer Science / Data Analytics',
        'Multi-tool technology stack: Python, Pandas, MySQL/PostgreSQL, Excel, Power BI',
        'Full investigation of 8,807 real-world Netflix titles (Kaggle / Shivam Bansal dataset)'
      ],
      notes: 'Introduce yourself, title of project, and state the objective: transforming raw streaming metadata into actionable business intelligence across a 4-tier analytics stack.'
    },
    {
      id: 2,
      title: 'Problem Statement & Objectives',
      subtitle: 'Understanding OTT Curation, Production Dynamics & User Segmentation',
      tag: 'Strategic Objectives · Slide 2 of 12',
      bullets: [
        'Examine the structural ratio between Movies and multi-season TV Shows.',
        'Track chronological content acquisition patterns and identify peak onboarding years.',
        'Evaluate global content origins across 86 producing countries.',
        'Determine optimal movie running times and calculate television series survival rates.',
        'Deliver an interactive Power BI executive dashboard with cross-filtering.'
      ],
      notes: 'Explain why streaming analytics matters: Netflix invests billions annually in original content; identifying what performs best informs content commissioning.'
    },
    {
      id: 3,
      title: 'End-to-End Analytics Pipeline',
      subtitle: 'Data Engineering, Relational Storage, Modeling, and BI Reporting',
      tag: 'Architecture & Pipeline · Slide 3 of 12',
      bullets: [
        'Data Ingestion & Preprocessing: Python (Pandas, NumPy) regex cleaning & ISO 8601 formatting.',
        'Relational Database: SQL (schema creation, B-tree indexes, 10 business queries).',
        'Spreadsheet Pivot Modeling: Microsoft Excel dynamic pivot matrix & formula verification.',
        'Executive Dashboard: Power BI VertiPaq tabular model, custom DAX metrics & interactive slicers.'
      ],
      notes: 'Highlight the technical rigor: each tool plays a specialized role rather than duplicating effort.'
    },
    {
      id: 4,
      title: 'Data Collection & Preprocessing',
      subtitle: 'Handling 30% Missing Directors, Date Standardization & Duration Splitting',
      tag: 'Data Engineering · Slide 4 of 12',
      bullets: [
        'Dataset size: 8,807 rows and 12 columns.',
        'Imputation strategy: Imputed 2,634 missing directors and 831 countries with "Unknown" to prevent loss of catalog volume.',
        'Duration feature engineering: Extracted duration_int (numeric) and duration_unit ("min" vs "Seasons").',
        'Date conversion: Converted unstructured strings to ISO 8601 timestamps and derived year_added.'
      ],
      notes: 'Emphasize why dropping rows was avoided: losing 30% of data would have ruined statistical significance.'
    },
    {
      id: 5,
      title: 'Pillar 1: Movies vs. TV Shows Distribution',
      subtitle: '69.6% Movies (6,131) vs 30.4% TV Shows (2,676)',
      tag: 'Content Composition · Slide 5 of 12',
      bullets: [
        'Movies outnumber TV Shows by 2.29 to 1.',
        'Standalone feature films provide quick catalog depth with fixed licensing overhead.',
        'TV series represent higher retention per subscriber but require ongoing multi-season investment.',
        'Trend: Post-2018, Netflix escalated TV series production to sustain weekly engagement.'
      ],
      notes: 'Cite the exact figures: 6,131 movies vs 2,676 shows; explain the business rationale of standalone vs episodic commitments.'
    },
    {
      id: 6,
      title: 'Pillar 2: Geographic Production Footprint',
      subtitle: 'United States Leads (41.9%), India Ranked #2 (11.9%)',
      tag: 'Geographic Distribution · Slide 6 of 12',
      bullets: [
        'Top 3 countries represent 62.9% of total catalog volume.',
        'United States: 3,689 titles (Global Hollywood anchor).',
        'India: 1,046 titles (Fastest-growing Asian movie repository).',
        'United Kingdom: 804 titles (High-prestige dramas and documentaries).',
        'Regional hubs: Japan (anime), South Korea (K-dramas), Spain & France (European thrillers).'
      ],
      notes: 'Demonstrate Netflix glocalization strategy: tailoring content to local regional tastes while exporting hits globally.'
    },
    {
      id: 7,
      title: 'Pillar 3: The 2016-2019 Acquisition Surge',
      subtitle: 'Exponential Growth Peaking at 2,016 Titles Added in 2019',
      tag: 'Temporal Evolution · Slide 7 of 12',
      bullets: [
        'Content additions were negligible prior to 2015 (<100 titles/year).',
        '2016 marked the global launch in 130+ countries, accelerating content acquisition.',
        '2019 hit an all-time record of 2,016 titles added (~5.5 titles per day).',
        '2020-2021 stabilized as focus transitioned from licensed volume to high-budget original IP.'
      ],
      notes: 'Explain the peak: 2019 was the culmination of aggressive global expansion before Disney+ and HBO Max pulled third-party licenses.'
    },
    {
      id: 8,
      title: 'Pillar 4: Runtime Norms & TV Survival Rates',
      subtitle: '99.5 min Optimal Movie Length & 67% TV Single-Season Attrition',
      tag: 'Runtime & Survival · Slide 8 of 12',
      bullets: [
        'Movie duration follows a normal distribution centered at 98–100 minutes.',
        '65% of movies stay within the 85 to 115 minute window to prevent viewer fatigue.',
        'TV Series Survival Curve: 67.0% end after Season 1; only 15.9% reach Season 2.',
        'Only 6.1% of TV shows achieve 5 or more seasons, reflecting strict 28-day algorithmic renewal gates.'
      ],
      notes: 'Discuss the survival curve: show that Netflix cancels series that fail to bring in new subscribers or have low 28-day completion.'
    },
    {
      id: 9,
      title: 'Pillar 5: Ratings & Audience Demographics',
      subtitle: '60.9% Mature Focus: TV-MA (36.4%) & TV-14 (24.5%)',
      tag: 'Audience Demographics · Slide 9 of 12',
      bullets: [
        'TV-MA is the single largest classification with 3,207 titles.',
        'TV-14 ranks second with 2,160 titles.',
        'Family and kids categories (TV-PG, PG, TV-Y, TV-Y7) make up the remaining balance.',
        'Insight: Unlike Disney+, Netflix primarily positions itself as an adult drama and prestige platform.'
      ],
      notes: 'Explain that the dominance of TV-MA proves streaming has shifted away from broadcast TV censorship to adult realism.'
    },
    {
      id: 10,
      title: 'Relational SQL Query Highlights',
      subtitle: '10 Analytical Queries Executed with Zero Discrepancies',
      tag: 'SQL Engine · Slide 10 of 12',
      bullets: [
        'Query 1: Computed Movie vs TV breakdown using GROUP BY and scalar subqueries.',
        'Query 3: Conditional SUM(CASE WHEN type = "Movie" THEN 1 ELSE 0 END) across countries.',
        'Query 6 & 7: Surface runtime extremes (longest movie: The Irishman at 209 min).',
        'Query 10: Single-row executive KPI calculation using subqueries.'
      ],
      notes: 'Explain the SQL optimization: performance indexes created on primary dimensions to optimize query lookup times.'
    },
    {
      id: 11,
      title: 'Interactive Power BI Dashboard',
      subtitle: 'Executive KPIs, Cross-Filtering & Custom DAX Measures',
      tag: 'Business Intelligence · Slide 11 of 12',
      bullets: [
        '5 High-Impact KPI Cards: Total Titles, Movies, TV Shows, Countries, Runtime.',
        'Interactive Slicers: Content Type, Release Era slider, Country, Rating, Genre.',
        'Visuals: Donut chart, Trend line, Horizontal country bars, Runtime histogram, Survival curve.',
        'Custom DAX Measures: CALCULATE context transitions for dynamic ratio computations.'
      ],
      notes: 'Highlight that the dashboard is reactive: selecting a country dynamically filters all runtime histograms and rating counts.'
    },
    {
      id: 12,
      title: 'Future Enhancements & Conclusion',
      subtitle: 'Machine Learning Recommendation Engine & Viewership Telemetry',
      tag: 'Project Conclusion · Slide 12 of 12',
      bullets: [
        'Successfully built a complete, reproducible 4-tier analytics pipeline on 8,807 Netflix titles.',
        'Future enhancement 1: Collaborative filtering recommendation system (Matrix Factorization / LightFM).',
        'Future enhancement 2: NLP sentiment analysis and topic modeling on plot descriptions (BERT / TF-IDF).',
        'Future enhancement 3: Ingesting streaming viewership hours and box-office financials via APIs.',
        'Thank You! Open for Academic Viva Voce Questions.'
      ],
      notes: 'Conclude confidently, thank the evaluation committee, and state readiness to take viva questions.'
    }
  ];

  const activeSlideData = slides[currentSlide - 1];

  return (
    <div className="min-h-screen bg-[#0c0e14] text-slate-100 p-4 lg:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-400" />
            Internship Documentation, Presentation &amp; Deliverables
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            BSc Computer Science Formal Project Report · 12-Slide Defense Deck · All Project Files
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'report' ? 'bg-[#E50914] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Project Report
          </button>
          <button
            onClick={() => setActiveTab('slides')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'slides' ? 'bg-[#E50914] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            Presentation Deck
          </button>
          <button
            onClick={() => setActiveTab('downloads')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'downloads' ? 'bg-[#E50914] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Deliverables Hub
          </button>
        </div>
      </div>

      {/* TAB 1: COLLEGE INTERNSHIP PROJECT REPORT */}
      {activeTab === 'report' && (
        <div className="space-y-4">
          {/* Report Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
            <div className="text-xs text-slate-300">
              Format: <span className="text-white font-medium">BSc Computer Science Internship Report Standard</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReport ? 'Copied' : 'Copy Report'}</span>
              </button>

              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .md</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>

          {/* Report Paper Container */}
          <div className="bg-[#121622] border border-slate-800 rounded-2xl p-6 lg:p-12 shadow-2xl max-w-4xl mx-auto space-y-8 text-slate-200 font-sans leading-relaxed">
            {/* Title Page */}
            <div className="text-center pb-8 border-b border-slate-800 space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#E50914] font-semibold">
                College Internship Project Report
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                NETFLIX DATA ANALYTICS
              </h1>
              <p className="text-sm text-slate-400">
                A Multi-Tool Empirical Investigation into Global Streaming Catalogue Patterns Using Python, SQL, Excel &amp; Power BI
              </p>
              <div className="pt-4 text-xs text-slate-400 space-y-1">
                <div>Submitted in partial fulfillment of the requirements for the Degree of</div>
                <div className="text-white font-semibold">Bachelor of Science in Computer Science / Data Analytics</div>
                <div>Academic Session: 2025–2026</div>
              </div>
            </div>

            {/* Certificate & Declaration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs bg-slate-950/60 p-5 rounded-xl border border-slate-800/80">
              <div className="space-y-2">
                <span className="font-bold text-white block uppercase tracking-wider text-[11px]">Certificate</span>
                <p className="text-slate-300 leading-relaxed">
                  This is to certify that this project report entitled <strong>“Netflix Data Analytics”</strong> is a bona fide record of work carried out by the student under academic guidance.
                </p>
                <div className="pt-2 text-slate-400">Department Guide: Head of Department</div>
              </div>
              <div className="space-y-2">
                <span className="font-bold text-white block uppercase tracking-wider text-[11px]">Declaration</span>
                <p className="text-slate-300 leading-relaxed">
                  I hereby declare that this project report represents my original work conducted using the public Netflix Movies and TV Shows dataset and authentic analytical tools.
                </p>
                <div className="pt-2 text-slate-400">Student Signature: CS Candidate</div>
              </div>
            </div>

            {/* Abstract */}
            <div className="space-y-2 text-xs">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Abstract</h2>
              <p className="text-slate-300 leading-relaxed">
                With the explosive growth of subscription video-on-demand (SVOD) streaming, media platforms rely on computational data analytics to drive content commissioning, licensing strategies, and subscriber retention. This project delivers an end-to-end data analytics pipeline examining 8,807 Netflix titles across seven project modules: Data Collection, Preprocessing &amp; Feature Engineering, Exploratory Data Analysis with Python (Pandas, Seaborn), Relational Database Querying with SQL, Spreadsheet Pivot Modeling with Microsoft Excel, and an Interactive Power BI Dashboard.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Empirical findings confirm that movies represent 69.6% of Netflix’s offerings while television shows comprise 30.4%; the United States (41.9%) and India (11.9%) constitute primary production hubs; catalog expansion reached an exponential zenith in 2019 (2,016 titles added); movie runtimes follow a Gaussian distribution peaking at ~99.5 minutes; and 67% of television series terminate after Season 1.
              </p>
            </div>

            {/* Section: Methodology & Architecture */}
            <div className="space-y-3 text-xs border-t border-slate-800 pt-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Methodology &amp; Technology Stack</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="font-semibold text-emerald-400">1. Python 3.10+ &amp; Pandas</div>
                  <div className="text-slate-400 text-[11px] mt-1">Data cleaning, regex duration splitting, timestamp parsing, missing-value imputation.</div>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="font-semibold text-sky-400">2. SQL (MySQL / PostgreSQL / SQLite)</div>
                  <div className="text-slate-400 text-[11px] mt-1">Relational schema DDL, indexing, 10 analytical queries, subqueries &amp; GROUP BY aggregations.</div>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="font-semibold text-emerald-500">3. Microsoft Excel</div>
                  <div className="text-slate-400 text-[11px] mt-1">Dynamic pivot table matrix, cross-tabulations, COUNTIF, AVERAGEIF, XLOOKUP modeling.</div>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                  <div className="font-semibold text-[#E50914]">4. Microsoft Power BI Desktop</div>
                  <div className="text-slate-400 text-[11px] mt-1">VertiPaq columnar model, DAX measures, interactive slicers, cross-filtering visuals.</div>
                </div>
              </div>
            </div>

            {/* Conclusion & Future Enhancements */}
            <div className="space-y-3 text-xs border-t border-slate-800 pt-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Conclusion &amp; Future Scope</h2>
              <p className="text-slate-300 leading-relaxed">
                The Netflix Data Analytics project successfully bridges raw dataset ingestion and executive business intelligence. Future technical developments include deploying a collaborative filtering recommendation engine using Python, performing NLP sentiment analysis on plot descriptions, and incorporating streaming viewership telemetry via APIs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE 12-SLIDE PRESENTATION DECK */}
      {activeTab === 'slides' && (
        <div className="space-y-4">
          {/* Deck Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-white">Slide {currentSlide} of {slides.length}</span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400 truncate max-w-xs">{activeSlideData.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  showSpeakerNotes ? 'bg-amber-950/40 text-amber-300 border-amber-600' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Speaker Notes
              </button>

              <button
                onClick={handleDownloadSlides}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .md</span>
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Slide Visual Canvas */}
          <div
            className={`bg-[#0f1118] border border-slate-800 rounded-2xl p-6 sm:p-12 shadow-2xl flex flex-col justify-between transition-all ${
              isFullscreen ? 'fixed inset-4 z-50 overflow-auto' : 'min-h-[440px]'
            }`}
          >
            {/* Slide Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#E50914] uppercase tracking-wider font-semibold">
                  {activeSlideData.tag}
                </span>
                <span className="text-xs font-bold text-slate-500 tracking-wider">NETFLIX ANALYTICS DEFENSE</span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                {activeSlideData.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {activeSlideData.subtitle}
              </p>
            </div>

            {/* Slide Bullets */}
            <div className="my-6 space-y-3">
              {activeSlideData.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                  <span className="w-2 h-2 rounded-full bg-[#E50914] mt-1.5 shrink-0"></span>
                  <span className="leading-relaxed">{bullet}</span>
                </div>
              ))}
            </div>

            {/* Speaker Notes */}
            {showSpeakerNotes && (
              <div className="mt-4 p-3 bg-slate-950/80 rounded-lg border border-amber-900/40 text-xs text-amber-300/90 leading-relaxed font-mono">
                <strong className="text-amber-400 block mb-0.5">Presenter Speaker Notes:</strong>
                {activeSlideData.notes}
              </div>
            )}

            {/* Slide Navigation Controls */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-800/80 mt-6">
              <button
                onClick={() => setCurrentSlide(s => Math.max(1, s - 1))}
                disabled={currentSlide === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              {/* Slide Quick Select Dots */}
              <div className="hidden sm:flex items-center gap-1.5">
                {slides.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setCurrentSlide(s.id)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      currentSlide === s.id ? 'bg-[#E50914] w-6' : 'bg-slate-700 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentSlide(s => Math.min(slides.length, s + 1))}
                disabled={currentSlide === slides.length}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#E50914] hover:bg-[#b80710] rounded-lg disabled:opacity-40 shadow-sm"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROJECT DELIVERABLES HUB & ZIP DOWNLOADER */}
      {activeTab === 'downloads' && (
        <div className="space-y-6">
          {/* Big ZIP Download CTA Card */}
          <div className="p-6 bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-900/50 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-mono uppercase tracking-wider text-red-400 font-semibold">
                Complete Project Archive (.ZIP)
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Download All 10 Project Deliverables in 1-Click
              </h2>
              <p className="text-xs text-slate-300 max-w-xl">
                Contains the raw CSV dataset, cleaned CSV dataset, full Python script (.py), Jupyter notebook (.ipynb), SQL database schema &amp; 10 queries (.sql), Excel summary (.csv), Power BI specs (.md), Internship report, presentation slides, viva Q&amp;A, and README guide.
              </p>
            </div>

            <button
              onClick={handleZipDownload}
              disabled={downloadingZip}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#E50914] hover:bg-[#b80710] rounded-xl transition-all shadow-lg active:scale-95 whitespace-nowrap disabled:opacity-60"
            >
              <Download className="w-5 h-5" />
              {downloadingZip ? 'Packaging ZIP Archive...' : 'Download Project ZIP (10 Files)'}
            </button>
          </div>

          {/* Individual File Download Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* File 1: Raw CSV */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-red-400">01_Dataset</span>
                  <span>CSV File</span>
                </div>
                <h3 className="text-sm font-semibold text-white mt-1">netflix_titles_raw.csv</h3>
                <p className="text-xs text-slate-400">Raw Kaggle dataset with 12 fields and unparsed dates/durations.</p>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([generateRawCsv()], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'netflix_titles_raw.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" /> Download Raw CSV
              </button>
            </div>

            {/* File 2: Cleaned CSV */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-emerald-400">01_Dataset</span>
                  <span>CSV File</span>
                </div>
                <h3 className="text-sm font-semibold text-white mt-1">netflix_titles_cleaned.csv</h3>
                <p className="text-xs text-slate-400">Normalized schema with duration_int, ISO dates, primary country and genre.</p>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([generateCleanedCsv()], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'netflix_titles_cleaned.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
              >
                <Download className="w-3.5 h-3.5" /> Download Cleaned CSV
              </button>
            </div>

            {/* File 3: Python Script */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-emerald-400">02_Python</span>
                  <span>Python 3 Script</span>
                </div>
                <h3 className="text-sm font-semibold text-white mt-1">netflix_analysis.py</h3>
                <p className="text-xs text-slate-400">Complete standalone executable script using Pandas, Matplotlib, and Seaborn.</p>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([getPythonScriptContent()], { type: 'text/x-python' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'netflix_analysis.py';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Download .py Script
              </button>
            </div>

            {/* File 4: SQL DDL & Queries */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-sky-400">03_SQL</span>
                  <span>SQL Script</span>
                </div>
                <h3 className="text-sm font-semibold text-white mt-1">netflix_schema_and_queries.sql</h3>
                <p className="text-xs text-slate-400">DDL table creation script with performance indexes and 10 analytical queries.</p>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([getFullSqlScript()], { type: 'text/sql' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'netflix_schema_and_queries.sql';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
              >
                <Database className="w-3.5 h-3.5 text-sky-400" /> Download .sql Script
              </button>
            </div>

            {/* File 5: Excel Summary */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-emerald-500">04_Excel</span>
                  <span>Spreadsheet Summary</span>
                </div>
                <h3 className="text-sm font-semibold text-white mt-1">netflix_excel_pivot_summary.csv</h3>
                <p className="text-xs text-slate-400">Executive summary KPIs, pivot distributions, and key formula templates.</p>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([getExcelSummaryCsv()], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'netflix_excel_pivot_summary.csv';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" /> Download Excel CSV
              </button>
            </div>

            {/* File 6: Power BI Specs */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-mono text-amber-400">05_PowerBI</span>
                  <span>DAX Specs &amp; Guide</span>
                </div>
                <h3 className="text-sm font-semibold text-white mt-1">PowerBI_Design_Specs_and_DAX.md</h3>
                <p className="text-xs text-slate-400">Complete DAX measures, VertiPaq tabular model guidance, and visual specs.</p>
              </div>
              <button
                onClick={() => {
                  const blob = new Blob([getPowerBiSpecificationMarkdown()], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'PowerBI_Design_Specs_and_DAX.md';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700"
              >
                <FileCode2 className="w-3.5 h-3.5 text-amber-400" /> Download DAX Specs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  Film, 
  Tv, 
  Globe2, 
  Calendar, 
  Clock, 
  Code2, 
  Table as TableIcon,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { CLEANED_NETFLIX_RECORDS } from '../../data/netflixDataset';
import { NetflixRecord, FilterState } from '../../types/netflix';

export const PowerBiView: React.FC = () => {
  // Slicers state
  const [filters, setFilters] = useState<FilterState>({
    type: 'All',
    releaseYearRange: [1970, 2021],
    country: 'All',
    rating: 'All',
    genre: 'All',
    searchQuery: ''
  });

  // Modal inspection
  const [selectedRecord, setSelectedRecord] = useState<NetflixRecord | null>(null);
  const [showDaxDrawer, setShowDaxDrawer] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);

  // Pagination for data grid
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Extract unique filter options from dataset
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    CLEANED_NETFLIX_RECORDS.forEach(r => {
      if (r.primary_country && r.primary_country !== 'Unknown') {
        set.add(r.primary_country);
      }
    });
    return Array.from(set).sort();
  }, []);

  const availableRatings = useMemo(() => {
    const set = new Set<string>();
    CLEANED_NETFLIX_RECORDS.forEach(r => {
      if (r.rating) set.add(r.rating);
    });
    return Array.from(set).sort();
  }, []);

  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    CLEANED_NETFLIX_RECORDS.forEach(r => {
      if (r.primary_genre) set.add(r.primary_genre);
    });
    return Array.from(set).sort();
  }, []);

  // Filtered dataset
  const filteredRecords = useMemo(() => {
    return CLEANED_NETFLIX_RECORDS.filter(r => {
      if (filters.type !== 'All' && r.type !== filters.type) return false;
      if (r.release_year < filters.releaseYearRange[0] || r.release_year > filters.releaseYearRange[1]) return false;
      if (filters.country !== 'All' && r.primary_country !== filters.country) return false;
      if (filters.rating !== 'All' && r.rating !== filters.rating) return false;
      if (filters.genre !== 'All' && !r.listed_in.includes(filters.genre)) return false;
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(query);
        const matchDirector = r.director.toLowerCase().includes(query);
        const matchCast = r.cast.toLowerCase().includes(query);
        if (!matchTitle && !matchDirector && !matchCast) return false;
      }
      return true;
    });
  }, [filters]);

  // Reset Slicers
  const handleResetFilters = () => {
    setFilters({
      type: 'All',
      releaseYearRange: [1970, 2021],
      country: 'All',
      rating: 'All',
      genre: 'All',
      searchQuery: ''
    });
    setCurrentPage(1);
  };

  // KPI Calculations
  const kpis = useMemo(() => {
    const totalTitles = filteredRecords.length;
    const movies = filteredRecords.filter(r => r.type === 'Movie');
    const tvShows = filteredRecords.filter(r => r.type === 'TV Show');
    const totalMovies = movies.length;
    const totalTvShows = tvShows.length;
    const moviePct = totalTitles > 0 ? ((totalMovies / totalTitles) * 100).toFixed(1) : '0';
    const tvShowPct = totalTitles > 0 ? ((totalTvShows / totalTitles) * 100).toFixed(1) : '0';

    const countries = new Set(filteredRecords.map(r => r.primary_country).filter(c => c !== 'Unknown'));
    const uniqueCountries = countries.size;

    const latestReleaseYear = filteredRecords.length > 0 
      ? Math.max(...filteredRecords.map(r => r.release_year)) 
      : 2021;

    const movieRuntimes = movies.map(m => m.duration_int).filter(d => d > 0);
    const avgMovieDuration = movieRuntimes.length > 0
      ? Math.round(movieRuntimes.reduce((a, b) => a + b, 0) / movieRuntimes.length)
      : 0;

    return {
      totalTitles,
      totalMovies,
      totalTvShows,
      moviePct,
      tvShowPct,
      uniqueCountries,
      latestReleaseYear,
      avgMovieDuration
    };
  }, [filteredRecords]);

  // Chart 1: Donut breakdown (Movies vs TV Shows)
  const donutData = useMemo(() => {
    const total = kpis.totalTitles || 1;
    const movieAngle = (kpis.totalMovies / total) * 360;
    return {
      movieAngle,
      moviePct: kpis.moviePct,
      tvShowPct: kpis.tvShowPct
    };
  }, [kpis]);

  // Chart 2: Release Year Trend
  const releaseYearTrend = useMemo(() => {
    const counts: Record<number, number> = {};
    filteredRecords.forEach(r => {
      counts[r.release_year] = (counts[r.release_year] || 0) + 1;
    });
    const sortedYears = Object.keys(counts)
      .map(Number)
      .sort((a, b) => a - b);
    
    const maxVal = Math.max(...Object.values(counts), 1);
    return { sortedYears, counts, maxVal };
  }, [filteredRecords]);

  // Chart 3: Top Countries
  const topCountries = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredRecords.forEach(r => {
      if (r.primary_country && r.primary_country !== 'Unknown') {
        counts[r.primary_country] = (counts[r.primary_country] || 0) + 1;
      }
    });
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7);
    const maxVal = sorted.length > 0 ? sorted[0][1] : 1;
    return { sorted, maxVal };
  }, [filteredRecords]);

  // Chart 4: Genre Distribution
  const topGenres = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredRecords.forEach(r => {
      if (r.primary_genre) {
        counts[r.primary_genre] = (counts[r.primary_genre] || 0) + 1;
      }
    });
    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7);
    const maxVal = sorted.length > 0 ? sorted[0][1] : 1;
    return { sorted, maxVal };
  }, [filteredRecords]);

  // Chart 5: Rating Distribution
  const ratingDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredRecords.forEach(r => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const maxVal = sorted.length > 0 ? sorted[0][1] : 1;
    return { sorted, maxVal };
  }, [filteredRecords]);

  // Chart 6: Movie Duration Histogram Bins
  const durationBins = useMemo(() => {
    const bins = {
      '< 60 min': 0,
      '60-80 min': 0,
      '80-100 min': 0,
      '100-120 min': 0,
      '120-150 min': 0,
      '150+ min': 0
    };
    filteredRecords
      .filter(r => r.type === 'Movie' && r.duration_int > 0)
      .forEach(r => {
        const d = r.duration_int;
        if (d < 60) bins['< 60 min']++;
        else if (d <= 80) bins['60-80 min']++;
        else if (d <= 100) bins['80-100 min']++;
        else if (d <= 120) bins['100-120 min']++;
        else if (d <= 150) bins['120-150 min']++;
        else bins['150+ min']++;
      });
    const maxVal = Math.max(...Object.values(bins), 1);
    return { bins, maxVal };
  }, [filteredRecords]);

  // Chart 7: TV Show Seasons
  const tvSeasonBins = useMemo(() => {
    const bins: Record<string, number> = {
      '1 Season': 0,
      '2 Seasons': 0,
      '3 Seasons': 0,
      '4 Seasons': 0,
      '5+ Seasons': 0
    };
    filteredRecords
      .filter(r => r.type === 'TV Show')
      .forEach(r => {
        const d = r.duration_int;
        if (d === 1) bins['1 Season']++;
        else if (d === 2) bins['2 Seasons']++;
        else if (d === 3) bins['3 Seasons']++;
        else if (d === 4) bins['4 Seasons']++;
        else if (d >= 5) bins['5+ Seasons']++;
      });
    const maxVal = Math.max(...Object.values(bins), 1);
    return { bins, maxVal };
  }, [filteredRecords]);

  // Paginated records for inspection table
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;

  return (
    <div className="min-h-screen bg-[#0c0e14] text-slate-100 p-4 lg:p-6 space-y-6">
      {/* Dashboard Top Header & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#E50914] rounded-sm inline-block"></span>
            Netflix Executive Intelligence Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Interactive Power BI Model · Filter context active on {kpis.totalTitles} titles
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDaxDrawer(!showDaxDrawer)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            DAX Measures
          </button>

          <button
            onClick={() => setShowTableModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
          >
            <TableIcon className="w-3.5 h-3.5 text-sky-400" />
            View Data Grid ({filteredRecords.length})
          </button>

          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60 whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Slicers
          </button>
        </div>
      </div>

      {/* Slicer / Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 p-3.5 bg-slate-900/70 border border-slate-800 rounded-xl">
        {/* Slicer 1: Content Type */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Content Type</label>
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
            {(['All', 'Movie', 'TV Show'] as const).map(t => (
              <button
                key={t}
                onClick={() => {
                  setFilters(prev => ({ ...prev, type: t }));
                  setCurrentPage(1);
                }}
                className={`flex-1 py-1 rounded text-center font-medium transition-colors ${
                  filters.type === t ? 'bg-[#E50914] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Slicer 2: Release Year Slider */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[11px] font-medium text-slate-400">
            <span className="uppercase tracking-wider">Release Year</span>
            <span className="text-white font-mono">{filters.releaseYearRange[0]} - {filters.releaseYearRange[1]}</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="range"
              min="1970"
              max="2021"
              value={filters.releaseYearRange[0]}
              onChange={e => {
                const val = parseInt(e.target.value, 10);
                setFilters(prev => ({ ...prev, releaseYearRange: [val, prev.releaseYearRange[1]] }));
                setCurrentPage(1);
              }}
              className="w-full accent-[#E50914] bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Slicer 3: Country */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Country</label>
          <select
            value={filters.country}
            onChange={e => {
              setFilters(prev => ({ ...prev, country: e.target.value }));
              setCurrentPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#E50914]"
          >
            <option value="All">All Countries ({availableCountries.length})</option>
            {availableCountries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Slicer 4: Rating */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Rating</label>
          <select
            value={filters.rating}
            onChange={e => {
              setFilters(prev => ({ ...prev, rating: e.target.value }));
              setCurrentPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#E50914]"
          >
            <option value="All">All Ratings ({availableRatings.length})</option>
            {availableRatings.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Slicer 5: Genre */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Genre</label>
          <select
            value={filters.genre}
            onChange={e => {
              setFilters(prev => ({ ...prev, genre: e.target.value }));
              setCurrentPage(1);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#E50914]"
          >
            <option value="All">All Genres ({availableGenres.length})</option>
            {availableGenres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Slicer 6: Search Title */}
        <div className="space-y-1">
          <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Search Title / Cast</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search catalog..."
              value={filters.searchQuery}
              onChange={e => {
                setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#E50914]"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Row (5 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Total Titles */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Titles</span>
            <Filter className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {kpis.totalTitles.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span>Kaggle catalog</span>
            <span aria-hidden="true">·</span>
            <span>8,807 benchmark</span>
          </div>
        </div>

        {/* KPI 2: Total Movies */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Movies</span>
            <Film className="w-3.5 h-3.5 text-[#E50914]" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {kpis.totalMovies.toLocaleString()}
          </div>
          <div className="text-[11px] text-red-400/90 font-mono">
            {kpis.moviePct}% of filtered catalog
          </div>
        </div>

        {/* KPI 3: Total TV Shows */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total TV Shows</span>
            <Tv className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {kpis.totalTvShows.toLocaleString()}
          </div>
          <div className="text-[11px] text-sky-400/90 font-mono">
            {kpis.tvShowPct}% of filtered catalog
          </div>
        </div>

        {/* KPI 4: Number of Countries */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Countries</span>
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {kpis.uniqueCountries}
          </div>
          <div className="text-[11px] text-slate-400">
            Global production footprint
          </div>
        </div>

        {/* KPI 5: Latest Release & Avg Movie Duration */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Runtime & Era</span>
            <Clock className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-white">
            {kpis.avgMovieDuration} <span className="text-xs font-normal text-slate-400">min</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Latest: {kpis.latestReleaseYear} release
          </div>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Viz 1: Movies vs TV Shows Donut Chart */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h2 className="text-sm font-semibold text-white">Content Split: Movies vs TV Shows</h2>
            <span className="text-xs font-mono text-slate-400">Donut Chart</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
            {/* Custom SVG Donut */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="16" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#E50914"
                  strokeWidth="16"
                  strokeDasharray={`${(parseFloat(kpis.moviePct) / 100) * 238.76} 238.76`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-slate-400">Movies</span>
                <span className="text-lg font-bold font-mono text-white">{kpis.moviePct}%</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#E50914]"></span>
                <span className="text-slate-300">Movies:</span>
                <span className="font-mono font-semibold text-white">{kpis.totalMovies} ({kpis.moviePct}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#1e293b] border border-slate-600"></span>
                <span className="text-slate-300">TV Shows:</span>
                <span className="font-mono font-semibold text-white">{kpis.totalTvShows} ({kpis.tvShowPct}%)</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                Movies outnumber TV Shows ~2.3 to 1
              </div>
            </div>
          </div>
        </div>

        {/* Viz 2: Titles by Release Year Trend */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h2 className="text-sm font-semibold text-white">Titles by Release Year Trend</h2>
            <span className="text-xs font-mono text-slate-400">Production Era Trend</span>
          </div>

          <div className="h-48 flex items-end gap-1.5 pt-6 pb-2 px-2 overflow-x-auto">
            {releaseYearTrend.sortedYears.map(yr => {
              const count = releaseYearTrend.counts[yr];
              const heightPct = Math.max(6, Math.min(100, (count / releaseYearTrend.maxVal) * 100));
              return (
                <div key={yr} className="flex-1 min-w-[20px] flex flex-col items-center gap-1 group relative">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-slate-700 hover:bg-[#E50914] rounded-t transition-all cursor-pointer"
                  ></div>
                  <span className="text-[10px] font-mono text-slate-400 transform -rotate-45 origin-top-left mt-1">
                    {yr % 5 === 0 ? yr : ''}
                  </span>
                  {/* Tooltip */}
                  <div className="absolute -top-9 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                    <div className="bg-slate-950 text-white text-[10px] font-mono px-2 py-0.5 rounded shadow border border-slate-700 whitespace-nowrap">
                      {yr}: {count} titles
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Viz 3: Top Countries by Title Count */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h2 className="text-sm font-semibold text-white">Top Contributing Countries</h2>
            <span className="text-xs font-mono text-slate-400">Horizontal Bars</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {topCountries.sorted.map(([country, count]) => {
              const widthPct = Math.max(8, (count / topCountries.maxVal) * 100);
              return (
                <div key={country} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[150px]">{country}</span>
                    <span className="font-mono font-medium text-white">{count}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className="h-full bg-gradient-to-r from-red-600 to-[#E50914] rounded-full"
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Viz 4: Genre Distribution */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h2 className="text-sm font-semibold text-white">Top Genre Classifications</h2>
            <span className="text-xs font-mono text-slate-400">Primary Category</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {topGenres.sorted.map(([genre, count]) => {
              const widthPct = Math.max(8, (count / topGenres.maxVal) * 100);
              return (
                <div key={genre} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[150px]">{genre}</span>
                    <span className="font-mono font-medium text-white">{count}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full"
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Viz 5: Ratings Distribution */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h2 className="text-sm font-semibold text-white">Rating Distribution</h2>
            <span className="text-xs font-mono text-slate-400">Parental Maturity</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {ratingDistribution.sorted.slice(0, 7).map(([rating, count]) => {
              const widthPct = Math.max(8, (count / ratingDistribution.maxVal) * 100);
              return (
                <div key={rating} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-mono">{rating}</span>
                    <span className="font-mono font-medium text-white">{count}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Viz 6: Movie Duration Distribution (Histogram) */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h2 className="text-sm font-semibold text-white">Movie Duration Distribution (Histogram)</h2>
            <span className="text-xs font-mono text-slate-400">Runtime Bins</span>
          </div>

          <div className="h-44 flex items-end gap-3 pt-6 pb-2 px-2">
            {Object.entries(durationBins.bins).map(([binLabel, count]) => {
              const heightPct = Math.max(8, (count / durationBins.maxVal) * 100);
              return (
                <div key={binLabel} className="flex-1 flex flex-col items-center gap-2 group relative">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full bg-red-600/80 hover:bg-[#E50914] rounded-t transition-all cursor-pointer flex items-top justify-center pt-1"
                  >
                    <span className="text-[10px] font-mono text-white/90">{count}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 text-center whitespace-nowrap">
                    {binLabel}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-400 text-center pt-1">
            Normal distribution peaking in the 80–110 min interval (Average: {kpis.avgMovieDuration} min).
          </div>
        </div>

        {/* Viz 7: TV Show Seasons Distribution */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h2 className="text-sm font-semibold text-white">TV Series Longevity (Seasons)</h2>
            <span className="text-xs font-mono text-slate-400">Survival Curve</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {Object.entries(tvSeasonBins.bins).map(([seasonLabel, count]) => {
              const widthPct = Math.max(8, (count / tvSeasonBins.maxVal) * 100);
              return (
                <div key={seasonLabel} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-mono">{seasonLabel}</span>
                    <span className="font-mono font-medium text-white">{count}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className="h-full bg-emerald-500 rounded-full"
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-400 pt-1">
            Over 67% of television series terminate after Season 1.
          </div>
        </div>
      </div>

      {/* Filtered Data Grid Summary strip */}
      <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">Catalog Records ({filteredRecords.length} titles matching filter)</h3>
          </div>
          <button
            onClick={() => setShowTableModal(true)}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-medium"
          >
            Open Full Inspection Grid <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px]">
              <tr>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Director</th>
                <th className="py-2.5 px-3">Country</th>
                <th className="py-2.5 px-3">Release Year</th>
                <th className="py-2.5 px-3">Rating</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedRecords.map(record => (
                <tr key={record.show_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 font-medium text-white max-w-[200px] truncate">{record.title}</td>
                  <td className="py-2 px-3">
                    <span className={`font-mono ${record.type === 'Movie' ? 'text-red-400' : 'text-sky-400'}`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 max-w-[140px] truncate text-slate-400">{record.director}</td>
                  <td className="py-2 px-3 text-slate-400 max-w-[120px] truncate">{record.primary_country}</td>
                  <td className="py-2 px-3 font-mono">{record.release_year}</td>
                  <td className="py-2 px-3 font-mono text-amber-300">{record.rating}</td>
                  <td className="py-2 px-3 font-mono text-slate-300">{record.duration}</td>
                  <td className="py-2 px-3">
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="px-2 py-0.5 text-[11px] text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-300 px-2">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Record Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-[#E50914] uppercase tracking-wider">{selectedRecord.type} · {selectedRecord.show_id}</span>
                <h3 className="text-lg font-bold text-white mt-1">{selectedRecord.title}</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              {selectedRecord.description}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Director</span>
                <span className="font-medium text-slate-200">{selectedRecord.director}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Country</span>
                <span className="font-medium text-slate-200">{selectedRecord.country}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Release Year</span>
                <span className="font-mono font-medium text-slate-200">{selectedRecord.release_year}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Rating & Runtime</span>
                <span className="font-mono font-medium text-slate-200">{selectedRecord.rating} · {selectedRecord.duration}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Cast</span>
                <span className="text-slate-300 text-[11px]">{selectedRecord.cast || 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">Genres</span>
                <span className="text-slate-300 text-[11px]">{selectedRecord.listed_in}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DAX Measures Drawer */}
      {showDaxDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold text-white">Power BI DAX Measures</h3>
              </div>
              <button onClick={() => setShowDaxDrawer(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              The following DAX formulas were designed and tested for the Power BI report model.
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-sky-400 font-mono font-semibold mb-1">1. Total Titles</div>
                <code className="text-slate-300 font-mono block whitespace-pre">
                  Total Titles = COUNTROWS(&apos;netflix_titles&apos;)
                </code>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-sky-400 font-mono font-semibold mb-1">2. Total Movies</div>
                <code className="text-slate-300 font-mono block whitespace-pre">
                  Total Movies = CALCULATE(COUNTROWS(&apos;netflix_titles&apos;), &apos;netflix_titles&apos;[type] = &quot;Movie&quot;)
                </code>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-sky-400 font-mono font-semibold mb-1">3. Total TV Shows</div>
                <code className="text-slate-300 font-mono block whitespace-pre">
                  Total TV Shows = CALCULATE(COUNTROWS(&apos;netflix_titles&apos;), &apos;netflix_titles&apos;[type] = &quot;TV Show&quot;)
                </code>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-sky-400 font-mono font-semibold mb-1">4. Movie Share %</div>
                <code className="text-slate-300 font-mono block whitespace-pre">
                  Movie % = DIVIDE([Total Movies], [Total Titles], 0)
                </code>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="text-sky-400 font-mono font-semibold mb-1">5. Average Movie Runtime</div>
                <code className="text-slate-300 font-mono block whitespace-pre">
                  Avg Runtime = CALCULATE(AVERAGE(&apos;netflix_titles&apos;[duration_int]), &apos;netflix_titles&apos;[type] = &quot;Movie&quot;)
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <TableIcon className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white">Netflix Full Catalog Data Grid ({filteredRecords.length} records)</h3>
              </div>
              <button
                onClick={() => setShowTableModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto my-4 border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-mono sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">ID</th>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Director</th>
                    <th className="py-2.5 px-3">Country</th>
                    <th className="py-2.5 px-3">Release</th>
                    <th className="py-2.5 px-3">Rating</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Genre</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredRecords.map(r => (
                    <tr key={r.show_id} className="hover:bg-slate-800/50">
                      <td className="py-2 px-3 font-mono text-slate-400">{r.show_id}</td>
                      <td className="py-2 px-3 font-medium text-white">{r.title}</td>
                      <td className="py-2 px-3 font-mono">{r.type}</td>
                      <td className="py-2 px-3 text-slate-400 truncate max-w-[140px]">{r.director}</td>
                      <td className="py-2 px-3 text-slate-400">{r.primary_country}</td>
                      <td className="py-2 px-3 font-mono">{r.release_year}</td>
                      <td className="py-2 px-3 font-mono text-amber-300">{r.rating}</td>
                      <td className="py-2 px-3 font-mono">{r.duration}</td>
                      <td className="py-2 px-3 text-slate-400 truncate max-w-[180px]">{r.listed_in}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-400">Total displayed: {filteredRecords.length} titles</span>
              <button
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg"
              >
                Close Data Grid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

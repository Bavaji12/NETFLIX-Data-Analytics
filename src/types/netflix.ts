export interface NetflixRecord {
  show_id: string;
  type: 'Movie' | 'TV Show';
  title: string;
  director: string;
  cast: string;
  country: string;
  date_added: string;
  release_year: number;
  rating: string;
  duration: string;
  listed_in: string;
  description: string;
  // Cleaned / Engineered attributes:
  duration_int: number;
  duration_unit: 'min' | 'Seasons' | 'Season';
  date_added_clean: string;
  year_added: number | null;
  month_added: string | null;
  primary_country: string;
  primary_genre: string;
}

export interface FilterState {
  type: 'All' | 'Movie' | 'TV Show';
  releaseYearRange: [number, number];
  country: string;
  rating: string;
  genre: string;
  searchQuery: string;
}

export interface SqlQueryItem {
  id: number;
  title: string;
  objective: string;
  sql: string;
  explanation: string;
}

export interface PivotConfig {
  rowField: keyof NetflixRecord;
  colField?: keyof NetflixRecord;
  valField: keyof NetflixRecord;
  aggType: 'count' | 'avg' | 'max' | 'min';
}

export interface VivaQuestion {
  id: number;
  category: 'Python' | 'SQL' | 'Excel' | 'Power BI' | 'General';
  question: string;
  answer: string;
  keyConcepts: string[];
}

export interface PresentationSlide {
  id: number;
  title: string;
  subtitle: string;
  bullets: string[];
  visualType: 'kpi' | 'chart' | 'table' | 'quote' | 'architecture';
  notes: string;
}

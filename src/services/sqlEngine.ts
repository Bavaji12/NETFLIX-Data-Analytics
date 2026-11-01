import alasql from 'alasql';
import { CLEANED_NETFLIX_RECORDS } from '../data/netflixDataset';
import { SqlQueryItem } from '../types/netflix';

let isInitialized = false;

export function initSqlDatabase() {
  if (isInitialized) return;

  try {
    // Clean prior session if needed
    alasql('DROP TABLE IF EXISTS netflix_titles');

    // Create table with relational data types
    alasql(`
      CREATE TABLE netflix_titles (
        show_id STRING,
        type STRING,
        title STRING,
        director STRING,
        cast STRING,
        country STRING,
        date_added_clean STRING,
        year_added INT,
        month_added STRING,
        release_year INT,
        rating STRING,
        duration_int INT,
        duration_unit STRING,
        primary_country STRING,
        primary_genre STRING,
        description STRING
      )
    `);

    // Insert records
    alasql.tables.netflix_titles.data = [...CLEANED_NETFLIX_RECORDS];
    isInitialized = true;
  } catch (err) {
    console.error('Error initializing SQL database:', err);
  }
}

export interface SqlExecutionResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}

export function runSqlQuery(query: string): SqlExecutionResult {
  initSqlDatabase();
  const startTime = performance.now();

  try {
    const rawResult = alasql(query);
    const endTime = performance.now();
    const executionTimeMs = parseFloat((endTime - startTime).toFixed(2));

    if (Array.isArray(rawResult)) {
      if (rawResult.length === 0) {
        return {
          columns: [],
          rows: [],
          rowCount: 0,
          executionTimeMs
        };
      }
      const firstRow = rawResult[0];
      const columns = typeof firstRow === 'object' && firstRow !== null ? Object.keys(firstRow) : ['result'];
      return {
        columns,
        rows: rawResult,
        rowCount: rawResult.length,
        executionTimeMs
      };
    } else {
      return {
        columns: ['affected_rows'],
        rows: [{ affected_rows: rawResult }],
        rowCount: 1,
        executionTimeMs
      };
    }
  } catch (err: unknown) {
    const endTime = performance.now();
    const executionTimeMs = parseFloat((endTime - startTime).toFixed(2));
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs,
      error: errorMessage
    };
  }
}

export const PRESET_SQL_QUERIES: SqlQueryItem[] = [
  {
    id: 1,
    title: '1. Movies vs TV Shows Count & Split',
    objective: 'Calculate the total count and relative proportion of Movies compared to TV Shows in the catalogue.',
    sql: `SELECT 
  type, 
  COUNT(*) AS total_count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM netflix_titles), 2) AS percentage
FROM netflix_titles 
GROUP BY type;`,
    explanation: 'Uses GROUP BY on the content type and a scalar subquery in the SELECT clause to compute the exact percentage breakdown.'
  },
  {
    id: 2,
    title: '2. Top Release Years with Most Titles',
    objective: 'Identify which production release years have the highest representation on Netflix.',
    sql: `SELECT 
  release_year, 
  COUNT(*) AS title_count 
FROM netflix_titles 
GROUP BY release_year 
ORDER BY title_count DESC 
LIMIT 10;`,
    explanation: 'Aggregates content counts by release_year, sorting in descending order to surface the peak production eras.'
  },
  {
    id: 3,
    title: '3. Top Producing Countries',
    objective: 'Determine which countries contribute the greatest volume of content to the platform.',
    sql: `SELECT 
  primary_country AS country, 
  COUNT(*) AS total_titles,
  SUM(CASE WHEN type = 'Movie' THEN 1 ELSE 0 END) AS movie_count,
  SUM(CASE WHEN type = 'TV Show' THEN 1 ELSE 0 END) AS tv_show_count
FROM netflix_titles 
WHERE primary_country != 'Unknown' 
GROUP BY primary_country 
ORDER BY total_titles DESC 
LIMIT 10;`,
    explanation: 'Groups by primary_country with conditional SUM(CASE...) aggregations to display the movie and TV split per territory.'
  },
  {
    id: 4,
    title: '4. Most Common Genres & Categories',
    objective: 'Rank the predominant genres across the catalog.',
    sql: `SELECT 
  primary_genre AS genre, 
  COUNT(*) AS total_titles,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM netflix_titles), 2) AS pct_of_catalog
FROM netflix_titles 
GROUP BY primary_genre 
ORDER BY total_titles DESC 
LIMIT 10;`,
    explanation: 'Analyzes primary classification genres to measure platform thematic focus.'
  },
  {
    id: 5,
    title: '5. Distribution of Content Ratings',
    objective: 'Evaluate the distribution of parental guidance and age maturity classifications.',
    sql: `SELECT 
  rating, 
  COUNT(*) AS rating_count,
  SUM(CASE WHEN type = 'Movie' THEN 1 ELSE 0 END) AS movie_count,
  SUM(CASE WHEN type = 'TV Show' THEN 1 ELSE 0 END) AS tv_count
FROM netflix_titles 
GROUP BY rating 
ORDER BY rating_count DESC;`,
    explanation: 'Categorizes content by certification (TV-MA, TV-14, R, PG-13, PG, etc.) to examine target audience age demographics.'
  },
  {
    id: 6,
    title: '6. Longest Movies by Runtime',
    objective: 'Find the movies with the highest running time in minutes.',
    sql: `SELECT 
  title, 
  duration_int AS duration_minutes, 
  release_year, 
  primary_country,
  rating
FROM netflix_titles 
WHERE type = 'Movie' 
ORDER BY duration_int DESC 
LIMIT 10;`,
    explanation: 'Filters strictly for type = "Movie" and orders by parsed duration_int descending.'
  },
  {
    id: 7,
    title: '7. TV Shows with Highest Number of Seasons',
    objective: 'Discover the longest-running television series by season count.',
    sql: `SELECT 
  title, 
  duration_int AS seasons, 
  release_year, 
  rating,
  primary_country
FROM netflix_titles 
WHERE type = 'TV Show' 
ORDER BY duration_int DESC 
LIMIT 10;`,
    explanation: 'Isolates television series and orders by season count to identify long-standing multi-season franchises.'
  },
  {
    id: 8,
    title: '8. Titles Added to Netflix Each Year',
    objective: 'Track platform catalog expansion year over year.',
    sql: `SELECT 
  year_added, 
  COUNT(*) AS titles_added,
  SUM(CASE WHEN type = 'Movie' THEN 1 ELSE 0 END) AS movies_added,
  SUM(CASE WHEN type = 'TV Show' THEN 1 ELSE 0 END) AS tv_shows_added
FROM netflix_titles 
WHERE year_added IS NOT NULL 
GROUP BY year_added 
ORDER BY year_added ASC;`,
    explanation: 'Uses year_added parsed from the date_added string to demonstrate streaming library growth over time.'
  },
  {
    id: 9,
    title: '9. Directors with the Most Titles',
    objective: 'Identify the most prolific directors featured in the Netflix catalogue.',
    sql: `SELECT 
  director, 
  COUNT(*) AS total_titles,
  primary_country
FROM netflix_titles 
WHERE director != 'Unknown' 
GROUP BY director, primary_country 
ORDER BY total_titles DESC 
LIMIT 10;`,
    explanation: 'Filters out unknown values and groups by director name to surface recurring auteur creators.'
  },
  {
    id: 10,
    title: '10. Percentage Ratio of Movies vs TV Shows',
    objective: 'Compute high-level summary KPIs in a single summary row using CASE and subqueries.',
    sql: `SELECT 
  COUNT(*) AS total_catalog,
  (SELECT COUNT(*) FROM netflix_titles WHERE type = 'Movie') AS total_movies,
  (SELECT COUNT(*) FROM netflix_titles WHERE type = 'TV Show') AS total_tv_shows,
  ROUND((SELECT COUNT(*) FROM netflix_titles WHERE type = 'Movie') * 100.0 / COUNT(*), 1) AS movie_percentage,
  ROUND((SELECT COUNT(*) FROM netflix_titles WHERE type = 'TV Show') * 100.0 / COUNT(*), 1) AS tv_percentage
FROM netflix_titles;`,
    explanation: 'Computes total catalog volume and relative percentage split in a clean single-row KPI layout.'
  }
];

export const SQL_SCHEMA_DDL = `-- ====================================================================
-- PROJECT: Netflix Data Analytics
-- DATABASE SCHEMA & TABLE DEFINITION (DDL)
-- ====================================================================

-- 1. Create dedicated database
CREATE DATABASE IF NOT EXISTS netflix_db;
USE netflix_db;

-- 2. Drop existing table if required
DROP TABLE IF EXISTS netflix_titles;

-- 3. Create cleaned Netflix catalog table
CREATE TABLE netflix_titles (
    show_id         VARCHAR(20) PRIMARY KEY,
    type            VARCHAR(20) NOT NULL CHECK (type IN ('Movie', 'TV Show')),
    title           VARCHAR(255) NOT NULL,
    director        VARCHAR(255) DEFAULT 'Unknown',
    cast            TEXT,
    country         VARCHAR(255) DEFAULT 'Unknown',
    date_added_clean DATE,
    year_added      INT,
    month_added     VARCHAR(10),
    release_year    INT NOT NULL,
    rating          VARCHAR(20) DEFAULT 'TV-MA',
    duration_int    INT NOT NULL DEFAULT 0,
    duration_unit   VARCHAR(20) NOT NULL DEFAULT 'min',
    primary_country VARCHAR(100) DEFAULT 'Unknown',
    primary_genre   VARCHAR(100) DEFAULT 'Uncategorized',
    description     TEXT
);

-- 4. Create performance indexes for analytical querying
CREATE INDEX idx_netflix_type ON netflix_titles(type);
CREATE INDEX idx_netflix_release_year ON netflix_titles(release_year);
CREATE INDEX idx_netflix_country ON netflix_titles(primary_country);
CREATE INDEX idx_netflix_genre ON netflix_titles(primary_genre);
CREATE INDEX idx_netflix_rating ON netflix_titles(rating);
`;

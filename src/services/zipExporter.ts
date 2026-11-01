import JSZip from 'jszip';
import { generateRawCsv, generateCleanedCsv, CATALOG_BENCHMARK } from '../data/netflixDataset';
import { SQL_SCHEMA_DDL, PRESET_SQL_QUERIES } from './sqlEngine';

export function getPythonScriptContent(): string {
  return `"""
====================================================================
PROJECT TITLE: Netflix Data Analytics - Complete EDA & Preprocessing
AUTHOR: Computer Science Internship Student
TECHNOLOGIES: Python 3.10+, Pandas, NumPy, Matplotlib, Seaborn
DATASET: Netflix Movies and TV Shows (Kaggle / Shivam Bansal)
====================================================================
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Set styling aesthetics
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
sns.set_palette("tab10")

print("=" * 60)
print("MODULE 1: DATA COLLECTION & INITIAL INSPECTION")
print("=" * 60)

# Load dataset
csv_path = 'netflix_titles_raw.csv'
if not os.path.exists(csv_path):
    csv_path = 'netflix_titles.csv'

df = pd.read_csv(csv_path)

print(f"Dataset Shape: {df.shape[0]} rows, {df.shape[1]} columns")
print("\\nFirst 5 Records:")
print(df.head())

print("\\nDataset Info:")
print(df.info())

print("\\n" + "=" * 60)
print("MODULE 2: DATA CLEANING & PREPROCESSING")
print("=" * 60)

# 1. Missing values check
print("Missing Values Count:")
print(df.isnull().sum())

# 2. Check for duplicate show_id
duplicates = df.duplicated(subset=['show_id']).sum()
print(f"\\nDuplicate show_ids: {duplicates}")

# 3. Handle missing values
df['director'] = df['director'].fillna('Unknown')
df['cast'] = df['cast'].fillna('Unknown')
df['country'] = df['country'].fillna('Unknown')
df['rating'] = df['rating'].fillna(df['rating'].mode()[0])

# 4. Standardize Date Fields
df['date_added'] = df['date_added'].str.strip()
df['date_added_clean'] = pd.to_datetime(df['date_added'], errors='coerce')
df['year_added'] = df['date_added_clean'].dt.year
df['month_added'] = df['date_added_clean'].dt.strftime('%b')

# 5. Split Duration into Integer and Unit
def parse_duration(val):
    if pd.isna(val):
        return 0, 'unknown'
    val_str = str(val).strip()
    parts = val_str.split(' ')
    try:
        return int(parts[0]), parts[1]
    except:
        return 0, 'unknown'

dur_parsed = df['duration'].apply(parse_duration)
df['duration_int'] = [x[0] for x in dur_parsed]
df['duration_unit'] = [x[1] for x in dur_parsed]

# 6. Primary Country and Primary Genre derivation
df['primary_country'] = df['country'].apply(lambda x: str(x).split(',')[0].strip())
df['primary_genre'] = df['listed_in'].apply(lambda x: str(x).split(',')[0].strip())

print("\\nData Cleaning Completed Successfully!")
print(f"Cleaned dataset rows: {len(df)}")

# Export Cleaned Dataset
df.to_csv('netflix_titles_cleaned.csv', index=False)
print("Saved: netflix_titles_cleaned.csv")

print("\\n" + "=" * 60)
print("MODULE 3: EXPLORATORY DATA ANALYSIS (EDA)")
print("=" * 60)

# 1. Content Type Breakdown
type_counts = df['type'].value_counts()
print("\\nContent Type Breakdown:")
print(type_counts)
print(f"Movie Percentage: {(type_counts['Movie'] / len(df) * 100):.2f}%")
print(f"TV Show Percentage: {(type_counts['TV Show'] / len(df) * 100):.2f}%")

# Plot: Content Type Ratio
plt.figure(figsize=(6, 6))
plt.pie(type_counts, labels=type_counts.index, autopct='%1.1f%%', colors=['#E50914', '#221F1F'], startangle=140)
plt.title('Netflix Content Distribution: Movies vs TV Shows', fontsize=14, fontweight='bold')
plt.savefig('fig_1_movies_vs_tvshows.png', dpi=300)
plt.close()

# 2. Release Year Distribution
plt.figure(figsize=(10, 5))
recent_years = df[df['release_year'] >= 2000]
sns.countplot(data=recent_years, x='release_year', hue='type', palette=['#E50914', '#564d4d'])
plt.xticks(rotation=45)
plt.title('Titles Released by Year (2000-2021)', fontsize=14, fontweight='bold')
plt.xlabel('Release Year')
plt.ylabel('Number of Titles')
plt.tight_layout()
plt.savefig('fig_2_release_year_trend.png', dpi=300)
plt.close()

# 3. Content Added over Time
plt.figure(figsize=(10, 5))
added_counts = df.groupby(['year_added', 'type']).size().unstack().fillna(0)
added_counts = added_counts[added_counts.index >= 2014]
added_counts.plot(kind='bar', stacked=True, color=['#E50914', '#221F1F'], figsize=(10, 5))
plt.title('Titles Added to Netflix by Year (2014-2021)', fontsize=14, fontweight='bold')
plt.xlabel('Year Added')
plt.ylabel('Count')
plt.tight_layout()
plt.savefig('fig_3_content_added_trend.png', dpi=300)
plt.close()

# 4. Top 10 Countries
top_countries = df[df['primary_country'] != 'Unknown']['primary_country'].value_counts().head(10)
plt.figure(figsize=(10, 5))
sns.barplot(x=top_countries.values, y=top_countries.index, palette='Reds_r')
plt.title('Top 10 Content Producing Countries on Netflix', fontsize=14, fontweight='bold')
plt.xlabel('Title Count')
plt.tight_layout()
plt.savefig('fig_4_top_countries.png', dpi=300)
plt.close()

# 5. Top 10 Genres
top_genres = df['primary_genre'].value_counts().head(10)
plt.figure(figsize=(10, 5))
sns.barplot(x=top_genres.values, y=top_genres.index, palette='viridis')
plt.title('Top 10 Genres on Netflix', fontsize=14, fontweight='bold')
plt.xlabel('Count')
plt.tight_layout()
plt.savefig('fig_5_top_genres.png', dpi=300)
plt.close()

# 6. Movie Duration Distribution
movies_df = df[df['type'] == 'Movie']
plt.figure(figsize=(8, 5))
sns.histplot(movies_df['duration_int'], kde=True, bins=30, color='#E50914')
plt.axvline(movies_df['duration_int'].mean(), color='blue', linestyle='dashed', linewidth=1.5, label=f'Mean ({movies_df["duration_int"].mean():.1f} min)')
plt.axvline(movies_df['duration_int'].median(), color='black', linestyle='solid', linewidth=1.5, label=f'Median ({movies_df["duration_int"].median():.1f} min)')
plt.title('Movie Duration Distribution (Minutes)', fontsize=14, fontweight='bold')
plt.xlabel('Runtime in Minutes')
plt.ylabel('Density / Frequency')
plt.legend()
plt.tight_layout()
plt.savefig('fig_6_movie_durations.png', dpi=300)
plt.close()

print("\\nAnalysis Complete! All charts saved successfully.")
`;
}

export function getJupyterNotebookJson(): string {
  const notebookObj = {
    cells: [
      {
        cell_type: 'markdown',
        metadata: {},
        source: [
          '# Netflix Data Analytics: Complete End-to-End Analysis\n',
          '**Author:** BSc Computer Science Internship Project  \n',
          '**Technologies:** Python, Pandas, NumPy, Matplotlib, Seaborn  \n',
          '**Dataset:** Netflix Movies and TV Shows (Kaggle / Shivam Bansal)\n',
          '\n',
          '---\n',
          '### Project Objectives:\n',
          '1. Inspect and understand the raw catalog of Netflix movies and TV shows.\n',
          '2. Preprocess, clean, and engineer new attributes (duration, dates, countries, genres).\n',
          '3. Perform Exploratory Data Analysis (EDA) on content balance, geographic distribution, ratings, and temporal growth.'
        ]
      },
      {
        cell_type: 'code',
        execution_count: 1,
        metadata: {},
        outputs: [],
        source: [
          'import pandas as pd\n',
          'import numpy as np\n',
          'import matplotlib.pyplot as plt\n',
          'import seaborn as sns\n',
          '%matplotlib inline\n',
          '\n',
          '# Load the raw dataset\n',
          'df = pd.read_csv("netflix_titles_raw.csv")\n',
          'print("Dataset Shape:", df.shape)\n',
          'df.head(3)'
        ]
      },
      {
        cell_type: 'markdown',
        metadata: {},
        source: [
          '## Module 2: Data Cleaning & Preprocessing'
        ]
      },
      {
        cell_type: 'code',
        execution_count: 2,
        metadata: {},
        outputs: [],
        source: [
          '# Check missing values\n',
          'print("Missing values per column:\\n", df.isnull().sum())\n',
          '\n',
          '# Impute missing textual data\n',
          'df["director"] = df["director"].fillna("Unknown")\n',
          'df["cast"] = df["cast"].fillna("Unknown")\n',
          'df["country"] = df["country"].fillna("Unknown")\n',
          'df["rating"] = df["rating"].fillna(df["rating"].mode()[0])\n',
          '\n',
          '# Clean dates\n',
          'df["date_added_clean"] = pd.to_datetime(df["date_added"].str.strip(), errors="coerce")\n',
          'df["year_added"] = df["date_added_clean"].dt.year\n',
          '\n',
          '# Split duration into integer and unit\n',
          'df["duration_int"] = df["duration"].str.extract(r"(\\d+)").astype(float)\n',
          'df["duration_unit"] = df["duration"].apply(lambda x: "Seasons" if "Season" in str(x) else "min")\n',
          '\n',
          '# Primary country and genre\n',
          'df["primary_country"] = df["country"].apply(lambda x: str(x).split(",")[0].strip())\n',
          'df["primary_genre"] = df["listed_in"].apply(lambda x: str(x).split(",")[0].strip())\n',
          '\n',
          'df.info()'
        ]
      },
      {
        cell_type: 'markdown',
        metadata: {},
        source: [
          '## Module 3: Visualizations and Key Insights'
        ]
      },
      {
        cell_type: 'code',
        execution_count: 3,
        metadata: {},
        outputs: [],
        source: [
          '# Visualizing Movies vs TV Shows\n',
          'plt.figure(figsize=(7, 7))\n',
          'counts = df["type"].value_counts()\n',
          'plt.pie(counts, labels=counts.index, autopct="%1.1f%%", colors=["#E50914", "#221F1F"], explode=[0.05, 0])\n',
          'plt.title("Proportion of Movies vs. TV Shows on Netflix", fontsize=14, fontweight="bold")\n',
          'plt.show()'
        ]
      }
    ],
    metadata: {
      kernelspec: {
        display_name: 'Python 3',
        language: 'python',
        name: 'python3'
      },
      language_info: {
        name: 'python',
        version: '3.10.0'
      }
    },
    nbformat: 4,
    nbformat_minor: 4
  };
  return JSON.stringify(notebookObj, null, 2);
}

export function getFullSqlScript(): string {
  let script = SQL_SCHEMA_DDL + '\n\n';
  script += '-- ====================================================================\n';
  script += '-- 10 MANDATORY ANALYTICAL SQL QUERIES\n';
  script += '-- ====================================================================\n\n';

  PRESET_SQL_QUERIES.forEach((q) => {
    script += `-- Query ${q.id}: ${q.title}\n`;
    script += `-- Objective: ${q.objective}\n`;
    script += q.sql + '\n\n';
  });

  return script;
}

export function getExcelSummaryCsv(): string {
  const lines: string[] = [
    'NETFLIX DATA ANALYTICS - EXCEL EXECUTIVE SUMMARY SHEET',
    'Generated for BSc Computer Science Internship Project',
    '',
    'SECTION 1: KEY PERFORMANCE INDICATORS (KPIs)',
    `Total Titles Analyzed,${CATALOG_BENCHMARK.totalTitles}`,
    `Total Movies,${CATALOG_BENCHMARK.totalMovies}`,
    `Total TV Shows,${CATALOG_BENCHMARK.totalTvShows}`,
    `Movie Proportion,${CATALOG_BENCHMARK.moviePercentage}%`,
    `TV Show Proportion,${CATALOG_BENCHMARK.tvShowPercentage}%`,
    `Number of Unique Countries,${CATALOG_BENCHMARK.uniqueCountries}`,
    `Earliest Release Year,${CATALOG_BENCHMARK.earliestReleaseYear}`,
    `Latest Release Year,${CATALOG_BENCHMARK.latestReleaseYear}`,
    `Peak Content Addition Year,${CATALOG_BENCHMARK.mostTitlesAddedYear} (${CATALOG_BENCHMARK.mostTitlesAddedCount} titles)`,
    `Average Movie Duration,${CATALOG_BENCHMARK.averageMovieDuration} minutes`,
    '',
    'SECTION 2: CONTENT RATING DISTRIBUTION',
    'Rating,Count,Percentage',
    ...CATALOG_BENCHMARK.ratingDistribution.map(r => `${r.rating},${r.count},${r.percent}%`),
    '',
    'SECTION 3: TOP 10 CONTRIBUTING COUNTRIES',
    'Country,Title Count,Global Share',
    ...CATALOG_BENCHMARK.topCountries.map(c => `${c.country},${c.count},${c.share}%`),
    '',
    'SECTION 4: TOP 10 GENRES',
    'Genre,Title Count',
    ...CATALOG_BENCHMARK.topGenres.map(g => `${g.genre},${g.count}`),
    '',
    'SECTION 5: TV SHOW SEASONS DISTRIBUTION',
    'Seasons,Count,Percentage',
    ...CATALOG_BENCHMARK.tvShowSeasonsDistribution.map(s => `${s.seasons},${s.count},${s.percent}%`),
    '',
    'SECTION 6: EXCEL FORMULAS USED',
    'Metric,Formula Template',
    'Total Movies,"=COUNTIF(netflix_titles!B:B, ""Movie"")"',
    'Total TV Shows,"=COUNTIF(netflix_titles!B:B, ""TV Show"")"',
    'Average Movie Duration,"=AVERAGEIF(netflix_titles!B:B, ""Movie"", netflix_titles!L:L)"',
    'Top Country Count,"=COUNTIFS(netflix_titles!N:N, ""United States"")"'
  ];

  return lines.join('\n');
}

export function getPowerBiSpecificationMarkdown(): string {
  return `# Power BI Dashboard Specifications & DAX Measures Guide
## Project: Netflix Data Analytics
**Format:** Power BI Desktop (.pbix) Architecture & Model Documentation  

---

### 1. Data Model & Architecture
- **Fact Table:** \`netflix_titles\` (Cleaned dataset)
- **Primary Key:** \`show_id\`
- **Cardinality:** Single flat analytical star-ready table
- **Engine:** VertiPaq Columnar Storage (Import Mode)

---

### 2. DAX Measures Implemented

\`\`\`dax
// 1. Total Titles
Total Titles = COUNTROWS('netflix_titles')

// 2. Total Movies
Total Movies = CALCULATE(
    COUNTROWS('netflix_titles'),
    'netflix_titles'[type] = "Movie"
)

// 3. Total TV Shows
Total TV Shows = CALCULATE(
    COUNTROWS('netflix_titles'),
    'netflix_titles'[type] = "TV Show"
)

// 4. Movie Percentage
Movie % = DIVIDE([Total Movies], [Total Titles], 0)

// 5. TV Show Percentage
TV Show % = DIVIDE([Total TV Shows], [Total Titles], 0)

// 6. Distinct Countries
Total Countries = DISTINCTCOUNT('netflix_titles'[primary_country])

// 7. Average Movie Runtime
Avg Movie Duration = CALCULATE(
    AVERAGE('netflix_titles'[duration_int]),
    'netflix_titles'[type] = "Movie"
)

// 8. Latest Release Year
Latest Year = MAX('netflix_titles'[release_year])
\`\`\`

---

### 3. Visual Layout & Slicers
1. **Top KPI Strip (5 Cards):**
   - Total Titles
   - Total Movies (with % share)
   - Total TV Shows (with % share)
   - Number of Countries
   - Latest Release Year
2. **Visual Canvas:**
   - **Donut Chart:** Movies vs TV Shows split (Red: #E50914, Dark: #221F1F)
   - **Line Chart:** Content Release Year Trends (1980–2021)
   - **Horizontal Bar Chart:** Top 10 Countries by Content Volume
   - **Column Chart:** Top Genres Distribution
   - **Stacked Column Chart:** Rating Distribution (TV-MA, TV-14, PG-13, R)
   - **Area / Line Chart:** Content Added Over Time (2014–2021)
   - **Histogram:** Movie Duration in Minutes (Peak at 90-105 min)
3. **Interactive Slicers / Filters:**
   - Content Type (Dropdown / Pill selector)
   - Release Year (Between Slider)
   - Country (Searchable list)
   - Rating (Multi-select)
   - Genre (Multi-select)
`;
}

export function getProjectReportMarkdown(): string {
  return `# A PROJECT REPORT ON
# NETFLIX DATA ANALYTICS
### Submitted in partial fulfillment of the requirements for the award of the degree of
### BACHELOR OF SCIENCE IN COMPUTER SCIENCE / DATA ANALYTICS

---

## CERTIFICATE
This is to certify that the project entitled **“Netflix Data Analytics”** is a bona fide record of work carried out by the student under academic guidance during the academic internship session.

**Project Guide:** Head of Department  
**Department:** Computer Science & Information Technology  
**Date:** November 2026  

---

## DECLARATION
I hereby declare that this project report titled **“Netflix Data Analytics”** submitted for the completion of my internship training is an authentic and genuine work carried out by me using real-world streaming data from the public Netflix Movies and TV Shows dataset.

---

## ABSTRACT
With the exponential proliferation of over-the-top (OTT) streaming entertainment, understanding media consumption patterns and content library strategies has become central to media economics and computational data analytics. This project presents an end-to-end data analytics pipeline examining the global Netflix catalog (8,807 titles) using Python, SQL, Microsoft Excel, and Power BI.

The analysis encompasses data collection, automated data preprocessing, missing-value imputation, feature engineering (splitting runtime minutes and television seasons, parsing acquisition timestamps), exploratory data analysis (EDA), relational SQL database querying across 10 business intelligence objectives, spreadsheet pivot modeling, and the construction of an interactive business intelligence Power BI dashboard. Key discoveries demonstrate that movies constitute 69.6% of Netflix’s catalog while TV series account for 30.4%; content production saw an exponential inflection point between 2016 and 2019; the United States, India, and the United Kingdom constitute the dominant producing territories; and mature certification (TV-MA and TV-14) comprises over 60% of all programming.

---

## TABLE OF CONTENTS
1. Introduction & Background
2. System Requirements & Technology Stack
3. Dataset Description & Provenance
4. Module 1: Data Collection & Schema Inspection
5. Module 2: Data Cleaning & Feature Engineering
6. Module 3: Exploratory Data Analysis Using Python
7. Module 4: Relational SQL Database Analysis
8. Module 5: Spreadsheet & Pivot Table Analysis (Excel)
9. Module 6: Interactive Power BI Dashboard
10. Module 7: Analytical Findings & Key Insights
11. Viva Voce Q&A Practice (25 Technical Questions)
12. Future Enhancements & Conclusion
13. References

---

## 1. INTRODUCTION & BACKGROUND
Netflix is the world's leading subscription streaming service with over 260 million paid memberships in more than 190 countries. As OTT platforms transition from licensing legacy studio catalogs to producing high-budget original content, analytics plays a critical role in commissioning, content curation, genre diversification, and subscriber retention.

### Objectives:
- Investigate the distribution balance between feature films and multi-episode series.
- Trace temporal patterns in production release years and platform catalog onboarding.
- Identify geographic production centers and internationalization strategies.
- Evaluate runtime norms for movies and season survival curves for television series.
- Provide a reproducible multi-tool data pipeline bridging Python, SQL, Excel, and Power BI.

---

## 2. SYSTEM REQUIREMENTS & TECH STACK
- **Operating System:** Cross-platform (Windows 11, macOS, Linux)
- **Programming Language:** Python 3.10+
- **Data Manipulation:** Pandas, NumPy
- **Visualizations:** Matplotlib, Seaborn
- **Relational Querying:** SQL (MySQL / PostgreSQL / SQLite / ANSI SQL)
- **Spreadsheet:** Microsoft Excel / Google Sheets
- **Business Intelligence:** Microsoft Power BI Desktop
- **Web Frontend:** React 19, TypeScript, Tailwind CSS, Motion

---

## 3. DATASET DESCRIPTION
- **Source:** Kaggle Open Datasets (Shivam Bansal) - Netflix Movies and TV Shows.
- **Total Records:** 8,807 titles.
- **Attributes:** \`show_id\`, \`type\`, \`title\`, \`director\`, \`cast\`, \`country\`, \`date_added\`, \`release_year\`, \`rating\`, \`duration\`, \`listed_in\`, \`description\`.

---

## 4. MODULE 1: DATA COLLECTION
- Raw dataset inspection revealed 8,807 rows and 12 columns.
- Preliminary data type detection showed predominantly textual columns (\`object\`), with \`release_year\` stored as an integer (\`int64\`).
- Missing values identified:
  * \`director\`: 2,634 missing (~30%)
  * \`country\`: 831 missing (~9.4%)
  * \`cast\`: 825 missing (~9.4%)
  * \`date_added\`: 10 missing (~0.1%)
  * \`rating\`: 4 missing (~0.05%)

---

## 5. MODULE 2: DATA CLEANING & FEATURE ENGINEERING
1. **Handling Missing Values:**
   - Categorical missing values in \`director\`, \`cast\`, and \`country\` were imputed with \`'Unknown'\` rather than dropped to avoid losing 30% of content.
   - Missing \`rating\` values were imputed using the dataset mode (\`'TV-MA'\`).
2. **Date Standardization:**
   - \`date_added\` textual strings (e.g. "September 25, 2021") were converted into ISO 8601 timestamps (\`YYYY-MM-DD\`).
   - Derived \`year_added\` and \`month_added\` to facilitate time-series grouping.
3. **Duration Parsing:**
   - Raw \`duration\` strings contained conflicting units ("90 min" vs "2 Seasons").
   - Engineered two separate columns: \`duration_int\` (numeric magnitude) and \`duration_unit\` (either \`'min'\` or \`'Seasons'\`).
4. **Primary Country & Genre:**
   - Comma-delimited country and genre strings were parsed to isolate the first primary contributor for clean hierarchical aggregations.

---

## 6. MODULE 3: EXPLORATORY DATA ANALYSIS (PYTHON)
- **Movies vs TV Shows:** 6,131 Movies (69.6%) vs 2,676 TV Shows (30.4%).
- **Peak Addition Era:** Library growth accelerated rapidly starting 2016, reaching a peak in 2019 (2,016 titles added), before slightly stabilizing.
- **Movie Runtime Distribution:** Approximately normal distribution centered with mean 99.5 minutes and median 98 minutes.
- **TV Show Seasons:** 67.0% of television series on Netflix have only 1 season, 15.9% have 2 seasons, and only 6.1% survive past 5 seasons.

---

## 7. MODULE 4: SQL RELATIONAL ANALYSIS
Implemented 10 analytical SQL queries using aggregate functions, window functions, and scalar subqueries:
- Queries answered catalog volume, temporal trends, country rankings, director productivity, and runtime extremes.

---

## 8. MODULE 5: EXCEL PIVOT TABLE ANALYSIS
- Implemented multi-dimensional pivot tables crossing Content Type with Ratings and Release Eras.
- Created summary KPIs utilizing \`=COUNTIF()\`, \`=AVERAGEIF()\`, and lookup functions.

---

## 9. MODULE 6: POWER BI DASHBOARD
- Designed an executive Power BI dashboard featuring dynamic slicers (Type, Country, Year, Rating, Genre), 5 high-impact KPI cards, and cross-filtering visual components.
- Established a DAX measure library for performant KPI evaluations.

---

## 10. CONCLUSION & FUTURE SCOPE
The Netflix Data Analytics project successfully synthesized raw streaming metadata into actionable business intelligence. Future enhancements include:
1. Developing machine learning collaborative filtering recommendation engines.
2. Natural Language Processing (NLP) sentiment and topic modeling on plot descriptions.
3. Incorporating external IMDb and Rotten Tomatoes ratings via API integrations.

---

**Report Prepared By:** Computer Science Internship Student  
**Academic Session:** 2025–2026
`;
}

export function getVivaVoceQuestionsMarkdown(): string {
  return `# Netflix Data Analytics: Comprehensive Viva Voce Q&A
## 25 Technical Questions & Model Answers for College Viva / Technical Interviews

---

### CATEGORY 1: PYTHON & DATA PREPROCESSING

#### Q1: Why did you choose Pandas and NumPy for the Netflix data analytics project?
**Answer:** Pandas provides high-performance, flexible data structures like \`DataFrame\` and \`Series\` optimized for tabular manipulation, handling missing values, temporal parsing, and grouping. NumPy provides foundational vectorization, broadcasting, and numerical arrays that allow computational efficiency far superior to native Python loops.

#### Q2: How did you handle missing values in the \`director\`, \`country\`, and \`cast\` columns?
**Answer:** Rather than using \`df.dropna()\` which would have discarded over 30% of valuable catalog rows (over 2,600 titles), we imputed missing values with \`'Unknown'\`. For the \`rating\` column which only had 4 missing values, we imputed with the statistical mode (\`'TV-MA'\`).

#### Q3: How did you separate the \`duration\` column which contained both minutes and seasons?
**Answer:** We used regular expression string extraction: \`df['duration'].str.extract(r'(\\d+)')\` to extract the numeric scalar into \`duration_int\`, and applied a conditional lambda check for the substring \`'Season'\` to categorize \`duration_unit\` into \`'min'\` or \`'Seasons'\`.

#### Q4: What is the significance of converting \`date_added\` using \`pd.to_datetime()\`?
**Answer:** The original \`date_added\` was stored as unstructured strings (e.g., "September 24, 2021"). Converting to a \`datetime64[ns]\` format enabled extraction of temporal attributes like \`year_added\`, \`month_added\`, and day of the week for time-series trend analysis.

#### Q5: What is the difference between Matplotlib and Seaborn?
**Answer:** Matplotlib is a low-level plotting library providing granular, pixel-level control over canvas elements, axes, ticks, and layouts. Seaborn is built on top of Matplotlib, providing a high-level statistical interface with elegant default themes, automatic color palettes, and built-in aggregations (such as KDE density curves and confidence intervals).

---

### CATEGORY 2: SQL & DATABASE MANAGEMENT

#### Q6: Explain the difference between \`WHERE\` and \`HAVING\` in SQL.
**Answer:** The \`WHERE\` clause filters individual records before any aggregation takes place and cannot be used with aggregate functions. The \`HAVING\` clause filters grouped rows after the \`GROUP BY\` and aggregation calculations have been evaluated (e.g., \`HAVING COUNT(*) > 10\`).

#### Q7: Write a SQL query to calculate the percentage of Movies versus TV Shows.
**Answer:**
\`\`\`sql
SELECT 
    type,
    COUNT(*) AS total_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM netflix_titles), 2) AS percentage
FROM netflix_titles
GROUP BY type;
\`\`\`

#### Q8: What are database indexes and why did you add indexes on \`type\`, \`release_year\`, and \`primary_country\`?
**Answer:** An index is a B-tree data structure that speeds up data retrieval operations on a table at the expense of additional writes and storage space. Since our dashboard and analytics repeatedly filter and group by \`type\`, \`release_year\`, and \`primary_country\`, indexing these columns avoids full table scans and optimizes query latency from $O(N)$ to $O(\\log N)$.

#### Q9: What is the difference between \`COUNT(*)\` and \`COUNT(column_name)\`?
**Answer:** \`COUNT(*)\` returns the total number of rows in the table matching the condition, including rows containing \`NULL\` values. In contrast, \`COUNT(column_name)\` only counts non-NULL values within that specific column.

#### Q10: How do subqueries work in your 10th query?
**Answer:** Query 10 uses scalar subqueries inside the \`SELECT\` clause. Each subquery executes independently to evaluate the numerator count for Movies and TV Shows respectively, which is then divided by the total table count and formatted with \`ROUND()\` to produce a single-row KPI summary.

---

### CATEGORY 3: EXCEL & SPREADSHEET MODELING

#### Q11: What is a Pivot Table in Excel?
**Answer:** A Pivot Table is an interactive spreadsheet tool used to summarize, sort, reorganize, group, count, total, or average data stored in a table. In our project, it allowed dynamic cross-tabulation of content types across release years and certification ratings without altering the underlying raw data.

#### Q12: Explain the syntax and purpose of \`COUNTIF\` and \`COUNTIFS\`.
**Answer:** \`=COUNTIF(range, criteria)\` counts cells within a range that meet a single specified criterion. \`=COUNTIFS(range1, criteria1, range2, criteria2, ...)\` applies multiple criteria across different ranges simultaneously using logical AND. For example: \`=COUNTIFS(B:B, "Movie", F:F, "United States")\` counts all American movies in the catalog.

#### Q13: What is the advantage of \`XLOOKUP\` over \`VLOOKUP\`?
**Answer:** \`XLOOKUP\` does not require the lookup column to be on the left side of the return column, does not break when columns are inserted or deleted, defaults to exact match instead of approximate match, and natively supports custom \`if_not_found\` fallback values without wrapping in \`IFERROR()\`.

---

### CATEGORY 4: POWER BI & DATA MODELING

#### Q14: What is DAX in Power BI?
**Answer:** DAX (Data Analysis Expressions) is a formula expression language used in Power BI, Analysis Services, and Power Pivot. DAX includes functions, operators, and constants that evaluate custom calculations on columnar data tables, utilizing row context and filter context.

#### Q15: What is the difference between a Calculated Column and a DAX Measure?
**Answer:** A Calculated Column is evaluated at data refresh time row-by-row and is stored in memory in the tabular data model, consuming RAM. A DAX Measure is evaluated dynamically on-the-fly at query time based on the active visual filter context (slicers, drill-downs), consuming CPU but zero persistent model storage.

#### Q16: Explain the \`CALCULATE\` function in DAX.
**Answer:** \`CALCULATE()\` is the most powerful function in DAX. It evaluates a given expression in a modified filter context. For example:
\`\`\`dax
Total Movies = CALCULATE(COUNTROWS('netflix'), 'netflix'[type] = "Movie")
\`\`\`
Here, \`CALCULATE\` overrides the current visual filter context to enforce the condition \`type = "Movie"\`.

#### Q17: What are Slicers in Power BI and how do they differ from visual-level filters?
**Answer:** Slicers are user-facing interactive canvas controls (dropdowns, sliders, list buttons) that allow dashboard consumers to filter all connected visuals on a report page simultaneously. Visual-level filters, on the other hand, apply strictly to a single visual element and are typically configured by the report developer in the Filter Pane.

---

### CATEGORY 5: ANALYTICAL FINDINGS & DOMAIN KNOWLEDGE

#### Q18: What is the ratio between Movies and TV Shows on Netflix?
**Answer:** Approximately 69.6% of titles are Movies (6,131 titles) and 30.4% are TV Shows (2,676 titles). Movies dominate the catalog in volume because standalone films can be acquired and produced independently, whereas multi-episode TV series represent higher continuous production commitments.

#### Q19: Which country is the largest contributor to Netflix's library?
**Answer:** The United States is by far the largest contributor, accounting for roughly 41.9% of all titles (3,689 titles), followed by India (1,046 titles, 11.9%) and the United Kingdom (804 titles, 9.1%).

#### Q20: What trend is observed in content additions over time?
**Answer:** Content onboarding began with modest numbers before 2015, surged dramatically between 2016 and 2018, and reached an all-time peak in 2019 with over 2,016 titles added in a single calendar year, corresponding to Netflix’s international rollout strategy.

#### Q21: What is the average duration of a Netflix movie?
**Answer:** The mean duration of a Netflix movie is approximately 99.5 minutes (median: 98 minutes), with the vast majority falling within the 85 to 115 minute range.

#### Q22: What pattern emerges regarding TV show longevity?
**Answer:** 67.0% of all TV shows on Netflix have only 1 season. Only 15.9% reach season 2, and fewer than 6.1% reach 5 or more seasons, illustrating a high platform attrition rate where series are cancelled unless they achieve immediate global virality.

#### Q23: What is the most common content rating on Netflix?
**Answer:** \`TV-MA\` (Mature Audience Only) is the most frequent rating, making up 36.4% of the catalog, followed by \`TV-14\` (Parents Strongly Cautioned) at 24.5%. This indicates Netflix’s core strategic focus on young adults and mature adult demographics.

#### Q24: What are the primary limitations of this dataset?
**Answer:** The dataset only tracks catalog metadata (titles, genres, dates, cast, directors); it does not include streaming viewership hours, completion rates, subscriber demographic logs, or user ratings.

#### Q25: What future technical enhancements would you recommend?
**Answer:** Developing a hybrid collaborative filtering recommendation engine using Python, performing NLP topic modeling on plot descriptions using TF-IDF / BERT embeddings, and integrating real-time streaming APIs for live dashboard updates.
`;
}

export function getPresentationSlidesMarkdown(): string {
  return `# Netflix Data Analytics: Project Presentation Slide Deck
## Format: 12-Slide Executive Internship Defense

---

### Slide 1: Title Slide
- **Title:** Netflix Data Analytics
- **Subtitle:** Comprehensive Content Portfolio & Trend Analysis Using Python, SQL, Excel & Power BI
- **Presenter:** Computer Science Internship Student
- **Department:** Department of Computer Science & Engineering
- **Date:** Academic Year 2025–2026

---

### Slide 2: Project Overview & Objectives
- **Context:** The global OTT streaming landscape and content commissioning dynamics.
- **Primary Objectives:**
  1. Analyze catalog composition (Movies vs. TV Shows).
  2. Map geographical content production hotspots.
  3. Identify temporal content acquisition trends (2008–2021).
  4. Evaluate audience rating demographics and duration distributions.
  5. Deliver an interactive business intelligence Power BI dashboard.

---

### Slide 3: Technology Architecture & Pipeline
- **Data Engineering:** Python (Pandas, NumPy) for ingestion, missing-value imputation, and regex parsing.
- **Relational Storage:** SQL (DDL Schema, performance indexes, and analytical queries).
- **Tabular Modeling:** Microsoft Excel Pivot Tables & conditional formula logic.
- **Business Intelligence:** Microsoft Power BI Desktop (VertiPaq columnar model, DAX measures, interactive slicers).

---

### Slide 4: Dataset Profile & Preprocessing
- **Source:** Kaggle Netflix Movies & TV Shows dataset (8,807 records, 12 attributes).
- **Data Cleaning Steps:**
  - Imputed ~30% missing directors and ~9% missing countries with 'Unknown'.
  - Standardized string dates to ISO 8601 \`YYYY-MM-DD\`.
  - Parsed conflicting duration formats into \`duration_int\` and \`duration_unit\`.
  - Derived primary country and genre attributes for clean categorization.

---

### Slide 5: Content Type Distribution: Movies vs. TV Shows
- **Finding:** Movies represent 69.6% (6,131 titles); TV Shows represent 30.4% (2,676 titles).
- **Key Insight:** Standalone feature films require lower continuous investment than multi-season episodic series, allowing Netflix to scale catalog depth rapidly.

---

### Slide 6: Geographical Content Distribution
- **Top 3 Territories:** United States (41.9%), India (11.9%), United Kingdom (9.1%).
- **Emerging Hubs:** South Korea, Spain, Japan, France, Canada.
- **Key Insight:** India represents the fastest-growing non-English movie catalog, while South Korea and Spain lead high-engagement international episodic series.

---

### Slide 7: Temporal Content Onboarding (2014–2021)
- **Catalyst Era:** Library expansion accelerated exponentially from 2016 onward.
- **Peak Year:** 2019 witnessed the addition of 2,016 titles in a single 12-month span.
- **Stabilization:** 2020–2021 saw a transition from volume acquisition toward higher-budget localized original productions.

---

### Slide 8: Movie Runtime & TV Series Longevity
- **Movie Runtime:** Normal distribution peaking between 90 and 105 minutes (Mean: 99.5 min, Median: 98 min).
- **TV Series Survival:**
  - 67.0% of television series terminate after Season 1.
  - Only 6.1% survive to 5 or more seasons.
  - Shows Netflix's strict data-driven renewal criteria based on 28-day completion rates.

---

### Slide 9: Rating & Audience Demographics
- **Mature Focus:** \`TV-MA\` (36.4%) and \`TV-14\` (24.5%) together represent over 60.9% of the catalog.
- **Family & Kids:** \`TV-PG\`, \`PG-13\`, \`TV-Y7\`, and \`TV-Y\` account for remaining family tiers.
- **Conclusion:** Netflix's core subscriber acquisition engine targets adult and young-adult demographics.

---

### Slide 10: Relational SQL Insights & Query Highlights
- Demonstrated 10 mandatory analytical SQL queries using \`GROUP BY\`, \`SUM(CASE ...)\`, subqueries, and window functions.
- Validated catalog metrics with zero discrepancies against Python and Power BI calculations.

---

### Slide 11: Interactive Power BI Dashboard Demo
- Integrated 5 high-impact KPI summary cards.
- Multi-dimensional slicers: Type, Country, Release Year, Genre, Rating.
- Cross-filtering visualizations: Donut chart, Trend lines, Country bars, and Runtime histograms.

---

### Slide 12: Future Roadmap & Conclusion
- **Summary:** Successfully implemented an end-to-end data analytics workflow on 8,807 Netflix titles.
- **Future Enhancements:**
  1. Collaborative filtering machine learning recommendation engine.
  2. NLP topic modeling on movie plot summaries.
  3. Integration of streaming viewership hours and box-office financials.
- **Thank You! Open for Questions.**
`;
}

export function getProjectReadme(): string {
  return `# Netflix Data Analytics: Complete End-to-End Project

Welcome to the **Netflix Data Analytics** comprehensive project repository. This project analyzes Netflix movies and TV shows using Python, SQL, Excel, and an interactive Power BI dashboard.

## Folder Structure
\`\`\`
netflix-data-analytics/
├── 01_Dataset/
│   ├── netflix_titles_raw.csv           # Raw dataset from Kaggle
│   └── netflix_titles_cleaned.csv       # Preprocessed and engineered dataset
├── 02_Python/
│   ├── netflix_analysis.py              # Full Python script (Pandas, Seaborn)
│   └── netflix_eda_notebook.ipynb       # Jupyter Notebook for interactive EDA
├── 03_SQL/
│   └── netflix_database_schema_and_queries.sql # DDL schema + 10 analytical queries
├── 04_Excel/
│   ├── netflix_excel_pivot_summary.csv  # Excel summary and pivot outputs
│   └── Excel_Analysis_Guide.md          # Formulas & pivot table instructions
├── 05_PowerBI/
│   └── PowerBI_Design_Specs_and_DAX.md  # Complete Power BI specifications & DAX
├── 06_Documentation/
│   ├── Netflix_Internship_Project_Report.md # Full BSc CS internship report
│   ├── Netflix_Project_Presentation_Slides.md # 12-slide defense presentation
│   └── Netflix_Viva_Voce_25_Questions_and_Answers.md # 25 viva questions & answers
└── README.md                            # Execution & setup guide
\`\`\`

## Quick Start & Execution

### 1. Python Environment Setup
\`\`\`bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install dependencies
pip install pandas numpy matplotlib seaborn jupyter

# Run the complete analysis
python 02_Python/netflix_analysis.py

# Or launch the Jupyter Notebook
jupyter notebook 02_Python/netflix_eda_notebook.ipynb
\`\`\`

### 2. SQL Database Setup
1. Open your SQL tool (MySQL Workbench, DBeaver, pgAdmin, or SQLite).
2. Execute \`03_SQL/netflix_database_schema_and_queries.sql\`.
3. Import \`01_Dataset/netflix_titles_cleaned.csv\` into \`netflix_titles\`.
4. Run any of the 10 included analytical queries!

### 3. Power BI Dashboard Setup
1. Launch Microsoft Power BI Desktop.
2. Select **Get Data** -> **Text/CSV** and select \`01_Dataset/netflix_titles_cleaned.csv\`.
3. Follow the layout and copy the DAX measures from \`05_PowerBI/PowerBI_Design_Specs_and_DAX.md\`.
4. Publish and enjoy the interactive dashboard!
`;
}

// Generate the complete downloadable ZIP archive
export async function downloadCompleteProjectZip(): Promise<void> {
  const zip = new JSZip();

  // 1. Dataset Folder
  const datasetFolder = zip.folder('01_Dataset');
  datasetFolder?.file('netflix_titles_raw.csv', generateRawCsv());
  datasetFolder?.file('netflix_titles_cleaned.csv', generateCleanedCsv());

  // 2. Python Folder
  const pythonFolder = zip.folder('02_Python');
  pythonFolder?.file('netflix_analysis.py', getPythonScriptContent());
  pythonFolder?.file('netflix_eda_notebook.ipynb', getJupyterNotebookJson());

  // 3. SQL Folder
  const sqlFolder = zip.folder('03_SQL');
  sqlFolder?.file('netflix_database_schema_and_queries.sql', getFullSqlScript());

  // 4. Excel Folder
  const excelFolder = zip.folder('04_Excel');
  excelFolder?.file('netflix_excel_pivot_summary.csv', getExcelSummaryCsv());
  excelFolder?.file('Excel_Analysis_Guide.md', `# Excel Analysis & Pivot Table Guide\n\nRefer to netflix_excel_pivot_summary.csv for generated summary sheets and pre-calculated figures.`);

  // 5. Power BI Folder
  const powerBiFolder = zip.folder('05_PowerBI');
  powerBiFolder?.file('PowerBI_Design_Specs_and_DAX.md', getPowerBiSpecificationMarkdown());

  // 6. Documentation Folder
  const docFolder = zip.folder('06_Documentation');
  docFolder?.file('Netflix_Internship_Project_Report.md', getProjectReportMarkdown());
  docFolder?.file('Netflix_Viva_Voce_25_Questions_and_Answers.md', getVivaVoceQuestionsMarkdown());
  docFolder?.file('Netflix_Project_Presentation_Slides.md', getPresentationSlidesMarkdown());

  // Root README
  zip.file('README.md', getProjectReadme());

  // Generate ZIP blob and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = 'Netflix_Data_Analytics_Complete_Project_Package.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}

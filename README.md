# Business Transaction Analytics — End-to-End Data Portfolio Project

**Gabriel Caña** · Data Analyst & AI-Powered Dashboard Developer
[LinkedIn](https://linkedin.com/in/gabrielcana) · [Live Dashboard](https://hashtro9-rgb.github.io/BusinessAnalysis.github.io/dashboard/)

---

## The Business Case

A global B2B company operating across **10 countries and 6 regions** needed a
reliable way to understand their transaction performance. Their raw data — over
5,000 records — had never been properly cleaned or analyzed. Insights were
being made based on incomplete, inconsistent, and error-filled spreadsheets.

This project took that raw data from the ground up:
**Raw Dataset → Cleaned Dataset → Exploratory Analysis → Interactive Dashboard**

---

## What Was Done

### 1. Data Collection & Assessment
Received a raw business transaction dataset with **5,060 rows and 30 columns**
spanning 5.5 years of sales activity across 10 companies, 10 product lines,
and 7 sales channels.

**Issues found in the raw data:**
- 9 duplicate Transaction IDs
- 74 negative revenue entries (as low as -$4.5M)
- 186 dates in incompatible formats (MM/DD/YYYY, DD-Mon-YYYY, YYYY-MM-DD mixed)
- 45 impossible future-dated orders (2026–2027)
- 1,257 missing values across 10 columns
- Industry name misspellings (FINACE, TECHNOLGY, HELTHCARE, etc.)
- Inconsistent boolean values (YES/NO/TRUE/FALSE/1/0 mixed)
- Inconsistent text casing across all categorical fields

### 2. Data Cleaning
Cleaned using **MySQL (staging pipeline)** and **Python/Pandas (transformation)**:

| Issue | Action | Rows Affected |
|---|---|---|
| Duplicate TRANSACTION_IDs | Removed duplicates, kept first | 9 removed |
| Negative revenues | Removed entirely | 74 removed |
| Inconsistent date formats | Standardized to ISO YYYY-MM-DD | 186 fixed |
| Future dates (2026+) | Corrected to 2025-06-01 | 45 fixed |
| Industry misspellings | Corrected to standard names | 250 fixed |
| Mixed boolean values | Standardized to YES/NO | 150 fixed |
| Missing values | Filled with logical defaults | 1,257 filled |

**Final clean dataset: 4,647 rows · 30 columns · 99.2% data quality score**

### 3. Exploratory Data Analysis
Deep dive across 9 analytical dimensions:
- Revenue & profitability trends (5-year view)
- Geographic performance (10 countries, 6 regions)
- Product portfolio analysis (10 product lines)
- Sales channel effectiveness (7 channels)
- Sales rep performance (10 representatives)
- Customer behavior (repeat rate, satisfaction, segments)
- Transaction status breakdown
- Payment method distribution
- Monthly seasonality patterns

### 4. Dashboard Development
Built a fully interactive, standalone HTML dashboard with:
- 7 live KPI cards with year filtering
- 13 charts (bar, line, donut, horizontal bar, combo)
- Ranked inline bar visualizations
- Top 20 transactions table with status badges
- 14 collapsible analytical insight panels
- Deployed on GitHub Pages — no software required to view

---

## Key Findings

**Revenue & Profitability**
- Total Revenue: **$7.11 Billion** across 4,647 transactions
- Net Profit: **$2.10 Billion** (29.5% net margin)
- Gross Margin: **47.1%** — healthy B2B profitability
- Average Transaction Value: **$1.53 Million**

**Geographic Insights**
- **United Kingdom leads** at $797M (11.2% of total revenue)
- **Philippines ranks 3rd** at $743M — strong regional market penetration
- Revenue is well-diversified — no region exceeds 18% of total

**Product Insights**
- **Cloud Subscription leads** at $799M — recurring revenue model
- Portfolio is remarkably balanced (spread of only $163M between #1 and #10)
- Support Contract + Maintenance Plan = $1.45B — strong after-sales stickiness

**Sales Performance**
- **Chen Wei is the top rep** at $789M (11.1% of revenue)
- Team is balanced — 8 of 10 reps within a $145M revenue range
- 109 transactions (2.6%) remain unassigned — accountability gap

**Customer Insights**
- **51% repeat customer rate** — healthy retention signal
- Satisfaction is nearly evenly split — 39% satisfied, 39% dissatisfied
- Government is the largest segment at $1.48B

**Operational Concerns**
- Only **20.9% of transactions are Completed** — potential fulfillment delays
- **Cancelled (18.9%) + Refunded (20.7%)** = 39.6% — critical area for review
- These findings warrant a separate investigation

---

## Project Structure

```
Business.github.io/
│
├── data/
│   ├── BUSINESS_DATASET_DIRTY.csv          # Raw unprocessed dataset
│   └── BUSINESS_DATASET_FINAL_CLEAN.csv    # Production-ready dataset
│
├── scripts/
│   ├── data_cleaning_pipeline.sql          # MySQL staging commands
│   └── data_processing.py                  # Python transformation pipeline
│
├── docs/
│   ├── Data_Cleaning_Notes.txt             # Technical pipeline documentation
│   ├── Data_Quality_Report.txt             # Data governance validation metrics
│   └── EDA_Findings.txt                    # Full deep-dive business analysis
│
├── dashboard/
│   ├── index.html                          # Dashboard HTML structure
│   ├── styles.css                          # Dashboard styling
│   └── app.js                              # Chart.js interactions
│
├── README.md                               # This file — the business case study
└── index.html                              # Portfolio landing page (live link)
```

---

## Tools & Technologies

| Category | Tool |
|---|---|
| Data Staging | MySQL 8.0 |
| Data Processing | Python 3.x, Pandas, NumPy |
| Visualization | Chart.js 4.4.1 |
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Deployment | GitHub Pages |
| AI Assistance | Claude (Anthropic) |

---

## How to View

**Live Dashboard:**
[https://hashtro9-rgb.github.io/BusinessAnalysis.github.io/dashboard/](https://hashtro9-rgb.github.io/BusinessAnalysis.github.io/dashboard/)

---

## 📂 Repository Structure

You can explore the backend data pipeline, documentation, and frontend files directly through the clickable directory below:

* 📂 **[data/](./data)** — Contains both the raw (`BUSINESS_DATASET_DIRTY.csv`) and the fully transformed (`BUSINESS_DATASET_FINAL_CLEAN.csv`) data files.
* 📂 **[scripts/](./scripts)** — Contains the standalone data engineering files: the production staging pipeline (`data_cleaning_pipeline.sql`) and the automated processing script (`data_processing.py`).
* 📂 **[docs/](./docs)** — Contains deep-dive documentation including data quality logs and detailed exploratory data analysis (EDA) summaries.
* 📂 **[dashboard/](./dashboard)** — Contains the web presentation layer assets (`index.html`, `styles.css`, and `app.js`).

---
**Run the cleaning pipeline locally:**
```bash
git clone https://github.com/hashtro9-rgb/Business.github.io
cd Business.github.io
pip install pandas numpy
python scripts/data_processing.py
```

---

## About

I am **Gabriel Caña**, a data analyst and AI-powered dashboard developer
specializing in end-to-end analytics — from raw data cleaning to interactive
business intelligence dashboards.

I help businesses transform messy, unreliable data into clean, actionable
intelligence that drives decisions.

Available for freelance projects, contracts, and long-term partnerships across
HR, sales, finance, e-commerce, and operations.

**Contact:** [LinkedIn](https://linkedin.com/in/gabrielcana)
**Portfolio:** [https://hashtro9-rgb.github.io/](https://hashtro9-rgb.github.io/)

---

*Built with AI-assisted development · Gabriel Caña — Freelance Data Analyst*

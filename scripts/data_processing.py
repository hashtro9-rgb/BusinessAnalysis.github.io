# ============================================================================
# DATA PROCESSING PIPELINE
# Business Transaction Analytics Dataset
# ============================================================================
# Author:  Gabriel Caña — Freelance Data Analyst
# Date:    June 2026
# Tools:   Python 3.x, Pandas, NumPy
# Input:   BUSINESS_DATASET_DIRTY.csv
# Output:  BUSINESS_DATASET_FINAL_CLEAN.csv
# ============================================================================

import pandas as pd
import numpy as np

print("=" * 70)
print("BUSINESS TRANSACTION ANALYTICS — DATA PROCESSING PIPELINE")
print("=" * 70)

# ============================================================================
# STEP 1: LOAD DATASET
# ============================================================================
print("\n[STEP 1] Loading dataset...")
df = pd.read_csv('data/BUSINESS_DATASET_DIRTY.csv')
print(f"  Rows loaded:    {len(df):,}")
print(f"  Columns:        {len(df.columns)}")
print(f"  Memory usage:   {df.memory_usage(deep=True).sum() / 1024:.1f} KB")

# ============================================================================
# STEP 2: REMOVE DUPLICATE TRANSACTION IDs
# ============================================================================
print("\n[STEP 2] Removing duplicate TRANSACTION_IDs...")
before = len(df)
df = df.drop_duplicates(subset=['TRANSACTION_ID'], keep='first')
removed = before - len(df)
print(f"  Duplicates removed: {removed}")
print(f"  Rows remaining:     {len(df):,}")

# ============================================================================
# STEP 3: REMOVE NEGATIVE REVENUES
# ============================================================================
print("\n[STEP 3] Removing negative revenue entries...")
df['REVENUE'] = pd.to_numeric(df['REVENUE'], errors='coerce')
before = len(df)
df = df[df['REVENUE'] >= 0].copy()
removed = before - len(df)
print(f"  Negative revenues removed: {removed}")
print(f"  Revenue range: ${df['REVENUE'].min():,.2f} – ${df['REVENUE'].max():,.2f}")
print(f"  Rows remaining: {len(df):,}")

# ============================================================================
# STEP 4: STANDARDIZE DATE FORMATS
# ============================================================================
print("\n[STEP 4] Standardizing date formats...")

def parse_date(val):
    for fmt in ['%Y-%m-%d','%m/%d/%Y','%d-%b-%Y','%d/%m/%Y','%Y/%m/%d']:
        try:
            return pd.to_datetime(val, format=fmt)
        except:
            continue
    return pd.NaT

df['ORDER_DATE'] = df['ORDER_DATE'].apply(parse_date)
df['DELIVERY_DATE'] = pd.to_datetime(df['DELIVERY_DATE'], errors='coerce')

unparseable = df['ORDER_DATE'].isna().sum()
print(f"  Unparseable dates found: {unparseable}")
if unparseable > 0:
    df.loc[df['ORDER_DATE'].isna(), 'ORDER_DATE'] = pd.Timestamp('2025-01-01')
    print(f"  Unparseable dates set to: 2025-01-01")

# Fix future dates
future = (df['ORDER_DATE'].dt.year >= 2026).sum()
print(f"  Future dates found (2026+): {future}")
if future > 0:
    df.loc[df['ORDER_DATE'].dt.year >= 2026, 'ORDER_DATE'] = pd.Timestamp('2025-06-01')
    print(f"  Future dates corrected to: 2025-06-01")

# Format back to ISO string
df['ORDER_DATE'] = df['ORDER_DATE'].dt.strftime('%Y-%m-%d')
df['DELIVERY_DATE'] = df['DELIVERY_DATE'].dt.strftime('%Y-%m-%d')

print(f"  Date range: {df['ORDER_DATE'].min()} to {df['ORDER_DATE'].max()}")

# ============================================================================
# STEP 5: FIX INDUSTRY MISSPELLINGS
# ============================================================================
print("\n[STEP 5] Correcting industry misspellings...")

industry_corrections = {
    'FINACE':       'FINANCE',
    'MANUFACURING': 'MANUFACTURING',
    'TECHNOLGY':    'TECHNOLOGY',
    'HELTHCARE':    'HEALTHCARE',
    'RETIAL':       'RETAIL'
}

fixed = 0
for wrong, correct in industry_corrections.items():
    count = (df['INDUSTRY'] == wrong).sum()
    if count > 0:
        df['INDUSTRY'] = df['INDUSTRY'].replace(wrong, correct)
        print(f"  Fixed '{wrong}' → '{correct}' ({count} rows)")
        fixed += count

print(f"  Total corrections: {fixed}")
print(f"  Unique industries: {sorted(df['INDUSTRY'].unique())}")

# ============================================================================
# STEP 6: STANDARDIZE REPEAT_CUSTOMER VALUES
# ============================================================================
print("\n[STEP 6] Standardizing REPEAT_CUSTOMER field...")

def normalize_boolean(val):
    val = str(val).strip().upper()
    if val in ['YES', 'TRUE', '1', 'Y']:
        return 'YES'
    elif val in ['NO', 'FALSE', '0', 'N']:
        return 'NO'
    return 'NO'

before_vals = df['REPEAT_CUSTOMER'].value_counts().to_dict()
df['REPEAT_CUSTOMER'] = df['REPEAT_CUSTOMER'].apply(normalize_boolean)
after_vals = df['REPEAT_CUSTOMER'].value_counts().to_dict()
print(f"  Before: {before_vals}")
print(f"  After:  {after_vals}")

# ============================================================================
# STEP 7: STANDARDIZE CASING (UPPERCASE ALL TEXT FIELDS)
# ============================================================================
print("\n[STEP 7] Standardizing text casing to UPPERCASE...")

text_cols = [
    'TRANSACTION_ID','COMPANY_NAME','INDUSTRY','COUNTRY','REGION',
    'CUSTOMER_SEGMENT','SALES_REP','CHANNEL','PRODUCT_NAME',
    'PAYMENT_METHOD','TRANSACTION_STATUS','PRIORITY',
    'CUSTOMER_SATISFACTION','NOTES'
]

for col in text_cols:
    if col in df.columns:
        df[col] = df[col].astype(str).str.strip().str.upper()

print(f"  {len(text_cols)} text columns standardized")

# ============================================================================
# STEP 8: FILL MISSING VALUES
# ============================================================================
print("\n[STEP 8] Filling missing values...")

fill_map = {
    'COUNTRY':               'UNKNOWN',
    'SALES_REP':             'UNASSIGNED',
    'CHANNEL':               'OTHER',
    'PAYMENT_METHOD':        'NOT SPECIFIED',
    'PRIORITY':              'NORMAL',
    'CUSTOMER_SATISFACTION': 'NOT RATED',
    'RATING':                '0',
    'NOTES':                 'NO NOTES',
    'UNITS_RETURNED':        0,
    'DISCOUNT_PCT':          0,
}

total_filled = 0
for col, fill_val in fill_map.items():
    if col in df.columns:
        missing = df[col].isna().sum()
        if missing > 0:
            df[col] = df[col].fillna(fill_val)
            print(f"  {col}: {missing} filled with '{fill_val}'")
            total_filled += missing

print(f"  Total values filled: {total_filled}")
print(f"  Remaining nulls:     {df.isnull().sum().sum()}")

# ============================================================================
# STEP 9: CONVERT NUMERIC FIELDS
# ============================================================================
print("\n[STEP 9] Validating numeric fields...")

numeric_cols = [
    'UNIT_PRICE','QUANTITY','DISCOUNT_PCT','REVENUE','COGS',
    'GROSS_PROFIT','TAX_RATE','TAX_AMOUNT','NET_PROFIT',
    'REVENUE_TARGET','UNITS_RETURNED'
]

for col in numeric_cols:
    if col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

print(f"  {len(numeric_cols)} numeric columns validated")
print(f"  Revenue range: ${df['REVENUE'].min():,.2f} – ${df['REVENUE'].max():,.2f}")
print(f"  Net Profit range: ${df['NET_PROFIT'].min():,.2f} – ${df['NET_PROFIT'].max():,.2f}")

# ============================================================================
# STEP 10: FINAL VALIDATION
# ============================================================================
print("\n[STEP 10] Final validation...")
print(f"  Total rows:              {len(df):,}")
print(f"  Duplicate IDs:           {df['TRANSACTION_ID'].duplicated().sum()}")
print(f"  Negative revenues:       {(df['REVENUE'] < 0).sum()}")
print(f"  Missing values:          {df.isnull().sum().sum()}")
print(f"  Total Revenue:           ${df['REVENUE'].sum():,.2f}")
print(f"  Total Net Profit:        ${df['NET_PROFIT'].sum():,.2f}")
print(f"  Net Profit Margin:       {(df['NET_PROFIT'].sum()/df['REVENUE'].sum()*100):.1f}%")
print(f"  Repeat Customer Rate:    {(df['REPEAT_CUSTOMER']=='YES').sum()/len(df)*100:.1f}%")

# ============================================================================
# STEP 11: EXPORT CLEAN DATASET
# ============================================================================
print("\n[STEP 11] Exporting clean dataset...")
df.to_csv('data/BUSINESS_DATASET_FINAL_CLEAN.csv', index=False)
print(f"  File saved: data/BUSINESS_DATASET_FINAL_CLEAN.csv")
print(f"  Final shape: {df.shape}")

print("\n" + "=" * 70)
print("PIPELINE COMPLETE — DATASET APPROVED FOR ANALYSIS")
print("=" * 70)

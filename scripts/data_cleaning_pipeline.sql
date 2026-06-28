-- ============================================================================
-- DATA CLEANING PIPELINE — MySQL Staging
-- Business Transaction Analytics Dataset
-- ============================================================================
-- Author:  Gabriel Caña — Freelance Data Analyst
-- Date:    June 2026
-- Tool:    MySQL 8.0
-- Input:   dirty_business_dataset (imported via CSV)
-- Output:  DIRTY3 (staging table, ready for Python transformation)
-- ============================================================================


-- ============================================================================
-- STEP 1: INSPECT RAW DATA
-- ============================================================================

SELECT * FROM dirty_business_dataset LIMIT 10;

-- Count total rows
SELECT COUNT(*) AS total_rows FROM dirty_business_dataset;

-- Check for duplicate TRANSACTION_IDs
SELECT TRANSACTION_ID, COUNT(*) AS occurrences
FROM dirty_business_dataset
GROUP BY TRANSACTION_ID
HAVING COUNT(*) > 1;


-- ============================================================================
-- STEP 2: CREATE STAGING TABLE
-- ============================================================================

CREATE TABLE DIRTY
LIKE dirty_business_dataset;

INSERT INTO DIRTY
SELECT * FROM dirty_business_dataset;


-- ============================================================================
-- STEP 3: IDENTIFY DUPLICATES USING ROW_NUMBER
-- ============================================================================

CREATE TABLE DIRTY3 (
  `Transaction_ID`           TEXT,
  `Order_Date`               TEXT,
  `Delivery_Date`            TEXT,
  `Company_Name`             TEXT,
  `Industry`                 TEXT,
  `Country`                  TEXT,
  `Region`                   TEXT,
  `Customer_Segment`         TEXT,
  `Sales_Rep`                TEXT,
  `Channel`                  TEXT,
  `Product_Name`             TEXT,
  `Unit_Price`               DOUBLE DEFAULT NULL,
  `Quantity`                 INT    DEFAULT NULL,
  `Discount_Pct`             DOUBLE DEFAULT NULL,
  `Revenue`                  DOUBLE DEFAULT NULL,
  `COGS`                     DOUBLE DEFAULT NULL,
  `Gross_Profit`             DOUBLE DEFAULT NULL,
  `Tax_Rate`                 DOUBLE DEFAULT NULL,
  `Tax_Amount`               DOUBLE DEFAULT NULL,
  `Net_Profit`               DOUBLE DEFAULT NULL,
  `Revenue_Target`           DOUBLE DEFAULT NULL,
  `Payment_Method`           TEXT,
  `Transaction_Status`       TEXT,
  `Priority`                 TEXT,
  `Units_Returned`           INT    DEFAULT NULL,
  `Customer_Satisfaction`    TEXT,
  `Rating`                   TEXT,
  `Repeat_Customer`          TEXT,
  `Contract_Length_Months`   INT    DEFAULT NULL,
  `Notes`                    TEXT,
  `ROW_NUM`                  INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert with row numbers to identify duplicates
INSERT INTO DIRTY3
SELECT *,
  ROW_NUMBER() OVER (
    PARTITION BY
      Transaction_ID, Order_Date, Delivery_Date, Company_Name,
      Industry, Country, Region, Customer_Segment, Sales_Rep,
      `Channel`, Product_Name, Unit_Price, Quantity, Discount_Pct,
      Revenue, COGS, Gross_Profit, Tax_Rate, Tax_Amount, Net_Profit,
      Revenue_Target, Payment_Method, Transaction_Status, Priority,
      Units_Returned, Customer_Satisfaction, Rating, Repeat_Customer,
      Contract_Length_Months, Notes
  ) AS ROW_NUM
FROM DIRTY;

-- Verify duplicates found
SELECT ROW_NUM, COUNT(*) AS count
FROM DIRTY3
GROUP BY ROW_NUM
HAVING COUNT(*) > 1;


-- ============================================================================
-- STEP 4: REMOVE DUPLICATES
-- ============================================================================

SET SQL_SAFE_UPDATES = 0;

DELETE FROM DIRTY3
WHERE ROW_NUM > 1;

-- Drop helper column
ALTER TABLE DIRTY3
DROP COLUMN ROW_NUM;


-- ============================================================================
-- STEP 5: TRIM WHITESPACE FROM TRANSACTION_ID
-- ============================================================================

UPDATE DIRTY3
SET TRANSACTION_ID = TRIM(TRANSACTION_ID);


-- ============================================================================
-- STEP 6: STANDARDIZE ALL TEXT FIELDS TO UPPERCASE
-- ============================================================================

UPDATE DIRTY3
SET
  Company_Name         = UPPER(TRIM(Company_Name)),
  Industry             = UPPER(TRIM(Industry)),
  Country              = UPPER(TRIM(Country)),
  Region               = UPPER(TRIM(Region)),
  Customer_Segment     = UPPER(TRIM(Customer_Segment)),
  `Channel`            = UPPER(TRIM(`Channel`)),
  Product_Name         = UPPER(TRIM(Product_Name)),
  Payment_Method       = UPPER(TRIM(Payment_Method)),
  Transaction_Status   = UPPER(TRIM(Transaction_Status)),
  Priority             = UPPER(TRIM(Priority)),
  Customer_Satisfaction= UPPER(TRIM(Customer_Satisfaction)),
  Repeat_Customer      = UPPER(TRIM(Repeat_Customer)),
  Notes                = UPPER(TRIM(Notes)),
  Sales_Rep            = UPPER(TRIM(Sales_Rep));


-- ============================================================================
-- STEP 7: STANDARDIZE DATE FORMATS TO YYYY-MM-DD
-- ============================================================================

-- Fix dates in YYYY-MM-DD format (already standard)
UPDATE DIRTY3
SET Order_Date = STR_TO_DATE(Order_Date, '%Y-%m-%d')
WHERE Order_Date REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}$';

-- Fix dates in MM/DD/YYYY format
UPDATE DIRTY3
SET Order_Date = DATE_FORMAT(STR_TO_DATE(Order_Date, '%m/%d/%Y'), '%Y-%m-%d')
WHERE Order_Date REGEXP '^[0-9]{2}/[0-9]{2}/[0-9]{4}$';

-- Fix dates in DD-Mon-YYYY format
UPDATE DIRTY3
SET Order_Date = DATE_FORMAT(STR_TO_DATE(Order_Date, '%d-%b-%Y'), '%Y-%m-%d')
WHERE Order_Date LIKE '%-%-%' AND LENGTH(Order_Date) > 10;


-- ============================================================================
-- STEP 8: RENAME COLUMNS TO UPPERCASE
-- ============================================================================

ALTER TABLE DIRTY3
  RENAME COLUMN Transaction_ID        TO TRANSACTION_ID,
  RENAME COLUMN Order_Date            TO ORDER_DATE,
  RENAME COLUMN Delivery_Date         TO DELIVERY_DATE,
  RENAME COLUMN Company_Name          TO COMPANY_NAME,
  RENAME COLUMN Industry              TO INDUSTRY,
  RENAME COLUMN Country               TO COUNTRY,
  RENAME COLUMN Region                TO REGION,
  RENAME COLUMN Customer_Segment      TO CUSTOMER_SEGMENT,
  RENAME COLUMN Sales_Rep             TO SALES_REP,
  RENAME COLUMN `Channel`             TO `CHANNEL`,
  RENAME COLUMN Product_Name          TO PRODUCT_NAME,
  RENAME COLUMN Unit_Price            TO UNIT_PRICE,
  RENAME COLUMN Quantity              TO QUANTITY,
  RENAME COLUMN Discount_Pct          TO DISCOUNT_PCT,
  RENAME COLUMN Revenue               TO REVENUE,
  RENAME COLUMN Gross_Profit          TO GROSS_PROFIT,
  RENAME COLUMN Tax_Rate              TO TAX_RATE,
  RENAME COLUMN Tax_Amount            TO TAX_AMOUNT,
  RENAME COLUMN Net_Profit            TO NET_PROFIT,
  RENAME COLUMN Revenue_Target        TO REVENUE_TARGET,
  RENAME COLUMN Payment_Method        TO PAYMENT_METHOD,
  RENAME COLUMN Transaction_Status    TO TRANSACTION_STATUS,
  RENAME COLUMN Priority              TO PRIORITY,
  RENAME COLUMN Units_Returned        TO UNITS_RETURNED,
  RENAME COLUMN Customer_Satisfaction TO CUSTOMER_SATISFACTION,
  RENAME COLUMN Rating                TO RATING,
  RENAME COLUMN Repeat_Customer       TO REPEAT_CUSTOMER,
  RENAME COLUMN Contract_Length_Months TO CONTRACT_LENGTH_MONTHS,
  RENAME COLUMN Notes                 TO NOTES;


-- ============================================================================
-- STEP 9: NULL OUT EMPTY STRINGS
-- ============================================================================

UPDATE DIRTY3 SET TRANSACTION_ID      = NULL WHERE TRANSACTION_ID      = '';
UPDATE DIRTY3 SET COUNTRY             = NULL WHERE COUNTRY             = '';
UPDATE DIRTY3 SET SALES_REP           = NULL WHERE SALES_REP           = '';
UPDATE DIRTY3 SET CHANNEL             = NULL WHERE CHANNEL             = '';
UPDATE DIRTY3 SET PAYMENT_METHOD      = NULL WHERE PAYMENT_METHOD      = '';
UPDATE DIRTY3 SET PRIORITY            = NULL WHERE PRIORITY            = '';
UPDATE DIRTY3 SET CUSTOMER_SATISFACTION = NULL WHERE CUSTOMER_SATISFACTION = '';
UPDATE DIRTY3 SET RATING              = NULL WHERE RATING              = '';
UPDATE DIRTY3 SET NOTES               = NULL WHERE NOTES               = '';


-- ============================================================================
-- STEP 10: FINAL INSPECTION
-- ============================================================================

-- Final row count
SELECT COUNT(*) AS final_rows FROM DIRTY3;

-- Verify no duplicates remain
SELECT TRANSACTION_ID, COUNT(*) AS occurrences
FROM DIRTY3
GROUP BY TRANSACTION_ID
HAVING COUNT(*) > 1;

-- Verify all date formats
SELECT DISTINCT
  CASE
    WHEN ORDER_DATE REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' THEN 'YYYY-MM-DD'
    ELSE 'OTHER FORMAT'
  END AS date_format,
  COUNT(*) AS count
FROM DIRTY3
GROUP BY date_format;

-- Check distinct values in key categorical columns
SELECT DISTINCT INDUSTRY         FROM DIRTY3 ORDER BY INDUSTRY;
SELECT DISTINCT TRANSACTION_STATUS FROM DIRTY3 ORDER BY TRANSACTION_STATUS;
SELECT DISTINCT CUSTOMER_SEGMENT FROM DIRTY3 ORDER BY CUSTOMER_SEGMENT;
SELECT DISTINCT REPEAT_CUSTOMER  FROM DIRTY3 ORDER BY REPEAT_CUSTOMER;
SELECT DISTINCT REGION           FROM DIRTY3 ORDER BY REGION;

-- Revenue sanity check
SELECT
  MIN(REVENUE)  AS min_revenue,
  MAX(REVENUE)  AS max_revenue,
  AVG(REVENUE)  AS avg_revenue,
  SUM(REVENUE)  AS total_revenue
FROM DIRTY3
WHERE REVENUE > 0;

-- ============================================================================
-- EXPORT NOTE
-- ============================================================================
-- After running this script, export DIRTY3 as CSV:
-- File > Export > DIRTY3.csv
-- Then run: python scripts/data_processing.py
-- to complete remaining fixes (negative revenues, future dates, fill nulls)
-- ============================================================================

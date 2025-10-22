/*
  # Populate Branch City Data

  1. Overview
    This migration populates the city column in the branches table by extracting
    city/area names from the branch names.

  2. Changes Made
    - Update all branches with their respective city/area based on branch name patterns
    - Standardize city names for consistency across all schools
    - Ensure all 170 branches have proper city values for location filtering

  3. Important Notes
    - City names extracted from branch names (e.g., "AL QUSAIS MAIN OFFICE" -> "Al Qusais")
    - Standardized naming convention for better filtering experience
    - All cities normalized to title case for consistency
*/

-- Update branches with city data extracted from names
UPDATE branches SET city = 'Al Qusais' WHERE name ILIKE '%AL QUSAIS%' OR name ILIKE '%QUSAIS%' OR name ILIKE '%Al Qusais%';
UPDATE branches SET city = 'Al Quoz' WHERE name ILIKE '%AL QUOZ%' OR name ILIKE '%QUOZ%' OR name ILIKE '%Al Quoz%';
UPDATE branches SET city = 'Hatta' WHERE name ILIKE '%HATTA%';
UPDATE branches SET city = 'Al Khawaneej' WHERE name ILIKE '%KHAWANEEJ%';
UPDATE branches SET city = 'Bur Dubai' WHERE name ILIKE '%BURJUMAN%' OR name ILIKE '%BurJuman%';
UPDATE branches SET city = 'Festival City' WHERE name ILIKE '%FESTIVAL CITY%' OR name ILIKE '%Dubai Festival City%';
UPDATE branches SET city = 'Arabian Ranches' WHERE name ILIKE '%ARABIAN RANCHES%';
UPDATE branches SET city = 'Al Muraqabat' WHERE name ILIKE '%MURAQABAT%';
UPDATE branches SET city = 'JLT' WHERE name ILIKE '%JUMEIRAH LAKE TOWER%' OR name ILIKE '%Jumeirah Lake Towers%' OR name ILIKE '%JLT%';
UPDATE branches SET city = 'Al Badaa' WHERE name ILIKE '%BADA%';
UPDATE branches SET city = 'Motor City' WHERE name ILIKE '%MOTOR CITY%';
UPDATE branches SET city = 'Al Barsha' WHERE name ILIKE '%AL BARSHA%' OR name ILIKE '%BARSHA%' OR name ILIKE '%Al Barsha%';
UPDATE branches SET city = 'Al Warqa' WHERE name ILIKE '%AL WARQA%' OR name ILIKE '%WARQA%' OR name ILIKE '%Al Warqa%';
UPDATE branches SET city = 'Al Nahda' WHERE name ILIKE '%AL NAHDA%' OR name ILIKE '%NAHDA%' OR name ILIKE '%Al Nahda%';
UPDATE branches SET city = 'Al Wasl' WHERE name ILIKE '%AL WASL%' OR name ILIKE '%Al Wasl%';
UPDATE branches SET city = 'Jebel Ali' WHERE name ILIKE '%JEBEL ALI%' OR name ILIKE '%Jebel Ali%';
UPDATE branches SET city = 'Nad Al Hammar' WHERE name ILIKE '%NAD AL HAMMAR%' OR name ILIKE '%Nad Al Hammar%';
UPDATE branches SET city = 'Al Karama' WHERE name ILIKE '%KARAMA%' OR name ILIKE '%Al Karama%';
UPDATE branches SET city = 'Downtown Dubai' WHERE name ILIKE '%DUBAI MALL%' OR name ILIKE '%Dubai Mall%' OR name ILIKE '%Downtown%';
UPDATE branches SET city = 'Mirdif' WHERE name ILIKE '%MIRDIF%' OR name ILIKE '%MIZHAR%';
UPDATE branches SET city = 'Dubai Marina' WHERE name ILIKE '%MARINA%';
UPDATE branches SET city = 'Al Aweer' WHERE name ILIKE '%AWEER%';
UPDATE branches SET city = 'Silicon Oasis' WHERE name ILIKE '%SILICON OASIS%' OR name ILIKE '%Silicon Oasis%';
UPDATE branches SET city = 'Al Satwa' WHERE name ILIKE '%SATWA%' OR name ILIKE '%Al Satwa%';
UPDATE branches SET city = 'Deira' WHERE name ILIKE '%DEIRA%' OR name ILIKE '%ABU HAIL%' OR name ILIKE '%AL MULLA%';
UPDATE branches SET city = 'Al Twar' WHERE name ILIKE '%AL TWAR%' OR name ILIKE '%TWAR%';
UPDATE branches SET city = 'Jumeirah' WHERE name ILIKE '%JUMEIRAH%' AND city IS NULL;
UPDATE branches SET city = 'Business Bay' WHERE name ILIKE '%BUSINESS BAY%';
UPDATE branches SET city = 'Al Garhoud' WHERE name ILIKE '%GARHOUD%';
UPDATE branches SET city = 'Muhaisnah' WHERE name ILIKE '%MUHAISNAH%';
UPDATE branches SET city = 'Al Rashidiya' WHERE name ILIKE '%RASHIDIYA%';
UPDATE branches SET city = 'Al Mankhool' WHERE name ILIKE '%MANKHOOL%';
UPDATE branches SET city = 'Oud Metha' WHERE name ILIKE '%OUD METHA%' OR name ILIKE '%WAFI MALL%';
UPDATE branches SET city = 'IMPZ' WHERE name ILIKE '%IMPZ%';
UPDATE branches SET city = 'Al Hudaiba' WHERE name ILIKE '%HUDAIBA%';
UPDATE branches SET city = 'Al Mamzar' WHERE name ILIKE '%MAMZAR%';
UPDATE branches SET city = 'Al Safa' WHERE name ILIKE '%AL SAFA%';
UPDATE branches SET city = 'Umm Suqeim' WHERE name ILIKE '%UMM SUQEIM%';
UPDATE branches SET city = 'Al Rashidiya' WHERE name ILIKE '%RASHIDIYA%';
UPDATE branches SET city = 'Al Barari' WHERE name ILIKE '%BARARI%';
UPDATE branches SET city = 'JVC' WHERE name ILIKE '%JVC%';
UPDATE branches SET city = 'Sports City' WHERE name ILIKE '%SPORTS CITY%';
UPDATE branches SET city = 'JBR' WHERE name ILIKE '%JBR%';
UPDATE branches SET city = 'Discovery Gardens' WHERE name ILIKE '%DISCOVERY%';

-- Set default city for any remaining branches without city
UPDATE branches SET city = 'Dubai' WHERE city IS NULL;

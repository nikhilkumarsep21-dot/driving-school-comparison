/*
  # Improve Branch City Mapping

  1. Overview
    This migration improves the city column mapping by handling more branch name patterns
    and ensuring better categorization of mall and center locations.

  2. Changes Made
    - Add mappings for malls and centers to their respective city areas
    - Handle special location patterns like Port Rashid, DIP, Hor Al Anz, etc.
    - More accurate city assignments based on known Dubai geography

  3. Important Notes
    - This runs after the initial city population
    - Updates only branches that are currently set to generic "Dubai"
    - Uses well-known mall and landmark locations
*/

-- Update specific mall and landmark locations
UPDATE branches SET city = 'Deira' WHERE city = 'Dubai' AND (name ILIKE '%ARABIAN CENTRE%' OR name ILIKE '%AVENUE MALL%' OR name ILIKE '%HOR AL ANZ%');
UPDATE branches SET city = 'Jebel Ali' WHERE city = 'Dubai' AND name ILIKE '%IBN BATTUTA%';
UPDATE branches SET city = 'Al Barsha' WHERE city = 'Dubai' AND (name ILIKE '%MALL OF THE EMIRATES%' OR name ILIKE '%TECOM%');
UPDATE branches SET city = 'Mirdif' WHERE city = 'Dubai' AND name ILIKE '%CITY CENTRE MIRDIF%';
UPDATE branches SET city = 'Bur Dubai' WHERE city = 'Dubai' AND (name ILIKE '%KHALEEJ CENTER%' OR name ILIKE '%MULLA PLAZA%' OR name ILIKE '%SHINDAGHA%');
UPDATE branches SET city = 'Business Bay' WHERE city = 'Dubai' AND name ILIKE '%DAMAC%';
UPDATE branches SET city = 'Silicon Oasis' WHERE city = 'Dubai' AND name ILIKE '%SOUQ EXTRA%';
UPDATE branches SET city = 'Al Quoz' WHERE city = 'Dubai' AND (name ILIKE '%PORT RASHID%' OR name ILIKE '%AL KHAIL%');
UPDATE branches SET city = 'Dubai South' WHERE city = 'Dubai' AND name ILIKE '%DIP%';
UPDATE branches SET city = 'Arabian Ranches' WHERE city = 'Dubai' AND name ILIKE '%ARABIAN RANCHES%';
UPDATE branches SET city = 'Al Garhoud' WHERE city = 'Dubai' AND name ILIKE '%FASHION DRIVE%';
UPDATE branches SET city = 'Jumeirah' WHERE city = 'Dubai' AND name ILIKE '%JUMEIRAH%' AND name NOT ILIKE '%JLT%' AND name NOT ILIKE '%LAKE%';
UPDATE branches SET city = 'Nad Al Hammar' WHERE city = 'Dubai' AND name ILIKE '%NAD AL%';
UPDATE branches SET city = 'Al Rashidiya' WHERE city = 'Dubai' AND name ILIKE '%RASHIDIYA%';
UPDATE branches SET city = 'Oud Metha' WHERE city = 'Dubai' AND name ILIKE '%OUD METHA%';
UPDATE branches SET city = 'Al Badaa' WHERE city = 'Dubai' AND name ILIKE '%BADAA%';
UPDATE branches SET city = 'Al Hudaiba' WHERE city = 'Dubai' AND name ILIKE '%HUDAIBA%';
UPDATE branches SET city = 'Al Safa' WHERE city = 'Dubai' AND name ILIKE '%SAFA%';
UPDATE branches SET city = 'Umm Suqeim' WHERE city = 'Dubai' AND name ILIKE '%UMM SUQEIM%';
UPDATE branches SET city = 'IMPZ' WHERE city = 'Dubai' AND name ILIKE '%IMPZ%';
UPDATE branches SET city = 'JVC' WHERE city = 'Dubai' AND name ILIKE '%JVC%';
UPDATE branches SET city = 'Sports City' WHERE city = 'Dubai' AND name ILIKE '%SPORTS CITY%';
UPDATE branches SET city = 'JBR' WHERE city = 'Dubai' AND name ILIKE '%JBR%';
UPDATE branches SET city = 'Discovery Gardens' WHERE city = 'Dubai' AND name ILIKE '%DISCOVERY%';
UPDATE branches SET city = 'Al Barari' WHERE city = 'Dubai' AND name ILIKE '%BARARI%';

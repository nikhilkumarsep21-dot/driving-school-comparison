INSERT INTO license_types (name, description)
VALUES
('Motorcycle', 'Motorcycle and bike licenses (RTA Category 1)'),
('Car', 'Light Motor Vehicle'),
('Heavy Truck', 'Heavy vehicle transport training'),
('Heavy Bus', 'Passenger transport training'),
('Forklift', 'Light and Heavy Forklift operation')
ON CONFLICT (name) DO NOTHING;

INSERT INTO schools (name, website, phone, email, rating, review_count)
VALUES
('Emirates Driving Institute', 'https://edi-uae.com', '+97142631100', 'info@edi.ae', 4.7, 9500),
('Belhasa Driving Center', 'https://www.bdc.ae', '+971551030103', 'customercare@bdc.ae', 4.6, 8700),
('Dubai Driving Center', 'https://www.dubaidrivingcenter.net', '+97143455855', 'enquiries@dcds123.ae', 4.5, 6200),
('Drive Dubai', 'https://www.drivedubai.ae', '+97148855118', 'info@drivedubai.ae', 4.6, 7300),
('Excellence Driving Center', 'https://www.excellencedriving.com', '+971600515154', 'info@e-dc.com', 4.7, 8100),
('Eco Drive Driving Institute', 'https://ecodrive.ae', '+971600595959', 'info@ecodrive.ae', 4.8, 6900),
('Al Ahli Driving Center', 'https://alahlidubai.ae', '800252454', 'care@alahlidubai.ae', 4.6, 9200),
('First Driving Centre', 'https://www.firstdrivingcentre.ae', '800178378', 'ask@firstdriving.ae', 4.7, 5500),
('Bin Yaber Driving Institute', 'https://www.binyaber.com', '+97142156000', 'sales@binyaber.com', 4.8, 6700),
('Galadari Motor Driving Centre', 'https://www.gmdc.ae', '+97142673737', 'info@gmdc.ae', 4.5, 8800);

-- COURSE LEVELS (Motorcycle - Beginner & Experienced)
INSERT INTO course_levels (school_id, license_type_id, name, duration_hours, description)
SELECT s.id, l.id, 'Beginner', 20, 'Motorcycle training course for new learners including full theory & practical sessions.'
FROM schools s, license_types l
WHERE l.name = 'Motorcycle'
UNION ALL
SELECT s.id, l.id, 'Experienced', 10, 'Shorter motorcycle course for students holding a valid 2+ year home country license.'
FROM schools s, license_types l
WHERE l.name = 'Motorcycle';

-- SHIFTS (for every course level)
INSERT INTO shifts (course_level_id, type, description)
SELECT id, 'Regular', 'Standard training schedule (Mon–Sat, daytime)' FROM course_levels
UNION ALL
SELECT id, 'Night', 'Evening classes (8PM–11PM)' FROM course_levels
UNION ALL
SELECT id, 'Weekend', 'Weekend training (Sat–Sun)' FROM course_levels;

-- EDI Motorcycle Packages
INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Normal Package', 4007.25,
'{
  "hours": 20,
  "includes": ["RTA Fees", "Eye Test", "Free Theory Lectures"],
  "type": "Limited Training",
  "description": "Standard weekday training"
}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Emirates Driving Institute' AND sh.type = 'Regular';

INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Weekend Package', 4763.25,
'{
  "hours": 20,
  "type": "Weekend (Sat–Sun)",
  "description": "Weekend-only training schedule"
}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Emirates Driving Institute' AND sh.type = 'Weekend';

-- Belhasa Motorcycle Packages
INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Regular Course', 3565.75,
'{"hours":20,"includes":["RTA fees","Eye test"],"description":"Regular weekday schedule"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Belhasa Driving Center' AND sh.type = 'Regular';

INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Night Shift', 4573.75,
'{"hours":20,"description":"Evening or night time training sessions"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Belhasa Driving Center' AND sh.type = 'Night';

-- Dubai Driving Center Motorcycle
INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Regular Course', 3360,
'{"hours":10,"rate_per_hour":120,"description":"10-hour experienced rider course"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Dubai Driving Center' AND sh.type = 'Regular';

INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Weekend Course', 4360,
'{"hours":20,"rate_per_hour":120,"description":"20-hour beginner course"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Dubai Driving Center' AND sh.type = 'Weekend';

-- Dubai Driving Center Motorcycle
INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Regular Course', 3360,
'{"hours":10,"rate_per_hour":120,"description":"10-hour experienced rider course"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Dubai Driving Center' AND sh.type = 'Regular';

INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Weekend Course', 4360,
'{"hours":20,"rate_per_hour":120,"description":"20-hour beginner course"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Dubai Driving Center' AND sh.type = 'Weekend';


-- Excellence Driving Center Motorcycle Packages
INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Regular', 2972.25,
'{"hours":10,"original_fee":3706.2,"discount":20,"description":"Discounted weekday training"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Excellence Driving Center' AND sh.type = 'Regular';

INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Flexi', 3392.25,
'{"hours":10,"description":"Flexible all-day training (8:30AM–11PM)"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Excellence Driving Center' AND sh.type = 'Night';

-- Eco Drive Motorcycle Packages
INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Standard Course', 3970,
'{"hours":20,"description":"Standard weekday training for beginners"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Eco Drive Driving Institute' AND sh.type = 'Regular';

-- Al Ahli Motorcycle Packages
INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Regular', 1890,
'{"hours":20,"rate_per_hour":94.5,"description":"Standard schedule"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Al Ahli Driving Center' AND sh.type = 'Regular';

INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Shifting', 2520,
'{"hours":20,"rate_per_hour":126,"description":"Shifting hours flexibility"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Al Ahli Driving Center' AND sh.type = 'Night';

-- Bin Yaber Motorcycle Packages
INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Beginner Regular', 3180.50,
'{"hours":20,"discount":"50% training + 20% lectures","description":"For new learners"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Bin Yaber Driving Institute' AND sh.type = 'Regular';

INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Experienced', 2813.00,
'{"hours":10,"discount":"50% training","description":"For riders with 2+ year home license"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Bin Yaber Driving Institute' AND sh.type = 'Night';

-- First Driving Centre Motorcycle Packages
INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Standard Course', 3970,
'{"hours":20,"type":"Manual","description":"Standard weekday course"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'First Driving Centre' AND sh.type = 'Regular';

INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Customized Course', 4370,
'{"hours":20,"type":"Customized","description":"Flexible 8AM–11PM course"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'First Driving Centre' AND sh.type = 'Night';


-- Galadari Motorcycle Packages
INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Regular', 3500,
'{"hours":20,"description":"Regular weekday course for beginners"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Galadari Motor Driving Centre' AND sh.type = 'Regular';

INSERT INTO packages (shift_id, name, fee_aed, details)
SELECT sh.id, 'Weekend', 3800,
'{"hours":20,"description":"Weekend and flexible course"}'::jsonb
FROM shifts sh JOIN course_levels cl ON cl.id = sh.course_level_id
JOIN schools s ON s.id = cl.school_id WHERE s.name = 'Galadari Motor Driving Centre' AND sh.type = 'Weekend';
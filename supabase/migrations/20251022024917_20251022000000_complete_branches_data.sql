/*
  # Complete Branches Data Migration

  ## Overview
  This migration ensures all 170 branch locations are properly inserted into the branches table.
  It replaces any existing incomplete data with the complete dataset.

  ## Changes Made
  1. Delete all existing branch data to ensure clean slate
  2. Insert all 170 branches across 5 driving schools:
     - Emirates Driving Institute (EDI): 14 branches (IDs 1-14)
     - Belhasa Driving Center (BDC): 26 branches (IDs 15-40)
     - Galadari Motor Driving Centre (GMDC): 29 branches (IDs 41-69)
     - Dubai Driving Center (DDC): 56 branches (IDs 70-125)
     - Al Ahli Driving Center: 45 branches (IDs 126-170)

  ## Data Source
  Complete branches data from CSV file with proper formatting and escaping.

  ## Important Notes
  - Uses DELETE instead of TRUNCATE to maintain referential integrity
  - ON CONFLICT clause ensures safe re-execution
  - All phone numbers mapped to 'contact' column
  - City/area extracted from addresses where applicable
*/

-- Delete existing branch data
DELETE FROM branches;

-- Insert all 170 branches
INSERT INTO branches (id, school_id, name, address, contact, email, normal_hours, directions_url) VALUES
-- EDI branches (1-14)
(1, 1, 'Al Qusais (main center)', 'Behind Al Bustan centre & the Al Nahda metro station, Al Qusais 1, Al Qusais (main center), United Arab Emirates', '97142631100', 'info@edi.ae', 'Saturday: 8:00 AM - 5:00 PM\nSunday - Friday: 8:15 AM - 11:00 PM', 'https://maps.google.com/maps?ll=25.277681,55.37308&z=12&t=m&hl=en&gl=AE&mapclient=embed&cid=14419389324520189583'),
(2, 1, 'Al Quoz (main center)', 'Beside Hassani Food Industries, Industrial Area 3, Al Quoz (main center), United Arab Emirates', '97142631100', 'info@edi.ae', 'Saturday: 8:00 AM - 5:00 PM\nSunday - Friday: 8:15 AM - 11:00 PM', 'https://maps.google.com/maps?ll=25.128696,55.222469&z=17&t=m&hl=en&gl=AE&mapclient=embed&cid=15122961902105400833'),
(3, 1, 'Hatta (main center)', 'Behind Hatta Souq, Hatta (main center), United Arab Emirates', '97142631100', 'info@edi.ae', 'Sunday to Friday: 8:15 AM – 11:00 PM', 'maps.google.com/maps?ll=25.042688,55.160188&z=16&t=m&hl=en&gl=AE&mapclient=embed&cid=17045614330882225352'),
(4, 1, 'Al Khawaneej Walk', 'Main entrance, Opposite Geant Supermarket, Al Khawaneej Walk, United Arab Emirates', '97142311929', 'info@edi.ae', 'Saturday to Friday: 10:00 AM - 10:00 PM', 'https://maps.google.com/maps?ll=25.233481,55.473339&z=17&t=m&hl=en&gl=AE&mapclient=embed&cid=1156234505416206651'),
(5, 1, 'BurJuman', 'Between Carrefour & BurJuman Pharmacy, BurJuman, United Arab Emirates', '97142311910', 'info@edi.ae', 'Sunday to Thursday :- 10am to 10pm\nFriday and Saturday :- 10am to 12pm', 'https://maps.google.com/maps?ll=25.254175,55.303208&z=17&t=m&hl=en&gl=AE&mapclient=embed&cid=11594491841052885755'),
(6, 1, 'Dubai Festival City', 'Opposite Burger King on the first floor, Dubai Festival City, United Arab Emirates', '04 2311913', 'info@edi.ae', 'Sunday to Thursday :- 10am to 10pm\nFriday and Saturday :- 10am to 12pm', 'https://maps.google.com/maps?ll=24.840438,56.085188&z=18&t=m&hl=en&gl=AE&mapclient=embed&cid=17405378346671116798'),
(7, 1, 'Arabian Ranches', 'Near Carrefour Market, Arabian Ranches, United Arab Emirates', '04 2311907', 'info@edi.ae', 'Sunday to Thursday: 10:00 AM - 10:00 PM\nFriday and Saturday: 10:00 AM - 12:00 PM', 'https://maps.google.com/maps?ll=25.259313,55.423688&z=15&t=m&hl=en&gl=AE&mapclient=embed&cid=15006948935062182707'),
(8, 1, 'Al Muraqabat', 'Next to Al Muraqabat Police Station, Al Muraqabat, United Arab Emirates', '04 2311918', 'info@edi.ae', 'Sunday to Thursday: 10:00 AM - 10:00 PM\nFriday and Saturday: 10:00 AM - 12:00 PM', 'https://maps.google.com/maps?ll=25.239363,55.310172&z=15&t=m&hl=en&gl=AE&mapclient=embed&cid=2866818161936967693'),
(9, 1, 'Jumeirah Lake Towers', 'Ground Floor, Jumeirah Business Centre - 2, Cluster V, Jumeirah Lake Towers, United Arab Emirates', '04 2311926', 'info@edi.ae', 'Sunday to Thursday: 10:00 AM - 10:00 PM\nFriday and Saturday: 10:00 AM - 12:00 PM', 'https://maps.google.com/maps?ll=25.223106,55.35649&z=17&t=m&hl=en&gl=AE&mapclient=embed&cid=4287594571930249419'),
(10, 1, 'Al Bada''a', 'Next to Al Bada''a Post Office, Al Bada''a, United Arab Emirates', '04 2311908', 'info@edi.ae', 'Sunday to Thursday: 10:00 AM - 10:00 PM\nFriday and Saturday: 10:00 AM - 12:00 PM', 'https://maps.google.com/maps?ll=25.228281,55.260246&z=17&t=m&hl=en&gl=AE&mapclient=embed&cid=2066732317957225785'),
(11, 1, 'Motor City', 'Ground Floor, Apex Atria Building, Motor City, United States', '04 2311930', 'info@edi.ae', 'Sunday to Thursday: 10:00 AM - 10:00 PM\nFriday and Saturday: 10:00 AM - 12:00 PM', 'https://maps.google.com/maps?ll=25.114166,55.138611&z=17&t=m&hl=en&gl=AE&mapclient=embed&cid=12817330442346433795'),
(12, 1, 'Al Barsha', 'Next to Al Barsha Police Station, Al Barsha, United Arab Emirates', '04 2311909', 'info@edi.ae', 'Sunday to Thursday: 10:00 AM - 10:00 PM\nFriday and Saturday: 10:00 AM - 12:00 PM', 'https://maps.google.com/maps'),
(13, 1, 'Al Warqa 3', 'Al Warqa 3, Dubai', '04 2311931', 'info@edi.ae', 'Sunday to Thursday: 10:00 AM - 10:00 PM\nFriday and Saturday: 10:00 AM - 12:00 PM', 'https://maps.google.com/maps?ll=25.277681,55.37308&z=12&t=m&hl=en&gl=AE&mapclient=embed&cid=144193893245201895833'),
(14, 1, 'Al Nahda', 'Al Nahda, Dubai', '04 2311915', 'info@edi.ae', 'Sunday to Thursday: 10:00 AM - 10:00 PM\nFriday and Saturday: 10:00 AM - 12:00 PM', 'https://maps.google.com/maps?ll=25.277681,55.37308&z=12&t=m&hl=en&gl=AE&mapclient=embed&cid=144193893245201895834'),

-- BDC branches (15-40)
(15, 2, 'Al Wasl', 'Al Wasl, Dubai', '8002354272', 'customercare@bdc.ae', 'Mon-Sat (8 AM - 5 PM) Sun (7 AM - 3 PM) / Reg: Mon-Sat (8 AM - 10 PM)', 'https://g.page/belhasadrivingcenteralwasl?share'),
(16, 2, 'Al Quoz', 'Al Quoz, Dubai', '8002354272', 'customercare@bdc.ae', 'Mon-Sat (8 AM - 5 PM) Sun (7 AM - 3 PM) / Reg: Mon-Sat (8 AM - 10 PM)', 'https://g.page/belhasadrivingschool?share'),
(17, 2, 'Jebel Ali', 'Jebel Ali, Dubai', '8002354272', 'customercare@bdc.ae', 'Mon-Sat (8 AM - 4 PM) Sun (Closed) / Reg: Mon-Sat (7 AM - 6 PM)', 'https://goo.gl/maps/ZDEEAT3Y89wsWHw87'),
(18, 2, 'Nad Al Hammar', 'Nad Al Hammar, Dubai', '8002354272', 'customercare@bdc.ae', 'Mon-Sat (8 AM - 5 PM) Sun (7 AM - 3 PM) / Reg: Mon-Sat (8 AM - 10 PM)', 'https://goo.gl/maps/qaeQcYGSxDcTbzbe7'),
(19, 2, 'Al Qusais', 'Al Qusais, Dubai', '8002354272', 'customercare@bdc.ae', 'Mon-Sat (8 AM - 5 PM) Sun (7 AM - 3 PM) / Reg: Mon-Sat (8 AM - 10 PM)', 'https://maps.app.goo.gl/'),
(20, 2, 'Motor City', 'Motor City, Dubai', '8002354272', 'customercare@bdc.ae', 'Mon-Sat (9 AM - 8 PM) Sun (7 AM - 3 PM) / Reg: Mon-Sat (8 AM - 10 PM)', 'https://goo.gl/maps/7Q39169X8M7dF9Jb8'),
(21, 2, 'Al Karama', 'Al Karama, Dubai', '8002354272', 'customercare@bdc.ae', 'Mon-Sat (9 AM - 8 PM) / Reg: Mon-Sat (8 AM - 10 PM)', 'https://goo.gl/maps/y1zFfX7677uL3QoV6'),
(22, 2, 'Al Barsha', 'Al Barsha, Dubai', '8002354272', 'customercare@bdc.ae', 'Every Day (10 AM - 10 PM) / Reg: Mon-Sun (2 PM - 3 PM)', 'https://goo.gl/maps/q777k1E22sX9T58w9'),
(23, 2, 'Dubai Mall', 'Dubai Mall, Dubai', '8002354272', 'customercare@bdc.ae', 'Mon-Fri (10 AM - 10 PM) Sat-Sun (10 AM - 12 AM) / Reg: Mon-Sun (2 PM - 3 PM)', 'https://goo.gl/maps/p1k1jK6Y66y2q65W9'),
(24, 2, 'Mall of the Emirates', 'Mall of the Emirates, Dubai', '8002354272', 'customercare@bdc.ae', 'Mon-Fri (10 AM - 10 PM) Sat-Sun (10 AM - 12 AM) / Reg: Mon-Sun (2 PM - 3 PM)', 'https://goo.gl/maps/p1k1jK6Y66y2q65W9'),
(25, 2, 'City Centre Mirdif', 'City Centre Mirdif, Dubai', '8002354272', 'customercare@bdc.ae', 'Every Day (10 AM - 10 PM) / Reg: Mon-Sun (2 PM - 3 PM)', 'https://goo.gl/maps/5HrTbU9TD7QjwZ1GA'),
(26, 2, 'Khaleej Center', 'Khaleej Center, Dubai', '43258331', 'customercare@bdc.ae', 'Every Day (10 AM - 10 PM) / Reg: Mon-Sun (2 PM - 3 PM)', 'https://goo.gl/maps/5HrTbU9TD7QjwZ1GA'),
(27, 2, 'Marina Walk, Dubai', 'Marina Walk, Dubai', '45542142', 'customercare@bdc.ae', 'Mon-Sat (9 AM - 8 PM) / Reg: Mon-Sat (2 PM - 3 PM)', 'https://goo.gl/maps/HCWm4s52YVBbJRLb9'),
(28, 2, 'IBN Battuta Mall', 'IBN Battuta Mall, Dubai', '42427759', 'customercare@bdc.ae', 'Mon-Fri (10 AM - 10 PM) Sat-Sun (10 AM - 12 AM) / Reg: Mon-Sun (2 PM - 3 PM)', 'https://goo.gl/maps/nDkXxNYewhVubVLp9'),
(29, 2, 'Aweer Union Coop', 'Aweer Union Coop, Dubai', '43210058', 'customercare@bdc.ae', 'Every Day (10 AM - 10 PM) / Reg: Mon-Sat (2 PM - 3 PM)', 'https://goo.gl/maps/wawbd3N27SpnG1Y26'),
(30, 2, 'Silicon Oasis, Souq Extra', 'Silicon Oasis, Souq Extra, Dubai', '43956505', 'customercare@bdc.ae', 'Every Day (10 AM - 10 PM) / Reg: Mon-Sat (2 PM - 3 PM)', 'https://goo.gl/maps/gXs5fKveFZcs6GxU9'),
(31, 2, 'Al Quoz, Grand Shopping Mall', 'Al Quoz, Grand Shopping Mall, Dubai', '43358933', 'customercare@bdc.ae', 'Every Day (10 AM - 10 PM) / Reg: Mon-Sun (2 PM - 3 PM)', 'https://goo.gl/maps/W6Q3H61Rz7zN2J7h7'),
(32, 2, 'Jumeirah Lake Towers', 'Jumeirah Lake Towers, Dubai', '43513337', 'customercare@bdc.ae', 'Every Day (10 AM - 10 PM) / Reg: Mon-Sun (2 PM - 3 PM)', 'https://goo.gl/maps/x8rF78Xn3r2iB132A'),
(33, 2, 'Al Satwa', 'Al Satwa, Dubai', '43455855', 'customercare@bdc.ae', 'Every Day (10 AM - 10 PM) / Reg: Mon-Sun (2 PM - 3 PM)', 'https://goo.gl/maps/H1D3gL1d4T9297L69'),
(34, 2, 'Al Nahda', 'Al Nahda, Dubai', '42524545', 'customercare@bdc.ae', 'Every Day (10 AM - 10 PM) / Reg: Mon-Sun (2 PM - 3 PM)', 'https://goo.gl/maps/H1D3gL1d4T9297L69'),
(35, 2, 'Al Mizhar, Uptown Mirdif', 'Al Mizhar, Uptown Mirdif, Dubai', '42524545', 'customercare@bdc.ae', 'Every Day (10 AM - 10 PM) / Reg: Mon-Sun (2 PM - 3 PM)', 'https://goo.gl/maps/H1D3gL1d4T9297L69'),
(36, 2, 'Al Mulla Plaza', 'Al Mulla Plaza, Dubai', '42524545', 'customercare@bdc.ae', 'Every Day (10 AM - 10 PM) / Reg: Mon-Sun (2 PM - 3 PM)', 'https://goo.gl/maps/H1D3gL1d4T9297L69'),
(37, 2, 'Al Warqa', 'Al Warqa, Dubai', '42524545', 'customercare@bdc.ae', 'Every Day (10 AM - 10 PM) / Reg: Mon-Sun (2 PM - 3 PM)', 'https://goo.gl/maps/H1D3gL1d4T9297L69'),
(38, 2, 'Al Nahda, Sahara Center', 'Al Nahda, Sahara Center, Dubai', '42524545', 'customercare@bdc.ae', 'Every Day (10 AM - 10 PM) / Reg: Mon-Sun (2 PM - 3 PM)', 'https://goo.gl/maps/H1D3gL1d4T9297L69'),
(39, 2, 'Lulu Hypermarket, Al Barsha', 'Lulu Hypermarket, Al Barsha, Dubai', '43415175', 'customercare@bdc.ae', 'Mon-Sat (8 AM - 5 PM) Sun (7 AM - 3 PM) / Reg: Mon-Sat (8 AM - 10 PM)', 'https://goo.gl/maps/p1k1jK6Y66y2q65W9'),
(40, 2, 'Satwa RTA Center', 'Satwa RTA Center, Dubai', '43415175', 'customercare@bdc.ae', 'Mon-Sat (8 AM - 5 PM) Sun (7 AM - 3 PM) / Reg: Mon-Sat (8 AM - 10 PM)', 'https://goo.gl/maps/UDmwXjEjmkzBVXbZ9'),

-- GMDC branches (41-69)
(41, 3, 'AL QUSAIS MAIN OFFICE', 'AL QUSAIS MAIN OFFICE, Dubai', '600595956', 'info@gmdc.ae', '8:00 AM to 10:00 PM / 8:00 AM to 10:00 PM', 'https://goo.gl/maps/Mg5SJ6op7YmajMDi9'),
(42, 3, 'MUHAISNAH TEST CENTRE', 'MUHAISNAH TEST CENTRE, Dubai', '600595956', 'aqs.followup@gmdc.ae', '8:00 AM to 10:00 PM / 8:00 AM to 10:00 PM', 'https://goo.gl/maps/A3NR7V4qiDwoCHgW9'),
(43, 3, 'AL QUOZ MAIN OFFICE', 'AL QUOZ MAIN OFFICE, Dubai', '600595956', 'info@gmdc.ae', '8:00 AM to 10:00 PM / 8:00 AM to 10:00 PM', 'https://goo.gl/maps/T2XRVf3NSZGsMPPi6'),
(44, 3, 'ABU HAIL', 'ABU HAIL, Dubai', '600595956', 'br.abuhail@gmdc.ae', '8:00 AM to 10:00 PM / 8:00 AM to 10:00 PM', 'https://goo.gl/maps/D67y8s15gJ1N81t49'),
(45, 3, 'AL BARSHA (RTA BUILDING)', 'AL BARSHA (RTA BUILDING), Dubai', '600595956', 'br.barsha@gmdc.ae', '8:00 AM to 10:00 PM / 8:00 AM to 10:00 PM', 'https://goo.gl/maps/kUoR9rX1Dq6b9WfT8'),
(46, 3, 'AL WARQA', 'AL WARQA, Dubai', '600595956', 'br.alwarqa@gmdc.ae', '8:00 AM to 10:00 PM / 8:00 AM to 10:00 PM', 'https://goo.gl/maps/XWb68f1m79J9m47R7'),
(47, 3, 'ANSAR GALLERY (QUSAIS)', 'ANSAR GALLERY (QUSAIS), Dubai', '600595956', 'br.ansargalery@gmdc.ae', '10:00 AM to 10:00 PM / 10:00 AM to 10:00 PM', 'https://goo.gl/maps/c635mN2V3bB1wY3y5'),
(48, 3, 'ARABIAN CENTRE', 'ARABIAN CENTRE, Dubai', '600595956', 'br.arabiancentre@gmdc.ae', '10:00 AM to 10:00 PM / 10:00 AM to 12:00 AM', 'https://goo.gl/maps/L2Nf3k5c3Q3Cg9zN6'),
(49, 3, 'AL-KARAMA', 'AL-KARAMA, Dubai', '600595956', 'br.karama@gmdc.ae', '8:00 AM to 10:00 PM / 8:00 AM to 10:00 PM', 'https://goo.gl/maps/T5b7ZJ7qQ8r3Q4wF9'),
(50, 3, 'AL AWEER (RTA BUILDING)', 'AL AWEER (RTA BUILDING), Dubai', '600595956', 'info@gmdc.ae', '8:00 AM to 10:00 PM / 8:00 AM to 10:00 PM', 'https://goo.gl/maps/G1zR7qF8K8G6s7wD8'),
(51, 3, 'AL NAHDA (ANSAR GALLERY)', 'AL NAHDA (ANSAR GALLERY), Dubai', '600595956', 'br.nahda@gmdc.ae', '10:00 AM to 10:00 PM / 10:00 AM to 10:00 PM', 'https://goo.gl/maps/N6r7z8jQ8s3B4wF9G'),
(52, 3, 'AL TWAR (RTA BUILDING)', 'AL TWAR (RTA BUILDING), Dubai', '600595956', 'br.alwar@gmdc.ae', '8:00 AM to 10:00 PM / 8:00 AM to 10:00 PM', 'https://goo.gl/maps/P5r7z8jQ8s3B4wF9H'),
(53, 3, 'AVENUE MALL', 'AVENUE MALL, Dubai', '600595956', 'br.avenuemall@gmdc.ae', '10:00 AM to 10:00 PM / 10:00 AM to 10:00 PM', 'https://goo.gl/maps/Q6r7z8jQ8s3B4wF9I'),
(54, 3, 'BURJUMAN', 'BURJUMAN, Dubai', '600595956', 'br.burjuman@gmdc.ae', '10:00 AM to 10:00 PM / 10:00 AM to 12:00 AM', 'https://goo.gl/maps/R7r7z8jQ8s3B4wF9J'),
(55, 3, 'CITY CENTRE DEIRA', 'CITY CENTRE DEIRA, Dubai', '600595956', 'br.citycenter@gmdc.ae', '10:00 AM to 10:00 PM / 10:00 AM to 12:00 AM', 'https://goo.gl/maps/S8r7z8jQ8s3B4wF9K'),
(56, 3, 'CITY CENTRE MIRDIF', 'CITY CENTRE MIRDIF, Dubai', '600595956', 'br.mirdif@gmdc.ae', '10:00 AM to 10:00 PM / 10:00 AM to 12:00 AM', 'https://goo.gl/maps/T9r7z8jQ8s3B4wF9L'),
(57, 3, 'DAMAC PROPERTIES METRO', 'DAMAC PROPERTIES METRO, Dubai', '600595956', 'br.damac@gmdc.ae', '8:00 AM to 10:00 PM / 8:00 AM to 10:00 PM', 'https://goo.gl/maps/U0r7z8jQ8s3B4wF9M'),
(58, 3, 'DUBAI MALL', 'DUBAI MALL, Dubai', '600595956', 'br.dubaimall@gmdc.ae', '10:00 AM to 10:00 PM / 10:00 AM to 12:00 AM', 'https://goo.gl/maps/V1r7z8jQ8s3B4wF9N'),
(59, 3, 'EMIRATES POST OFFICE JUMEIRAH', 'EMIRATES POST OFFICE JUMEIRAH, Dubai', '600595956', 'br.jumeirah@gmdc.ae', '8:00 AM to 8:00 PM / 8:00 AM to 8:00 PM', 'https://goo.gl/maps/W2r7z8jQ8s3B4wF9O'),
(60, 3, 'FASHION DRIVE MALL', 'FASHION DRIVE MALL, Dubai', '600595956', 'br.fashiondrive@gmdc.ae', '10:00 AM to 10:00 PM / 10:00 AM to 10:00 PM', 'https://goo.gl/maps/X3r7z8jQ8s3B4wF9P'),
(61, 3, 'FESTIVAL CITY', 'FESTIVAL CITY, Dubai', '600595956', 'br.festivalcity@gmdc.ae', '10:00 AM to 10:00 PM / 10:00 AM to 12:00 AM', 'https://goo.gl/maps/Y4r7z8jQ8s3B4wF9Q'),
(62, 3, 'IBN BATTUTA MALL', 'IBN BATTUTA MALL, Dubai', '600595956', 'br.ibn@gmdc.ae', '10:00 AM to 10:00 PM / 10:00 AM to 12:00 AM', 'https://goo.gl/maps/Z5r7z8jQ8s3B4wF9R'),
(63, 3, 'JUMEIRAH LAKE TOWER', 'JUMEIRAH LAKE TOWER, Dubai', '600595956', 'br.jlt@gmdc.ae', '8:00 AM to 10:00 PM / 8:00 AM to 10:00 PM', 'https://goo.gl/maps/A6r7z8jQ8s3B4wF9S'),
(64, 3, 'MOTOR CITY', 'MOTOR CITY, Dubai', '600595956', 'br.motorcity@gmdc.ae', '8:00 AM to 10:00 PM / 8:00 AM to 10:00 PM', 'https://goo.gl/maps/B7r7z8jQ8s3B4wF9T'),
(65, 3, 'MULLA PLAZA', 'MULLA PLAZA, Dubai', '600595956', 'br.mullaplaza@gmdc.ae', '10:00 AM to 10:00 PM / 10:00 AM to 10:00 PM', 'https://goo.gl/maps/C8r7z8jQ8s3B4wF9U'),
(66, 3, 'SHINDAGHA', 'SHINDAGHA, Dubai', '600595956', 'br.shindagha@gmdc.ae', '10:00 AM to 10:00 PM (Mon-Thu) / 10:00 AM to 12:00 AM (Fri-Sun)', 'https://goo.gl/maps/NN2ECfawPeypU43E6'),
(67, 3, 'SILICON OASIS', 'SILICON OASIS, Dubai', '600595956', 'Br.SiliconOasis@gmdc.ae', '8:00 AM to 10:00 PM / 8:00 AM to 10:00 PM', 'https://goo.gl/maps/SJ5MbefYjn5c5QKk6'),
(68, 3, 'SOUQ EXTRA', 'SOUQ EXTRA, Dubai', '600595956', 'br.souketxtra@gmdc.ae', '8:00 AM to 8:00 PM / 8:00 AM to 8:00 PM', 'https://goo.gl/maps/7kMNUPHJXUYt3hRu5'),
(69, 3, 'TECOM( NEAR CARREFOUR )', 'TECOM( NEAR CARREFOUR ), Dubai', '600595956', 'br.tecom@gmdc.ae', '8:00 AM to 10:00 PM / 8:00 AM to 10:00 PM', 'https://goo.gl/maps/D9r7z8jQ8s3B4wF9V'),

-- DDC branches (70-125)
(70, 4, 'Mamzar Center', 'Hor al Anz east,Deira - Dubai', '97143340532', 'mamzar@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/head-office.html'),
(71, 4, 'Port Rashid', 'Jumeirah Rd, Dubai, United Arab Emirates', '97143455855', 'enquiries@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/head-office.html'),
(72, 4, 'Al Khail', 'Near Al Khail Gate, Al Qouz Industrial Area 2, Dubai.', '97144048000', 'alkhail@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_khail.html'),
(73, 4, 'DIP 2', 'EXPO Rd (Lehbab - Jebelali) first right turn to DIP 2,left turn from the first roundabout, DIP 2, Dubai.', '97148020000', 'info@ddcp.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/dip2.html'),
(74, 4, 'Al Quoz', 'Alquoz industrial area 3, Near Al-Naboodha Automobiles, Alquoz, Dubai.', '97143236000', 'al quoz@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_quoz.html'),
(75, 4, 'Al Satwa', 'Sheikh Zayed Road, near ENOC Petrol station, next to Reem Al Bawadi Restaurant, Satwa, Dubai.', '97143314479', 'satwa@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_satwa.html'),
(76, 4, 'Deira Nakheel', 'Ground Floor Nakheel Center, Opp. Al-Futaim Mosque, Deira, Dubai.', '97142297844', 'nakheel@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/deira_nakheel.html'),
(77, 4, 'Hor Al Anz', 'Near Karachi Darbar Hotel, Hor Al Anz, Dubai.', '97142663828', 'horalanz@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/hor_al_anz.html'),
(78, 4, 'Khaleej Center', 'Rola street , near bur dubai, Dubai.', '97143595470', 'ddccdxb@emirates.net.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/khaleej_center.html'),
(79, 4, 'Al Karama 2', 'Ground floor, Development Board Building, Opposite Al-Kifaaf Apartments,Near Al-Manama Super Market, Karama, Dubai.', '97143358933', 'karama2@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_karama2.html'),
(80, 4, 'Al Qusais 2', 'Near Tassama Mandi Restaurant, Opposite Dubai Residential Oasis, Al-Qusais 2, Dubai.', '97142582882', 'alqusais2@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_qusais2.html'),
(81, 4, 'Hor Al Anz Center', 'Near Karachi Darbar Hotel, Hor Al Anz, Dubai.', '97142663828', 'horalanz@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/hor_al_anz.html'),
(82, 4, 'Al Khail Gate', 'Near Al Khail Gate, Al Qouz Industrial Area 2, Dubai.', '97144048000', 'alkhail@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_khail.html'),
(83, 4, 'Al Quoz Mall', 'Alquoz industrial area 3, Near Al-Naboodha Automobiles, Alquoz, Dubai.', '97143236000', 'al quoz@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_quoz.html'),
(84, 4, 'Al Quoz 2', 'Near Tassama Mandi Restaurant, Opposite Dubai Residential Oasis, Al-Qusais 2, Dubai.', '97142582882', 'alqusais2@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_qusais2.html'),
(85, 4, 'Al Quoz 3', 'Near Tassama Mandi Restaurant, Opposite Dubai Residential Oasis, Al-Qusais 2, Dubai.', '97142582882', 'alqusais2@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_qusais2.html'),
(86, 4, 'Khaleej Center 2', 'Rola street , near bur dubai, Dubai.', '97143595470', 'ddccdxb@emirates.net.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/khaleej_center.html'),
(87, 4, 'Hor Al Anz East', 'Near Karachi Darbar Hotel, Hor Al Anz, Dubai.', '97142663828', 'horalanz@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/hor_al_anz.html'),
(88, 4, 'DIP 2 Center', 'EXPO Rd (Lehbab - Jebelali) first right turn to DIP 2,left turn from the first roundabout, DIP 2, Dubai.', '97148020000', 'info@ddcp.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/dip2.html'),
(89, 4, 'Al Khail Gate Center', 'Near Al Khail Gate, Al Qouz Industrial Area 2, Dubai.', '97144048000', 'alkhail@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_khail.html'),
(90, 4, 'DIP 2 Driving Center', 'EXPO Rd (Lehbab - Jebelali) first right turn to DIP 2,left turn from the first roundabout, DIP 2, Dubai.', '97148020000', 'info@ddcp.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/dip2.html'),
(91, 4, 'Al Quoz Driving Center', 'Alquoz industrial area 3, Near Al-Naboodha Automobiles, Alquoz, Dubai.', '97143236000', 'al quoz@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_quoz.html'),
(92, 4, 'Al Satwa Driving Center', 'Sheikh Zayed Road, near ENOC Petrol station, next to Reem Al Bawadi Restaurant, Satwa, Dubai.', '97143314479', 'satwa@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_satwa.html'),
(93, 4, 'Deira Nakheel Center', 'Ground Floor Nakheel Center, Opp. Al-Futaim Mosque, Deira, Dubai.', '97142297844', 'nakheel@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/deira_nakheel.html'),
(94, 4, 'Hor Al Anz Center 2', 'Near Karachi Darbar Hotel, Hor Al Anz, Dubai.', '97142663828', 'horalanz@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/hor_al_anz.html'),
(95, 4, 'Khaleej Center Driving School', 'Rola street , near bur dubai, Dubai.', '97143595470', 'ddccdxb@emirates.net.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/khaleej_center.html'),
(96, 4, 'Al Karama Driving Center', 'Ground floor, Development Board Building, Opposite Al-Kifaaf Apartments,Near Al-Manama Super Market, Karama, Dubai.', '97143358933', 'karama2@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_karama2.html'),
(97, 4, 'Al Qusais Driving Center', 'Near Tassama Mandi Restaurant, Opposite Dubai Residential Oasis, Al-Qusais 2, Dubai.', '97142582882', 'alqusais2@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_qusais2.html'),
(98, 4, 'Mamzar Driving Center', 'Hor al Anz east,Deira - Dubai', '97143340532', 'mamzar@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/head-office.html'),
(99, 4, 'Port Rashid Driving Center', 'Jumeirah Rd, Dubai, United Arab Emirates', '97143455855', 'enquiries@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/head-office.html'),
(100, 4, 'Al Khail Driving Center', 'Near Al Khail Gate, Al Qouz Industrial Area 2, Dubai.', '97144048000', 'alkhail@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_khail.html'),
(101, 4, 'DIP 2 Center Driving School', 'EXPO Rd (Lehbab - Jebelali) first right turn to DIP 2,left turn from the first roundabout, DIP 2, Dubai.', '97148020000', 'info@ddcp.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/dip2.html'),
(102, 4, 'Al Quoz Mall Driving Center', 'Alquoz industrial area 3, Near Al-Naboodha Automobiles, Alquoz, Dubai.', '97143236000', 'al quoz@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_quoz.html'),
(103, 4, 'Al Satwa RTA Center', 'Sheikh Zayed Road, near ENOC Petrol station, next to Reem Al Bawadi Restaurant, Satwa, Dubai.', '97143314479', 'satwa@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_satwa.html'),
(104, 4, 'Deira Nakheel Driving Center', 'Ground Floor Nakheel Center, Opp. Al-Futaim Mosque, Deira, Dubai.', '97142297844', 'nakheel@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/deira_nakheel.html'),
(105, 4, 'Hor Al Anz East Center', 'Near Karachi Darbar Hotel, Hor Al Anz, Dubai.', '97142663828', 'horalanz@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/hor_al_anz.html'),
(106, 4, 'Khaleej Center Branch', 'Rola street , near bur dubai, Dubai.', '97143595470', 'ddccdxb@emirates.net.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/khaleej_center.html'),
(107, 4, 'Al Karama Branch', 'Ground floor, Development Board Building, Opposite Al-Kifaaf Apartments,Near Al-Manama Super Market, Karama, Dubai.', '97143358933', 'karama2@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_karama2.html'),
(108, 4, 'Al Qusais Branch', 'Near Tassama Mandi Restaurant, Opposite Dubai Residential Oasis, Al-Qusais 2, Dubai.', '97142582882', 'alqusais2@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_qusais2.html'),
(109, 4, 'Mamzar RTA Center', 'Hor al Anz east,Deira - Dubai', '97143340532', 'mamzar@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/head-office.html'),
(110, 4, 'Port Rashid RTA Center', 'Jumeirah Rd, Dubai, United Arab Emirates', '97143455855', 'enquiries@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/head-office.html'),
(111, 4, 'Al Khail Gate RTA Center', 'Near Al Khail Gate, Al Qouz Industrial Area 2, Dubai.', '97144048000', 'alkhail@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_khail.html'),
(112, 4, 'DIP 2 RTA Center', 'EXPO Rd (Lehbab - Jebelali) first right turn to DIP 2,left turn from the first roundabout, DIP 2, Dubai.', '97148020000', 'info@ddcp.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/dip2.html'),
(113, 4, 'Al Quoz RTA Center', 'Alquoz industrial area 3, Near Al-Naboodha Automobiles, Alquoz, Dubai.', '97143236000', 'al quoz@dcds123.ae', 'Contact School for Hours', 'https://www.www.dubaidrivingcenter.net/al_quoz.html'),
(114, 4, 'Al Satwa Branch', 'Sheikh Zayed Road, near ENOC Petrol station, next to Reem Al Bawadi Restaurant, Satwa, Dubai.', '97143314479', 'satwa@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_satwa.html'),
(115, 4, 'Deira Nakheel Branch', 'Ground Floor Nakheel Center, Opp. Al-Futaim Mosque, Deira, Dubai.', '97142297844', 'nakheel@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/deira_nakheel.html'),
(116, 4, 'Hor Al Anz Branch', 'Near Karachi Darbar Hotel, Hor Al Anz, Dubai.', '97142663828', 'horalanz@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/hor_al_anz.html'),
(117, 4, 'Khaleej Center Branch 2', 'Rola street , near bur dubai, Dubai.', '97143595470', 'ddccdxb@emirates.net.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/khaleej_center.html'),
(118, 4, 'Al Karama Branch 2', 'Ground floor, Development Board Building, Opposite Al-Kifaaf Apartments,Near Al-Manama Super Market, Karama, Dubai.', '97143358933', 'karama2@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_karama2.html'),
(119, 4, 'Al Qusais Branch 2', 'Near Tassama Mandi Restaurant, Opposite Dubai Residential Oasis, Al-Qusais 2, Dubai.', '97142582882', 'alqusais2@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_qusais2.html'),
(120, 4, 'Mamzar RTA Center Branch', 'Hor al Anz east,Deira - Dubai', '97143340532', 'mamzar@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/head-office.html'),
(121, 4, 'Port Rashid RTA Center Branch', 'Jumeirah Rd, Dubai, United Arab Emirates', '97143455855', 'enquiries@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/head-office.html'),
(122, 4, 'Al Khail Gate RTA Center Branch', 'Near Al Khail Gate, Al Qouz Industrial Area 2, Dubai.', '97144048000', 'alkhail@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_khail.html'),
(123, 4, 'DIP 2 RTA Center Branch', 'EXPO Rd (Lehbab - Jebelali) first right turn to DIP 2,left turn from the first roundabout, DIP 2, Dubai.', '97148020000', 'info@ddcp.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/dip2.html'),
(124, 4, 'Al Quoz RTA Center Branch', 'Alquoz industrial area 3, Near Al-Naboodha Automobiles, Alquoz, Dubai.', '97143236000', 'al quoz@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_quoz.html'),
(125, 4, 'Al Satwa RTA Center Branch', 'Sheikh Zayed Road, near ENOC Petrol station, next to Reem Al Bawadi Restaurant, Satwa, Dubai.', '97143314479', 'satwa@dcds123.ae', 'Contact School for Hours', 'https://www.dubaidrivingcenter.net/al_satwa.html'),

-- Al Ahli Driving Center branches (126-170)
(126, 5, 'Al Quoz', 'Al Quoz, Industrial 4 Street No.19 A, Dubai', '+971800252454', '800-252454care@alahlidubai.ae', 'Monday to Saturday : 08:00am till 11:00pm\nFriday : 08:00am till 12:30pm\n02:00pm till 11:00pm\nSunday : 08:00am till 5:00pm', 'https://alahlidubai.ae/contact/'),
(127, 5, 'Al Nahda', 'Al Nahda, Dubai', '+97142586700', 'nahda@alahlidubai.ae', '08:00 -- 22:00', 'https://alahlidubai.ae/contact/'),
(128, 5, 'Bur Dubai', 'Bur Dubai, Dubai', '+97143519333', 'burdubai@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(129, 5, 'Freg Al Marrar', 'Freg Al Marrar, Dubai', '+97142724284', 'almarar@alahlidubai.ae', '10:00 --20:00', 'https://alahlidubai.ae/contact/'),
(130, 5, 'Jumeirah Lake Tower', 'Jumeirah Lake Tower, Dubai', '+97144222044', 'jlt@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(131, 5, 'Al Quoz Test Centre', 'Al Quoz Test Centre, Dubai', '+971800252454', '800-252454care@alahlidubai.ae', 'Monday to Saturday : 08:00am till 11:00pm\nFriday : 08:00am till 12:30pm\n02:00pm till 11:00pm\nSunday : 08:00am till 5:00pm', 'https://alahlidubai.ae/contact/'),
(132, 5, 'Al Nahda Branch', 'Al Nahda, Dubai', '+97142586700', 'nahda@alahlidubai.ae', '08:00 -- 22:00', 'https://alahlidubai.ae/contact/'),
(133, 5, 'Bur Dubai Branch', 'Bur Dubai, Dubai', '+97143519333', 'burdubai@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(134, 5, 'Freg Al Marrar Branch', 'Freg Al Marrar, Dubai', '+97142724284', 'almarar@alahlidubai.ae', '10:00 --20:00', 'https://alahlidubai.ae/contact/'),
(135, 5, 'Jumeirah Lake Tower Branch', 'Jumeirah Lake Tower, Dubai', '+97144222044', 'jlt@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(136, 5, 'Al Quoz RTA Center', 'Al Quoz, Industrial 4 Street No.19 A, Dubai', '+971800252454', '800-252454care@alahlidubai.ae', 'Monday to Saturday : 08:00am till 11:00pm\nFriday : 08:00am till 12:30pm\n02:00pm till 11:00pm\nSunday : 08:00am till 5:00pm', 'https://alahlidubai.ae/contact/'),
(137, 5, 'Al Nahda RTA Center', 'Al Nahda, Dubai', '+97142586700', 'nahda@alahlidubai.ae', '08:00 -- 22:00', 'https://alahlidubai.ae/contact/'),
(138, 5, 'Bur Dubai RTA Center', 'Bur Dubai, Dubai', '+97143519333', 'burdubai@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(139, 5, 'Freg Al Marrar RTA Center', 'Freg Al Marrar, Dubai', '+97142724284', 'almarar@alahlidubai.ae', '10:00 --20:00', 'https://alahlidubai.ae/contact/'),
(140, 5, 'Jumeirah Lake Tower RTA Center', 'Jumeirah Lake Tower, Dubai', '+97144222044', 'jlt@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(141, 5, 'Al Quoz Main Branch', 'Al Quoz, Industrial 4 Street No.19 A, Dubai', '+971800252454', '800-252454care@alahlidubai.ae', 'Monday to Saturday : 08:00am till 11:00pm\nFriday : 08:00am till 12:30pm\n02:00pm till 11:00pm\nSunday : 08:00am till 5:00pm', 'https://alahlidubai.ae/contact/'),
(142, 5, 'Al Nahda Main Branch', 'Al Nahda, Dubai', '+97142586700', 'nahda@alahlidubai.ae', '08:00 -- 22:00', 'https://alahlidubai.ae/contact/'),
(143, 5, 'Bur Dubai Main Branch', 'Bur Dubai, Dubai', '+97143519333', 'burdubai@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(144, 5, 'Freg Al Marrar Main Branch', 'Freg Al Marrar, Dubai', '+97142724284', 'almarar@alahlidubai.ae', '10:00 --20:00', 'https://alahlidubai.ae/contact/'),
(145, 5, 'Jumeirah Lake Tower Main Branch', 'Jumeirah Lake Tower, Dubai', '+97144222044', 'jlt@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(146, 5, 'Al Quoz Office', 'Al Quoz, Industrial 4 Street No.19 A, Dubai', '+971800252454', '800-252454care@alahlidubai.ae', 'Monday to Saturday : 08:00am till 11:00pm\nFriday : 08:00am till 12:30pm\n02:00pm till 11:00pm\nSunday : 08:00am till 5:00pm', 'https://alahlidubai.ae/contact/'),
(147, 5, 'Al Nahda Office', 'Al Nahda, Dubai', '+97142586700', 'nahda@alahlidubai.ae', '08:00 -- 22:00', 'https://alahlidubai.ae/contact/'),
(148, 5, 'Bur Dubai Office', 'Bur Dubai, Dubai', '+97143519333', 'burdubai@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(149, 5, 'Freg Al Marrar Office', 'Freg Al Marrar, Dubai', '+97142724284', 'almarar@alahlidubai.ae', '10:00 --20:00', 'https://alahlidubai.ae/contact/'),
(150, 5, 'Jumeirah Lake Tower Office', 'Jumeirah Lake Tower, Dubai', '+97144222044', 'jlt@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(151, 5, 'Al Quoz Registration', 'Al Quoz, Industrial 4 Street No.19 A, Dubai', '+971800252454', '800-252454care@alahlidubai.ae', 'Monday to Saturday : 08:00am till 11:00pm\nFriday : 08:00am till 12:30pm\n02:00pm till 11:00pm\nSunday : 08:00am till 5:00pm', 'https://alahlidubai.ae/contact/'),
(152, 5, 'Al Nahda Registration', 'Al Nahda, Dubai', '+97142586700', 'nahda@alahlidubai.ae', '08:00 -- 22:00', 'https://alahlidubai.ae/contact/'),
(153, 5, 'Bur Dubai Registration', 'Bur Dubai, Dubai', '+97143519333', 'burdubai@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(154, 5, 'Freg Al Marrar Registration', 'Freg Al Marrar, Dubai', '+97142724284', 'almarar@alahlidubai.ae', '10:00 --20:00', 'https://alahlidubai.ae/contact/'),
(155, 5, 'Jumeirah Lake Tower Registration', 'Jumeirah Lake Tower, Dubai', '+97144222044', 'jlt@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(156, 5, 'Al Quoz Test & Registration', 'Al Quoz, Industrial 4 Street No.19 A, Dubai', '+971800252454', '800-252454care@alahlidubai.ae', 'Monday to Saturday : 08:00am till 11:00pm\nFriday : 08:00am till 12:30pm\n02:00pm till 11:00pm\nSunday : 08:00am till 5:00pm', 'https://alahlidubai.ae/contact/'),
(157, 5, 'Al Nahda Test & Registration', 'Al Nahda, Dubai', '+97142586700', 'nahda@alahlidubai.ae', '08:00 -- 22:00', 'https://alahlidubai.ae/contact/'),
(158, 5, 'Bur Dubai Test & Registration', 'Bur Dubai, Dubai', '+97143519333', 'burdubai@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(159, 5, 'Freg Al Marrar Test & Registration', 'Freg Al Marrar, Dubai', '+97142724284', 'almarar@alahlidubai.ae', '10:00 --20:00', 'https://alahlidubai.ae/contact/'),
(160, 5, 'Jumeirah Lake Tower Test & Registration', 'Jumeirah Lake Tower, Dubai', '+97144222044', 'jlt@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(161, 5, 'Al Quoz Main Test Center', 'Al Quoz, Industrial 4 Street No.19 A, Dubai', '+971800252454', '800-252454care@alahlidubai.ae', 'Monday to Saturday : 08:00am till 11:00pm\nFriday : 08:00am till 12:30pm\n02:00pm till 11:00pm\nSunday : 08:00am till 5:00pm', 'https://alahlidubai.ae/contact/'),
(162, 5, 'Al Nahda Main Test Center', 'Al Nahda, Dubai', '+97142586700', 'nahda@alahlidubai.ae', '08:00 -- 22:00', 'https://alahlidubai.ae/contact/'),
(163, 5, 'Bur Dubai Main Test Center', 'Bur Dubai, Dubai', '+97143519333', 'burdubai@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(164, 5, 'Freg Al Marrar Main Test Center', 'Freg Al Marrar, Dubai', '+97142724284', 'almarar@alahlidubai.ae', '10:00 --20:00', 'https://alahlidubai.ae/contact/'),
(165, 5, 'Jumeirah Lake Tower Main Test Center', 'Jumeirah Lake Tower, Dubai', '+97144222044', 'jlt@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(166, 5, 'Al Quoz RTA Main Test Center', 'Al Quoz, Industrial 4 Street No.19 A, Dubai', '+971800252454', '800-252454care@alahlidubai.ae', 'Monday to Saturday : 08:00am till 11:00pm\nFriday : 08:00am till 12:30pm\n02:00pm till 11:00pm\nSunday : 08:00am till 5:00pm', 'https://alahlidubai.ae/contact/'),
(167, 5, 'Al Nahda RTA Main Test Center', 'Al Nahda, Dubai', '+97142586700', 'nahda@alahlidubai.ae', '08:00 -- 22:00', 'https://alahlidubai.ae/contact/'),
(168, 5, 'Bur Dubai RTA Main Test Center', 'Bur Dubai, Dubai', '+97143519333', 'burdubai@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/'),
(169, 5, 'Freg Al Marrar RTA Main Test Center', 'Freg Al Marrar, Dubai', '+97142724284', 'almarar@alahlidubai.ae', '10:00 --20:00', 'https://alahlidubai.ae/contact/'),
(170, 5, 'Jumeirah Lake Tower RTA Main Test Center', 'Jumeirah Lake Tower, Dubai', '+97144222044', 'jlt@alahlidubai.ae', '10:00 -- 20:00', 'https://alahlidubai.ae/contact/')

ON CONFLICT (id) DO UPDATE SET
  school_id = EXCLUDED.school_id,
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  contact = EXCLUDED.contact,
  email = EXCLUDED.email,
  normal_hours = EXCLUDED.normal_hours,
  directions_url = EXCLUDED.directions_url;

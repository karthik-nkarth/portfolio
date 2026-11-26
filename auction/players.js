const RAW_PLAYERS = [
  ['kohli', 'Virat Kohli', 'India', 'Modern Star', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm medium', 'Virat_Kohli', '2016 Prime • 973 Runs, 4 Tons', 252, 8004, 152.0, 52.7, 4, 8.8, 99, 99, 92, 65, 10, 0, 96, 15, 88, 97],
  ['dhoni', 'MS Dhoni', 'India', 'Legend', 'Wicketkeeper', 'Middle Order', 'None', 'RHB', 'Right-arm medium', 'MS_Dhoni', '2013–18 Prime • Finisher & Captain', 264, 5243, 154.6, 42.2, 0, 0.0, 92, 70, 96, 98, 5, 0, 90, 99, 99, 98],
  ['rohit', 'Rohit Sharma', 'India', 'Modern Star', 'Batsman', 'Top Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Rohit_Sharma', '2013–20 Prime • 5x IPL Champion Cap', 257, 6628, 142.8, 38.5, 15, 8.0, 95, 95, 88, 60, 0, 32, 90, 10, 98, 94],
  ['abd', 'AB de Villiers', 'South Africa', 'Legend', 'Wicketkeeper', 'Middle Order', 'None', 'RHB', 'Right-arm medium', 'AB_de_Villiers', '2015–16 Prime • Mr. 360 Destroyer', 184, 5162, 168.8, 45.2, 0, 0.0, 99, 90, 99, 88, 0, 0, 98, 86, 84, 99],
  ['gayle', 'Chris Gayle', 'West Indies', 'Legend', 'Batsman', 'Top Order', 'Spin', 'LHB', 'Right-arm offbreak', 'Chris_Gayle', '2011–13 Prime • 175* Universe Boss', 142, 4965, 165.4, 44.3, 18, 7.9, 97, 99, 72, 55, 0, 38, 76, 5, 78, 98],
  ['bumrah', 'Jasprit Bumrah', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Jasprit_Bumrah', '2020–24 Prime • Yorker Machine', 133, 69, 72.0, 9.0, 165, 6.48, 22, 10, 15, 28, 99, 0, 82, 0, 84, 99],
  ['malinga', 'Lasith Malinga', 'Sri Lanka', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Lasith_Malinga', '2011–14 Prime • Death Over King', 122, 88, 88.0, 11.0, 170, 6.75, 25, 10, 18, 30, 98, 0, 74, 0, 80, 97],
  ['raina', 'Suresh Raina', 'India', 'Golden Era', 'Batsman', 'Top Order', 'Spin', 'LHB', 'Right-arm offbreak', 'Suresh_Raina', '2010–14 Prime • Mr. IPL Consistency', 205, 5528, 145.5, 36.8, 25, 7.38, 93, 94, 92, 68, 0, 48, 97, 5, 82, 93],
  ['warner', 'David Warner', 'Australia', 'Golden Era', 'Batsman', 'Top Order', 'None', 'LHB', 'Legbreak', 'David_Warner_(cricketer)', '2015–19 Prime • 3x Orange Cap', 184, 6565, 149.2, 43.2, 0, 0.0, 97, 98, 80, 52, 0, 0, 94, 5, 92, 95],
  ['narine', 'Sunil Narine', 'West Indies', 'Modern Star', 'All-Rounder', 'Top Order', 'Spin', 'LHB', 'Right-arm offbreak', 'Sunil_Narine', '2012/2024 Prime • Mystery & Pinch Hit', 177, 1534, 172.0, 22.0, 180, 6.62, 78, 84, 68, 72, 0, 98, 82, 0, 74, 98],
  ['russell', 'Andre Russell', 'West Indies', 'Modern Star', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Andre_Russell', '2019 Prime • 204 SR Muscle Mania', 127, 2484, 182.5, 34.0, 115, 8.85, 91, 60, 90, 99, 83, 0, 88, 0, 70, 99],
  ['rashid', 'Rashid Khan', 'Afghanistan', 'Modern Star', 'All-Rounder', 'Lower Order', 'Spin', 'RHB', 'Legbreak googly', 'Rashid_Khan', '2018–23 Prime • Untouchable Leggie', 121, 545, 152.0, 18.0, 149, 6.42, 62, 25, 55, 78, 0, 99, 93, 0, 82, 97],
  ['sachin', 'Sachin Tendulkar', 'India', 'Legend', 'Batsman', 'Top Order', 'Spin', 'RHB', 'Legbreak / Offbreak', 'Sachin_Tendulkar', '2010 Prime • Orange Cap Masterclass', 78, 2334, 132.6, 39.8, 0, 7.5, 94, 96, 85, 52, 0, 36, 86, 5, 88, 92],
  ['watson', 'Shane Watson', 'Australia', 'Legend', 'All-Rounder', 'Top Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Shane_Watson', '2008/2018 Prime • 2x MVP Powerhouse', 145, 3874, 144.8, 34.5, 92, 7.82, 91, 93, 86, 72, 84, 0, 84, 0, 84, 95],
  ['kallis', 'Jacques Kallis', 'South Africa', 'Legend', 'All-Rounder', 'Top Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Jacques_Kallis', '2010–12 Prime • Classic Anchor & Seam', 98, 2427, 121.0, 34.5, 65, 7.75, 88, 90, 84, 58, 84, 0, 88, 0, 82, 89],
  ['pollard', 'Kieron Pollard', 'West Indies', 'Golden Era', 'All-Rounder', 'Middle Order', 'Pace', 'RHB', 'Right-arm medium', 'Kieron_Pollard', '2013–20 Prime • Clutch Big-Hitter', 189, 3412, 158.4, 33.4, 69, 8.65, 89, 55, 92, 96, 74, 0, 95, 0, 86, 95],
  ['hardik', 'Hardik Pandya', 'India', 'Modern Star', 'All-Rounder', 'Middle Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Hardik_Pandya', '2019–22 Prime • Clutch Pace Finisher', 137, 2525, 155.0, 34.0, 64, 8.5, 88, 60, 91, 94, 85, 0, 92, 0, 87, 94],
  ['jadeja', 'Ravindra Jadeja', 'India', 'Modern Star', 'All-Rounder', 'Lower Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Ravindra_Jadeja', '2021–23 Prime • Gun Fielder & All-Round', 240, 2959, 141.0, 30.8, 160, 7.55, 83, 45, 82, 91, 0, 89, 99, 0, 75, 93],
  ['sky', 'Suryakumar Yadav', 'India', 'Modern Star', 'Batsman', 'Middle Order', 'None', 'RHB', 'Right-arm medium', 'Suryakumar_Yadav', '2022–24 Prime • 360 T20 Phenom', 150, 3594, 166.5, 39.0, 0, 0.0, 96, 86, 98, 82, 0, 0, 91, 0, 82, 96],
  ['buttler', 'Jos Buttler', 'England', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'Jos_Buttler', '2022 Prime • 863 Runs, 4 Centuries', 107, 3582, 154.0, 42.8, 0, 0.0, 96, 98, 86, 68, 0, 0, 88, 91, 88, 96],

  ['sehwag', 'Virender Sehwag', 'India', 'Legend', 'Batsman', 'Top Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Virender_Sehwag', '2011–14 Prime • Fearless Powerplay Blitz', 104, 2728, 159.4, 31.2, 6, 8.2, 92, 96, 70, 48, 0, 28, 83, 0, 80, 94],
  ['gilchrist', 'Adam Gilchrist', 'Australia', 'Legend', 'Wicketkeeper', 'Top Order', 'None', 'LHB', 'Right-arm offbreak', 'Adam_Gilchrist', '2009 Prime • MVP Captain & Keeper', 80, 2069, 144.8, 30.2, 0, 0.0, 90, 93, 72, 50, 0, 0, 86, 96, 94, 92],
  ['gambhir', 'Gautam Gambhir', 'India', 'Legend', 'Batsman', 'Top Order', 'None', 'LHB', 'Legbreak', 'Gautam_Gambhir', '2012–14 Prime • 2x Title Captain', 154, 4217, 130.5, 34.2, 0, 0.0, 89, 92, 76, 48, 0, 0, 86, 0, 96, 89],
  ['yuvraj', 'Yuvraj Singh', 'India', 'Legend', 'All-Rounder', 'Middle Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Yuvraj_Singh', '2007–11 Prime • Six-Sixes Superstar', 132, 2750, 138.0, 29.0, 36, 7.45, 88, 68, 92, 82, 0, 74, 92, 0, 78, 93],
  ['steyn', 'Dale Steyn', 'South Africa', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Dale_Steyn', '2012–13 Prime • Steyn Gun Swing & Pace', 95, 167, 102.0, 12.0, 97, 6.72, 28, 12, 20, 35, 97, 0, 85, 0, 72, 94],
  ['murali', 'Muttiah Muralitharan', 'Sri Lanka', 'Legend', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Muttiah_Muralitharan', '2008–10 Prime • Spin Wizard', 66, 20, 68.0, 5.0, 63, 6.67, 15, 8, 12, 18, 0, 96, 78, 0, 70, 92],
  ['warne', 'Shane Warne', 'Australia', 'Legend', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak googly', 'Shane_Warne', '2008 Prime • Inaugural Master Captain', 55, 198, 95.0, 12.0, 57, 7.27, 36, 15, 25, 44, 0, 95, 80, 0, 98, 94],
  ['kumble', 'Anil Kumble', 'India', 'Legend', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak googly', 'Anil_Kumble', '2009 Prime • 5/5 & 6.57 Career Econ', 42, 35, 76.0, 8.5, 45, 6.57, 22, 10, 15, 26, 0, 94, 79, 0, 90, 91],
  ['chahal', 'Yuzvendra Chahal', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak googly', 'Yuzvendra_Chahal', '2020–22 Prime • Purple Cap Leg-Spinner', 160, 37, 45.0, 5.0, 205, 7.45, 12, 5, 10, 15, 0, 95, 76, 0, 65, 92],
  ['ashwin', 'Ravichandran Ashwin', 'India', 'Golden Era', 'All-Rounder', 'Lower Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Ravichandran_Ashwin', '2011–18 Prime • Powerplay Carrom Ball', 212, 800, 122.0, 16.0, 180, 6.95, 58, 30, 52, 68, 0, 93, 82, 0, 88, 90],
  ['bhuvi', 'Bhuvneshwar Kumar', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Bhuvneshwar_Kumar', '2016–17 Prime • Back-to-Back Purple Caps', 176, 306, 102.0, 10.5, 181, 7.22, 34, 15, 25, 42, 94, 0, 83, 0, 80, 92],
  ['zaheer', 'Zaheer Khan', 'India', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Left-arm fast-medium', 'Zaheer_Khan', '2010–12 Prime • Left-Arm Swing Maestro', 100, 117, 94.0, 10.0, 102, 7.45, 26, 10, 18, 32, 92, 0, 78, 0, 86, 90],
  ['starc', 'Mitchell Starc', 'Australia', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Left-arm fast', 'Mitchell_Starc', '2015/2024 Prime • 145kph Playoff Wrecker', 41, 105, 105.0, 13.0, 51, 7.35, 35, 12, 22, 44, 96, 0, 84, 0, 72, 94],
  ['boult', 'Trent Boult', 'New Zealand', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Left-arm fast-medium', 'Trent_Boult', '2020 Prime • First-Over Wicket Specialist', 104, 85, 98.0, 10.0, 121, 7.75, 22, 10, 15, 28, 94, 0, 87, 0, 70, 92],
  ['rabada', 'Kagiso Rabada', 'South Africa', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Right-arm fast', 'Kagiso_Rabada', '2020 Prime • Purple Cap Express Pace', 80, 206, 110.0, 13.0, 117, 7.85, 34, 12, 22, 42, 95, 0, 84, 0, 74, 93],
  ['cummins', 'Pat Cummins', 'Australia', 'Modern Star', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Pat_Cummins', '2024 Prime • Fearless Captain & Hit', 58, 515, 152.0, 21.0, 63, 8.3, 66, 25, 58, 82, 91, 0, 87, 0, 95, 92],
  ['dhawan', 'Shikhar Dhawan', 'India', 'Golden Era', 'Batsman', 'Top Order', 'None', 'LHB', 'Right-arm offbreak', 'Shikhar_Dhawan', '2019–21 Prime • Back-to-Back 600+ Seasons', 222, 6769, 136.0, 38.0, 4, 8.2, 92, 94, 72, 48, 0, 12, 88, 0, 80, 89],
  ['klrahul', 'KL Rahul', 'India', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'KL_Rahul', '2018–21 Prime • 600+ Runs Every Year', 132, 4683, 142.5, 48.0, 0, 0.0, 93, 95, 84, 58, 0, 0, 88, 88, 84, 91],
  ['pant', 'Rishabh Pant', 'India', 'Modern Star', 'Wicketkeeper', 'Middle Order', 'None', 'LHB', 'None', 'Rishabh_Pant', '2018–19 Prime • 684 Runs @ 173 SR', 111, 3284, 156.5, 38.0, 0, 0.0, 92, 75, 95, 86, 0, 0, 84, 92, 85, 94],
  ['gill', 'Shubman Gill', 'India', 'Modern Star', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm offbreak', 'Shubman_Gill', '2023 Prime • 890 Runs Orange Cap', 103, 3216, 148.0, 44.5, 0, 0.0, 93, 95, 80, 52, 0, 0, 90, 0, 83, 92],
  ['jaiswal', 'Yashasvi Jaiswal', 'India', 'Modern Star', 'Batsman', 'Top Order', 'Spin', 'LHB', 'Legbreak', 'Yashasvi_Jaiswal', '2023 Prime • 13-Ball Fifty Firepower', 53, 1607, 160.0, 36.5, 0, 0.0, 91, 94, 72, 50, 0, 18, 89, 0, 72, 92],
  ['samson', 'Sanju Samson', 'India', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'Sanju_Samson', '2021–24 Prime • Captain & Six Hitter', 168, 4419, 145.5, 34.0, 0, 0.0, 90, 90, 88, 65, 0, 0, 86, 90, 87, 90],
  ['faf', 'Faf du Plessis', 'South Africa', 'Golden Era', 'Batsman', 'Top Order', 'None', 'RHB', 'Legbreak', 'Faf_du_Plessis', '2021–23 Prime • 730 Runs & Electric Field', 145, 4571, 144.0, 39.0, 0, 0.0, 91, 93, 80, 52, 0, 0, 96, 0, 90, 90],
  ['maxwell', 'Glenn Maxwell', 'Australia', 'Golden Era', 'All-Rounder', 'Middle Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Glenn_Maxwell', '2014/2021 Prime • Big Show Demolition', 134, 2771, 164.0, 31.0, 37, 8.1, 89, 65, 93, 86, 0, 76, 95, 0, 78, 94],
  ['mccullum', 'Brendon McCullum', 'New Zealand', 'Legend', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'Right-arm medium', 'Brendon_McCullum', '2008/2015 Prime • 158* Launchpad', 109, 2880, 142.0, 30.0, 0, 0.0, 88, 92, 74, 54, 0, 0, 94, 86, 93, 91],

  ['hayden', 'Matthew Hayden', 'Australia', 'Legend', 'Batsman', 'Top Order', 'None', 'LHB', 'Right-arm medium', 'Matthew_Hayden', '2009 Prime • Mongoose Bat Orange Cap', 32, 1107, 144.0, 41.0, 0, 0.0, 89, 93, 68, 45, 0, 0, 84, 0, 78, 89],
  ['hussey', 'Michael Hussey', 'Australia', 'Legend', 'Batsman', 'Top Order', 'None', 'LHB', 'Right-arm medium', 'Michael_Hussey', '2013 Prime • Mr. Cricket 733 Runs', 59, 1977, 129.0, 42.5, 0, 0.0, 89, 91, 86, 55, 0, 0, 89, 0, 82, 87],
  ['bravo', 'Dwayne Bravo', 'West Indies', 'Golden Era', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Dwayne_Bravo', '2013–15 Prime • 2x Purple Cap Champion', 161, 1560, 134.0, 24.5, 183, 8.15, 74, 42, 72, 86, 92, 0, 94, 0, 84, 93],
  ['harbhajan', 'Harbhajan Singh', 'India', 'Legend', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Harbhajan_Singh', '2011–15 Prime • Economical Off-Spin', 163, 833, 138.0, 16.0, 150, 7.07, 45, 18, 35, 58, 0, 91, 82, 0, 84, 88],
  ['shami', 'Mohammed Shami', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Mohammed_Shami', '2023 Prime • Purple Cap Seam & Wobble', 110, 74, 85.0, 8.0, 127, 7.85, 20, 8, 12, 26, 94, 0, 79, 0, 68, 90],
  ['kuldeep', 'Kuldeep Yadav', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'LHB', 'Left-arm wrist-spin', 'Kuldeep_Yadav', '2022–24 Prime • Wicket-Taking Chinaman', 84, 184, 94.0, 14.0, 87, 7.9, 28, 10, 18, 35, 0, 93, 84, 0, 68, 90],
  ['axar', 'Axar Patel', 'India', 'Modern Star', 'All-Rounder', 'Lower Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Axar_Patel', '2023–24 Prime • Dart Spin + Clutch Sixes', 150, 1653, 136.0, 24.0, 123, 7.25, 78, 45, 78, 88, 0, 90, 90, 0, 78, 89],
  ['iyer', 'Shreyas Iyer', 'India', 'Modern Star', 'Batsman', 'Middle Order', 'None', 'RHB', 'Legbreak', 'Shreyas_Iyer', '2020/2024 Prime • Trophy Winning Captain', 115, 3127, 135.0, 34.0, 0, 0.0, 88, 82, 90, 68, 0, 0, 89, 0, 93, 88],
  ['rahane', 'Ajinkya Rahane', 'India', 'Golden Era', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm medium', 'Ajinkya_Rahane', '2012/2023 Prime • Classy Timer & 2.0 Hit', 185, 4642, 132.0, 32.5, 1, 5.0, 86, 89, 80, 52, 0, 0, 91, 0, 85, 85],
  ['uthappa', 'Robin Uthappa', 'India', 'Golden Era', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'Right-arm medium', 'Robin_Uthappa', '2014 Prime • Orange Cap 660 Runs', 205, 4952, 135.0, 30.0, 0, 0.0, 87, 90, 78, 54, 0, 0, 82, 85, 74, 86],
  ['karthik', 'Dinesh Karthik', 'India', 'Golden Era', 'Wicketkeeper', 'Lower Order', 'None', 'RHB', 'None', 'Dinesh_Karthik', '2022–24 Prime • 183 SR Death Finisher', 257, 4842, 148.0, 29.0, 0, 0.0, 87, 62, 88, 95, 0, 0, 85, 89, 80, 90],
  ['rayudu', 'Ambati Rayudu', 'India', 'Golden Era', 'Batsman', 'Middle Order', 'None', 'RHB', 'Right-arm offbreak', 'Ambati_Rayudu', '2018 Prime • 602 Runs Clutch Batsman', 204, 4348, 134.0, 31.0, 0, 0.0, 86, 82, 89, 72, 0, 0, 84, 72, 70, 86],
  ['dk_p', 'Devdutt Padikkal', 'India', 'Modern Star', 'Batsman', 'Top Order', 'None', 'LHB', 'Right-arm offbreak', 'Devdutt_Padikkal', '2021 Prime • Maiden IPL Century', 64, 1559, 131.0, 29.0, 0, 0.0, 81, 84, 68, 44, 0, 0, 82, 0, 62, 79],
  ['gaikwad', 'Ruturaj Gaikwad', 'India', 'Modern Star', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm offbreak', 'Ruturaj_Gaikwad', '2021–24 Prime • Orange Cap & CSK Cap', 66, 2380, 141.0, 42.5, 0, 0.0, 90, 93, 76, 52, 0, 0, 87, 0, 85, 89],
  ['rinku', 'Rinku Singh', 'India', 'Modern Star', 'Batsman', 'Lower Order', 'None', 'LHB', 'Right-arm offbreak', 'Rinku_Singh', '2023–24 Prime • 5 Sixes Ice-Cold Finisher', 46, 893, 150.0, 42.0, 0, 0.0, 88, 52, 88, 97, 0, 0, 92, 0, 68, 93],
  ['tilak', 'Tilak Varma', 'India', 'Modern Star', 'Batsman', 'Middle Order', 'Spin', 'LHB', 'Right-arm offbreak', 'Tilak_Varma', '2023–24 Prime • Fearless Left-Hand Core', 38, 1156, 148.0, 41.0, 0, 8.0, 87, 78, 90, 74, 0, 28, 88, 0, 74, 88],
  ['abhishek', 'Abhishek Sharma', 'India', 'Modern Star', 'All-Rounder', 'Top Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Abhishek_Sharma_(cricketer,_born_2000)', '2024 Prime • 204 SR Powerplay Terror', 63, 1377, 165.0, 29.0, 11, 8.2, 88, 93, 72, 55, 0, 52, 85, 0, 68, 91],
  ['dube', 'Shivam Dube', 'India', 'Modern Star', 'All-Rounder', 'Middle Order', 'Pace', 'LHB', 'Right-arm medium', 'Shivam_Dube', '2023–24 Prime • Spin Destroyer Six-Hitter', 65, 1502, 152.0, 34.0, 5, 8.9, 86, 55, 90, 82, 42, 0, 76, 0, 62, 88],
  ['siraj', 'Mohammed Siraj', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Mohammed_Siraj', '2023 Prime • New Ball Powerplay Wickets', 93, 109, 90.0, 11.0, 93, 8.2, 20, 8, 12, 24, 89, 0, 82, 0, 65, 87],
  ['arshdeep', 'Arshdeep Singh', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Left-arm medium-fast', 'Arshdeep_Singh_(cricketer)', '2022–24 Prime • Left-Arm Death Swing', 65, 29, 70.0, 6.0, 76, 8.3, 18, 8, 10, 22, 90, 0, 80, 0, 66, 89],
  ['nehra', 'Ashish Nehra', 'India', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Left-arm medium-fast', 'Ashish_Nehra', '2015–16 Prime • Swing & Length Master', 88, 41, 72.0, 8.0, 106, 7.65, 16, 6, 10, 20, 89, 0, 74, 0, 75, 87],
  ['pathan_i', 'Irfan Pathan', 'India', 'Legend', 'All-Rounder', 'Lower Order', 'Pace', 'LHB', 'Left-arm fast-medium', 'Irfan_Pathan', '2008–12 Prime • Early Swing + Pinch Hit', 103, 1139, 125.0, 23.0, 80, 7.77, 72, 45, 70, 80, 84, 0, 82, 0, 74, 85],
  ['pathan_y', 'Yusuf Pathan', 'India', 'Legend', 'All-Rounder', 'Middle Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Yusuf_Pathan', '2008–14 Prime • 37-Ball Hundred Blitz', 174, 3204, 152.0, 31.0, 42, 7.4, 86, 52, 88, 92, 0, 64, 80, 0, 70, 91],
  ['mishra', 'Amit Mishra', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak', 'Amit_Mishra', '2011–16 Prime • 3x IPL Hat-Trick Legend', 162, 381, 92.0, 11.5, 174, 7.35, 28, 10, 20, 35, 0, 91, 74, 0, 74, 89],
  ['chawla', 'Piyush Chawla', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Spin', 'LHB', 'Legbreak', 'Piyush_Chawla', '2014/2023 Prime • 190+ Wickets Veteran', 192, 624, 112.0, 12.0, 192, 7.7, 36, 12, 26, 46, 0, 88, 76, 0, 70, 86],

  ['klass', 'Heinrich Klaasen', 'South Africa', 'Modern Star', 'Wicketkeeper', 'Middle Order', 'None', 'RHB', 'Right-arm offbreak', 'Heinrich_Klaasen', '2023–24 Prime • Spin-Crushing 175 SR', 35, 993, 174.0, 42.0, 0, 0.0, 94, 70, 96, 90, 0, 0, 85, 89, 78, 95],
  ['pooran', 'Nicholas Pooran', 'West Indies', 'Modern Star', 'Wicketkeeper', 'Middle Order', 'None', 'LHB', 'None', 'Nicholas_Pooran', '2023–24 Prime • 178 SR Power Leftie', 76, 1769, 168.0, 34.0, 0, 0.0, 91, 68, 93, 92, 0, 0, 88, 88, 82, 93],
  ['head', 'Travis Head', 'Australia', 'Modern Star', 'Batsman', 'Top Order', 'Spin', 'LHB', 'Right-arm offbreak', 'Travis_Head', '2024 Prime • 191 SR Powerplay Assault', 25, 772, 185.0, 40.0, 2, 8.8, 92, 96, 76, 54, 0, 32, 88, 0, 78, 94],
  ['dekock', 'Quinton de Kock', 'South Africa', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'LHB', 'None', 'Quinton_de_Kock', '2019–22 Prime • Explosive Opener & Keeper', 107, 3157, 139.0, 34.0, 0, 0.0, 89, 92, 72, 50, 0, 0, 86, 92, 82, 89],
  ['miller', 'David Miller', 'South Africa', 'Golden Era', 'Batsman', 'Middle Order', 'None', 'LHB', 'Right-arm offbreak', 'David_Miller_(South_African_cricketer)', '2013/2022 Prime • Killer Miller Finisher', 130, 2924, 146.0, 41.0, 0, 0.0, 90, 58, 92, 94, 0, 0, 93, 0, 82, 91],
  ['stokes', 'Ben Stokes', 'England', 'Modern Star', 'All-Rounder', 'Middle Order', 'Pace', 'LHB', 'Right-arm fast-medium', 'Ben_Stokes', '2017 Prime • IPL MVP All-Rounder', 45, 935, 138.0, 29.0, 28, 8.4, 86, 76, 89, 84, 82, 0, 93, 0, 91, 91],
  ['archer', 'Jofra Archer', 'England', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Jofra_Archer', '2020 Prime • IPL MVP 150kph Bouncers', 40, 199, 152.0, 15.0, 48, 7.1, 46, 15, 30, 62, 95, 0, 86, 0, 68, 93],
  ['williamson', 'Kane Williamson', 'New Zealand', 'Golden Era', 'Batsman', 'Top Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Kane_Williamson', '2018 Prime • 735 Runs Orange Cap Captain', 79, 2128, 136.0, 42.0, 0, 8.5, 89, 91, 88, 52, 0, 24, 90, 0, 96, 88],
  ['smith', 'Steve Smith', 'Australia', 'Golden Era', 'Batsman', 'Top Order', 'Spin', 'RHB', 'Legbreak', 'Steve_Smith', '2016–17 Prime • Finalist Captain & Anchor', 103, 2485, 132.0, 37.5, 0, 8.0, 87, 89, 86, 54, 0, 20, 92, 0, 91, 86],
  ['sangakkara', 'Kumar Sangakkara', 'Sri Lanka', 'Legend', 'Wicketkeeper', 'Top Order', 'None', 'LHB', 'None', 'Kumar_Sangakkara', '2008–11 Prime • Elegant Keeper-Captain', 71, 1687, 127.0, 29.0, 0, 0.0, 85, 88, 80, 48, 0, 0, 86, 94, 90, 85],
  ['jayawardene', 'Mahela Jayawardene', 'Sri Lanka', 'Legend', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm medium', 'Mahela_Jayawardene', '2010–12 Prime • Tactician & 110* Century', 80, 1802, 128.0, 30.0, 0, 0.0, 85, 87, 82, 50, 0, 0, 90, 0, 92, 85],
  ['pietersen', 'Kevin Pietersen', 'England', 'Legend', 'Batsman', 'Middle Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Kevin_Pietersen', '2012 Prime • Switch-Hit Superstar', 36, 1001, 139.0, 38.0, 7, 7.4, 87, 84, 89, 68, 0, 35, 87, 0, 82, 88],
  ['morkel_m', 'Morne Morkel', 'South Africa', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Right-arm fast', 'Morne_Morkel', '2012 Prime • Purple Cap Steep Bounce', 70, 126, 115.0, 12.0, 77, 7.69, 26, 10, 15, 34, 91, 0, 76, 0, 68, 88],
  ['morkel_a', 'Albie Morkel', 'South Africa', 'Legend', 'All-Rounder', 'Lower Order', 'Pace', 'LHB', 'Right-arm medium-fast', 'Albie_Morkel', '2008–12 Prime • 100m Sixes & Powerplay', 91, 974, 145.0, 24.5, 85, 8.15, 78, 45, 76, 90, 84, 0, 82, 0, 74, 88],
  ['tahir', 'Imran Tahir', 'South Africa', 'Golden Era', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak googly', 'Imran_Tahir', '2019 Prime • Purple Cap & Marathon Sprint', 59, 33, 88.0, 8.0, 82, 7.5, 15, 5, 10, 18, 0, 92, 74, 0, 65, 90],
  ['johnson', 'Mitchell Johnson', 'Australia', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Left-arm fast', 'Mitchell_Johnson', '2013/2017 Prime • 24 Wkts Title Hero', 54, 162, 114.0, 12.0, 61, 7.8, 32, 12, 22, 42, 92, 0, 84, 0, 70, 90],
  ['lee', 'Brett Lee', 'Australia', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Brett_Lee', '2008–12 Prime • 150kph Thunderbolt', 38, 124, 112.0, 12.0, 25, 7.45, 34, 12, 22, 42, 90, 0, 85, 0, 72, 87],
  ['mcgrath', 'Glenn McGrath', 'Australia', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Glenn_McGrath', '2008 Prime • 6.61 Econ Pinpoint Line', 14, 4, 80.0, 4.0, 12, 6.61, 10, 5, 8, 12, 90, 0, 76, 0, 76, 86],
  ['symonds', 'Andrew Symonds', 'Australia', 'Legend', 'All-Rounder', 'Middle Order', 'Pace', 'RHB', 'Right-arm medium / offbreak', 'Andrew_Symonds', '2008–10 Prime • 117* & Rocket Arm', 39, 974, 134.0, 36.0, 20, 7.6, 85, 70, 88, 78, 70, 45, 96, 0, 76, 89],
  ['flintoff', 'Andrew Flintoff', 'England', 'Legend', 'All-Rounder', 'Middle Order', 'Pace', 'RHB', 'Right-arm fast', 'Andrew_Flintoff', '2009 Prime • World-Class Seam & Muscle', 18, 180, 132.0, 25.0, 15, 7.9, 75, 50, 78, 82, 86, 0, 84, 0, 78, 84],
  ['hazlewood', 'Josh Hazlewood', 'Australia', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Right-arm fast-medium', 'Josh_Hazlewood', '2021–22 Prime • McGrath-Like Test Line', 27, 19, 80.0, 9.0, 35, 7.7, 14, 5, 8, 18, 92, 0, 80, 0, 72, 89],
  ['nortje', 'Anrich Nortje', 'South Africa', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Anrich_Nortje', '2020 Prime • 156kph Playoff Fire', 46, 49, 95.0, 8.0, 60, 8.2, 16, 6, 10, 22, 91, 0, 81, 0, 64, 88],
  ['hasaranga', 'Wanindu Hasaranga', 'Sri Lanka', 'Modern Star', 'All-Rounder', 'Lower Order', 'Spin', 'RHB', 'Legbreak', 'Wanindu_Hasaranga', '2022 Prime • 26 Wickets Googly Artist', 26, 72, 128.0, 14.0, 35, 7.6, 56, 22, 50, 68, 0, 91, 88, 0, 76, 89],
  ['salt', 'Phil Salt', 'England', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'Phil_Salt', '2024 Prime • 182 SR KKR Title Opener', 21, 653, 178.0, 36.0, 0, 0.0, 89, 93, 70, 50, 0, 0, 86, 86, 74, 90],
  ['curran', 'Sam Curran', 'England', 'Modern Star', 'All-Rounder', 'Lower Order', 'Pace', 'LHB', 'Left-arm medium-fast', 'Sam_Curran', '2020–24 Prime • Left-Arm Swing & Middle Hit', 59, 883, 138.0, 26.0, 58, 8.8, 78, 55, 80, 84, 84, 0, 87, 0, 82, 87],
  ['green', 'Cameron Green', 'Australia', 'Modern Star', 'All-Rounder', 'Top Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Cameron_Green_(cricketer)', '2023 Prime • 452 Runs @ 160 SR + Bounce', 29, 707, 153.0, 41.0, 16, 8.8, 84, 84, 85, 72, 82, 0, 91, 0, 68, 87],
  ['marsh_m', 'Mitchell Marsh', 'Australia', 'Modern Star', 'All-Rounder', 'Top Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Mitchell_Marsh', '2022–24 Prime • 150 SR Brutal Top Order', 42, 665, 144.0, 25.0, 37, 8.4, 82, 84, 80, 65, 81, 0, 86, 0, 82, 85],
  ['marsh_s', 'Shaun Marsh', 'Australia', 'Legend', 'Batsman', 'Top Order', 'None', 'LHB', 'Slow left-arm orthodox', 'Shaun_Marsh', '2008 Prime • First-Ever Orange Cap 616 Runs', 71, 2477, 133.0, 39.9, 0, 0.0, 88, 91, 76, 48, 0, 0, 84, 0, 72, 87],
  ['stoinis', 'Marcus Stoinis', 'Australia', 'Modern Star', 'All-Rounder', 'Middle Order', 'Pace', 'RHB', 'Right-arm medium', 'Marcus_Stoinis', '2020/2024 Prime • Match-Winning 124*', 96, 1866, 146.0, 31.0, 43, 8.9, 84, 72, 86, 84, 78, 0, 86, 0, 74, 87],
  ['livingstone', 'Liam Livingstone', 'England', 'Modern Star', 'All-Rounder', 'Middle Order', 'Spin', 'RHB', 'Legbreak / Offbreak', 'Liam_Livingstone', '2022 Prime • 182 SR 117m Sixes', 39, 939, 162.0, 30.0, 11, 8.6, 84, 62, 86, 88, 0, 68, 90, 0, 74, 88],
  ['bairstow', 'Jonny Bairstow', 'England', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'Jonny_Bairstow', '2019/2024 Prime • 108* Chase & 144 SR', 50, 1589, 147.0, 35.0, 0, 0.0, 87, 90, 74, 52, 0, 0, 84, 87, 72, 87],
  ['morgan', 'Eoin Morgan', 'England', 'Golden Era', 'Batsman', 'Middle Order', 'None', 'LHB', 'Right-arm medium', 'Eoin_Morgan', '2020–21 Prime • Ice-Cool White-Ball Cap', 83, 1405, 132.0, 26.0, 0, 0.0, 80, 62, 84, 78, 0, 0, 86, 0, 95, 83],
  ['finch', 'Aaron Finch', 'Australia', 'Golden Era', 'Batsman', 'Top Order', 'Spin', 'RHB', 'Slow left-arm orthodox', 'Aaron_Finch', '2016 Prime • 5 Consecutive 50s', 92, 2091, 132.0, 27.0, 1, 8.5, 82, 85, 68, 45, 0, 15, 84, 0, 86, 81],
  ['conway', 'Devon Conway', 'New Zealand', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'LHB', 'None', 'Devon_Conway', '2023 Prime • 672 Runs Final POTM', 23, 924, 142.0, 48.6, 0, 0.0, 89, 92, 74, 48, 0, 0, 86, 84, 72, 88],
  ['rachin', 'Rachin Ravindra', 'New Zealand', 'Modern Star', 'All-Rounder', 'Top Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Rachin_Ravindra', '2024 Prime • Fearless Strokeplay & Spin', 14, 290, 158.0, 26.0, 4, 8.2, 81, 84, 72, 50, 0, 62, 88, 0, 70, 83],
  ['mitchell', 'Daryl Mitchell', 'New Zealand', 'Modern Star', 'All-Rounder', 'Middle Order', 'Pace', 'RHB', 'Right-arm medium', 'Daryl_Mitchell_(cricketer)', '2024 Prime • Busy Middle-Order Glue', 15, 351, 142.0, 31.0, 1, 8.8, 82, 70, 85, 74, 58, 0, 88, 0, 74, 82],
  ['boult_ferg', 'Lockie Ferguson', 'New Zealand', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Lockie_Ferguson', '2020–22 Prime • 157kph Lockie Express', 45, 67, 118.0, 11.0, 46, 8.4, 18, 6, 12, 24, 89, 0, 82, 0, 64, 86],
  ['southee', 'Tim Southee', 'New Zealand', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Tim_Southee', '2015–18 Prime • Outswing & Slower Balls', 54, 120, 116.0, 11.0, 47, 8.5, 28, 10, 18, 38, 85, 0, 84, 0, 82, 83],
  ['henry', 'Matt Henry', 'New Zealand', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Matt_Henry_(cricketer)', '2023–24 Prime • New Ball Seam Movement', 12, 24, 92.0, 8.0, 16, 8.2, 20, 8, 12, 25, 86, 0, 82, 0, 66, 82],
  ['santner', 'Mitchell Santner', 'New Zealand', 'Modern Star', 'All-Rounder', 'Lower Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Mitchell_Santner', '2022–24 Prime • Economical Left-Arm Control', 18, 88, 115.0, 15.0, 15, 6.9, 55, 25, 50, 66, 0, 87, 91, 0, 84, 84],
  ['theekshana', 'Maheesh Theekshana', 'Sri Lanka', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Maheesh_Theekshana', '2022–23 Prime • Powerplay Mystery Carrom', 27, 15, 72.0, 6.0, 25, 7.6, 14, 5, 10, 16, 0, 87, 78, 0, 64, 84],
  ['pathirana', 'Matheesha Pathirana', 'Sri Lanka', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Matheesha_Pathirana', '2023–24 Prime • Baby Malinga Death Yorkers', 20, 12, 60.0, 4.0, 34, 7.6, 10, 4, 6, 12, 92, 0, 78, 0, 60, 91],
  ['noor', 'Noor Ahmad', 'Afghanistan', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Left-arm wrist-spin', 'Noor_Ahmad', '2023–24 Prime • Sharp Left-Arm Googly', 23, 22, 85.0, 7.0, 24, 7.9, 15, 5, 10, 18, 0, 88, 82, 0, 60, 86],
  ['gurbaz', 'Rahmanullah Gurbaz', 'Afghanistan', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'Rahmanullah_Gurbaz', '2023–24 Prime • Aggressive Afghan Keeper', 14, 289, 145.0, 24.0, 0, 0.0, 82, 85, 68, 48, 0, 0, 84, 85, 70, 83],
  ['naveen', 'Naveen-ul-Haq', 'Afghanistan', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Naveen-ul-Haq', '2023–24 Prime • Clever Change-Up Death Bowler', 18, 25, 80.0, 6.0, 25, 8.6, 14, 5, 8, 16, 85, 0, 80, 0, 64, 84],
  ['holder', 'Jason Holder', 'West Indies', 'Golden Era', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Jason_Holder', '2020–21 Prime • Bounce & Lower-Order Hits', 46, 259, 125.0, 14.0, 53, 8.5, 60, 28, 56, 74, 85, 0, 84, 0, 86, 84],
  ['hetmyer', 'Shimron Hetmyer', 'West Indies', 'Modern Star', 'Batsman', 'Middle Order', 'None', 'LHB', 'None', 'Shimron_Hetmyer', '2022–24 Prime • Fearless Death Finisher', 72, 1243, 158.0, 34.0, 0, 0.0, 86, 54, 88, 92, 0, 0, 88, 0, 68, 89],
  ['powell', 'Rovman Powell', 'West Indies', 'Modern Star', 'Batsman', 'Middle Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Rovman_Powell', '2022–24 Prime • Towering Six-Hitter', 27, 360, 152.0, 24.0, 1, 9.0, 82, 48, 84, 88, 48, 0, 86, 0, 80, 85],
  ['zampa', 'Adam Zampa', 'Australia', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak googly', 'Adam_Zampa', '2020–23 Prime • White-Ball Leg-Spin Ace', 20, 25, 80.0, 6.0, 29, 7.9, 14, 5, 8, 16, 0, 89, 80, 0, 68, 86],
  ['ellis', 'Nathan Ellis', 'Australia', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Nathan_Ellis', '2023 Prime • Back-of-Hand Slower Specialist', 16, 18, 95.0, 9.0, 18, 8.4, 18, 6, 10, 22, 85, 0, 82, 0, 74, 84],
  ['jansen', 'Marco Jansen', 'South Africa', 'Modern Star', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Left-arm fast', 'Marco_Jansen', '2022–24 Prime • 6ft 8in Left-Arm Swing', 21, 66, 120.0, 11.0, 20, 8.8, 54, 22, 48, 68, 86, 0, 84, 0, 64, 84],
  ['stubbs', 'Tristan Stubbs', 'South Africa', 'Modern Star', 'Wicketkeeper', 'Middle Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Tristan_Stubbs', '2024 Prime • 190 SR 360 Finisher', 18, 405, 180.0, 40.0, 3, 7.5, 88, 65, 91, 90, 0, 42, 91, 80, 70, 90],
  ['coetzee', 'Gerald Coetzee', 'South Africa', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Gerald_Coetzee', '2024 Prime • 150kph Strike Bowler', 12, 22, 110.0, 11.0, 15, 9.2, 26, 8, 16, 36, 86, 0, 82, 0, 62, 84],
  ['ngidi', 'Lungi Ngidi', 'South Africa', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Lungi_Ngidi', '2018 Prime • 6.00 Econ CSK Champion', 14, 12, 75.0, 6.0, 25, 7.9, 14, 5, 8, 16, 86, 0, 78, 0, 64, 84],
  ['mustafizur', 'Mustafizur Rahman', 'Bangladesh', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Left-arm fast-medium', 'Mustafizur_Rahman', '2016 Prime • Fizz Cutters Title Run', 57, 14, 65.0, 5.0, 61, 8.1, 12, 4, 8, 14, 88, 0, 76, 0, 64, 87],
  ['shakib', 'Shakib Al Hasan', 'Bangladesh', 'Golden Era', 'All-Rounder', 'Middle Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Shakib_Al_Hasan', '2012–18 Prime • Tactician Spin All-Rounder', 71, 793, 127.0, 22.0, 63, 7.45, 78, 64, 80, 72, 0, 86, 84, 0, 86, 85],
  ['rossouw', 'Rilee Rossouw', 'South Africa', 'Modern Star', 'Batsman', 'Top Order', 'None', 'LHB', 'Right-arm offbreak', 'Rilee_Rossouw', '2023–24 Prime • Brutal Top-Order Leftie', 22, 470, 154.0, 28.0, 0, 0.0, 82, 85, 76, 52, 0, 0, 85, 0, 66, 83],
  ['moeen', 'Moeen Ali', 'England', 'Modern Star', 'All-Rounder', 'Top Order', 'Spin', 'LHB', 'Right-arm offbreak', 'Moeen_Ali', '2021 Prime • Sixes vs Spin + Offbreaks', 67, 1162, 144.0, 24.0, 35, 7.1, 82, 84, 82, 66, 0, 82, 84, 0, 76, 86],
  ['woakes', 'Chris Woakes', 'England', 'Golden Era', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Chris_Woakes', '2017–21 Prime • Swing & Handy Lower Bat', 21, 78, 115.0, 13.0, 30, 8.7, 50, 20, 44, 66, 84, 0, 82, 0, 74, 81],
  ['wood', 'Mark Wood', 'England', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Mark_Wood_(cricketer)', '2023 Prime • 5/14 Pure 154kph Express', 10, 15, 110.0, 7.5, 11, 8.1, 20, 6, 12, 26, 90, 0, 82, 0, 65, 88],
  ['topley', 'Reece Topley', 'England', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Left-arm fast-medium', 'Reece_Topley', '2023–24 Prime • Tall Left-Arm Angle', 10, 10, 80.0, 5.0, 10, 8.9, 12, 4, 8, 15, 82, 0, 78, 0, 64, 79],
  ['brooks', 'Harry Brook', 'England', 'Modern Star', 'Batsman', 'Middle Order', 'None', 'RHB', 'Right-arm medium', 'Harry_Brook', '2023 Prime • 100* vs KKR Strokes', 11, 190, 132.0, 22.0, 0, 0.0, 82, 76, 84, 64, 0, 0, 88, 0, 74, 82],
  ['afridi', 'Shahid Afridi', 'Pakistan', 'Legend', 'All-Rounder', 'Middle Order', 'Spin', 'RHB', 'Legbreak googly', 'Shahid_Afridi', '2008 Prime • Boom Boom Leg-Spin & Sixes', 10, 81, 176.0, 14.0, 9, 7.5, 76, 55, 78, 84, 0, 84, 84, 0, 82, 87],
  ['akhtar', 'Shoaib Akhtar', 'Pakistan', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Shoaib_Akhtar', '2008 Prime • 4/11 RawalPindi Express', 3, 2, 50.0, 2.0, 5, 7.7, 15, 5, 10, 18, 92, 0, 72, 0, 68, 88],
  ['gul', 'Umar Gul', 'Pakistan', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Umar_Gul', '2008 Prime • Reverse Swing Yorker Specialist', 6, 39, 135.0, 13.0, 12, 8.2, 22, 8, 14, 28, 87, 0, 75, 0, 66, 84],
  ['sohail', 'Sohail Tanvir', 'Pakistan', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Left-arm medium-fast', 'Sohail_Tanvir', '2008 Prime • Inaugural Purple Cap 6/14', 11, 36, 120.0, 12.0, 22, 6.46, 28, 10, 18, 36, 89, 0, 76, 0, 65, 88],
  ['afridi_shaheen', 'Shaheen Afridi', 'Pakistan', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Left-arm fast', 'Shaheen_Afridi', '2021–23 Prime • Unplayable First-Over Swing', 0, 0, 0.0, 0.0, 0, 0.0, 26, 8, 16, 36, 92, 0, 82, 0, 76, 90],
  ['babar', 'Babar Azam', 'Pakistan', 'Modern Star', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm offbreak', 'Babar_Azam', '2021–24 Prime • T20 Consistency Maestro', 0, 0, 0.0, 0.0, 0, 0.0, 89, 92, 78, 48, 0, 0, 86, 0, 82, 86],

  ['ganguly', 'Sourav Ganguly', 'India', 'Legend', 'Batsman', 'Top Order', 'Pace', 'LHB', 'Right-arm medium', 'Sourav_Ganguly', '2008–10 Prime • Dada Captain & Off-Side Elegance', 59, 1349, 112.0, 26.0, 10, 7.8, 79, 82, 72, 48, 46, 0, 78, 0, 95, 82],
  ['dravid', 'Rahul Dravid', 'India', 'Legend', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm offbreak', 'Rahul_Dravid', '2011–13 Prime • The Wall Anchor & Mentor', 89, 2174, 118.0, 29.0, 0, 0.0, 82, 85, 76, 44, 0, 0, 86, 60, 93, 82],
  ['laxman', 'VVS Laxman', 'India', 'Legend', 'Batsman', 'Middle Order', 'None', 'RHB', 'Right-arm offbreak', 'VVS_Laxman', '2008–10 Prime • Wristy Strokeplay', 20, 282, 108.0, 18.0, 0, 0.0, 72, 72, 75, 45, 0, 0, 78, 0, 76, 72],
  ['vijay', 'Murali Vijay', 'India', 'Golden Era', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm offbreak', 'Murali_Vijay', '2010–11 Prime • Playoff Centurion', 106, 2619, 128.0, 28.0, 0, 0.0, 83, 86, 68, 42, 0, 0, 84, 0, 70, 82],
  ['badrinath', 'Subramaniam Badrinath', 'India', 'Golden Era', 'Batsman', 'Middle Order', 'None', 'RHB', 'Right-arm offbreak', 'Subramaniam_Badrinath', '2010–12 Prime • CSK Crisis Anchor', 95, 1441, 122.0, 32.0, 0, 0.0, 79, 72, 83, 60, 0, 0, 84, 0, 70, 77],
  ['tiwary_m', 'Manoj Tiwary', 'India', 'Golden Era', 'Batsman', 'Middle Order', 'Spin', 'RHB', 'Legbreak', 'Manoj_Tiwary', '2012 Prime • Championship Winning Runs', 98, 1695, 120.0, 29.0, 1, 8.2, 77, 70, 80, 62, 0, 22, 85, 0, 74, 76],
  ['ojha_p', 'Pragyan Ojha', 'India', 'Legend', 'Bowler', 'Lower Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Pragyan_Ojha', '2010 Prime • Purple Cap Left-Arm Spin', 92, 16, 55.0, 4.0, 89, 7.36, 10, 4, 6, 12, 0, 89, 74, 0, 62, 85],
  ['rp_singh', 'RP Singh', 'India', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Left-arm fast-medium', 'R._P._Singh', '2009 Prime • Purple Cap 23 Wickets', 82, 52, 75.0, 7.0, 90, 7.89, 15, 5, 8, 18, 88, 0, 74, 0, 64, 86],
  ['munaf', 'Munaf Patel', 'India', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Munaf_Patel', '2011 Prime • 22 Wickets Seam Precision', 63, 39, 82.0, 8.0, 74, 7.51, 14, 5, 8, 16, 85, 0, 70, 0, 62, 82],
  ['sreesanth', 'S. Sreesanth', 'India', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'S._Sreesanth', '2008 Prime • Outswing & Fire', 44, 34, 78.0, 8.0, 40, 8.14, 16, 5, 10, 18, 84, 0, 74, 0, 60, 81],
  ['praveen', 'Praveen Kumar', 'India', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium', 'Praveen_Kumar', '2008–11 Prime • Banana Swing Both Ways', 119, 340, 112.0, 12.0, 90, 7.72, 34, 12, 24, 42, 87, 0, 78, 0, 66, 84],
  ['dinda', 'Ashok Dinda', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Ashok_Dinda', '2012–16 Prime • High-Effort Seam', 78, 26, 68.0, 5.0, 69, 8.2, 12, 4, 8, 14, 79, 0, 74, 0, 60, 76],
  ['vinay', 'Vinay Kumar', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Vinay_Kumar', '2012–15 Prime • 105 IPL Wickets Cutter Ace', 105, 304, 112.0, 12.0, 105, 8.35, 32, 10, 20, 40, 84, 0, 78, 0, 76, 82],
  ['balaji', 'Lakshmipathy Balaji', 'India', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Lakshmipathy_Balaji', '2008/2012 Prime • First IPL Hat-Trick', 73, 36, 74.0, 6.0, 76, 8.0, 14, 5, 8, 16, 84, 0, 74, 0, 64, 82],
  ['sharma_i', 'Ishant Sharma', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Ishant_Sharma', '2011/2019 Prime • 5/12 & Bounce', 110, 57, 78.0, 9.0, 92, 8.15, 16, 6, 10, 20, 84, 0, 76, 0, 68, 82],
  ['sharma_m', 'Mohit Sharma', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium', 'Mohit_Sharma', '2014/2023 Prime • Purple Cap Back-of-Hand', 112, 125, 92.0, 10.0, 132, 8.45, 20, 6, 12, 24, 87, 0, 80, 0, 66, 86],
  ['umesh', 'Umesh Yadav', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Umesh_Yadav', '2018/2022 Prime • 145kph Powerplay Bursts', 148, 224, 118.0, 11.0, 144, 8.45, 32, 10, 20, 40, 87, 0, 78, 0, 64, 85],
  ['kaul', 'Siddarth Kaul', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Siddarth_Kaul', '2017–18 Prime • 21 Wickets SRH', 55, 22, 65.0, 6.0, 58, 8.6, 12, 4, 8, 14, 80, 0, 74, 0, 60, 78],
  ['sandeep', 'Sandeep Sharma', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium', 'Sandeep_Sharma', '2017/2024 Prime • New-Ball Swing & Yorkers', 126, 54, 72.0, 8.0, 137, 7.85, 14, 4, 8, 16, 88, 0, 78, 0, 64, 86],
  ['unadkat', 'Jaydev Unadkat', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Left-arm medium-fast', 'Jaydev_Unadkat', '2017 Prime • 24 Wickets Slower Cutters', 105, 198, 108.0, 12.0, 99, 8.8, 26, 8, 16, 34, 82, 0, 78, 0, 70, 81],
  ['natarajan', 'T. Natarajan', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Left-arm medium-fast', 'T._Natarajan', '2020/2024 Prime • Yorker King Left-Arm', 61, 3, 50.0, 3.0, 67, 8.75, 10, 4, 6, 12, 87, 0, 76, 0, 60, 86],
  ['deepak', 'Deepak Chahar', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium', 'Deepak_Chahar', '2019–21 Prime • Powerplay Swing Wizard', 81, 80, 125.0, 12.0, 77, 7.95, 34, 12, 22, 44, 87, 0, 80, 0, 66, 86],
  ['shardul', 'Shardul Thakur', 'India', 'Modern Star', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Shardul_Thakur', '2021/2023 Prime • Lord Partnership Breaker', 95, 307, 138.0, 14.0, 94, 9.2, 52, 20, 46, 68, 82, 0, 82, 0, 66, 84],
  ['harshal', 'Harshal Patel', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Harshal_Patel', '2021 Prime • Record 32 Wickets Purple Cap', 105, 250, 125.0, 13.0, 135, 8.7, 36, 12, 24, 46, 89, 0, 78, 0, 68, 89],
  ['avesh', 'Avesh Khan', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Avesh_Khan', '2021/2024 Prime • 24 Wickets & Hard Lengths', 63, 41, 108.0, 10.0, 74, 8.9, 16, 6, 10, 20, 85, 0, 78, 0, 62, 83],
  ['prasidh', 'Prasidh Krishna', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Prasidh_Krishna', '2022 Prime • Hit-the-Deck Bounce', 51, 9, 50.0, 3.0, 49, 8.9, 10, 4, 6, 12, 85, 0, 76, 0, 62, 82],
  ['khaleel', 'Khaleel Ahmed', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Left-arm fast-medium', 'Khaleel_Ahmed', '2022–24 Prime • Left-Arm New-Ball Seam', 57, 2, 40.0, 2.0, 74, 8.8, 10, 4, 6, 12, 85, 0, 76, 0, 60, 83],
  ['mukesh', 'Mukesh Kumar', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium', 'Mukesh_Kumar_(cricketer)', '2024 Prime • Death Yorkers & Seam', 20, 10, 80.0, 5.0, 24, 9.4, 12, 4, 8, 14, 81, 0, 76, 0, 60, 79],
  ['harshit', 'Harshit Rana', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Harshit_Rana', '2024 Prime • 19 Wickets Title-Winning Pace', 21, 12, 95.0, 6.0, 25, 8.9, 24, 8, 15, 30, 85, 0, 80, 0, 62, 84],
  ['mayank_y', 'Mayank Yadav', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Mayank_Yadav', '2024 Prime • 156.7 kph Thunderbolts', 4, 0, 0.0, 0.0, 7, 6.98, 10, 4, 6, 10, 88, 0, 78, 0, 58, 87],
  ['umran', 'Umran Malik', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Umran_Malik', '2022 Prime • 22 Wickets 157kph Speedster', 26, 23, 105.0, 8.0, 29, 9.3, 14, 5, 8, 16, 84, 0, 78, 0, 58, 82],
  ['varun', 'Varun Chakaravarthy', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak / Mystery', 'Varun_Chakaravarthy', '2021/2024 Prime • 21 Wickets Title Mystery', 71, 25, 70.0, 6.0, 83, 7.56, 12, 4, 8, 14, 0, 91, 76, 0, 64, 89],
  ['bishnoi', 'Ravi Bishnoi', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak googly', 'Ravi_Bishnoi', '2020–24 Prime • Quick Googly & Athletic Field', 66, 36, 85.0, 8.0, 63, 7.8, 14, 5, 8, 16, 0, 88, 90, 0, 64, 86],
  ['sundar', 'Washington Sundar', 'India', 'Modern Star', 'All-Rounder', 'Middle Order', 'Spin', 'LHB', 'Right-arm offbreak', 'Washington_Sundar', '2017/2020 Prime • Powerplay Squeeze', 60, 378, 120.0, 16.0, 37, 7.55, 66, 52, 68, 70, 0, 84, 82, 0, 68, 81],
  ['krunal', 'Krunal Pandya', 'India', 'Modern Star', 'All-Rounder', 'Middle Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Krunal_Pandya', '2017 Prime • Final MOTM & Economical Darts', 127, 1647, 134.0, 23.0, 76, 7.35, 74, 48, 76, 80, 0, 84, 85, 0, 76, 85],
  ['tewatia', 'Rahul Tewatia', 'India', 'Modern Star', 'All-Rounder', 'Lower Order', 'Spin', 'LHB', 'Legbreak', 'Rahul_Tewatia', '2020–23 Prime • 5 Sixes Clutch Iceman', 93, 1013, 142.0, 27.0, 32, 7.9, 80, 40, 78, 92, 0, 66, 84, 0, 66, 88],
  ['hooda', 'Deepak Hooda', 'India', 'Modern Star', 'All-Rounder', 'Middle Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Deepak_Hooda', '2022 Prime • 451 Runs Power Middle', 118, 1465, 130.0, 20.0, 10, 8.5, 76, 68, 79, 68, 0, 48, 85, 0, 68, 79],
  ['nitish_r', 'Nitish Rana', 'India', 'Modern Star', 'Batsman', 'Middle Order', 'Spin', 'LHB', 'Right-arm offbreak', 'Nitish_Rana', '2019–23 Prime • Aggressive Middle-Order Captain', 107, 2636, 136.0, 29.0, 10, 8.2, 83, 76, 85, 68, 0, 42, 82, 0, 80, 82],
  ['tripathi', 'Rahul Tripathi', 'India', 'Modern Star', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm medium', 'Rahul_Tripathi', '2022 Prime • 158 SR Intent Monster', 95, 2236, 142.0, 28.0, 0, 0.0, 84, 86, 82, 58, 0, 0, 90, 0, 66, 84],
  ['pandey', 'Manish Pandey', 'India', 'Golden Era', 'Batsman', 'Middle Order', 'None', 'RHB', 'Right-arm medium', 'Manish_Pandey', '2014 Prime • 94* in IPL Final', 171, 3850, 126.0, 30.0, 0, 0.0, 83, 80, 84, 62, 0, 0, 93, 0, 74, 82],
  ['jadhav', 'Kedar Jadhav', 'India', 'Golden Era', 'Batsman', 'Middle Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Kedar_Jadhav', '2017 Prime • Street-Smart Finisher', 95, 1208, 124.0, 23.0, 0, 8.2, 74, 52, 76, 74, 0, 38, 80, 60, 64, 75],
  ['agarwal', 'Mayank Agarwal', 'India', 'Modern Star', 'Batsman', 'Top Order', 'None', 'RHB', 'None', 'Mayank_Agarwal', '2020–21 Prime • 156 SR Destructive Opener', 127, 2661, 138.0, 26.0, 0, 0.0, 85, 88, 72, 48, 0, 0, 87, 0, 76, 83],
  ['shaw', 'Prithvi Shaw', 'India', 'Modern Star', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm offbreak', 'Prithvi_Shaw', '2021 Prime • 6 Fours in an Over Blitz', 79, 1892, 149.0, 26.0, 0, 0.0, 84, 88, 62, 40, 0, 0, 78, 0, 72, 84],
  ['kishan', 'Ishan Kishan', 'India', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'LHB', 'None', 'Ishan_Kishan', '2020 Prime • 516 Runs & 30 Sixes', 105, 2644, 141.0, 31.0, 0, 0.0, 87, 90, 76, 56, 0, 0, 84, 87, 72, 87],
  ['venkatesh', 'Venkatesh Iyer', 'India', 'Modern Star', 'All-Rounder', 'Top Order', 'Pace', 'LHB', 'Right-arm medium', 'Venkatesh_Iyer', '2021/2024 Prime • Playoff & Final Match-Winner', 51, 1326, 145.0, 34.0, 3, 8.8, 85, 85, 84, 66, 48, 0, 86, 0, 72, 87],
  ['parag', 'Riyan Parag', 'India', 'Modern Star', 'All-Rounder', 'Middle Order', 'Spin', 'RHB', 'Legbreak / Offbreak', 'Riyan_Parag', '2024 Prime • 573 Runs Breakout #4', 70, 1173, 149.0, 32.0, 4, 8.6, 85, 70, 88, 78, 0, 52, 91, 0, 72, 86],
  ['patidar', 'Rajat Patidar', 'India', 'Modern Star', 'Batsman', 'Middle Order', 'None', 'RHB', 'Right-arm offbreak', 'Rajat_Patidar', '2022/2024 Prime • 112* Eliminator & Spin Killer', 27, 799, 165.0, 36.0, 0, 0.0, 87, 78, 90, 70, 0, 0, 86, 0, 74, 88],
  ['sai', 'Sai Sudharsan', 'India', 'Modern Star', 'Batsman', 'Top Order', 'None', 'LHB', 'Legbreak', 'Sai_Sudharsan', '2023–24 Prime • 96 in Final & 527 Runs', 25, 1034, 141.0, 47.0, 0, 0.0, 87, 90, 78, 50, 0, 0, 85, 0, 70, 85],
  ['jurel', 'Dhruv Jurel', 'India', 'Modern Star', 'Wicketkeeper', 'Lower Order', 'None', 'RHB', 'None', 'Dhruv_Jurel', '2023–24 Prime • Calm Finisher & Agile Keeper', 27, 347, 152.0, 28.0, 0, 0.0, 81, 56, 82, 86, 0, 0, 88, 87, 68, 83],
  ['jitesh', 'Jitesh Sharma', 'India', 'Modern Star', 'Wicketkeeper', 'Lower Order', 'None', 'RHB', 'None', 'Jitesh_Sharma', '2023 Prime • 160 SR Fearless Lower-Order WK', 40, 730, 155.0, 25.0, 0, 0.0, 81, 52, 80, 87, 0, 0, 84, 85, 70, 84],
  ['saha', 'Wriddhiman Saha', 'India', 'Golden Era', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'Wriddhiman_Saha', '2014 Prime • 115* IPL Final & Elite Gloves', 170, 2934, 132.0, 26.0, 0, 0.0, 80, 83, 70, 50, 0, 0, 88, 95, 68, 82],
  ['parthiv', 'Parthiv Patel', 'India', 'Golden Era', 'Wicketkeeper', 'Top Order', 'None', 'LHB', 'None', 'Parthiv_Patel', '2017/2019 Prime • Crisp Powerplay Cutter', 139, 2848, 128.0, 24.0, 0, 0.0, 78, 81, 62, 42, 0, 0, 80, 86, 70, 77],
  ['samson_naman', 'Naman Dhir', 'India', 'Modern Star', 'All-Rounder', 'Middle Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Naman_Dhir', '2024 Prime • 177 SR Dynamic Striker', 7, 140, 177.0, 24.0, 0, 8.5, 76, 65, 78, 72, 0, 44, 84, 0, 60, 78],
  ['shashank', 'Shashank Singh', 'India', 'Modern Star', 'Batsman', 'Middle Order', 'Pace', 'RHB', 'Right-arm medium', 'Shashank_Singh_(cricketer,_born_1991)', '2024 Prime • 164 SR 354 Runs Finisher', 24, 423, 162.0, 38.0, 1, 8.8, 83, 55, 85, 88, 35, 0, 85, 0, 66, 86],
  ['ashutosh', 'Ashutosh Sharma', 'India', 'Modern Star', 'Batsman', 'Lower Order', 'None', 'RHB', 'Right-arm medium', 'Ashutosh_Sharma_(cricketer)', '2024 Prime • 167 SR Lower-Order Fireworks', 11, 189, 167.0, 27.0, 0, 0.0, 80, 48, 78, 88, 0, 0, 84, 0, 60, 84],
  ['nitish_k', 'Nitish Kumar Reddy', 'India', 'Modern Star', 'All-Rounder', 'Middle Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Nitish_Kumar_Reddy', '2024 Prime • Emerging Player 303 Runs & Seam', 15, 303, 143.0, 33.0, 3, 9.0, 82, 68, 85, 76, 70, 0, 87, 0, 68, 84],
  ['ramandeep', 'Ramandeep Singh', 'India', 'Modern Star', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium', 'Ramandeep_Singh_(cricketer)', '2024 Prime • 201 SR Finisher & Fly Catcher', 20, 170, 182.0, 28.0, 6, 8.8, 78, 42, 74, 88, 54, 0, 94, 0, 60, 84],
  ['samad', 'Abdul Samad', 'India', 'Modern Star', 'Batsman', 'Lower Order', 'Spin', 'RHB', 'Legbreak', 'Abdul_Samad', '2023–24 Prime • Fearless Clean Finisher', 50, 577, 150.0, 21.0, 2, 9.0, 77, 45, 75, 85, 0, 24, 85, 0, 58, 80],
  ['shahbaz', 'Shahbaz Ahmed', 'India', 'Modern Star', 'All-Rounder', 'Lower Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Shahbaz_Ahmed_(cricketer)', '2022/2024 Prime • Qualifier 2 Match-Winner', 55, 536, 125.0, 20.0, 21, 8.6, 68, 40, 68, 76, 0, 79, 86, 0, 64, 79],
  ['chahar_r', 'Rahul Chahar', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak googly', 'Rahul_Chahar', '2019–21 Prime • 2x Title Winner Leggie', 78, 124, 102.0, 10.0, 75, 7.65, 22, 8, 14, 28, 0, 86, 80, 0, 62, 83],
  ['suyash', 'Suyash Sharma', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak googly', 'Suyash_Sharma', '2023 Prime • Fast Skiddy Mystery Leggie', 13, 0, 0.0, 0.0, 10, 8.3, 10, 4, 6, 10, 0, 81, 76, 0, 58, 79],
  ['sai_k', 'R. Sai Kishore', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Sai_Kishore', '2024 Prime • Tall Left-Arm Spin & Leadership', 10, 13, 130.0, 6.5, 13, 8.2, 22, 8, 14, 28, 0, 84, 82, 0, 74, 81],
  ['kulkarni', 'Dhawal Kulkarni', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Dhawal_Kulkarni', '2016 Prime • 18 Wickets Powerplay Swing', 92, 104, 92.0, 10.0, 86, 8.3, 18, 6, 10, 22, 82, 0, 74, 0, 64, 79],
  ['bhatia', 'Rajat Bhatia', 'India', 'Legend', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium', 'Rajat_Bhatia', '2012–14 Prime • Economical Slow-Cutter All-Round', 95, 342, 120.0, 16.0, 71, 7.42, 54, 24, 52, 68, 79, 0, 76, 0, 66, 79],
  ['ojha_n', 'Naman Ojha', 'India', 'Golden Era', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'Naman_Ojha', '2010–16 Prime • Safe Gloves & Crisp Pull', 113, 1554, 118.0, 21.0, 0, 0.0, 74, 76, 68, 48, 0, 0, 80, 86, 64, 75],
  ['bisla', 'Manvinder Bisla', 'India', 'Golden Era', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'Manvinder_Bisla', '2012 Prime • 89 in IPL Final Hero', 39, 798, 122.0, 22.0, 0, 0.0, 74, 78, 60, 42, 0, 0, 78, 82, 62, 80],
  ['karthik_m', 'Murali Kartik', 'India', 'Legend', 'Bowler', 'Lower Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Murali_Kartik', '2008–12 Prime • Classical Flight & Arm Ball', 54, 113, 105.0, 11.0, 31, 7.65, 22, 8, 14, 28, 0, 82, 74, 0, 72, 77],
  ['yadav_j', 'Jayant Yadav', 'India', 'Modern Star', 'All-Rounder', 'Lower Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Jayant_Yadav', '2020 Prime • Final Powerplay Specialist', 20, 40, 108.0, 10.0, 8, 6.86, 38, 15, 32, 46, 0, 80, 78, 0, 64, 75],
  ['vaibhav', 'Vaibhav Arora', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Vaibhav_Arora', '2024 Prime • New-Ball Outswing Title Run', 20, 9, 75.0, 4.5, 19, 8.9, 12, 4, 8, 14, 81, 0, 76, 0, 58, 79],
  ['yash_d', 'Yash Dayal', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Left-arm fast-medium', 'Yash_Dayal', '2024 Prime • Clutch Final Over Defence', 28, 0, 0.0, 0.0, 28, 8.9, 10, 4, 6, 12, 83, 0, 76, 0, 60, 82],
  ['tushar', 'Tushar Deshpande', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Right-arm medium-fast', 'Tushar_Deshpande', '2023–24 Prime • 21 Wickets Title Run', 36, 21, 95.0, 7.0, 42, 9.3, 12, 4, 8, 14, 82, 0, 76, 0, 60, 81],
  ['simarjeet', 'Simarjeet Singh', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Simarjeet_Singh_(cricketer)', '2024 Prime • 145kph Hard Lengths', 10, 9, 80.0, 4.5, 9, 8.4, 12, 4, 8, 14, 79, 0, 76, 0, 58, 76],
  ['vyshak', 'Vijaykumar Vyshak', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium', 'Vijaykumar_Vyshak', '2023–24 Prime • Smart Slow Balls at Chinnaswamy', 11, 14, 88.0, 7.0, 13, 9.4, 14, 5, 8, 16, 78, 0, 78, 0, 60, 77],
  ['akash_m', 'Akash Madhwal', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Akash_Madhwal', '2023 Prime • 5/5 in Eliminator', 13, 4, 66.0, 4.0, 19, 8.8, 10, 4, 6, 12, 82, 0, 76, 0, 60, 82],
  ['kartik_t', 'Kartik Tyagi', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Kartik_Tyagi', '2021 Prime • Defended 4 Runs in Final Over', 20, 11, 80.0, 5.5, 15, 9.2, 12, 4, 8, 14, 81, 0, 78, 0, 58, 80],
  ['mavi', 'Shivam Mavi', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Shivam_Mavi', '2020 Prime • Sharp Nip & Seam', 32, 51, 95.0, 8.5, 30, 8.7, 20, 6, 12, 24, 80, 0, 80, 0, 60, 78],
  ['nagarkoti', 'Kamlesh Nagarkoti', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Kamlesh_Nagarkoti', '2020 Prime • Electric Fielder & Pace', 12, 22, 92.0, 7.0, 5, 8.8, 18, 6, 10, 22, 77, 0, 90, 0, 58, 76],
  ['kamboj', 'Anshul Kamboj', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Anshul_Kamboj', '2024 Prime • New-Ball Swing Prospect', 3, 2, 100.0, 2.0, 2, 9.0, 14, 5, 8, 18, 76, 0, 76, 0, 58, 74],
  ['prabhsimran', 'Prabhsimran Singh', 'India', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'Prabhsimran_Singh', '2023–24 Prime • 155 SR Century Powerplay', 34, 756, 150.0, 24.0, 0, 0.0, 82, 86, 65, 45, 0, 0, 80, 80, 62, 83],
  ['anuj', 'Anuj Rawat', 'India', 'Modern Star', 'Wicketkeeper', 'Middle Order', 'None', 'LHB', 'None', 'Anuj_Rawat', '2024 Prime • Left-Hand Finisher & Keeper', 24, 318, 126.0, 20.0, 0, 0.0, 74, 68, 74, 72, 0, 0, 82, 82, 60, 75],
  ['bharat', 'KS Bharat', 'India', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'K._S._Bharat', '2021 Prime • Last-Ball Six vs DC', 10, 199, 124.0, 28.0, 0, 0.0, 75, 78, 72, 50, 0, 0, 82, 88, 64, 76],
  ['abhishek_p', 'Abishek Porel', 'India', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'LHB', 'None', 'Abishek_Porel', '2024 Prime • 159 SR Left-Hand Keeper', 18, 360, 156.0, 27.0, 0, 0.0, 80, 83, 72, 56, 0, 0, 82, 83, 60, 81],
  ['badoni', 'Ayush Badoni', 'India', 'Modern Star', 'Batsman', 'Middle Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Ayush_Badoni', '2022–24 Prime • 360 Scoop Specialist', 42, 634, 136.0, 26.0, 2, 8.2, 79, 58, 82, 82, 0, 28, 85, 0, 66, 80],
  ['wadhera', 'Nehal Wadhera', 'India', 'Modern Star', 'Batsman', 'Middle Order', 'Spin', 'LHB', 'Legbreak', 'Nehal_Wadhera', '2023–24 Prime • Clean Left-Hand Middle Bat', 20, 350, 140.0, 25.0, 0, 8.5, 79, 64, 82, 74, 0, 18, 86, 0, 62, 79],
  ['lomror', 'Mahipal Lomror', 'India', 'Modern Star', 'All-Rounder', 'Middle Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Mahipal_Lomror', '2023–24 Prime • Impact Sub Sixes vs Spin', 40, 527, 144.0, 22.0, 1, 8.4, 78, 56, 80, 78, 0, 38, 82, 0, 60, 79],
  ['shahrukh', 'Shahrukh Khan', 'India', 'Modern Star', 'Batsman', 'Lower Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Shahrukh_Khan_(cricketer)', '2023–24 Prime • Heavy-Duty Lower Finisher', 40, 553, 144.0, 23.0, 0, 8.5, 78, 46, 76, 86, 0, 22, 84, 0, 64, 81],
  ['garg', 'Priyam Garg', 'India', 'Modern Star', 'Batsman', 'Middle Order', 'None', 'RHB', 'Right-arm medium', 'Priyam_Garg', '2020 Prime • U19 Captain & Crisp Cuts', 21, 251, 118.0, 18.0, 0, 0.0, 73, 66, 75, 58, 0, 0, 84, 0, 74, 73],
  ['manohar', 'Abhinav Manohar', 'India', 'Modern Star', 'Batsman', 'Lower Order', 'None', 'RHB', 'Legbreak', 'Abhinav_Manohar', '2022–23 Prime • Massive Sixes in Death Overs', 19, 231, 140.0, 20.0, 0, 0.0, 76, 48, 76, 83, 0, 12, 82, 0, 60, 78],
  ['dubey_s', 'Shubham Dubey', 'India', 'Modern Star', 'Batsman', 'Lower Order', 'None', 'LHB', 'Right-arm offbreak', 'Shubham_Dubey', '2024 Prime • Left-Hand Finisher Burst', 4, 33, 150.0, 16.0, 0, 0.0, 73, 45, 72, 80, 0, 0, 80, 0, 58, 74],
  ['dhull', 'Yash Dhull', 'India', 'Modern Star', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm offbreak', 'Yash_Dhull', '2022–23 Prime • U19 World Cup Winning Cap', 4, 16, 95.0, 8.0, 0, 0.0, 72, 74, 68, 44, 0, 0, 82, 0, 76, 72],
  ['kulkarni_a', 'Arshin Kulkarni', 'India', 'Modern Star', 'All-Rounder', 'Top Order', 'Pace', 'RHB', 'Right-arm medium', 'Arshin_Kulkarni', '2024 Prime • Youth Powerplay All-Rounder', 2, 9, 100.0, 4.5, 0, 9.0, 71, 72, 65, 52, 62, 0, 80, 0, 60, 72],
  ['vijay_s', 'Vijay Shankar', 'India', 'Modern Star', 'All-Rounder', 'Middle Order', 'Pace', 'RHB', 'Right-arm medium', 'Vijay_Shankar', '2019/2023 Prime • 160 SR Comeback Hitter', 72, 1115, 132.0, 26.0, 9, 8.8, 77, 64, 80, 72, 56, 0, 84, 0, 66, 78],
  ['bhatt_g', 'Gowtham Krishnappa', 'India', 'Modern Star', 'All-Rounder', 'Lower Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Krishnappa_Gowtham', '2018 Prime • Powerplay Offie + Late Sixes', 36, 247, 165.0, 16.0, 21, 8.2, 62, 32, 58, 76, 0, 78, 82, 0, 62, 79],
  ['jadeja_a', 'Ajay Jadeja', 'India', 'Legend', 'Batsman', 'Middle Order', 'None', 'RHB', 'Right-arm medium', 'Ajay_Jadeja', 'Pre-IPL / ODI Prime • Tactical Finisher', 0, 0, 0.0, 0.0, 0, 0.0, 78, 65, 80, 76, 0, 0, 86, 0, 84, 78],
  ['kaif', 'Mohammad Kaif', 'India', 'Legend', 'Batsman', 'Middle Order', 'None', 'RHB', 'Right-arm offbreak', 'Mohammad_Kaif', '2008 Prime • Gun Fielder & Tactician', 29, 259, 112.0, 16.0, 0, 0.0, 73, 66, 76, 58, 0, 0, 97, 0, 80, 77],
  ['tiwary_s', 'Saurabh Tiwary', 'India', 'Golden Era', 'Batsman', 'Middle Order', 'None', 'LHB', 'None', 'Saurabh_Tiwary', '2010 Prime • 419 Runs Breakthrough Leftie', 93, 1494, 124.0, 28.0, 0, 0.0, 77, 68, 79, 64, 0, 0, 76, 0, 62, 76],
  ['bisht_p', 'Paul Valthaty', 'India', 'Golden Era', 'Batsman', 'Top Order', 'Pace', 'RHB', 'Right-arm medium', 'Paul_Valthaty', '2011 Prime • 120* & 463 Runs Sensation', 23, 505, 130.0, 25.0, 7, 8.2, 77, 80, 64, 48, 52, 0, 76, 0, 60, 79],
  ['pawar', 'Pawan Negi', 'India', 'Golden Era', 'All-Rounder', 'Lower Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Pawan_Negi', '2014–15 Prime • CLT20 5/22 & Big Sixes', 50, 365, 128.0, 16.0, 34, 7.9, 58, 28, 54, 70, 0, 77, 82, 0, 60, 76],
  ['kulkarni_dh', 'Swapnil Asnodkar', 'India', 'Legend', 'Batsman', 'Top Order', 'None', 'RHB', 'None', 'Swapnil_Asnodkar', '2008 Prime • Fearless Inaugural Title Opener', 20, 423, 128.0, 24.0, 0, 0.0, 74, 78, 58, 40, 0, 0, 78, 0, 58, 74],
  ['yusuf_p2', 'Manpreet Gony', 'India', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium', 'Manpreet_Gony', '2008 Prime • 17 Wickets CSK Finalist', 44, 99, 135.0, 14.0, 37, 8.6, 26, 8, 16, 36, 78, 0, 72, 0, 58, 76],
  ['joginder', 'Joginder Sharma', 'India', 'Legend', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium', 'Joginder_Sharma', '2007–10 Prime • 2007 Final Last Over Hero', 16, 36, 118.0, 12.0, 12, 8.8, 42, 16, 36, 52, 76, 0, 74, 0, 64, 76],
  ['raina_m', 'Mandeep Singh', 'India', 'Golden Era', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm medium', 'Mandeep_Singh', '2012/2015 Prime • 432 Runs Emerging Star', 111, 1706, 126.0, 23.0, 0, 0.0, 76, 78, 74, 52, 0, 0, 84, 0, 66, 75],
  ['vohra', 'Manan Vohra', 'India', 'Golden Era', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm medium', 'Manan_Vohra', '2014/2017 Prime • 95 vs SRH Clean Hitter', 56, 1083, 132.0, 24.0, 0, 0.0, 75, 79, 62, 42, 0, 0, 82, 0, 60, 75],
  ['suryavanshi_n', 'Nikhil Naik', 'India', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'Nikhil_Naik', 'Domestic T20 Prime • Agile Reserve WK', 3, 30, 115.0, 10.0, 0, 0.0, 68, 70, 62, 45, 0, 0, 78, 80, 58, 69],
  ['jaggi', 'Ishank Jaggi', 'India', 'Golden Era', 'Batsman', 'Middle Order', 'None', 'RHB', 'Legbreak', 'Ishank_Jaggi', '2017 Prime • Domestic White-Ball Run Machine', 7, 33, 110.0, 11.0, 0, 0.0, 70, 62, 72, 54, 0, 0, 78, 0, 62, 69],
  ['chawla_s', 'Sarfaraz Khan', 'India', 'Modern Star', 'Batsman', 'Middle Order', 'None', 'RHB', 'Legbreak', 'Sarfaraz_Khan_(cricketer)', '2015–16 Prime • Audacious Reverse Scoops', 50, 585, 132.0, 24.0, 0, 0.0, 77, 62, 79, 74, 0, 0, 76, 0, 62, 77],
  ['pant_sub', 'Kusal Mendis', 'Sri Lanka', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'Kusal_Mendis', '2023–24 Prime • T20 Aggressive Opener-WK', 0, 0, 0.0, 0.0, 0, 0.0, 80, 83, 72, 48, 0, 0, 82, 85, 74, 79],
  ['krunal_2', 'Rajvardhan Hangargekar', 'India', 'Modern Star', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Rajvardhan_Hangargekar', '2023 Prime • 140kph + Long Levers', 2, 0, 0.0, 0.0, 3, 9.0, 48, 18, 40, 60, 76, 0, 78, 0, 58, 74],
  ['sharma_k', 'Karn Sharma', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Spin', 'LHB', 'Legbreak googly', 'Karn_Sharma', '2014–17 Prime • 3x IPL Champion Leggie', 84, 350, 122.0, 14.0, 76, 7.9, 36, 12, 24, 48, 0, 84, 76, 0, 62, 82],
  ['markande', 'Mayank Markande', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak googly', 'Mayank_Markande', '2018/2023 Prime • Sharp Googly Breakthrough', 37, 48, 92.0, 9.0, 37, 8.6, 14, 5, 8, 18, 0, 82, 76, 0, 58, 80],
  ['murugan', 'Murugan Ashwin', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak', 'Murugan_Ashwin', '2019–21 Prime • Tight Middle-Overs Leg-Spin', 44, 35, 88.0, 7.0, 35, 7.95, 12, 4, 8, 15, 0, 80, 76, 0, 58, 77],
  ['shreyas_g', 'Shreyas Gopal', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak googly', 'Shreyas_Gopal', '2019 Prime • 20 Wickets & Hat-Trick', 52, 180, 114.0, 14.0, 52, 8.1, 34, 12, 24, 44, 0, 84, 80, 0, 62, 82],
  ['nadim', 'Shahbaz Nadeem', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Slow left-arm orthodox', 'Shahbaz_Nadeem', '2012–16 Prime • Economical Left-Arm Spin', 72, 39, 72.0, 6.0, 48, 7.6, 12, 4, 8, 14, 0, 81, 76, 0, 62, 77],
  ['harpreet', 'Harpreet Brar', 'India', 'Modern Star', 'All-Rounder', 'Lower Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Harpreet_Brar', '2021–24 Prime • Big-Match Wickets & Sixes', 41, 219, 128.0, 18.0, 25, 7.75, 56, 22, 50, 70, 0, 83, 82, 0, 60, 82],
  ['kotian', 'Tanush Kotian', 'India', 'Modern Star', 'All-Rounder', 'Lower Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Tanush_Kotian', '2024 Prime • Ranji MVP Spin All-Rounder', 1, 24, 78.0, 24.0, 0, 0.0, 58, 35, 55, 65, 0, 77, 80, 0, 62, 74],
  ['sharma_j', 'Jatin Saxena', 'India', 'Golden Era', 'All-Rounder', 'Middle Order', 'Spin', 'RHB', 'Legbreak', 'Jalaj_Saxena', 'Domestic T20 Legend • 600+ Wickets Veteran', 1, 0, 0.0, 0.0, 0, 0.0, 54, 30, 55, 62, 0, 80, 76, 0, 68, 74],

  ['dilshan', 'Tillakaratne Dilshan', 'Sri Lanka', 'Legend', 'Batsman', 'Top Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Tillakaratne_Dilshan', '2009–12 Prime • Dilscoop Innovator', 52, 1153, 124.0, 27.0, 5, 8.0, 82, 85, 74, 52, 0, 46, 92, 72, 82, 83],
  ['jayasuriya', 'Sanath Jayasuriya', 'Sri Lanka', 'Legend', 'All-Rounder', 'Top Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Sanath_Jayasuriya', '2008 Prime • 114* Matara Mauler', 30, 768, 148.0, 29.0, 13, 8.0, 86, 90, 72, 50, 0, 72, 84, 0, 82, 89],
  ['vaas', 'Chaminda Vaas', 'Sri Lanka', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Left-arm fast-medium', 'Chaminda_Vaas', '2009–10 Prime • Powerplay Swing & Title', 13, 81, 108.0, 13.0, 18, 7.54, 28, 10, 18, 36, 86, 0, 76, 0, 72, 83],
  ['mathews', 'Angelo Mathews', 'Sri Lanka', 'Golden Era', 'All-Rounder', 'Middle Order', 'Pace', 'RHB', 'Right-arm medium', 'Angelo_Mathews', '2011–15 Prime • Calm Captain & Seam', 49, 724, 126.0, 24.0, 27, 8.2, 75, 58, 78, 74, 74, 0, 82, 0, 84, 79],
  ['perera', 'Thisara Perera', 'Sri Lanka', 'Golden Era', 'All-Rounder', 'Lower Order', 'Pace', 'LHB', 'Right-arm medium-fast', 'Thisara_Perera', '2012–16 Prime • Cleared Ropes & Cutters', 37, 422, 142.0, 20.0, 31, 8.7, 74, 38, 72, 84, 78, 0, 80, 0, 74, 81],
  ['smith_dr', 'Dwayne Smith', 'West Indies', 'Golden Era', 'All-Rounder', 'Top Order', 'Pace', 'RHB', 'Right-arm medium', 'Dwayne_Smith', '2014 Prime • 566 Runs CSK Powerplay Blast', 91, 2385, 139.0, 29.0, 26, 8.8, 84, 88, 72, 56, 56, 0, 84, 0, 64, 85],
  ['simmons', 'Lendl Simmons', 'West Indies', 'Golden Era', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm medium', 'Lendl_Simmons', '2014–15 Prime • 2x MI Title Opener', 29, 1079, 132.0, 40.0, 1, 8.5, 86, 89, 70, 48, 0, 0, 82, 0, 66, 85],
  ['lewis', 'Evin Lewis', 'West Indies', 'Modern Star', 'Batsman', 'Top Order', 'None', 'LHB', 'None', 'Evin_Lewis', '2018/2021 Prime • Fearless Sixes Opener', 27, 654, 144.0, 28.0, 0, 0.0, 82, 86, 66, 46, 0, 0, 82, 0, 62, 82],
  ['badree', 'Samuel Badree', 'West Indies', 'Golden Era', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak', 'Samuel_Badree', '2016–17 Prime • IPL Hat-Trick Powerplay Spin', 12, 13, 72.0, 6.0, 11, 7.6, 12, 4, 8, 14, 0, 86, 74, 0, 64, 82],
  ['joseph', 'Alzarri Joseph', 'West Indies', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Alzarri_Joseph', '2019 Prime • Record 6/12 IPL Debut', 22, 32, 95.0, 8.0, 21, 9.1, 20, 6, 12, 26, 85, 0, 82, 0, 64, 84],
  ['shepherd', 'Romario Shepherd', 'West Indies', 'Modern Star', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Romario_Shepherd', '2024 Prime • 32-Run Final Over Blitz', 10, 115, 195.0, 28.0, 4, 9.4, 76, 35, 72, 90, 76, 0, 84, 0, 60, 84],
  ['hodge', 'Brad Hodge', 'Australia', 'Legend', 'Batsman', 'Middle Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Brad_Hodge', '2011–13 Prime • T20 Master Finisher', 66, 1400, 131.0, 33.3, 17, 7.8, 84, 76, 86, 78, 0, 38, 86, 0, 74, 84],
  ['bailey', 'George Bailey', 'Australia', 'Golden Era', 'Batsman', 'Middle Order', 'None', 'RHB', 'Right-arm medium', 'George_Bailey_(cricketer,_born_1982)', '2014 Prime • KXIP Finalist Smiling Captain', 40, 663, 135.0, 25.0, 0, 0.0, 78, 66, 80, 70, 0, 0, 88, 0, 90, 80],
  ['faulkner', 'James Faulkner', 'Australia', 'Golden Era', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Left-arm medium-fast', 'James_Faulkner_(cricketer)', '2013–14 Prime • 28 Wickets Death Finisher', 60, 527, 138.0, 21.0, 59, 8.6, 72, 35, 70, 84, 87, 0, 84, 0, 70, 87],
  ['lynn', 'Chris Lynn', 'Australia', 'Golden Era', 'Batsman', 'Top Order', 'None', 'RHB', 'Slow left-arm orthodox', 'Chris_Lynn', '2017–18 Prime • Lynnsanity Powerplay Sixes', 42, 1329, 145.0, 34.0, 0, 0.0, 86, 90, 70, 48, 0, 0, 84, 0, 72, 87],
  ['coult_nile', 'Nathan Coulter-Nile', 'Australia', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Nathan_Coulter-Nile', '2017/2020 Prime • 3/29 Qualifier & Pinch', 39, 82, 118.0, 12.0, 48, 7.75, 32, 10, 20, 42, 87, 0, 82, 0, 64, 85],
  ['harris_r', 'Ryan Harris', 'Australia', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Ryan_Harris_(cricketer)', '2009–12 Prime • 2009 Title Winner Seam', 37, 117, 110.0, 13.0, 45, 7.56, 26, 8, 16, 34, 88, 0, 82, 0, 70, 85],
  ['bollinger', 'Doug Bollinger', 'Australia', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Left-arm fast-medium', 'Doug_Bollinger', '2010–11 Prime • 2x CSK Title Strike Bowler', 27, 21, 95.0, 7.0, 37, 7.21, 16, 5, 8, 20, 89, 0, 78, 0, 64, 87],
  ['tait', 'Shaun Tait', 'Australia', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Shaun_Tait', '2010–11 Prime • 157kph Wild Thing', 21, 23, 95.0, 8.0, 23, 8.1, 14, 4, 8, 16, 88, 0, 76, 0, 58, 85],
  ['david_t', 'Tim David', 'Australia', 'Modern Star', 'Batsman', 'Lower Order', 'None', 'RHB', 'Right-arm offbreak', 'Tim_David', '2022–24 Prime • 180 SR Giant Death Hitter', 38, 659, 174.0, 30.0, 0, 0.0, 86, 46, 84, 94, 0, 0, 88, 0, 64, 89],
  ['fraser_m', 'Jake Fraser-McGurk', 'Australia', 'Modern Star', 'Batsman', 'Top Order', 'None', 'RHB', 'Legbreak', 'Jake_Fraser-McGurk', '2024 Prime • 234 SR Teenage Tornado', 9, 330, 234.0, 36.6, 0, 0.0, 87, 92, 68, 48, 0, 0, 88, 0, 60, 91],
  ['inglis', 'Josh Inglis', 'Australia', 'Modern Star', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'Josh_Inglis', '2023–24 Prime • Fearless Sweeper & Keeper', 0, 0, 0.0, 0.0, 0, 0.0, 83, 85, 80, 62, 0, 0, 86, 89, 72, 83],
  ['spencer_j', 'Spencer Johnson', 'Australia', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Left-arm fast', 'Spencer_Johnson_(cricketer)', '2024 Prime • 148kph Left-Arm Death Pace', 5, 6, 100.0, 6.0, 4, 9.2, 12, 4, 8, 15, 81, 0, 78, 0, 58, 79],
  ['taylor_r', 'Ross Taylor', 'New Zealand', 'Legend', 'Batsman', 'Middle Order', 'None', 'RHB', 'Right-arm offbreak', 'Ross_Taylor', '2008–10 Prime • Slog-Sweep Powerhouse', 55, 1017, 132.0, 26.0, 0, 0.0, 83, 74, 85, 72, 0, 0, 85, 0, 82, 83],
  ['vettori', 'Daniel Vettori', 'New Zealand', 'Legend', 'All-Rounder', 'Lower Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Daniel_Vettori', '2011–12 Prime • 6.78 Econ Captain', 34, 121, 108.0, 15.0, 28, 6.78, 42, 16, 36, 52, 0, 90, 82, 0, 92, 86],
  ['styris', 'Scott Styris', 'New Zealand', 'Legend', 'All-Rounder', 'Middle Order', 'Pace', 'RHB', 'Right-arm medium', 'Scott_Styris', '2009 Prime • 2009 Title Winning All-Rounder', 12, 131, 120.0, 22.0, 8, 7.6, 68, 52, 72, 66, 72, 0, 80, 0, 74, 77],
  ['guptill', 'Martin Guptill', 'New Zealand', 'Golden Era', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm offbreak', 'Martin_Guptill', '2016–18 Prime • T20I Sixes Record Opener', 13, 270, 138.0, 23.0, 0, 0.0, 82, 86, 66, 44, 0, 0, 92, 0, 68, 81],
  ['munro', 'Colin Munro', 'New Zealand', 'Golden Era', 'Batsman', 'Top Order', 'Pace', 'LHB', 'Right-arm medium', 'Colin_Munro', '2018–19 Prime • 3x T20I Centurion', 13, 177, 132.0, 18.0, 0, 8.5, 81, 85, 68, 48, 30, 0, 84, 0, 66, 80],
  ['phillips', 'Glenn Phillips', 'New Zealand', 'Modern Star', 'Wicketkeeper', 'Middle Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Glenn_Phillips_(cricketer)', '2022–24 Prime • Superman Fielder & Power', 8, 65, 135.0, 16.0, 2, 7.5, 84, 65, 86, 86, 0, 60, 98, 82, 70, 87],
  ['anderson_c', 'Corey Anderson', 'New Zealand', 'Golden Era', 'All-Rounder', 'Middle Order', 'Pace', 'LHB', 'Left-arm medium-fast', 'Corey_Anderson_(cricketer)', '2014 Prime • 95* off 44 Balls Playoff Miracle', 30, 538, 136.0, 25.0, 11, 9.0, 78, 55, 80, 82, 72, 0, 82, 0, 66, 84],
  ['neesh', 'Jimmy Neesham', 'New Zealand', 'Modern Star', 'All-Rounder', 'Lower Order', 'Pace', 'LHB', 'Right-arm medium-fast', 'James_Neesham', '2021 Prime • Clutch Death Bowling & Finishes', 14, 92, 128.0, 18.0, 8, 8.8, 70, 42, 70, 78, 75, 0, 84, 0, 66, 78],
  ['roy', 'Jason Roy', 'England', 'Modern Star', 'Batsman', 'Top Order', 'None', 'RHB', 'None', 'Jason_Roy', '2018/2023 Prime • 152 SR Powerplay Punisher', 21, 614, 146.0, 31.0, 0, 0.0, 85, 89, 68, 45, 0, 0, 86, 0, 66, 84],
  ['hales', 'Alex Hales', 'England', 'Golden Era', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm medium', 'Alex_Hales', '2018–22 Prime • 148 SR T20 World Cup Hero', 6, 148, 132.0, 25.0, 0, 0.0, 83, 87, 68, 46, 0, 0, 82, 0, 64, 82],
  ['jacks', 'Will Jacks', 'England', 'Modern Star', 'All-Rounder', 'Top Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Will_Jacks', '2024 Prime • 41-Ball Century vs GT', 8, 230, 175.0, 33.0, 2, 8.5, 86, 88, 82, 68, 0, 65, 87, 0, 66, 89],
  ['ali_rashid', 'Adil Rashid', 'England', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Legbreak googly', 'Adil_Rashid', '2021–24 Prime • World No.1 T20I Leg-Spinner', 3, 18, 95.0, 9.0, 2, 8.2, 24, 8, 16, 30, 0, 90, 78, 0, 68, 85],
  ['jordan', 'Chris Jordan', 'England', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Chris_Jordan_(cricketer)', '2016–21 Prime • Bucket-Hands Slip & Death Yorkers', 28, 75, 118.0, 11.0, 27, 9.1, 32, 10, 22, 42, 82, 0, 94, 0, 68, 81],
  ['mills', 'Tymal Mills', 'England', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Left-arm fast', 'Tymal_Mills', '2017/2022 Prime • 145kph & Deceptive Slower', 10, 8, 60.0, 4.0, 11, 9.2, 10, 4, 6, 12, 80, 0, 74, 0, 58, 76],
  ['botha', 'Johan Botha', 'South Africa', 'Legend', 'All-Rounder', 'Lower Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Johan_Botha_(cricketer)', '2009–12 Prime • 6.92 Econ Tactical Offie', 34, 409, 120.0, 19.0, 25, 6.92, 56, 30, 54, 66, 0, 85, 84, 0, 82, 80],
  ['smith_g', 'Graeme Smith', 'South Africa', 'Legend', 'Batsman', 'Top Order', 'None', 'LHB', 'Right-arm offbreak', 'Graeme_Smith', '2008 Prime • 441 Runs Championship Partner', 29, 739, 116.0, 29.0, 0, 0.0, 81, 84, 70, 44, 0, 0, 82, 0, 92, 81],
  ['kemp', 'Justin Kemp', 'South Africa', 'Legend', 'All-Rounder', 'Middle Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Justin_Kemp', '2010 Prime • Big-Hitting CSK Title All-Rounder', 5, 26, 118.0, 13.0, 3, 7.4, 64, 42, 66, 70, 68, 0, 78, 0, 64, 73],
  ['duminy', 'JP Duminy', 'South Africa', 'Golden Era', 'All-Rounder', 'Middle Order', 'Spin', 'LHB', 'Right-arm offbreak', 'JP_Duminy', '2014–15 Prime • 410 Runs & Handy Offies', 83, 2029, 130.0, 39.7, 23, 7.4, 84, 72, 87, 78, 0, 66, 86, 0, 82, 84],
  ['ntini', 'Makhaya Ntini', 'South Africa', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Makhaya_Ntini', '2008 Prime • Hat-Trick & Endless Energy', 9, 11, 70.0, 5.5, 7, 6.95, 12, 4, 8, 14, 84, 0, 78, 0, 64, 79],
  ['boucher', 'Mark Boucher', 'South Africa', 'Legend', 'Wicketkeeper', 'Lower Order', 'None', 'RHB', 'None', 'Mark_Boucher', '2008–10 Prime • Iron-Glove Finisher', 31, 394, 132.0, 26.0, 0, 0.0, 74, 45, 72, 82, 0, 0, 84, 94, 78, 80],
  ['mendis_a', 'Ajantha Mendis', 'Sri Lanka', 'Legend', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Carrom / Mystery', 'Ajantha_Mendis', '2008–10 Prime • Original Carrom Mystery', 10, 3, 50.0, 3.0, 8, 7.3, 10, 4, 6, 10, 0, 87, 74, 0, 60, 81],
  ['malinga_2', 'Nuwan Kulasekara', 'Sri Lanka', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Nuwan_Kulasekara', '2011–13 Prime • New-Ball Inswing', 6, 5, 70.0, 5.0, 5, 7.2, 22, 8, 14, 28, 82, 0, 78, 0, 66, 77],
  ['nabi', 'Mohammad Nabi', 'Afghanistan', 'Modern Star', 'All-Rounder', 'Lower Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Mohammad_Nabi', '2019–24 Prime • Mr. President Economical Off-Spin', 24, 215, 144.0, 18.0, 15, 7.25, 66, 36, 65, 76, 0, 84, 84, 0, 84, 82],
  ['mujeeb', 'Mujeeb Ur Rahman', 'Afghanistan', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Right-arm offbreak / Carrom', 'Mujeeb_Ur_Rahman_(cricketer)', '2018 Prime • 17-Year-Old Powerplay Mystery', 19, 12, 85.0, 6.0, 17, 7.8, 12, 4, 8, 14, 0, 86, 76, 0, 58, 82],
  ['farooqi', 'Fazalhaq Farooqi', 'Afghanistan', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Left-arm fast-medium', 'Fazalhaq_Farooqi', '2024 Prime • T20 WC Joint-Highest Wickets', 7, 2, 50.0, 2.0, 6, 8.8, 10, 4, 6, 12, 84, 0, 76, 0, 58, 81],
  ['raza', 'Sikandar Raza', 'Zimbabwe', 'Modern Star', 'All-Rounder', 'Middle Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Sikandar_Raza', '2023–24 Prime • Clutch Chase & Mystery Spin', 9, 182, 138.0, 26.0, 3, 8.2, 76, 56, 78, 76, 0, 76, 86, 0, 82, 82],
  ['flower_f', 'Rassie van der Dussen', 'South Africa', 'Modern Star', 'Batsman', 'Middle Order', 'None', 'RHB', 'Legbreak', 'Rassie_van_der_Dussen', '2022–24 Prime • Classical Middle-Order Anchor', 3, 22, 105.0, 11.0, 0, 0.0, 80, 74, 82, 60, 0, 0, 84, 0, 72, 77],
  ['ten_does', 'Ryan ten Doeschate', 'Netherlands', 'Golden Era', 'All-Rounder', 'Middle Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Ryan_ten_Doeschate', '2011–14 Prime • 2x KKR Title & Electric Field', 29, 326, 140.0, 24.0, 2, 7.8, 74, 52, 76, 76, 62, 0, 92, 0, 78, 80],
  ['bopara', 'Ravi Bopara', 'England', 'Golden Era', 'All-Rounder', 'Middle Order', 'Pace', 'RHB', 'Right-arm medium', 'Ravi_Bopara', '2009–15 Prime • Smart Cutters & Anchor', 24, 531, 120.0, 29.0, 11, 8.0, 72, 62, 74, 66, 68, 0, 80, 0, 70, 75],
  ['collingwood', 'Paul Collingwood', 'England', 'Legend', 'All-Rounder', 'Middle Order', 'Pace', 'RHB', 'Right-arm medium', 'Paul_Collingwood', '2010 Prime • T20 WC Winning Captain', 8, 203, 134.0, 40.0, 5, 7.5, 75, 58, 78, 72, 68, 0, 95, 0, 90, 81],
  ['sammy', 'Darren Sammy', 'West Indies', 'Golden Era', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Daren_Sammy', '2013–14 Prime • 2x T20 WC Winning Captain', 22, 295, 134.0, 21.0, 11, 8.4, 66, 36, 64, 78, 74, 0, 84, 0, 93, 81],
  ['simmons_2', 'Carlos Brathwaite', 'West Indies', 'Golden Era', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Carlos_Brathwaite', '2016 Prime • Remember the Name 4 Sixes', 16, 181, 165.0, 18.0, 13, 8.8, 68, 30, 64, 84, 78, 0, 84, 0, 76, 83],
  ['badani_s', 'Shubman_Sub_Krunal', 'India', 'Modern Star', 'Batsman', 'Middle Order', 'None', 'LHB', 'None', 'Rinku_Singh', 'SkipPlaceholder', 1, 1, 100.0, 1.0, 0, 0.0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

const EXTRA_INDIAN_PLAYERS = [
  ['srinath', 'Javagal Srinath', 'India', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Javagal_Srinath', 'Pre-IPL Legend • 145kph Express Seam', 0, 0, 0.0, 0.0, 0, 0.0, 22, 8, 14, 28, 89, 0, 76, 0, 74, 84],
  ['agarkar', 'Ajit Agarkar', 'India', 'Legend', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Ajit_Agarkar', '2008–12 Prime • Fast Outswing & Lower Hits', 42, 179, 118.0, 14.0, 29, 8.8, 34, 12, 22, 44, 84, 0, 82, 0, 70, 81],
  ['chawla_r', 'Ramesh Powar', 'India', 'Legend', 'Bowler', 'Lower Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Ramesh_Powar', '2008–11 Prime • Flight & Loop Tactician', 27, 67, 105.0, 11.0, 13, 7.45, 22, 8, 14, 26, 0, 79, 72, 0, 64, 75],
  ['varun_a', 'Varun Aaron', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast', 'Varun_Aaron', '2014–19 Prime • 150kph Fireball Pace', 52, 50, 78.0, 7.0, 44, 8.9, 12, 4, 8, 14, 82, 0, 76, 0, 58, 79],
  ['tiwari_a', 'Anureet Singh', 'India', 'Golden Era', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Anureet_Singh', '2015 Prime • 15 Wickets KXIP Seam', 23, 37, 92.0, 9.0, 18, 8.9, 14, 5, 8, 16, 77, 0, 74, 0, 58, 74],
  ['jadeja_d', 'Dhruv Shorey', 'India', 'Modern Star', 'Batsman', 'Top Order', 'None', 'RHB', 'Right-arm offbreak', 'Dhruv_Shorey', 'Domestic Prime • Consistent Top-Order Bat', 2, 13, 100.0, 6.5, 0, 0.0, 70, 72, 65, 42, 0, 0, 78, 0, 62, 70],
  ['sutar', 'Manav Suthar', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Spin', 'LHB', 'Slow left-arm orthodox', 'Manav_Suthar', '2024 Prime • Young Left-Arm Spin Prospect', 1, 1, 50.0, 1.0, 0, 0.0, 24, 8, 16, 30, 0, 77, 78, 0, 60, 73],
  ['raghuvanshi', 'Angkrish Raghuvanshi', 'India', 'Modern Star', 'Batsman', 'Top Order', 'None', 'RHB', 'Slow left-arm orthodox', 'Angkrish_Raghuvanshi', '2024 Prime • 155 SR Fearless Stroke-Maker', 10, 163, 155.0, 23.0, 0, 0.0, 80, 83, 74, 50, 0, 0, 84, 0, 60, 81],
  ['rizvi', 'Sameer Rizvi', 'India', 'Modern Star', 'Batsman', 'Middle Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Sameer_Rizvi', '2024 Prime • First-Ball Six vs Rashid Khan', 8, 51, 128.0, 12.0, 0, 0.0, 74, 52, 76, 78, 0, 22, 82, 0, 60, 76],
  ['deshmukh', 'Kedar Devdhar', 'India', 'Golden Era', 'Wicketkeeper', 'Top Order', 'None', 'RHB', 'None', 'Kedar_Devdhar', 'Domestic T20 Prime • Explosive Opener-WK', 1, 0, 0.0, 0.0, 0, 0.0, 70, 72, 62, 44, 0, 0, 76, 81, 60, 70],
  ['singh_g', 'Gurkeerat Singh Mann', 'India', 'Golden Era', 'All-Rounder', 'Middle Order', 'Spin', 'RHB', 'Right-arm offbreak', 'Gurkeerat_Singh', '2015–19 Prime • Aggressive 50s & Offies', 41, 511, 124.0, 21.0, 5, 7.9, 73, 56, 75, 68, 0, 48, 86, 65, 64, 74],
  ['saxena_r', 'Rishi Dhawan', 'India', 'Golden Era', 'All-Rounder', 'Lower Order', 'Pace', 'RHB', 'Right-arm medium-fast', 'Rishi_Dhawan', '2014/2022 Prime • Swing & Lower-Order Runs', 39, 210, 114.0, 17.5, 25, 8.1, 56, 26, 52, 68, 79, 0, 80, 0, 72, 77],
  ['kulkarni_y', 'Yash Thakur', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Yash_Thakur', '2024 Prime • 5/30 vs GT Death Specialist', 19, 0, 0.0, 0.0, 24, 9.8, 10, 4, 6, 12, 81, 0, 76, 0, 58, 80],
  ['khan_m', 'Mohsin Khan', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'LHB', 'Left-arm fast-medium', 'Mohsin_Khan_(Indian_cricketer)', '2022 Prime • 5.96 Econ Left-Arm Bounce', 24, 25, 85.0, 8.0, 27, 8.5, 14, 5, 8, 18, 86, 0, 78, 0, 60, 85],
  ['thampi', 'Basil Thampi', 'India', 'Modern Star', 'Bowler', 'Lower Order', 'Pace', 'RHB', 'Right-arm fast-medium', 'Basil_Thampi', '2017 Prime • Emerging Player Yorkers', 25, 32, 95.0, 8.0, 22, 9.6, 14, 5, 8, 16, 79, 0, 76, 0, 58, 77]
];

function computeBasePrice(overall) {
  if (overall >= 94) return 3500;
  if (overall >= 90) return 2500;
  if (overall >= 86) return 1600;
  if (overall >= 81) return 900;
  if (overall >= 75) return 500;
  return 300;
}

function expandPlayer(row) {
  const [
    id, name, country, era, role, battingPosition, bowlingType, battingStyle, bowlingStyle,
    wikiTitle, primeNote, matches, runs, strikeRate, average, wickets, economy,
    batting, topOrder, middleOrder, lowerOrder, paceBowling, spinBowling, fielding,
    wicketkeeping, captaincy, impact
  ] = row;

  let primarySkill = batting;
  if (role === 'Bowler') {
    primarySkill = Math.max(paceBowling, spinBowling);
  } else if (role === 'All-Rounder') {
    primarySkill = Math.round(batting * 0.52 + Math.max(paceBowling, spinBowling) * 0.48);
  } else if (role === 'Wicketkeeper') {
    primarySkill = Math.round(batting * 0.78 + wicketkeeping * 0.22);
  }

  const overall = Math.min(
    99,
    Math.round(primarySkill * 0.65 + impact * 0.23 + fielding * 0.07 + captaincy * 0.05)
  );

  const basePrice = computeBasePrice(overall);

  return {
    id,
    name,
    country,
    isOverseas: country !== 'India',
    era,
    role,
    battingPosition,
    bowlingType,
    battingStyle,
    bowlingStyle,
    wikiTitle,
    primeNote,
    stats: { matches, runs, strikeRate, average, wickets, economy },
    ratings: {
      overall,
      batting,
      topOrder,
      middleOrder,
      lowerOrder,
      paceBowling,
      spinBowling,
      fielding,
      wicketkeeping,
      captaincy,
      impact
    },
    basePrice
  };
}

const EXPANDED_POOL = [...RAW_PLAYERS, ...EXTRA_INDIAN_PLAYERS]
  .filter((row) => row[10] !== 'SkipPlaceholder')
  .map(expandPlayer);

// Curate balanced 160-player prime pool (104 Indian + 56 Overseas)
const CURATED_INDIAN = EXPANDED_POOL
  .filter((p) => !p.isOverseas)
  .sort((a, b) => b.ratings.overall - a.ratings.overall)
  .slice(0, 104);

const CURATED_OVERSEAS = EXPANDED_POOL
  .filter((p) => p.isOverseas)
  .sort((a, b) => b.ratings.overall - a.ratings.overall)
  .slice(0, 56);

const ALL_PLAYERS = [...CURATED_INDIAN, ...CURATED_OVERSEAS];

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getLotSizeForTeamCount(teamCount) {
  const table = { 2: 40, 3: 60, 4: 72, 5: 82, 6: 92, 7: 100 };
  return table[Math.min(7, Math.max(2, Number(teamCount) || 2))] || 40;
}

function buildGameAuctionPool(sampleSize = 100) {
  const indianPlayers = shuffle(ALL_PLAYERS.filter((p) => !p.isOverseas));
  const overseasPlayers = shuffle(ALL_PLAYERS.filter((p) => p.isOverseas));

  const targetIndian = Math.min(indianPlayers.length, Math.round(sampleSize * 0.65));
  const targetOverseas = Math.min(overseasPlayers.length, sampleSize - targetIndian);

  const selected = [
    ...indianPlayers.slice(0, targetIndian),
    ...overseasPlayers.slice(0, targetOverseas)
  ].map((p) => ({
    ...p,
    stats: { ...p.stats },
    ratings: { ...p.ratings },
    scoutRefreshedAt: new Date().toISOString()
  }));

  const marquee = shuffle(selected.filter((p) => p.ratings.overall >= 90));
  const rest = shuffle(selected.filter((p) => p.ratings.overall < 90));

  const openers = marquee.slice(0, 3);
  const remaining = shuffle([...marquee.slice(3), ...rest]);
  return [...openers, ...remaining];
}

export {
  ALL_PLAYERS,
  buildGameAuctionPool,
  getLotSizeForTeamCount,
  computeBasePrice
};

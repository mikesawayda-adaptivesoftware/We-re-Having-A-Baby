import { NameInfo } from '../core/models/name-info.model';

export const NAME_INFO_DATA: NameInfo[] = [
  // ==================== BOY NAMES ====================
  
  // Classic Names
  { name: 'James', gender: 'boy', meaning: 'Supplanter', origin: 'Hebrew', popularity: 5, peakDecade: '1940s', syllables: 1, nicknames: ['Jim', 'Jimmy', 'Jamie'], famousPeople: ['James Dean', 'LeBron James', 'James Madison'], variants: ['Jacob', 'Jacques', 'Diego'] },
  { name: 'William', gender: 'boy', meaning: 'Resolute protector', origin: 'Germanic', popularity: 4, peakDecade: '1920s', syllables: 2, nicknames: ['Will', 'Bill', 'Billy', 'Liam'], famousPeople: ['William Shakespeare', 'Prince William', 'Will Smith'], variants: ['Wilhelm', 'Guillaume', 'Guillermo'] },
  { name: 'Benjamin', gender: 'boy', meaning: 'Son of the right hand', origin: 'Hebrew', popularity: 7, peakDecade: '2010s', syllables: 3, nicknames: ['Ben', 'Benny', 'Benji'], famousPeople: ['Benjamin Franklin', 'Ben Affleck', 'Benjamin Netanyahu'], variants: ['Binyamin', 'Benjamín'] },
  { name: 'Henry', gender: 'boy', meaning: 'Ruler of the home', origin: 'Germanic', popularity: 9, peakDecade: '1910s', syllables: 2, nicknames: ['Hank', 'Harry', 'Hal'], famousPeople: ['Henry Ford', 'Prince Harry', 'Henry Cavill'], variants: ['Henri', 'Enrique', 'Heinrich'] },
  { name: 'Alexander', gender: 'boy', meaning: 'Defender of the people', origin: 'Greek', popularity: 11, peakDecade: '2000s', syllables: 4, nicknames: ['Alex', 'Xander', 'Lex', 'Sasha'], famousPeople: ['Alexander the Great', 'Alexander Hamilton'], variants: ['Alessandro', 'Alejandro', 'Aleksandr'] },
  { name: 'Sebastian', gender: 'boy', meaning: 'Venerable, revered', origin: 'Greek', popularity: 18, peakDecade: '2010s', syllables: 4, nicknames: ['Seb', 'Bastian', 'Bash'], famousPeople: ['Sebastian Bach', 'Sebastian Stan'], variants: ['Sebastián', 'Sebastiano'] },
  { name: 'Theodore', gender: 'boy', meaning: 'Gift of God', origin: 'Greek', popularity: 23, peakDecade: '2020s', syllables: 3, nicknames: ['Theo', 'Ted', 'Teddy'], famousPeople: ['Theodore Roosevelt', 'Dr. Seuss (Theodor Geisel)'], variants: ['Theodoros', 'Teodoro', 'Fyodor'] },
  { name: 'Oliver', gender: 'boy', meaning: 'Olive tree', origin: 'Latin', popularity: 3, peakDecade: '2020s', syllables: 3, nicknames: ['Ollie', 'Oli'], famousPeople: ['Oliver Twist', 'Oliver Stone'], variants: ['Olivier', 'Oliviero'] },
  { name: 'Elijah', gender: 'boy', meaning: 'My God is Yahweh', origin: 'Hebrew', popularity: 6, peakDecade: '2020s', syllables: 3, nicknames: ['Eli', 'Lijah'], famousPeople: ['Elijah Wood', 'Elijah Muhammad'], variants: ['Elias', 'Ilya', 'Elia'] },
  { name: 'Lucas', gender: 'boy', meaning: 'Bringer of light', origin: 'Greek', popularity: 8, peakDecade: '2020s', syllables: 2, nicknames: ['Luke', 'Luca'], famousPeople: ['George Lucas', 'Lucas Hedges'], variants: ['Luke', 'Luca', 'Lukas'] },
  { name: 'Mason', gender: 'boy', meaning: 'Stone worker', origin: 'English', popularity: 12, peakDecade: '2010s', syllables: 2, nicknames: ['Mace', 'Mase'], famousPeople: ['Mason Mount', 'Mason Disick'], variants: [] },
  { name: 'Ethan', gender: 'boy', meaning: 'Strong, firm', origin: 'Hebrew', popularity: 13, peakDecade: '2000s', syllables: 2, nicknames: ['Eth'], famousPeople: ['Ethan Hawke', 'Ethan Allen'], variants: ['Eitan'] },
  { name: 'Liam', gender: 'boy', meaning: 'Strong-willed warrior', origin: 'Irish', popularity: 1, peakDecade: '2020s', syllables: 1, nicknames: [], famousPeople: ['Liam Neeson', 'Liam Hemsworth', 'Liam Gallagher'], variants: ['William', 'Uilliam'] },
  { name: 'Noah', gender: 'boy', meaning: 'Rest, comfort', origin: 'Hebrew', popularity: 2, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Noah Centineo', 'Noah Wyle'], variants: ['Noe', 'Noach'] },
  { name: 'Aiden', gender: 'boy', meaning: 'Little fire', origin: 'Irish', popularity: 24, peakDecade: '2010s', syllables: 2, nicknames: ['Aid'], famousPeople: ['Aidan Turner', 'Aidan Gallagher'], variants: ['Aidan', 'Ayden', 'Aden'] },
  { name: 'Jackson', gender: 'boy', meaning: 'Son of Jack', origin: 'English', popularity: 14, peakDecade: '2010s', syllables: 2, nicknames: ['Jack', 'Jax', 'Jackie'], famousPeople: ['Jackson Pollock', 'Michael Jackson'], variants: ['Jaxon', 'Jaxson'] },
  { name: 'Logan', gender: 'boy', meaning: 'Little hollow', origin: 'Scottish', popularity: 16, peakDecade: '2010s', syllables: 2, nicknames: [], famousPeople: ['Logan Paul', 'Wolverine/Logan'], variants: [] },
  { name: 'David', gender: 'boy', meaning: 'Beloved', origin: 'Hebrew', popularity: 27, peakDecade: '1960s', syllables: 2, nicknames: ['Dave', 'Davey', 'Davy'], famousPeople: ['David Bowie', 'David Beckham', 'Michelangelo\'s David'], variants: ['Davide', 'Dawid', 'Dávid'] },
  { name: 'Joseph', gender: 'boy', meaning: 'He will add', origin: 'Hebrew', popularity: 28, peakDecade: '1920s', syllables: 2, nicknames: ['Joe', 'Joey', 'Jos'], famousPeople: ['Joseph Stalin', 'Joe Biden', 'Joseph Gordon-Levitt'], variants: ['José', 'Giuseppe', 'Josef'] },
  { name: 'Samuel', gender: 'boy', meaning: 'Heard by God', origin: 'Hebrew', popularity: 21, peakDecade: '2000s', syllables: 3, nicknames: ['Sam', 'Sammy'], famousPeople: ['Samuel L. Jackson', 'Sam Smith'], variants: ['Shmuel', 'Samuele'] },
  { name: 'Daniel', gender: 'boy', meaning: 'God is my judge', origin: 'Hebrew', popularity: 15, peakDecade: '1990s', syllables: 2, nicknames: ['Dan', 'Danny'], famousPeople: ['Daniel Radcliffe', 'Daniel Craig', 'Daniel Day-Lewis'], variants: ['Daniele', 'Daniil'] },
  { name: 'Matthew', gender: 'boy', meaning: 'Gift of God', origin: 'Hebrew', popularity: 30, peakDecade: '1990s', syllables: 2, nicknames: ['Matt', 'Matty'], famousPeople: ['Matthew McConaughey', 'Matt Damon'], variants: ['Mateo', 'Matteo', 'Matthieu'] },
  { name: 'Michael', gender: 'boy', meaning: 'Who is like God?', origin: 'Hebrew', popularity: 17, peakDecade: '1980s', syllables: 2, nicknames: ['Mike', 'Mikey', 'Mick'], famousPeople: ['Michael Jordan', 'Michael Jackson', 'Michael Phelps'], variants: ['Miguel', 'Michel', 'Mikhail'] },
  { name: 'Christopher', gender: 'boy', meaning: 'Bearer of Christ', origin: 'Greek', popularity: 47, peakDecade: '1980s', syllables: 3, nicknames: ['Chris', 'Topher', 'Kit'], famousPeople: ['Christopher Columbus', 'Chris Hemsworth', 'Christopher Nolan'], variants: ['Cristopher', 'Christoph', 'Cristóbal'] },
  { name: 'Andrew', gender: 'boy', meaning: 'Manly, brave', origin: 'Greek', popularity: 52, peakDecade: '1990s', syllables: 2, nicknames: ['Andy', 'Drew'], famousPeople: ['Andrew Lincoln', 'Prince Andrew', 'Andrew Garfield'], variants: ['Andrés', 'Andrea', 'Andrei'] },
  
  // Modern Popular Names
  { name: 'Levi', gender: 'boy', meaning: 'Joined, attached', origin: 'Hebrew', popularity: 10, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Levi Strauss', 'Levi Ackerman'], variants: [] },
  { name: 'Carter', gender: 'boy', meaning: 'Cart driver', origin: 'English', popularity: 35, peakDecade: '2010s', syllables: 2, nicknames: [], famousPeople: ['Jimmy Carter', 'Carter Reynolds'], variants: [] },
  { name: 'Owen', gender: 'boy', meaning: 'Young warrior', origin: 'Welsh', popularity: 22, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Owen Wilson', 'Clive Owen'], variants: ['Owain', 'Eoghan'] },
  { name: 'Wyatt', gender: 'boy', meaning: 'Brave in war', origin: 'English', popularity: 26, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Wyatt Earp'], variants: [] },
  { name: 'Jack', gender: 'boy', meaning: 'God is gracious', origin: 'English', popularity: 20, peakDecade: '2000s', syllables: 1, nicknames: ['Jackie'], famousPeople: ['Jack Nicholson', 'Jack Black', 'Captain Jack Sparrow'], variants: ['Jacques', 'Giacomo', 'Jock'] },
  { name: 'Luke', gender: 'boy', meaning: 'Light-giving', origin: 'Greek', popularity: 31, peakDecade: '2000s', syllables: 1, nicknames: [], famousPeople: ['Luke Skywalker', 'Luke Bryan', 'Luke Perry'], variants: ['Lucas', 'Luca', 'Lukas'] },
  { name: 'Grayson', gender: 'boy', meaning: 'Son of the steward', origin: 'English', popularity: 32, peakDecade: '2020s', syllables: 2, nicknames: ['Gray'], famousPeople: ['Grayson Allen'], variants: ['Greyson'] },
  { name: 'Leo', gender: 'boy', meaning: 'Lion', origin: 'Latin', popularity: 19, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Leonardo DiCaprio', 'Leo Tolstoy'], variants: ['Leon', 'Leonardo', 'Leopold'] },
  { name: 'Ezra', gender: 'boy', meaning: 'Helper', origin: 'Hebrew', popularity: 33, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Ezra Miller', 'Ezra Pound'], variants: [] },
  { name: 'Asher', gender: 'boy', meaning: 'Happy, blessed', origin: 'Hebrew', popularity: 25, peakDecade: '2020s', syllables: 2, nicknames: ['Ash'], famousPeople: ['Asher Angel'], variants: [] },
  { name: 'Maverick', gender: 'boy', meaning: 'Independent, nonconformist', origin: 'American', popularity: 36, peakDecade: '2020s', syllables: 3, nicknames: ['Mav'], famousPeople: ['Maverick (Top Gun)'], variants: [] },
  { name: 'Hudson', gender: 'boy', meaning: 'Hugh\'s son', origin: 'English', popularity: 40, peakDecade: '2020s', syllables: 2, nicknames: ['Hud'], famousPeople: ['Hudson River', 'Kate Hudson\'s son'], variants: [] },
  { name: 'Miles', gender: 'boy', meaning: 'Soldier, merciful', origin: 'Latin', popularity: 41, peakDecade: '2020s', syllables: 1, nicknames: [], famousPeople: ['Miles Davis', 'Miles Morales'], variants: ['Milo', 'Myles'] },
  { name: 'Finn', gender: 'boy', meaning: 'Fair, white', origin: 'Irish', popularity: 45, peakDecade: '2020s', syllables: 1, nicknames: [], famousPeople: ['Finn Wolfhard', 'Huckleberry Finn'], variants: ['Fionn', 'Finnegan'] },
  
  // Trendy & Unique Names
  { name: 'Atlas', gender: 'boy', meaning: 'Bearer of the heavens', origin: 'Greek', popularity: 100, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Atlas (Greek Titan)'], variants: [] },
  { name: 'Kai', gender: 'boy', meaning: 'Sea, ocean', origin: 'Hawaiian', popularity: 71, peakDecade: '2020s', syllables: 1, nicknames: [], famousPeople: ['Kai Greene'], variants: [] },
  { name: 'Phoenix', gender: 'boy', meaning: 'Dark red, mythical bird', origin: 'Greek', popularity: 95, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Joaquin Phoenix', 'River Phoenix'], variants: [] },
  { name: 'Jasper', gender: 'boy', meaning: 'Treasurer', origin: 'Persian', popularity: 85, peakDecade: '2020s', syllables: 2, nicknames: ['Jas'], famousPeople: ['Jasper Johns'], variants: ['Casper', 'Kasper'] },
  { name: 'Felix', gender: 'boy', meaning: 'Lucky, successful', origin: 'Latin', popularity: 68, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Felix the Cat', 'Felix Baumgartner'], variants: ['Felice', 'Félix'] },
  { name: 'Milo', gender: 'boy', meaning: 'Soldier, merciful', origin: 'Germanic', popularity: 65, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Milo Ventimiglia'], variants: ['Miles'] },
  { name: 'Oscar', gender: 'boy', meaning: 'God spear, deer-lover', origin: 'Irish', popularity: 54, peakDecade: '2020s', syllables: 2, nicknames: ['Ozzy'], famousPeople: ['Oscar Wilde', 'Oscar Isaac'], variants: ['Óscar'] },
  { name: 'Silas', gender: 'boy', meaning: 'Wood, forest', origin: 'Latin', popularity: 60, peakDecade: '2020s', syllables: 2, nicknames: ['Si'], famousPeople: ['Silas Marner'], variants: ['Silvanus'] },
  { name: 'Archer', gender: 'boy', meaning: 'Bowman', origin: 'English', popularity: 90, peakDecade: '2020s', syllables: 2, nicknames: ['Archie'], famousPeople: ['Sterling Archer'], variants: [] },
  { name: 'August', gender: 'boy', meaning: 'Great, magnificent', origin: 'Latin', popularity: 75, peakDecade: '2020s', syllables: 2, nicknames: ['Gus', 'Auggie'], famousPeople: ['August Wilson'], variants: ['Augustus', 'Augusto'] },
  
  // ==================== GIRL NAMES ====================
  
  // Classic Names
  { name: 'Emma', gender: 'girl', meaning: 'Whole, universal', origin: 'Germanic', popularity: 2, peakDecade: '2000s', syllables: 2, nicknames: ['Em', 'Emmy'], famousPeople: ['Emma Watson', 'Emma Stone', 'Emma Thompson'], variants: ['Ema'] },
  { name: 'Olivia', gender: 'girl', meaning: 'Olive tree', origin: 'Latin', popularity: 1, peakDecade: '2020s', syllables: 4, nicknames: ['Liv', 'Livvy', 'Ollie'], famousPeople: ['Olivia Wilde', 'Olivia Newton-John', 'Olivia Rodrigo'], variants: ['Olive', 'Alivia'] },
  { name: 'Charlotte', gender: 'girl', meaning: 'Free woman', origin: 'French', popularity: 3, peakDecade: '2020s', syllables: 2, nicknames: ['Charlie', 'Lottie', 'Char'], famousPeople: ['Princess Charlotte', 'Charlotte Brontë'], variants: ['Carlotta', 'Charlotta'] },
  { name: 'Amelia', gender: 'girl', meaning: 'Industrious, striving', origin: 'Germanic', popularity: 4, peakDecade: '2020s', syllables: 4, nicknames: ['Amy', 'Mia', 'Millie'], famousPeople: ['Amelia Earhart'], variants: ['Amalia', 'Emilia'] },
  { name: 'Sophia', gender: 'girl', meaning: 'Wisdom', origin: 'Greek', popularity: 6, peakDecade: '2010s', syllables: 3, nicknames: ['Sophie', 'Soph'], famousPeople: ['Sophia Loren', 'Sofia Vergara'], variants: ['Sofia', 'Sophie'] },
  { name: 'Isabella', gender: 'girl', meaning: 'Devoted to God', origin: 'Hebrew/Spanish', popularity: 7, peakDecade: '2010s', syllables: 4, nicknames: ['Bella', 'Izzy', 'Isa'], famousPeople: ['Queen Isabella', 'Isabella Rossellini'], variants: ['Isabel', 'Isabelle', 'Isobel'] },
  { name: 'Ava', gender: 'girl', meaning: 'Life, living one', origin: 'Latin', popularity: 5, peakDecade: '2010s', syllables: 2, nicknames: [], famousPeople: ['Ava Gardner', 'Ava DuVernay'], variants: ['Eva', 'Avis'] },
  { name: 'Mia', gender: 'girl', meaning: 'Mine, beloved', origin: 'Scandinavian', popularity: 8, peakDecade: '2010s', syllables: 2, nicknames: [], famousPeople: ['Mia Farrow', 'Mia Hamm', 'Mia Khalifa'], variants: ['Maria'] },
  { name: 'Evelyn', gender: 'girl', meaning: 'Wished for child', origin: 'English', popularity: 9, peakDecade: '2020s', syllables: 3, nicknames: ['Evie', 'Eve', 'Lyn'], famousPeople: ['Evelyn Waugh'], variants: ['Evelina', 'Eveline'] },
  { name: 'Luna', gender: 'girl', meaning: 'Moon', origin: 'Latin', popularity: 10, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Luna Lovegood'], variants: [] },
  { name: 'Harper', gender: 'girl', meaning: 'Harp player', origin: 'English', popularity: 11, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Harper Lee'], variants: [] },
  { name: 'Camila', gender: 'girl', meaning: 'Young ceremonial attendant', origin: 'Latin', popularity: 12, peakDecade: '2020s', syllables: 3, nicknames: ['Cami', 'Mila'], famousPeople: ['Camila Cabello'], variants: ['Camilla', 'Kamila'] },
  { name: 'Sofia', gender: 'girl', meaning: 'Wisdom', origin: 'Greek', popularity: 13, peakDecade: '2010s', syllables: 3, nicknames: ['Sof', 'Sofi'], famousPeople: ['Sofia Coppola'], variants: ['Sophia', 'Sophie'] },
  { name: 'Scarlett', gender: 'girl', meaning: 'Red, scarlet', origin: 'English', popularity: 14, peakDecade: '2020s', syllables: 2, nicknames: ['Scar'], famousPeople: ['Scarlett Johansson', 'Scarlett O\'Hara'], variants: ['Scarlet'] },
  { name: 'Elizabeth', gender: 'girl', meaning: 'Pledged to God', origin: 'Hebrew', popularity: 15, peakDecade: '1990s', syllables: 4, nicknames: ['Liz', 'Beth', 'Lizzy', 'Eliza', 'Betty'], famousPeople: ['Queen Elizabeth II', 'Elizabeth Taylor'], variants: ['Elisabeth', 'Elspeth'] },
  { name: 'Emily', gender: 'girl', meaning: 'Rival, industrious', origin: 'Latin', popularity: 16, peakDecade: '2000s', syllables: 3, nicknames: ['Em', 'Emmy', 'Millie'], famousPeople: ['Emily Dickinson', 'Emily Blunt'], variants: ['Emilie', 'Emilia'] },
  { name: 'Eleanor', gender: 'girl', meaning: 'Bright, shining one', origin: 'Greek', popularity: 17, peakDecade: '2020s', syllables: 3, nicknames: ['Ellie', 'Nora', 'Nell', 'Lena'], famousPeople: ['Eleanor Roosevelt'], variants: ['Elinor', 'Eleanora'] },
  { name: 'Chloe', gender: 'girl', meaning: 'Blooming, fertility', origin: 'Greek', popularity: 18, peakDecade: '2010s', syllables: 2, nicknames: [], famousPeople: ['Chloë Grace Moretz', 'Chloe Kardashian'], variants: ['Chloé', 'Cloe'] },
  { name: 'Penelope', gender: 'girl', meaning: 'Weaver', origin: 'Greek', popularity: 19, peakDecade: '2020s', syllables: 4, nicknames: ['Penny', 'Nell', 'Poppy'], famousPeople: ['Penélope Cruz', 'Penelope (Odyssey)'], variants: ['Penelopé'] },
  { name: 'Layla', gender: 'girl', meaning: 'Night, dark beauty', origin: 'Arabic', popularity: 20, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Eric Clapton\'s "Layla"'], variants: ['Leila', 'Leyla', 'Lila'] },
  
  // Modern Popular Names
  { name: 'Riley', gender: 'girl', meaning: 'Courageous', origin: 'Irish', popularity: 21, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Riley Keough'], variants: ['Rylee', 'Ryleigh'] },
  { name: 'Zoey', gender: 'girl', meaning: 'Life', origin: 'Greek', popularity: 22, peakDecade: '2010s', syllables: 2, nicknames: [], famousPeople: ['Zoey Deschanel', 'Zoey Deutch'], variants: ['Zoe', 'Zoie'] },
  { name: 'Nora', gender: 'girl', meaning: 'Honor, light', origin: 'Irish', popularity: 23, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Nora Ephron', 'Nora Jones'], variants: ['Norah', 'Honora'] },
  { name: 'Lily', gender: 'girl', meaning: 'Lily flower, purity', origin: 'English', popularity: 24, peakDecade: '2010s', syllables: 2, nicknames: [], famousPeople: ['Lily Collins', 'Lily James', 'Lily Allen'], variants: ['Lilly', 'Lillie', 'Lillian'] },
  { name: 'Hazel', gender: 'girl', meaning: 'Hazel tree', origin: 'English', popularity: 25, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Hazel Grace (TFIOS)'], variants: [] },
  { name: 'Violet', gender: 'girl', meaning: 'Purple flower', origin: 'Latin', popularity: 26, peakDecade: '2020s', syllables: 3, nicknames: ['Vi'], famousPeople: ['Violet Affleck'], variants: ['Violetta', 'Viola'] },
  { name: 'Aurora', gender: 'girl', meaning: 'Dawn', origin: 'Latin', popularity: 27, peakDecade: '2020s', syllables: 4, nicknames: ['Rory', 'Aura'], famousPeople: ['Sleeping Beauty/Aurora'], variants: [] },
  { name: 'Savannah', gender: 'girl', meaning: 'Treeless plain', origin: 'Spanish', popularity: 28, peakDecade: '2010s', syllables: 3, nicknames: ['Sav', 'Vanna'], famousPeople: ['Savannah Guthrie'], variants: ['Savanna'] },
  { name: 'Audrey', gender: 'girl', meaning: 'Noble strength', origin: 'English', popularity: 29, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Audrey Hepburn', 'Audrey Tautou'], variants: ['Audra'] },
  { name: 'Brooklyn', gender: 'girl', meaning: 'Stream, water', origin: 'English', popularity: 30, peakDecade: '2010s', syllables: 2, nicknames: ['Brook', 'Brookie'], famousPeople: ['Brooklyn Beckham'], variants: ['Brooklynn'] },
  { name: 'Bella', gender: 'girl', meaning: 'Beautiful', origin: 'Italian', popularity: 31, peakDecade: '2010s', syllables: 2, nicknames: [], famousPeople: ['Bella Hadid', 'Bella Swan'], variants: ['Belle'] },
  { name: 'Claire', gender: 'girl', meaning: 'Clear, bright', origin: 'French', popularity: 32, peakDecade: '2020s', syllables: 1, nicknames: [], famousPeople: ['Claire Danes', 'Claire Foy'], variants: ['Clare', 'Clara', 'Chiara'] },
  { name: 'Skylar', gender: 'girl', meaning: 'Scholar', origin: 'Dutch', popularity: 33, peakDecade: '2010s', syllables: 2, nicknames: ['Sky'], famousPeople: ['Skylar Grey'], variants: ['Skyler', 'Schuyler'] },
  { name: 'Lucy', gender: 'girl', meaning: 'Light', origin: 'Latin', popularity: 34, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Lucy Liu', 'Lucille Ball'], variants: ['Lucia', 'Lucille', 'Lucie'] },
  { name: 'Paisley', gender: 'girl', meaning: 'Church, cemetery', origin: 'Scottish', popularity: 35, peakDecade: '2010s', syllables: 2, nicknames: [], famousPeople: ['Paisley Park'], variants: [] },
  
  // Trendy & Unique Names
  { name: 'Willow', gender: 'girl', meaning: 'Willow tree', origin: 'English', popularity: 36, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Willow Smith', 'Willow (Buffy)'], variants: [] },
  { name: 'Ivy', gender: 'girl', meaning: 'Ivy plant, fidelity', origin: 'English', popularity: 37, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Blue Ivy Carter'], variants: [] },
  { name: 'Emilia', gender: 'girl', meaning: 'Rival, industrious', origin: 'Latin', popularity: 38, peakDecade: '2020s', syllables: 4, nicknames: ['Millie', 'Em', 'Mia'], famousPeople: ['Emilia Clarke'], variants: ['Amelia', 'Emily'] },
  { name: 'Autumn', gender: 'girl', meaning: 'Fall season', origin: 'Latin', popularity: 39, peakDecade: '2010s', syllables: 2, nicknames: [], famousPeople: [], variants: [] },
  { name: 'Jade', gender: 'girl', meaning: 'Precious stone', origin: 'Spanish', popularity: 40, peakDecade: '2000s', syllables: 1, nicknames: [], famousPeople: ['Jade Thirlwall'], variants: ['Jada', 'Giada'] },
  { name: 'Iris', gender: 'girl', meaning: 'Rainbow', origin: 'Greek', popularity: 41, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Iris Apfel', 'Iris (Greek goddess)'], variants: [] },
  { name: 'Eloise', gender: 'girl', meaning: 'Healthy, wide', origin: 'French', popularity: 42, peakDecade: '2020s', syllables: 3, nicknames: ['Ellie', 'Lo', 'Lola'], famousPeople: ['Eloise at the Plaza'], variants: ['Eloisa', 'Heloise'] },
  { name: 'Athena', gender: 'girl', meaning: 'Goddess of wisdom', origin: 'Greek', popularity: 43, peakDecade: '2020s', syllables: 3, nicknames: [], famousPeople: ['Athena (Greek goddess)'], variants: [] },
  { name: 'Cora', gender: 'girl', meaning: 'Maiden', origin: 'Greek', popularity: 44, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Lady Cora (Downton Abbey)'], variants: ['Kora', 'Coralie'] },
  { name: 'Freya', gender: 'girl', meaning: 'Noble woman', origin: 'Norse', popularity: 45, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Freya (Norse goddess)'], variants: ['Freyja', 'Freja'] },
  { name: 'Nova', gender: 'girl', meaning: 'New, star', origin: 'Latin', popularity: 46, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: [], variants: [] },
  { name: 'Isla', gender: 'girl', meaning: 'Island', origin: 'Scottish', popularity: 47, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Isla Fisher'], variants: [] },
  { name: 'Eliza', gender: 'girl', meaning: 'Pledged to God', origin: 'Hebrew', popularity: 48, peakDecade: '2020s', syllables: 3, nicknames: ['Liza', 'Ellie'], famousPeople: ['Eliza Hamilton', 'Eliza Doolittle'], variants: ['Elizabeth', 'Elise'] },
  { name: 'Rose', gender: 'girl', meaning: 'Rose flower', origin: 'Latin', popularity: 49, peakDecade: '2020s', syllables: 1, nicknames: ['Rosie'], famousPeople: ['Rose McGowan', 'Rose (Titanic)'], variants: ['Rosa', 'Rosalie', 'Rosemary'] },
  { name: 'Stella', gender: 'girl', meaning: 'Star', origin: 'Latin', popularity: 50, peakDecade: '2020s', syllables: 2, nicknames: [], famousPeople: ['Stella McCartney'], variants: ['Estella', 'Estelle'] },
];

// Create a map for quick lookup
export const NAME_INFO_MAP = new Map<string, NameInfo>(
  NAME_INFO_DATA.map(info => [info.name.toLowerCase(), info])
);


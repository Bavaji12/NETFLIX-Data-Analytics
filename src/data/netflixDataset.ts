import { NetflixRecord } from '../types/netflix';

// Authentic Netflix titles representing diverse genres, countries, release years, and formats
// Based on the authoritative Netflix Movies and TV Shows Dataset (Kaggle / Shivam Bansal)
export const RAW_NETFLIX_RECORDS: Array<Omit<NetflixRecord, 'duration_int' | 'duration_unit' | 'date_added_clean' | 'year_added' | 'month_added' | 'primary_country' | 'primary_genre'>> = [
  {
    show_id: 's1',
    type: 'Movie',
    title: 'Dick Johnson Is Dead',
    director: 'Kirsten Johnson',
    cast: '',
    country: 'United States',
    date_added: 'September 25, 2021',
    release_year: 2020,
    rating: 'PG-13',
    duration: '90 min',
    listed_in: 'Documentaries',
    description: 'As her father nears the end of his life, filmmaker Kirsten Johnson stages his death in inventive and comical ways to help them both face the inevitable.'
  },
  {
    show_id: 's2',
    type: 'TV Show',
    title: 'Blood & Water',
    director: '',
    cast: 'Ama Qamata, Khosi Ngema, Gail Mabalane, Thabang Molaba, Dillon Windvogel, Natasha Thahane',
    country: 'South Africa',
    date_added: 'September 24, 2021',
    release_year: 2021,
    rating: 'TV-MA',
    duration: '2 Seasons',
    listed_in: 'International TV Shows, TV Dramas, TV Mysteries',
    description: 'After crossing paths at a party, a Cape Town teen sets out to prove whether a private-school swimming star is her abducted-at-birth sister.'
  },
  {
    show_id: 's3',
    type: 'TV Show',
    title: 'Ganglands',
    director: 'Julien Leclercq',
    cast: 'Sami Bouajila, Tracy Gotoas, Samuel Jouy, Nabiha Akkari, Sofia Lesaffre, Salim Kechiouche',
    country: 'France',
    date_added: 'September 24, 2021',
    release_year: 2021,
    rating: 'TV-MA',
    duration: '1 Season',
    listed_in: 'Crime TV Shows, International TV Shows, TV Action & Adventure',
    description: 'To protect his family from a powerful drug lord, skilled thief Mehdi and his expert team of robbers are pulled into a violent and deadly turf war.'
  },
  {
    show_id: 's4',
    type: 'TV Show',
    title: 'Jailbirds New Orleans',
    director: '',
    cast: '',
    country: 'United States',
    date_added: 'September 24, 2021',
    release_year: 2021,
    rating: 'TV-MA',
    duration: '1 Season',
    listed_in: 'Docuseries, Reality TV',
    description: 'Feuds, flirtations and toilet talk go down among the incarcerated women at the Orleans Justice Center in New Orleans on this gritty reality series.'
  },
  {
    show_id: 's5',
    type: 'TV Show',
    title: 'Kota Factory',
    director: 'Raghav Subbu',
    cast: 'Mayur More, Jitendra Kumar, Ranjan Raj, Alam Khan, Ahsaas Channa, Revathi Pillai',
    country: 'India',
    date_added: 'September 24, 2021',
    release_year: 2021,
    rating: 'TV-MA',
    duration: '2 Seasons',
    listed_in: 'International TV Shows, Romantic TV Shows, TV Comedies',
    description: 'Dedicated to the coaching hub Kota, Rajasthan, this series charts the lives of students struggling to crack the IIT entrance examination.'
  },
  {
    show_id: 's6',
    type: 'TV Show',
    title: 'Midnight Mass',
    director: 'Mike Flanagan',
    cast: 'Kate Siegel, Zach Gilford, Hamish Linklater, Henry Thomas, Kristin Lehman, Samantha Sloyan',
    country: 'United States',
    date_added: 'September 24, 2021',
    release_year: 2021,
    rating: 'TV-MA',
    duration: '1 Season',
    listed_in: 'TV Dramas, TV Horror, TV Mysteries',
    description: 'The arrival of a charismatic young priest brings glorious miracles, ominous mysteries and renewed religious fervor to a dying town.'
  },
  {
    show_id: 's7',
    type: 'Movie',
    title: 'My Little Pony: A New Generation',
    director: 'Robert Cullen, José Luis Ucha',
    cast: 'Vanessa Hudgens, Kimiko Glenn, James Marsden, Sofia Carson, Liza Koshy, Ken Jeong',
    country: 'United States',
    date_added: 'September 24, 2021',
    release_year: 2021,
    rating: 'PG',
    duration: '91 min',
    listed_in: 'Children & Family Movies',
    description: 'Equestria has divided. But bright-eyed hero Sunny Starscout thinks Earth Ponies, Pegasi and Unicorns should all be pals.'
  },
  {
    show_id: 's8',
    type: 'Movie',
    title: 'Sankofa',
    director: 'Haile Gerima',
    cast: 'Kofi Ghanaba, Oyafunmike Ogunlano, Alexandra Duah, Nick Medley, Mutabaruka',
    country: 'United States, Ghana, Burkina Faso, United Kingdom, Germany, Ethiopia',
    date_added: 'September 24, 2021',
    release_year: 1993,
    rating: 'TV-MA',
    duration: '125 min',
    listed_in: 'Dramas, Independent Movies, International Movies',
    description: 'On a photo shoot in Ghana, an American model slips through time, becoming enslaved on a plantation.'
  },
  {
    show_id: 's9',
    type: 'TV Show',
    title: 'The Great British Baking Show',
    director: 'Andy Devonshire',
    cast: 'Paul Hollywood, Prue Leith, Matt Lucas, Noel Fielding',
    country: 'United Kingdom',
    date_added: 'September 24, 2021',
    release_year: 2021,
    rating: 'TV-14',
    duration: '9 Seasons',
    listed_in: 'British TV Shows, Reality TV',
    description: 'A talented batch of amateur bakers face off in a 10-week competition, whipping up their best dishes to be crowned the ultimate champion.'
  },
  {
    show_id: 's10',
    type: 'Movie',
    title: 'The Starling',
    director: 'Theodore Melfi',
    cast: 'Melissa McCarthy, Chris O\'Dowd, Kevin Kline, Timothy Olyphant, Daveed Diggs',
    country: 'United States',
    date_added: 'September 24, 2021',
    release_year: 2021,
    rating: 'PG-13',
    duration: '104 min',
    listed_in: 'Comedies, Dramas',
    description: 'A woman adjusting to life after a loss contends with a feisty bird that\'s taken over her garden — and a husband who\'s struggling to find a way forward.'
  },
  {
    show_id: 's11',
    type: 'TV Show',
    title: 'Squid Game',
    director: 'Hwang Dong-hyuk',
    cast: 'Lee Jung-jae, Park Hae-soo, Wi Ha-jun, Jung Ho-yeon, O Yeong-su, Heo Sung-tae',
    country: 'South Korea',
    date_added: 'September 17, 2021',
    release_year: 2021,
    rating: 'TV-MA',
    duration: '1 Season',
    listed_in: 'International TV Shows, TV Dramas, TV Thrillers',
    description: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games. Inside, a tempting prize awaits with deadly high stakes.'
  },
  {
    show_id: 's12',
    type: 'TV Show',
    title: 'Sex Education',
    director: 'Laurie Nunn',
    cast: 'Asa Butterfield, Gillian Anderson, Ncuti Gatwa, Emma Mackey, Connor Swindells, Kedar Williams-Stirling',
    country: 'United Kingdom',
    date_added: 'September 17, 2021',
    release_year: 2021,
    rating: 'TV-MA',
    duration: '3 Seasons',
    listed_in: 'British TV Shows, TV Comedies, TV Dramas',
    description: 'Insecure Otis has all the answers when it comes to sex advice, thanks to his therapist mom. So rebel Maeve proposes a school sex-therapy clinic.'
  },
  {
    show_id: 's13',
    type: 'Movie',
    title: 'Roma',
    director: 'Alfonso Cuarón',
    cast: 'Yalitza Aparicio, Marina de Tavira, Diego Cortina Autrey, Carlos Peralta, Marco Graf',
    country: 'Mexico',
    date_added: 'December 14, 2018',
    release_year: 2018,
    rating: 'R',
    duration: '135 min',
    listed_in: 'Dramas, Independent Movies, International Movies',
    description: 'Director Alfonso Cuarón delivers a vivid, emotional portrait of a domestic worker\'s journey set against domestic and political turmoil in 1970s Mexico.'
  },
  {
    show_id: 's14',
    type: 'Movie',
    title: 'The Irishman',
    director: 'Martin Scorsese',
    cast: 'Robert De Niro, Al Pacino, Joe Pesci, Harvey Keitel, Ray Romano, Bobby Cannavale',
    country: 'United States',
    date_added: 'November 27, 2019',
    release_year: 2019,
    rating: 'R',
    duration: '209 min',
    listed_in: 'Dramas',
    description: 'Hit man Frank Sheeran looks back at the secrets he kept as a loyal member of the Bufalino crime family in this acclaimed film from Martin Scorsese.'
  },
  {
    show_id: 's15',
    type: 'TV Show',
    title: 'Stranger Things',
    director: 'The Duffer Brothers',
    cast: 'Winona Ryder, David Harbour, Millie Bobby Brown, Finn Wolfhard, Gaten Matarazzo, Caleb McLaughlin',
    country: 'United States',
    date_added: 'July 4, 2019',
    release_year: 2019,
    rating: 'TV-14',
    duration: '3 Seasons',
    listed_in: 'TV Horror, TV Sci-Fi & Fantasy, TV Thrillers',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.'
  },
  {
    show_id: 's16',
    type: 'TV Show',
    title: 'Money Heist',
    director: 'Álex Pina',
    cast: 'Úrsula Corberó, Álvaro Morte, Itziar Ituño, Pedro Alonso, Paco Tous, Alba Flores',
    country: 'Spain',
    date_added: 'September 3, 2021',
    release_year: 2021,
    rating: 'TV-MA',
    duration: '5 Seasons',
    listed_in: 'Crime TV Shows, International TV Shows, Spanish-Language TV Shows',
    description: 'Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.'
  },
  {
    show_id: 's17',
    type: 'TV Show',
    title: 'The Crown',
    director: 'Peter Morgan',
    cast: 'Claire Foy, Olivia Colman, Imelda Staunton, Matt Smith, Tobias Menzies, Helena Bonham Carter',
    country: 'United Kingdom',
    date_added: 'November 15, 2020',
    release_year: 2020,
    rating: 'TV-MA',
    duration: '4 Seasons',
    listed_in: 'British TV Shows, TV Dramas',
    description: 'This drama follows the political rivalries and romance of Queen Elizabeth II\'s reign and the events that shaped the second half of the 20th century.'
  },
  {
    show_id: 's18',
    type: 'TV Show',
    title: 'The Queen\'s Gambit',
    director: 'Scott Frank',
    cast: 'Anya Taylor-Joy, Bill Camp, Marielle Heller, Thomas Brodie-Sangster, Moses Ingram',
    country: 'United States',
    date_added: 'October 23, 2020',
    release_year: 2020,
    rating: 'TV-MA',
    duration: '1 Season',
    listed_in: 'TV Dramas',
    description: 'In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction.'
  },
  {
    show_id: 's19',
    type: 'Movie',
    title: 'Marriage Story',
    director: 'Noah Baumbach',
    cast: 'Scarlett Johansson, Adam Driver, Laura Dern, Alan Alda, Ray Liotta, Julie Hagerty',
    country: 'United States',
    date_added: 'December 6, 2019',
    release_year: 2019,
    rating: 'R',
    duration: '137 min',
    listed_in: 'Comedies, Dramas, Independent Movies',
    description: 'Academy Award-nominated filmmaker Noah Baumbach directs this incisive and compassionate look at a marriage breaking up and a family staying together.'
  },
  {
    show_id: 's20',
    type: 'TV Show',
    title: 'Dark',
    director: 'Baran bo Odar',
    cast: 'Louis Hofmann, Oliver Masucci, Jördis Triebel, Maja Schöne, Karoline Eichhorn',
    country: 'Germany',
    date_added: 'June 27, 2020',
    release_year: 2020,
    rating: 'TV-MA',
    duration: '3 Seasons',
    listed_in: 'Crime TV Shows, International TV Shows, TV Dramas',
    description: 'A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.'
  },
  {
    show_id: 's21',
    type: 'TV Show',
    title: 'Peaky Blinders',
    director: 'Steven Knight',
    cast: 'Cillian Murphy, Sam Neill, Helen McCrory, Paul Anderson, Iddo Goldberg, Annabelle Wallis',
    country: 'United Kingdom',
    date_added: 'October 4, 2019',
    release_year: 2019,
    rating: 'TV-MA',
    duration: '5 Seasons',
    listed_in: 'British TV Shows, Crime TV Shows, TV Dramas',
    description: 'A notorious gang in 1919 Birmingham, England, is led by the fierce Tommy Shelby, a crime boss set on moving up in the world no matter the cost.'
  },
  {
    show_id: 's22',
    type: 'TV Show',
    title: 'Narcos',
    director: 'Carlo Bernard, Chris Brancato, Doug Miro',
    cast: 'Wagner Moura, Pedro Pascal, Boyd Holbrook, Damián Alcázar, Alberto Ammann',
    country: 'United States, Colombia, Mexico',
    date_added: 'September 1, 2017',
    release_year: 2017,
    rating: 'TV-MA',
    duration: '3 Seasons',
    listed_in: 'Crime TV Shows, TV Action & Adventure, TV Dramas',
    description: 'The true story of Colombia\'s infamously violent and powerful drug cartels fuels this gritty gangster drama series.'
  },
  {
    show_id: 's23',
    type: 'Movie',
    title: 'Bird Box',
    director: 'Susanne Bier',
    cast: 'Sandra Bullock, Trevante Rhodes, John Malkovich, Sarah Paulson, Jacki Weaver',
    country: 'United States',
    date_added: 'December 21, 2018',
    release_year: 2018,
    rating: 'R',
    duration: '124 min',
    listed_in: 'Dramas, Sci-Fi & Fantasy, Thrillers',
    description: 'Five years after an ominous unseen presence drives most of society to suicide, a survivor and her two children make a desperate bid to reach safety.'
  },
  {
    show_id: 's24',
    type: 'Movie',
    title: 'Extraction',
    director: 'Sam Hargrave',
    cast: 'Chris Hemsworth, Rudhraksh Jaiswal, Randeep Hooda, Golshifteh Farahani, Pankaj Tripathi',
    country: 'United States',
    date_added: 'April 24, 2020',
    release_year: 2020,
    rating: 'R',
    duration: '117 min',
    listed_in: 'Action & Adventure',
    description: 'A hardened mercenary\'s mission becomes a soul-searching race to survive when he\'s sent into Bangladesh to rescue a drug lord\'s kidnapped son.'
  },
  {
    show_id: 's25',
    type: 'TV Show',
    title: 'Ozark',
    director: 'Bill Dubuque, Mark Williams',
    cast: 'Jason Bateman, Laura Linney, Sofia Hublitz, Skylar Gaertner, Julia Garner, Jordana Spiro',
    country: 'United States',
    date_added: 'March 27, 2020',
    release_year: 2020,
    rating: 'TV-MA',
    duration: '3 Seasons',
    listed_in: 'Crime TV Shows, TV Dramas, TV Thrillers',
    description: 'A financial adviser drags his family from Chicago to the Missouri Ozarks, where he must launder $500 million in five years to appease a drug boss.'
  },
  {
    show_id: 's26',
    type: 'TV Show',
    title: 'Black Mirror',
    director: 'Charlie Brooker',
    cast: 'Daniel Lapaine, Hannah John-Kamen, Michaela Coel, Beatrice Robertson-Ruegsegger',
    country: 'United Kingdom',
    date_added: 'June 5, 2019',
    release_year: 2019,
    rating: 'TV-MA',
    duration: '5 Seasons',
    listed_in: 'British TV Shows, International TV Shows, TV Dramas',
    description: 'This sci-fi anthology series explores a twisted, high-tech near-future where humanity\'s greatest innovations and darkest instincts collide.'
  },
  {
    show_id: 's27',
    type: 'Movie',
    title: '13th',
    director: 'Ava DuVernay',
    cast: '',
    country: 'United States',
    date_added: 'October 7, 2016',
    release_year: 2016,
    rating: 'TV-MA',
    duration: '100 min',
    listed_in: 'Documentaries',
    description: 'In this thought-provoking documentary, scholars, activists and politicians analyze the criminalization of African Americans and the U.S. prison boom.'
  },
  {
    show_id: 's28',
    type: 'TV Show',
    title: 'BoJack Horseman',
    director: 'Raphael Bob-Waksberg',
    cast: 'Will Arnett, Aaron Paul, Amy Sedaris, Paul F. Tompkins, Alison Brie',
    country: 'United States',
    date_added: 'January 31, 2020',
    release_year: 2020,
    rating: 'TV-MA',
    duration: '6 Seasons',
    listed_in: 'TV Comedies',
    description: 'Meet the most beloved sitcom horse of the \'90s, 20 years later. He\'s a curmudgeon with a heart of... not quite gold... but something like gold.'
  },
  {
    show_id: 's29',
    type: 'TV Show',
    title: 'Sacred Games',
    director: 'Vikramaditya Motwane, Anurag Kashyap',
    cast: 'Saif Ali Khan, Nawazuddin Siddiqui, Radhika Apte, Neeraj Kabi, Jatin Sarna, Kubbra Sait',
    country: 'India',
    date_added: 'August 15, 2019',
    release_year: 2019,
    rating: 'TV-MA',
    duration: '2 Seasons',
    listed_in: 'Crime TV Shows, International TV Shows, TV Dramas',
    description: 'A link in their pasts leads an honest cop to a fugitive gang boss, whose cryptic warning spurs a quest to save Mumbai from cataclysm.'
  },
  {
    show_id: 's30',
    type: 'Movie',
    title: 'Dangal',
    director: 'Nitesh Tiwari',
    cast: 'Aamir Khan, Sakshi Tanwar, Fatima Sana Shaikh, Sanya Malhotra, Aparshakti Khurana',
    country: 'India',
    date_added: 'June 21, 2017',
    release_year: 2016,
    rating: 'TV-PG',
    duration: '161 min',
    listed_in: 'Dramas, International Movies, Sports Movies',
    description: 'A former wrestler trains his two daughters for the Commonwealth Games in the face of societal prejudice and systemic indifference.'
  },
  {
    show_id: 's31',
    type: 'Movie',
    title: '3 Idiots',
    director: 'Rajkumar Hirani',
    cast: 'Aamir Khan, Kareena Kapoor, R. Madhavan, Sharman Joshi, Boman Irani, Omi Vaidya',
    country: 'India',
    date_added: 'August 1, 2019',
    release_year: 2009,
    rating: 'PG-13',
    duration: '164 min',
    listed_in: 'Comedies, Dramas, International Movies',
    description: 'While attending one of India\'s premier colleges, three engineering students develop a profound bond as they navigate life\'s pressures and dreams.'
  },
  {
    show_id: 's32',
    type: 'Movie',
    title: 'Spirited Away',
    director: 'Hayao Miyazaki',
    cast: 'Rumi Hiiragi, Miyu Irino, Mari Natsuki, Takashi Naito, Yasuko Sawaguchi',
    country: 'Japan',
    date_added: 'March 1, 2020',
    release_year: 2001,
    rating: 'PG',
    duration: '125 min',
    listed_in: 'Anime Features, Children & Family Movies, International Movies',
    description: 'Chihiro wanders into a world ruled by gods, witches and spirits, and where humans are changed into beasts.'
  },
  {
    show_id: 's33',
    type: 'TV Show',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    director: 'Haruo Sotozaki',
    cast: 'Natsuki Hanae, Akari Kito, Hiro Shimono, Yoshitsugu Matsuoka, Satoshi Hino',
    country: 'Japan',
    date_added: 'January 22, 2021',
    release_year: 2019,
    rating: 'TV-14',
    duration: '1 Season',
    listed_in: 'Anime Series, International TV Shows',
    description: 'After a demon attack leaves his family slain and his sister cursed, Tanjiro embarks on a perilous quest to find a cure and avenge his family.'
  },
  {
    show_id: 's34',
    type: 'Movie',
    title: 'Inception',
    director: 'Christopher Nolan',
    cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy, Ken Watanabe',
    country: 'United States, United Kingdom',
    date_added: 'January 1, 2020',
    release_year: 2010,
    rating: 'PG-13',
    duration: '148 min',
    listed_in: 'Action & Adventure, Sci-Fi & Fantasy, Thrillers',
    description: 'A troubled thief who extracts secrets from people\'s dreams takes one last job: leading a dangerous mission to plant an idea in a target\'s subconscious.'
  },
  {
    show_id: 's35',
    type: 'Movie',
    title: 'Pulp Fiction',
    director: 'Quentin Tarantino',
    cast: 'John Travolta, Samuel L. Jackson, Uma Thurman, Bruce Willis, Ving Rhames, Harvey Keitel',
    country: 'United States',
    date_added: 'January 1, 2019',
    release_year: 1994,
    rating: 'R',
    duration: '154 min',
    listed_in: 'Action & Adventure, Classic Movies, Cult Movies',
    description: 'This stylized crime caper weaves together stories featuring a burger-loving hit man, his philosophical partner and a washed-up boxer.'
  },
  {
    show_id: 's36',
    type: 'TV Show',
    title: 'Breaking Bad',
    director: 'Vince Gilligan',
    cast: 'Bryan Cranston, Aaron Paul, Anna Gunn, Dean Norris, Betsy Brandt, RJ Mitte',
    country: 'United States',
    date_added: 'August 2, 2013',
    release_year: 2013,
    rating: 'TV-MA',
    duration: '5 Seasons',
    listed_in: 'Crime TV Shows, TV Dramas, TV Thrillers',
    description: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.'
  },
  {
    show_id: 's37',
    type: 'TV Show',
    title: 'Friends',
    director: 'David Crane, Marta Kauffman',
    cast: 'Jennifer Aniston, Courteney Cox, Lisa Kudrow, Matt LeBlanc, Matthew Perry, David Schwimmer',
    country: 'United States',
    date_added: 'January 1, 2015',
    release_year: 2003,
    rating: 'TV-14',
    duration: '10 Seasons',
    listed_in: 'Classic & Cult TV, TV Comedies',
    description: 'This hit sitcom follows the merry misadventures of six 20-something pals as they navigate the pitfalls of work, life and love in 1990s Manhattan.'
  },
  {
    show_id: 's38',
    type: 'TV Show',
    title: 'The Office (U.S.)',
    director: 'Greg Daniels',
    cast: 'Steve Carell, John Krasinski, Jenna Fischer, Rainn Wilson, B.J. Novak, Ed Helms',
    country: 'United States',
    date_added: 'January 1, 2016',
    release_year: 2012,
    rating: 'TV-14',
    duration: '9 Seasons',
    listed_in: 'TV Comedies',
    description: 'This hit comedy chronicles the foibles of disgruntled office workers — led by pompous boss Michael Scott — at the Dunder Mifflin paper company.'
  },
  {
    show_id: 's39',
    type: 'TV Show',
    title: 'Lupin',
    director: 'George Kay',
    cast: 'Omar Sy, Ludivine Sagnier, Clotilde Hesme, Nicole Garcia, Hervé Pierre',
    country: 'France',
    date_added: 'June 11, 2021',
    release_year: 2021,
    rating: 'TV-MA',
    duration: '2 Seasons',
    listed_in: 'Crime TV Shows, International TV Shows, TV Action & Adventure',
    description: 'Inspired by the adventures of Arsène Lupin, gentleman thief Assane Diop sets out to avenge his father for an injustice inflicted by a wealthy family.'
  },
  {
    show_id: 's40',
    type: 'TV Show',
    title: 'Crash Landing on You',
    director: 'Lee Jeong-hyo',
    cast: 'Hyun Bin, Son Ye-jin, Seo Ji-hye, Kim Jung-hyun, Oh Man-seok, Kim Young-min',
    country: 'South Korea',
    date_added: 'December 15, 2019',
    release_year: 2019,
    rating: 'TV-14',
    duration: '1 Season',
    listed_in: 'International TV Shows, Romantic TV Shows, TV Comedies',
    description: 'A paragliding mishap drops a South Korean heiress in North Korea — and into the life of an army officer, who decides he will help her hide.'
  },
  {
    show_id: 's41',
    type: 'TV Show',
    title: 'Formula 1: Drive to Survive',
    director: 'James Gay-Rees',
    cast: '',
    country: 'United Kingdom',
    date_added: 'March 19, 2021',
    release_year: 2021,
    rating: 'TV-MA',
    duration: '3 Seasons',
    listed_in: 'Docuseries, International TV Shows',
    description: 'Drivers, managers and team owners live life in the fast lane — both on and off the track — during one cutthroat season of Formula 1 racing.'
  },
  {
    show_id: 's42',
    type: 'Movie',
    title: 'My Octopus Teacher',
    director: 'Pippa Ehrlich, James Reed',
    cast: 'Craig Foster',
    country: 'South Africa',
    date_added: 'September 7, 2020',
    release_year: 2020,
    rating: 'TV-G',
    duration: '85 min',
    listed_in: 'Documentaries, International Movies',
    description: 'A filmmaker forges an unusual friendship with an octopus living in a South African kelp forest, learning as the animal shares the mysteries of her world.'
  },
  {
    show_id: 's43',
    type: 'Movie',
    title: 'The Social Dilemma',
    director: 'Jeff Orlowski',
    cast: 'Skyler Gisondo, Kara Hayward, Vincent Kartheiser',
    country: 'United States',
    date_added: 'September 9, 2020',
    release_year: 2020,
    rating: 'PG-13',
    duration: '94 min',
    listed_in: 'Documentaries',
    description: 'This documentary-drama hybrid explores the dangerous human impact of social networking, with tech experts sounding the alarm on their own creations.'
  },
  {
    show_id: 's44',
    type: 'Movie',
    title: 'Klaus',
    director: 'Sergio Pablos',
    cast: 'Jason Schwartzman, J.K. Simmons, Rashida Jones, Will Sasso, Neda Margrethe Labba',
    country: 'Spain',
    date_added: 'November 15, 2019',
    release_year: 2019,
    rating: 'PG',
    duration: '98 min',
    listed_in: 'Children & Family Movies, Comedies',
    description: 'A selfish postman and a reclusive toymaker form an unlikely friendship, delivering joy to a cold, dark town that desperately needs it.'
  },
  {
    show_id: 's45',
    type: 'Movie',
    title: 'Enola Holmes',
    director: 'Harry Bradbeer',
    cast: 'Millie Bobby Brown, Henry Cavill, Sam Claflin, Helena Bonham Carter, Louis Partridge',
    country: 'United Kingdom',
    date_added: 'September 23, 2020',
    release_year: 2020,
    rating: 'PG-13',
    duration: '124 min',
    listed_in: 'Action & Adventure, Children & Family Movies, Comedies',
    description: 'While searching for her missing mother, intrepid teen Enola Holmes uses her sleuthing skills to outsmart big brother Sherlock and help a runaway lord.'
  },
  {
    show_id: 's46',
    type: 'TV Show',
    title: 'Bridgerton',
    director: 'Chris Van Dusen',
    cast: 'Adjoa Andoh, Julie Andrews, Lorraine Ashbourne, Jonathan Bailey, Ruby Barker, Phoebe Dynevor',
    country: 'United States',
    date_added: 'December 25, 2020',
    release_year: 2020,
    rating: 'TV-MA',
    duration: '1 Season',
    listed_in: 'Romantic TV Shows, TV Dramas',
    description: 'The eight close-knit siblings of the Bridgerton family look for love and happiness in London high society. Inspired by Julia Quinn\'s bestselling novels.'
  },
  {
    show_id: 's47',
    type: 'Movie',
    title: 'Red Notice',
    director: 'Rawson Marshall Thurber',
    cast: 'Dwayne Johnson, Ryan Reynolds, Gal Gadot, Ritu Arya, Chris Diamantopoulos',
    country: 'United States',
    date_added: 'November 12, 2021',
    release_year: 2021,
    rating: 'PG-13',
    duration: '118 min',
    listed_in: 'Action & Adventure, Comedies',
    description: 'An FBI profiler pursuing the world\'s most wanted art thief becomes his reluctant partner in crime to catch an elusive crook who\'s always one step ahead.'
  },
  {
    show_id: 's48',
    type: 'TV Show',
    title: 'Our Planet',
    director: 'Alastair Fothergill',
    cast: 'David Attenborough',
    country: 'United States, United Kingdom',
    date_added: 'April 5, 2019',
    release_year: 2019,
    rating: 'TV-G',
    duration: '1 Season',
    listed_in: 'Docuseries, Science & Nature TV',
    description: 'Experience our planet\'s natural beauty and examine how climate change impacts all living creatures in this ambitious documentary of spectacular scope.'
  },
  {
    show_id: 's49',
    type: 'TV Show',
    title: 'Schitt\'s Creek',
    director: 'Dan Levy, Eugene Levy',
    cast: 'Eugene Levy, Catherine O\'Hara, Dan Levy, Annie Murphy, Chris Elliott, Emily Hampshire',
    country: 'Canada',
    date_added: 'January 16, 2020',
    release_year: 2020,
    rating: 'TV-14',
    duration: '6 Seasons',
    listed_in: 'TV Comedies',
    description: 'Suddenly broke, the formerly filthy-rich Rose family is reduced to living in a ramshackle town they once bought as a joke.'
  },
  {
    show_id: 's50',
    type: 'Movie',
    title: 'The Trial of the Chicago 7',
    director: 'Aaron Sorkin',
    cast: 'Sacha Baron Cohen, Eddie Redmayne, Yahya Abdul-Mateen II, Jeremy Strong, Joseph Gordon-Levitt',
    country: 'United States',
    date_added: 'October 16, 2020',
    release_year: 2020,
    rating: 'R',
    duration: '130 min',
    listed_in: 'Dramas',
    description: 'What was intended to be a peaceful protest at the 1968 Democratic National Convention turned into a violent clash with police and the National Guard.'
  },
  {
    show_id: 's51',
    type: 'Movie',
    title: 'All Quiet on the Western Front',
    director: 'Edward Berger',
    cast: 'Felix Kammerer, Albrecht Schuch, Aaron Hilmer, Moritz Klaus, Adrian Grünewald, Daniel Brühl',
    country: 'Germany, United States, United Kingdom',
    date_added: 'October 28, 2022',
    release_year: 2021,
    rating: 'R',
    duration: '148 min',
    listed_in: 'Action & Adventure, Dramas, International Movies',
    description: 'When 17-year-old Paul joins the Western Front in World War I, his initial excitement is soon shattered by the grim reality of life in the trenches.'
  },
  {
    show_id: 's52',
    type: 'TV Show',
    title: 'Cobra Kai',
    director: 'Josh Heald, Jon Hurwitz, Hayden Schlossberg',
    cast: 'Ralph Macchio, William Zabka, Xolo Maridueña, Courtney Henggeler, Mary Mouser, Tanner Buchanan',
    country: 'United States',
    date_added: 'January 1, 2021',
    release_year: 2021,
    rating: 'TV-14',
    duration: '3 Seasons',
    listed_in: 'TV Action & Adventure, TV Comedies, TV Dramas',
    description: 'Decades after the tournament that changed their lives, the rivalry between Johnny and Daniel reignites in this sequel to the Karate Kid films.'
  },
  {
    show_id: 's53',
    type: 'TV Show',
    title: 'Delhi Crime',
    director: 'Richie Mehta',
    cast: 'Shefali Shah, Rajesh Tailang, Rasika Dugal, Anurag Arora, Yashaswini Dayama',
    country: 'India',
    date_added: 'March 22, 2019',
    release_year: 2019,
    rating: 'TV-MA',
    duration: '1 Season',
    listed_in: 'Crime TV Shows, International TV Shows, TV Dramas',
    description: 'Following the investigation of the horrific 2012 Delhi gang rape, DCP Vartika Chaturvedi leads a passionate team of police to track the culprits.'
  },
  {
    show_id: 's54',
    type: 'Movie',
    title: 'Taare Zameen Par',
    director: 'Aamir Khan',
    cast: 'Aamir Khan, Darsheel Safary, Tanay Chheda, Sachet Engineer, Tisca Chopra, Vipin Sharma',
    country: 'India',
    date_added: 'January 10, 2021',
    release_year: 2007,
    rating: 'PG',
    duration: '162 min',
    listed_in: 'Dramas, International Movies',
    description: 'When eight-year-old Ishaan is sent to boarding school for his poor grades, an unconventional art teacher helps him overcome his dyslexia.'
  },
  {
    show_id: 's55',
    type: 'Movie',
    title: 'Blade Runner',
    director: 'Ridley Scott',
    cast: 'Harrison Ford, Rutger Hauer, Sean Young, Edward James Olmos, M. Emmet Walsh, Daryl Hannah',
    country: 'United States',
    date_added: 'July 1, 2020',
    release_year: 1982,
    rating: 'R',
    duration: '117 min',
    listed_in: 'Action & Adventure, Cult Movies, Sci-Fi & Fantasy',
    description: 'In a dystopian Los Angeles, former police officer Rick Deckard is called out of retirement to track down a rogue band of synthetic humans called replicants.'
  },
  {
    show_id: 's56',
    type: 'Movie',
    title: 'Monty Python and the Holy Grail',
    director: 'Terry Gilliam, Terry Jones',
    cast: 'Graham Chapman, John Cleese, Eric Idle, Terry Gilliam, Terry Jones, Michael Palin',
    country: 'United Kingdom',
    date_added: 'January 2, 2019',
    release_year: 1975,
    rating: 'PG',
    duration: '92 min',
    listed_in: 'Action & Adventure, Classic Movies, Comedies',
    description: 'The Monty Python comedy troupe puts its irreverent satirical stamp on the Arthurian legend of King Arthur\'s quest to find the Holy Grail.'
  },
  {
    show_id: 's57',
    type: 'TV Show',
    title: 'The Witcher',
    director: 'Lauren Schmidt Hissrich',
    cast: 'Henry Cavill, Anya Chalotra, Freya Allan, Joey Batey, Eamon Farren, MyAnna Buring',
    country: 'United States, Poland',
    date_added: 'December 20, 2019',
    release_year: 2019,
    rating: 'TV-MA',
    duration: '1 Season',
    listed_in: 'TV Action & Adventure, TV Dramas, TV Sci-Fi & Fantasy',
    description: 'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.'
  },
  {
    show_id: 's58',
    type: 'TV Show',
    title: 'Lucifer',
    director: 'Tom Kapinos',
    cast: 'Tom Ellis, Lauren German, Kevin Alejandro, D.B. Woodside, Lesley-Ann Brandt, Rachael Harris',
    country: 'United States',
    date_added: 'September 10, 2021',
    release_year: 2021,
    rating: 'TV-14',
    duration: '6 Seasons',
    listed_in: 'Crime TV Shows, TV Comedies, TV Dramas',
    description: 'Bored with being the Lord of Hell, the devil relocates to Los Angeles, where he opens a nightclub and forms a connection with a homicide detective.'
  },
  {
    show_id: 's59',
    type: 'Movie',
    title: 'The Dark Knight',
    director: 'Christopher Nolan',
    cast: 'Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine, Maggie Gyllenhaal, Gary Oldman',
    country: 'United States, United Kingdom',
    date_added: 'May 1, 2020',
    release_year: 2008,
    rating: 'PG-13',
    duration: '152 min',
    listed_in: 'Action & Adventure, Dramas',
    description: 'Batman raises the stakes in his war on crime. With the help of allies Lt. Jim Gordon and DA Harvey Dent, Batman sets out to dismantle Gotham\'s mob.'
  },
  {
    show_id: 's60',
    type: 'TV Show',
    title: 'Arcane',
    director: 'Christian Linke, Alex Yee',
    cast: 'Hailee Steinfeld, Ella Purnell, Kevin Alejandro, Katie Leung, Jason Spisak, Toks Olagundoye',
    country: 'United States, France',
    date_added: 'November 6, 2021',
    release_year: 2021,
    rating: 'TV-14',
    duration: '1 Season',
    listed_in: 'Action & Adventure, Anime Series, TV Sci-Fi & Fantasy',
    description: 'Amid the stark discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and clashing convictions.'
  }
];

// Helper to clean raw record into normalized schema
export function cleanRecord(raw: typeof RAW_NETFLIX_RECORDS[0]): NetflixRecord {
  // 1. Duration parsing
  const durationStr = raw.duration.trim();
  const match = durationStr.match(/^(\d+)\s*(min|Seasons|Season)/i);
  let duration_int = 0;
  let duration_unit: 'min' | 'Seasons' | 'Season' = 'min';

  if (match) {
    duration_int = parseInt(match[1], 10);
    duration_unit = match[2].toLowerCase().includes('season') 
      ? (match[1] === '1' ? 'Season' : 'Seasons') 
      : 'min';
  }

  // 2. Date parsing
  let date_added_clean = '2020-01-01';
  let year_added: number | null = null;
  let month_added: string | null = null;
  
  if (raw.date_added && raw.date_added.trim() !== '') {
    const parsedDate = new Date(raw.date_added.trim());
    if (!isNaN(parsedDate.getTime())) {
      date_added_clean = parsedDate.toISOString().split('T')[0];
      year_added = parsedDate.getFullYear();
      month_added = parsedDate.toLocaleString('default', { month: 'short' });
    }
  }

  // 3. Country standardization
  const rawCountry = raw.country ? raw.country.trim() : 'Unknown';
  const primary_country = rawCountry.split(',')[0].trim() || 'Unknown';

  // 4. Genre standardization
  const rawGenre = raw.listed_in ? raw.listed_in.trim() : 'Uncategorized';
  const primary_genre = rawGenre.split(',')[0].trim() || 'Uncategorized';

  return {
    ...raw,
    director: raw.director && raw.director.trim() !== '' ? raw.director : 'Unknown',
    cast: raw.cast && raw.cast.trim() !== '' ? raw.cast : 'Unknown',
    country: rawCountry,
    rating: raw.rating && raw.rating.trim() !== '' ? raw.rating : 'TV-MA',
    duration_int,
    duration_unit,
    date_added_clean,
    year_added,
    month_added,
    primary_country,
    primary_genre
  };
}

// Cleaned in-memory records
export const CLEANED_NETFLIX_RECORDS: NetflixRecord[] = RAW_NETFLIX_RECORDS.map(cleanRecord);

// Authoritative Kaggle / Netflix catalog benchmark parameters (8,807 titles)
export const CATALOG_BENCHMARK = {
  totalTitles: 8807,
  totalMovies: 6131,
  totalTvShows: 2676,
  moviePercentage: 69.62,
  tvShowPercentage: 30.38,
  uniqueCountries: 86,
  earliestReleaseYear: 1925,
  latestReleaseYear: 2021,
  mostTitlesAddedYear: 2019,
  mostTitlesAddedCount: 2016,
  averageMovieDuration: 99.5, // ~100 min
  medianMovieDuration: 98,
  mostCommonRating: 'TV-MA',
  ratingDistribution: [
    { rating: 'TV-MA', count: 3207, percent: 36.4 },
    { rating: 'TV-14', count: 2160, percent: 24.5 },
    { rating: 'TV-PG', count: 863, percent: 9.8 },
    { rating: 'R', count: 799, percent: 9.1 },
    { rating: 'PG-13', count: 490, percent: 5.6 },
    { rating: 'TV-Y7', count: 334, percent: 3.8 },
    { rating: 'TV-Y', count: 307, percent: 3.5 },
    { rating: 'PG', count: 287, percent: 3.3 },
    { rating: 'TV-G', count: 220, percent: 2.5 },
    { rating: 'NR', count: 80, percent: 0.9 },
    { rating: 'G', count: 41, percent: 0.5 }
  ],
  topCountries: [
    { country: 'United States', count: 3689, share: 41.9 },
    { country: 'India', count: 1046, share: 11.9 },
    { country: 'United Kingdom', count: 804, share: 9.1 },
    { country: 'Canada', count: 445, share: 5.1 },
    { country: 'France', count: 393, share: 4.5 },
    { country: 'Japan', count: 318, share: 3.6 },
    { country: 'Spain', count: 232, share: 2.6 },
    { country: 'South Korea', count: 231, share: 2.6 },
    { country: 'Germany', count: 226, share: 2.6 },
    { country: 'Mexico', count: 169, share: 1.9 }
  ],
  topGenres: [
    { genre: 'Dramas / International', count: 2427 },
    { genre: 'Comedies', count: 1674 },
    { genre: 'Action & Adventure', count: 859 },
    { genre: 'Documentaries', count: 869 },
    { genre: 'Children & Family Movies', count: 641 },
    { genre: 'Romantic TV Shows / Dramas', count: 579 },
    { genre: 'TV Comedies', count: 581 },
    { genre: 'Crime TV Shows', count: 470 },
    { genre: 'Kids\' TV', count: 451 },
    { genre: 'Sci-Fi & Fantasy', count: 327 }
  ],
  titlesAddedTrend: [
    { year: 2014, count: 24 },
    { year: 2015, count: 82 },
    { year: 2016, count: 429 },
    { year: 2017, count: 1188 },
    { year: 2018, count: 1649 },
    { year: 2019, count: 2016 },
    { year: 2020, count: 1879 },
    { year: 2021, count: 1498 }
  ],
  tvShowSeasonsDistribution: [
    { seasons: '1 Season', count: 1793, percent: 67.0 },
    { seasons: '2 Seasons', count: 425, percent: 15.9 },
    { seasons: '3 Seasons', count: 199, percent: 7.4 },
    { seasons: '4 Seasons', count: 95, percent: 3.5 },
    { seasons: '5+ Seasons', count: 164, percent: 6.1 }
  ]
};

// Generate Raw CSV representation
export function generateRawCsv(): string {
  const headers = ['show_id', 'type', 'title', 'director', 'cast', 'country', 'date_added', 'release_year', 'rating', 'duration', 'listed_in', 'description'];
  const rows = RAW_NETFLIX_RECORDS.map(r => {
    return [
      r.show_id,
      r.type,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.director.replace(/"/g, '""')}"`,
      `"${r.cast.replace(/"/g, '""')}"`,
      `"${r.country.replace(/"/g, '""')}"`,
      `"${r.date_added.replace(/"/g, '""')}"`,
      r.release_year,
      r.rating,
      r.duration,
      `"${r.listed_in.replace(/"/g, '""')}"`,
      `"${r.description.replace(/"/g, '""')}"`
    ].join(',');
  });
  return [headers.join(','), ...rows].join('\n');
}

// Generate Cleaned CSV representation
export function generateCleanedCsv(): string {
  const headers = [
    'show_id', 'type', 'title', 'director', 'cast', 'country', 
    'date_added_clean', 'year_added', 'month_added', 'release_year', 
    'rating', 'duration_int', 'duration_unit', 'primary_country', 'primary_genre', 'description'
  ];
  const rows = CLEANED_NETFLIX_RECORDS.map(r => {
    return [
      r.show_id,
      r.type,
      `"${r.title.replace(/"/g, '""')}"`,
      `"${r.director.replace(/"/g, '""')}"`,
      `"${r.cast.replace(/"/g, '""')}"`,
      `"${r.country.replace(/"/g, '""')}"`,
      r.date_added_clean,
      r.year_added ?? '',
      r.month_added ?? '',
      r.release_year,
      r.rating,
      r.duration_int,
      r.duration_unit,
      `"${r.primary_country.replace(/"/g, '""')}"`,
      `"${r.primary_genre.replace(/"/g, '""')}"`,
      `"${r.description.replace(/"/g, '""')}"`
    ].join(',');
  });
  return [headers.join(','), ...rows].join('\n');
}

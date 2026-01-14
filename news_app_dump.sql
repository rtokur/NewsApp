--
-- PostgreSQL database dump
--

\restrict AGuBRwQf1rWV5E2Xe4BQiPV6tUEST9JIfsgUqpxe6Ema8HmXe6LVZM3w2r0a0dE

-- Dumped from database version 14.20 (Homebrew)
-- Dumped by pg_dump version 14.20 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: rumeysatokur
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.categories OWNER TO rumeysatokur;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: rumeysatokur
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO rumeysatokur;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rumeysatokur
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: news; Type: TABLE; Schema: public; Owner: rumeysatokur
--

CREATE TABLE public.news (
    id integer NOT NULL,
    title character varying NOT NULL,
    content text NOT NULL,
    image_url character varying NOT NULL,
    published_at timestamp with time zone NOT NULL,
    category_id integer,
    is_breaking boolean NOT NULL,
    source_id integer
);


ALTER TABLE public.news OWNER TO rumeysatokur;

--
-- Name: news_id_seq; Type: SEQUENCE; Schema: public; Owner: rumeysatokur
--

CREATE SEQUENCE public.news_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.news_id_seq OWNER TO rumeysatokur;

--
-- Name: news_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rumeysatokur
--

ALTER SEQUENCE public.news_id_seq OWNED BY public.news.id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: rumeysatokur
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    user_id integer,
    token_hash text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.refresh_tokens OWNER TO rumeysatokur;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: rumeysatokur
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.refresh_tokens_id_seq OWNER TO rumeysatokur;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rumeysatokur
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- Name: sources; Type: TABLE; Schema: public; Owner: rumeysatokur
--

CREATE TABLE public.sources (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    logo_url text
);


ALTER TABLE public.sources OWNER TO rumeysatokur;

--
-- Name: sources_id_seq; Type: SEQUENCE; Schema: public; Owner: rumeysatokur
--

CREATE SEQUENCE public.sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sources_id_seq OWNER TO rumeysatokur;

--
-- Name: sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rumeysatokur
--

ALTER SEQUENCE public.sources_id_seq OWNED BY public.sources.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: rumeysatokur
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    full_name character varying(255),
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO rumeysatokur;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: rumeysatokur
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO rumeysatokur;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rumeysatokur
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: news id; Type: DEFAULT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.news ALTER COLUMN id SET DEFAULT nextval('public.news_id_seq'::regclass);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- Name: sources id; Type: DEFAULT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.sources ALTER COLUMN id SET DEFAULT nextval('public.sources_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: rumeysatokur
--

COPY public.categories (id, name) FROM stdin;
1	Technology
2	Business
3	Health
4	Science
5	Sports
6	Entertainment
7	World
8	Lifestyle
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: rumeysatokur
--

COPY public.news (id, title, content, image_url, published_at, category_id, is_breaking, source_id) FROM stdin;
1	Nvidia unveils 'reasoning' AI technology for self-driving cars	Nvidia has unveiled a new tech platform for self-driving cars as the world's leading chip-maker seeks more physical products to embed AI into.\nSpeaking at the annual CES technology conference in Las Vegas, boss Jensen Huan said the system - called Alpamayo - would bring "reasoning" to autonomous vehicles.\nThat would allow cars to "think through rare scenarios, drive safely in complex environments, and explain their driving decisions," Huang claimed.\nHe said Nvidia was working with Mercedes to produce a driverless car powered by the tech, which would be released in the US in the coming months before being rolled out in Europe and Asia. Nvidia's chips have helped power the AI revolution, though so far attention has mostly been focussed on the software it powers, such as ChatGPT.\nHowever, leading tech firms are now increasingly looking for hardware - meaning physical products such as cars - that AI could be used in. Wearing his trademark black leather jacket, Huang told an audience of hundreds that the project has taught Nvidia "an enormous amount" about how to help partners build robotic systems.\n"The ChatGPT moment for physical AI is almost here," Huang said.\n"NVIDIA's pivot toward AI at scale and AI systems as differentiators will help keep it way ahead of rivals," said Paolo Pescatore, analyst at PP Foresight, from Las Vegas.\n"Alpamayo represents a profound shift for NVIDIA, moving from being primarily a compute to a platform provider for physical AI ecosystems."\nShares of the AI chip designer rose slightly in after-hours trading following Huang's presentation.\nIt featured a video demonstration of the AI-powered Mercedes-Benz driving through San Francisco while a passenger, sat behind the steering wheel, kept their hands in their lap.\n"It drives so naturally because it learned directly from human demonstrators," Huang said, "but in every single scenario... it tells you what it's going to do, and it reasons about what it's about to do."\nAlpamayo is an open-source AI model, with the underlying code now available on machine learning platform Hugging Face, where autonomous vehicle researchers can access it for free and retrain the model, Huang said.\n"Our vision is that someday, every single car, every single truck, will be autonomous," he told the audience.\nThe project could pose a threat to companies like Elon Musk's Tesla, which offers driver assistance software called Autopilot.\n"Well that's just exactly what Tesla is doing," Musk posted on social media following the Alpamayo announcement. "What they will find is that it's easy to get to 99% and then super hard to solve the long tail of the distribution."\nLike Tesla, Nvidia also has plans to launch a robotaxi service by next year in collaboration with a partner, but has declined to name the partner or say where it will be.Nvidia is the world's most valuable publicly traded company, with a market cap of more than $4.5tn (£3.3tn).\nIt became the first company to reach $5tn in October, but has lost value over concerns about whether demand AI is overhyped.\nThe company also revealed that its Rubin AI chips are currently being manufactured and are due for release later this year.\nThe highly-anticipated hardware can compute using less energy than Nvidia's current line of AI chips, and could drive down the cost of developing the technology.	https://ichef.bbci.co.uk/news/1024/branded_news/692b/live/775b4f50-ea88-11f0-b5f7-49f0357294ff.jpg	2026-01-06 02:38:33+03	1	t	1
2	Global Markets React to Interest Rate Decisions	Financial markets across the globe showed mixed reactions following new interest rate announcements by central banks. Investors are closely monitoring inflation data and economic indicators, as uncertainty continues to affect long-term investment strategies. Analysts warn that volatility may persist throughout the year.	https://picsum.photos/800/600?random=2	2026-01-02 01:14:30.978305+03	2	f	2
3	New Breakthrough in Cancer Research	Scientists have announced a major breakthrough in cancer treatment, revealing a new therapy that targets cancer cells with unprecedented precision. Early clinical trials show promising results with fewer side effects, offering hope to millions of patients worldwide.	https://picsum.photos/800/600?random=3	2026-01-01 01:14:30.978305+03	3	t	3
4	Space Agency Plans Mission to Jupiter’s Moons	A new space mission aimed at exploring Jupiter’s icy moons has been officially approved. Researchers hope the mission will provide insights into the possibility of extraterrestrial life, as some of the moons are believed to contain subsurface oceans.	https://picsum.photos/800/600?random=4	2025-12-31 01:14:30.978305+03	4	f	4
5	Championship Final Ends with Historic Victory	The championship final concluded with a historic victory that will be remembered for decades. Fans around the world celebrated as the underdog team delivered an outstanding performance, breaking multiple records in the process.	https://picsum.photos/800/600?random=5	2025-12-30 01:14:30.978305+03	5	t	5
6	Streaming Platforms Compete for Global Audiences	Major streaming platforms are investing heavily in original content to attract global audiences. Industry experts note that competition is driving innovation, resulting in higher-quality productions and diverse storytelling.	https://picsum.photos/800/600?random=6	2025-12-29 01:14:30.978305+03	6	f	6
7	World Leaders Meet to Discuss Climate Action	World leaders gathered at an international summit to discuss urgent climate action. Commitments were made to reduce emissions and invest in renewable energy, although critics argue that stronger measures are still needed.	https://picsum.photos/800/600?random=7	2025-12-28 01:14:30.978305+03	7	t	1
8	Minimalist Living Gains Popularity Worldwide	More people are embracing minimalist lifestyles in an effort to reduce stress and focus on what truly matters. Experts say this trend reflects a growing desire for balance in an increasingly fast-paced world.	https://picsum.photos/800/600?random=8	2025-12-27 01:14:30.978305+03	8	f	7
9	Advancements in Quantum Computing	Quantum computing continues to evolve as researchers achieve new milestones in processing power and stability. These advancements could eventually revolutionize fields such as cryptography, medicine, and artificial intelligence.	https://picsum.photos/800/600?random=9	2025-12-26 01:14:30.978305+03	1	t	8
10	Startup Ecosystems Thrive in Emerging Markets	Emerging markets are becoming hotspots for startup innovation, fueled by young talent and increasing access to funding. Analysts predict sustained growth as global investors turn their attention to these regions.	https://picsum.photos/800/600?random=10	2025-12-25 01:14:30.978305+03	2	f	9
11	New Study Reveals Benefits of Daily Exercise	A comprehensive study has confirmed that even moderate daily exercise can significantly improve mental and physical health. Researchers emphasize that consistency is more important than intensity when it comes to long-term benefits.	https://images.example.com/exercise.jpg	2025-12-24 01:14:30.978305+03	3	t	10
12	The hidden label to look for on your food that means it contains toxic chemical	Americans may unknowingly be consuming a harmful chemical in one of their grocery store staples.\n\nAs part of the process of getting chicken from farm to grocery store, manufacturers chill the meat in large cold water tanks that contain chlorine to kill off bacteria like Salmonella, Campylobacter and E.coli.\n\nHowever, this can result in the meat soaking up some of the chemicals used to clean them. Meanwhile, chlorine rinses, which also include chlorine alternatives and organic acids, are not foolproof protection against food-borne illness, as they do not fully sanitize the chicken. \n\nIn the EU and UK, the use of chlorine baths is banned. Instead, they primarily use air chilling with cold air or, sometimes, nontoxic acid sprays.\n\nThe US system, regulated by the USDA, views the chlorinated chill as a critical final step to ensure a safe product and considers it safe and effective. The USDA permits chlorine rinses and sprays, often at 18 to 30 parts per million (PPM) or up to 50 ppm in chill tanks, to control pathogens.\n\nThe primary concern among public health bodies and experts is not only that chlorine residue poses risk to humans, but that it masks poor hygiene practices elsewhere in the process, as well as poor animal welfare guarantees at farms that allow for the spread of pathogens that may survive the chlorine process, which does not sterilize chicken.\n\nPaul Saladino, a health influencer and former psychiatrist, warns Americans about chlorine-processed chicken. He recommends that consumers look for an 'air-chilled' label on chicken packaging, as this indicates the chicken was not washed in a chlorine bath. \n\nAir chilling is the standard in the EU not only for its ability to mitigate potential chemical residues but also its stronger, purer flavor, crispier skin and tender meat, as it avoids water absorption.Saladino said: ‘Even organic chicken can be dunked in a chlorine bath and have up to 12 percent retained water from the chilling process, which means unless your chicken says it’s air-chilled, it is full of chemicals and chlorine that are absorbed in the chicken when it’s chilled.’ Still, the public health threat due to chlorine residue on chicken may not be as extreme as warned, according to experts. \n\nEdmund McCormick, a food Science and formulation consultant who focuses on microbial risk reduction with Cape Crystal Brands, told the Daily Mail that most mainstream risk assessments deem this is a minimal health threat. \n\nHe said that when chlorine hits organic material on the chicken, like bacteria, it binds to it and neutralizes it. \n\nBy the time the chicken is rinsed and packaged, the reactive chlorine has mostly been used up in this reaction, leaving very little on the meat itself.\n\nLess than five percent of poultry processing facilities still use chlorine in rinses and sprays, according to the National Chicken Council, an industry group that surveyed its members.\n\nToxicity warnings should be taken with a grain of salt, based on a series of studies on the subject. Researchers tested whether drinking chlorinated water harms the immune system. \n\nMultiple studies fed mice and rats water with chlorine levels far higher than any used in food processing for months.They found no negative effects on immune organs, cell function, or antibody production, even at extreme doses. The only change was that animals drank less of the highly chlorinated water, leading to mild dehydration effects, not toxicity. \n\nAdditionally, although some people who are highly sensitive to chlorine could notice minor irritation, this is very unlikely because the chlorine concentration is extremely small—lower than what's found in a swimming pool. \n\nEstimates suggest that adults would need to eat five percent of their body weight in chlorinated chicken each day to be at risk of negative health effects, like chemical toxicity or organ stress, from poultry alone. This is an amount far beyond anything a person could or would ever realistically eat.\n\nWhile chlorine is used to kill dangerous, life-threatening bacteria, a chlorine bath is not a foolproof way to protect consumers from foodborne illness. \n\nChlorine washes reduce but do not sterilize chicken. Some pathogens, like Campylobacter, can form biofilms or hide in feather follicles, potentially surviving the wash.\n\nConsumers might develop a false sense of security and mishandle the meat, including by not cooking it thoroughly or allowing for cross-contamination in the kitchen.\n\nIn Europe, the primary strategy focuses on preventing pathogens in living animals through farm-level measures like vaccination and specialized feed. In contrast, the US system emphasizes methods to eliminate contaminants only after slaughter. \n\nEuropean health authorities argue that a chlorine bath is a band-aid that covers up flaws up and down the processing line, the entirety of which should be made as safe as possible.\n\nMcCormick said: ‘A chlorine or an equivalent rinse is able to reduce surface microbial load but unable to reliably “fix” upstream failures such as a high incoming pathogen burden, fecal contamination events, insufficient scald or defeather control, poor evisceration control or systemic farm-level disease pressure.\n\n‘In other words: Antimicrobial dips are more a last stand-in for a multi-hurdle system, not a replacement for clean birds in, clean birds out.’	https://i.dailymail.co.uk/1s/2026/01/05/19/105252615-0-image-m-62_1767642933285.jpg	2026-01-06 02:38:25+03	8	t	11
13	Search ends for mountain lions after solo hiker fatally attacked on Colorado trail	The search for mountain lions along a remote trail in Colorado where a solo hiker was fatally attacked ended Monday after authorities killed two of the predators — including one with human DNA on its paws — but could not find a third.\n\nThe victim of the New Year’s Day attack was identified as a 46-year-old woman from Fort Collins, about an hour’s drive from the attack site on the Crosier Mountain trail, east of Rocky Mountain National Park. It was the first fatal mountain lion attack in Colorado since the late 1990s, and the fourth killing in North America over the past decade.\n\nVictim Kristen Marie Kovatch died of asphyxia due to having her neck compressed, the Larimer County Coroner’s Office said in a statement Monday. The injuries were “consistent with a mountain lion attack” and her death was ruled an accident, the coroner’s office said.\n\nKovatch’s family said she was an ultramarathon runner who died doing something she loved — hiking and enjoying the beauty of Colorado’s public lands.“We are devastated by the sudden and tragic loss of our beloved Kristen,” the family said in a statement. “Our family is struggling to comprehend this heartbreaking moment.”\n\nTwo hikers found Kovatch’s body on a trail southeast of the community of Glen Haven, Colorado, at around noon on Jan. 1, state officials said. A mountain lion was nearby and they threw rocks to scare it away. One of the hikers, a physician, attended to the victim but did not find a pulse.\n\nLater that day, two mountain lions located in the area were shot and killed by wildlife officers.\n\nA necropsy revealed that one of those animals, a male, had human DNA on its four paws, Colorado Parks and Wildlife spokesperson Kara Van Hoose said Monday. The other lion killed did not have signs of human DNA, she said.\n\nThe search for a third mountain lion spotted in the area stretched over four days with no further sign of the animal, officials said. Hiking tails in the area were closed while the search was ongoing.\n\nMountain lions — also known as cougars, pumas or catamounts — can weigh up to 130 pounds (60 kilograms) and grow to more than 6 feet (1.8 meters) long. They primarily eat deer.\n\nColorado has an estimated 3,800 to 4,400 mountain lions, which are classified as a big game species in the state and can be hunted.\n\nA Glen Haven man running on the same trail where Kovatch was killed encountered a mountain lion in November. He said it rushed him aggressively but he fought it off with a stick.It was one of several mountain lion encounters east of Rocky Mountain National Park in recent months, according to Van Hoose. In two of those cases, the predators killed dogs being walked by their owners, she said.	https://i0.wp.com/bdn-data.s3.amazonaws.com/uploads/2026/01/preview-164.jpg?fit=1024%2C678&ssl=1	2026-01-06 02:38:04+03	7	f	12
17	No drama as Pearly-Thinaah, Aaron-Wooi Yik cruise into second round	KUALA LUMPUR: Anything less than a first-round win would have spelled trouble for national women’s doubles pair Pearly Tan–M. Thinaah at the Malaysian Open.\n\nFacing unheralded Indian sisters Rutaparna Panda–Swetaparna Panda, the world No. 2 duo delivered as expected, needing just 30 minutes to cruise to a 21-11, 21-9 victory at the Axiata Arena yesterday.\n\nIt marked only the second time Pearly and Thinaah have advanced beyond the opening round of the home tournament, having last done so in 2022.\n\nThe previous three editions, however, had ended in disappointment after first-round exits in 2023, 2024 and 2025 – which explained Pearly’s visible relief following yesterday’s win.“We did think about it (the early exits), and we know that we needed to improve on,” said Pearly.\n\n“We have been disappointed too by exiting in the first round, and the fans didn’t get to see us in action longer on the court.\n\n“So this year we have come really prepared.”Added Thinaah: “It’s the first day and a new season, so we want to keep a good momentum going for us. But of course, there will be things to improve on.”\n\nPearly-Thinaah will now have a SEA Games final repeat in the second round tomorrow as they face Indonesia’s Febriana Kusuma-Meilysa Puspitasari.\n\nThe Malaysians won the gold and they have also beaten the pair thrice in the World Tour.\n\nMeanwhile, Aaron Chia-Soh Wooi Yik also booked their spot in the men’s doubles second round after beating Chen Zhi Yi-Presley Smith of the United States 21-11, 21-19 in just 34 minutes.\n\nThey will face either China’s Chen Xujun-Liu Yang or Taiwan’s Liu Kuang-heng-Yang Po-han for a place in the quarter-finals.\n\n“We’re feeling good. Our condition is good and physically everything is all okay.\n\n“It’s a good start to the season,” said Aaron.\n\nTeammates Yap Roy King-Wan Arif Wan Junaidi also cleared the opening round after defeating Goh V Shem-Choi Sol-gyu 22-20, 21-12 in 38 minutes to set up a meeting against India’s Satwiksairaj Rankireddy-Chirag Shetty today.	https://apicms.thestar.com.my/uploads/images/2026/01/08/3709906.jpg	2026-01-08 02:24:32+03	5	t	15
18	Liam Rosenior has problems to fix at Chelsea	New Chelsea head coach Liam Rosenior arrived with optimism, but Wednesday's 2-1 defeat at Fulham underlined the scale of the task ahead.\nThe 41-year-old described his appointment as "one of the proudest moments of his life", yet the reality was clear as Chelsea dropped out of the Premier League top five for the first time since August.\nSitting in the directors' box alongside co-owner Behdad Eghbali and members of the sporting leadership team, Rosenior watched as the side he has inherited slipped to eighth.\nHe replaced Enzo Maresca after the Italian fell out with the Blues hierarchy, with Rosenior joining from French club Strasbourg who share Chelsea's owners.\nThose decision-makers were targeted by chants from the away end during the match at Fulham, while the Chelsea players struggled against their west London rivals on the pitch.\nChelsea have won just one of their past nine league games and two of 11 in all competitions, falling from potential title contenders in November to a side now lagging far behind.\nThey have ground to make up to achieve their minimum aim this season – qualifying for the Champions League, which should be achievable with a top-five finish.\nBBC Sport looks at the problems Rosenior faces on and off the pitch.Build a relationship with the fansIf Chelsea's relationship with the fans isn't broken, it is certainly fraying.\nJust hours after Rosenior was confirmed in his new post, the Chelsea Supporters' Trust released a highly critical survey - not aimed at the appointment, but at the club's leadership.\nAmong the headlines was that more than half of respondents doubt Chelsea will achieve success in the next three to five years under the current regime. A similar proportion lack confidence in the ownership's decision-making.\nRosenior seemed aware of the stakes. In his first interview with the club's media channels, he used the word 'win' 14 times - a clear signal that he understands the only way to repair this fractured relationship is through results.\nThe former Fulham defender also referenced playing against Didier Drogba, Arjen Robben, Frank Lampard, Joe Cole and Michael Essien - acknowledging the fear factor Chelsea once commanded during the Roman Abramovich ownership era. These were savvy remarks from the London-born coach, showing he understands the club's identity.\nYet even he may not grasp the depth of anger that exists among the fanbase. On Wednesday, chants in support of the sanctioned Russian oligarch who transformed Chelsea rang out across Stamford Bridge, alongside unsavoury songs aimed at co-controlling owner Eghbali and Clearlake Capital.\nThere will also be a protest before Rosenior's first league match against Brentford, who leapfrogged them in the table on Wednesday, on Saturday week.\nRosenior must know he could become a target himself if results do not come quickly. He embodies everything Todd Boehly and Clearlake believe in: he is young, progressive, and connected to their multi-club model via Strasbourg.\nSigning off his first interview, Rosenior said: "Believe in what is an amazing football club, believe in the players, and when you give energy to the team, you help them win. That's why we are here. I can't wait to meet them and do that soon."\nFix inconsistencyChelsea have spent more than £1.5bn on new players since 2022. Although they have raised over £750m through player sales, results have not matched the scale of investment.\nMuch of the criticism has focused on the club assembling the youngest squad in the Premier League, with an average starting XI aged under 24. No team that young has ever won the title in the Premier League era.\nChelsea have shown flashes of quality but often lose control and drop points. Former boss Maresca highlighted the issue after his side dropped a league-high 15 points from winning positions this season.\nRosenior faces similar concerns. His Strasbourg team, with an average age of around 21, dropped 13 points from winning positions and won only two of their past 10 Ligue 1 matches.\nInsiders at Chelsea insist they want to be Champions League regulars and eventually challenge for the biggest titles. Yet to achieve even their minimum aims, Chelsea and Rosenior need to find momentum quickly.\nResolve ill-discipline\nChelsea were reduced to 10 men at Fulham when Marc Cucurella was sent off for pulling back Harry Wilson as he broke through on goal.\nWilson later scored the winner with a fine finish in the 82nd minute.\nCaretaker manager Calum McFarlane defended Cucurella by saying: "There's been a lot made of the red cards this season. I don't think this one is ill-disciplined. This is football. You get caught one-v-one and Marc is one of the best defenders in the world."\nHowever, McFarlane admitted concern over three yellow cards that followed immediately for dissent after the dismissal, shown to Cole Palmer, Enzo Fernandez and Tosin Adarabioyo.\n"The three yellow cards directly after is something we'll have to look at, but I would argue that we don't want that to happen," McFarlane said.\nMcFarlane was also later cautioned for questioning the referee.\nSince the start of the 2023-24 season, Chelsea have received 251 yellow cards and 11 reds – the most of any Premier League club. They have had five red cards for players in the league this season, and one more in their remaining 17 matches would equal an unwanted club record that was set in 2007-08.\nFormer boss Maresca had been trying to address the issue before his departure.What's next for Rosenior?\nRosenior joined team meetings before the Fulham match and travelled with the squad to Craven Cottage.\nHis first full training session is scheduled for Thursday. He will then be presented to the media on Friday before selecting his first team for Saturday's FA Cup third-round game at Charlton Athletic.\nIn the following week, Chelsea face Arsenal in the Carabao Cup semi-final, followed by Rosenior's first Premier League match at home to Brentford.	https://ichef.bbci.co.uk/ace/branded_sport/1200/cpsprodpb/19e9/live/983615e0-ebfd-11f0-81ae-8378c6aa7ffe.jpg	2026-01-08 02:44:48+03	5	f	1
20	China Metals in Grip of Frenzy as Investors Bet on Global Rally	China’s metal markets are in the grip of a speculative frenzy, with trading values in Shanghai surging more than 260% from a year earlier, as traders and deep-pocketed funds pile into commodities like copper, nickel and lithium.\n\nOpen interest has surged to a record across the six base metals traded in Shanghai, pointing to robust sentiment as investors bet on global supply tightness, resilient industrial demand and a more supportive interest-rate backdrop in China and the US. Heightened geopolitical risks have added to the rush into raw materials.\n\nThe total turnover of the Shanghai Futures Exchange’s six base metals contracts, plus gold and silver futures, reached 37.1 trillion yuan in December – equivalent to more than $5 trillion. By trading volume, Dec. 29 was the single busiest day for copper in more than a decade.As well as general supply tightness, metals are finding support from monetary easing by central banks. Lower interest rates typically encourage investors to buy non-yielding assets like metals. A weaker dollar is also a tailwind, with investors piling into the so-called debasement trade.“We’ve seen significant macro allocation flows into commodities,” said Jia Zheng, head of trading at Shanghai Soochow Jiuying Investment Management Co., adding that some equity funds are betting commodity futures will rise alongside stocks this year.\n\nNickel – used in stainless steel and batteries – advanced nearly 6% on the Shanghai Futures Exchange on Wednesday. The most-active aluminum contract closed at its highest since 2021, while copper has shot beyond a milestone 100,000 yuan a ton, defying some bearish signs in the local market including rising inventories.\n\nTurnover on the Guangzhou Futures Exchange — including lithium, palladium, platinum and silicon futures — was around 5.6 trillion yuan in December. This was more than six times higher than the same month in 2024, although some of the Guangzhou contracts are relatively new.\n\nBut questions remain as to whether the scorching rallies have run too far, too fast. As the bull run accelerated in the second half of last year, some of the new capital invested was speculative, said Chi Kai, chief investment officer at Shanghai Cosine Capital Management Partnership.\n\n“This market will test trading skills,” he said. “Easy profits won’t come simply by holding positions – and the risks are increasing.”Volatility is becoming an increasing risk, especially in Guangzhou, where a platinum contract launched at the end of November has already traded either limit-up or limit-down on eight occasions.\n\nFrom mid-December, the Guangzhou bourse also capped new positions and raised fees for lithium carbonate after the contract rallied 35% in the space of around seven weeks. Though open interest has retreated since then, it remains at a historically elevated level. The most-active lithium futures contract rose 4.5% on Wednesday.The Shanghai Futures Exchange will also raise the trading marginand daily price limit for some silver futures from Friday, according to a statement from the exchange. The bourse urged investors in a separate statement to invest rationally, citing recent developments that have caused volatility in metal prices.With base metals starting the year strongly — copper hit a record on the London Metal Exchange earlier this week and the LMEX Index that tracks the six main metals surged to the highest level since 2022 — Chinese investors are likely to stick around. This is reinforced by the presence of macro funds, which tend to hold their positions longer, Shanghai Soochow’s Jia said.\n\n“Looking ahead to the next six months, under the broad backdrop of monetary easing in China and the US, macro capital is unlikely to exit,” she said.\n\nOn the Wire\nVillagers near China’s capital are facing a bitter winter, with many unable to afford gas heating after the phaseout of local subsidies intended to relieve the cost of Beijing’s campaign for cleaner air.\n\nChina kicks off 2026 with 10 straight quarters of falling prices, the longest deflationary streak since the data was first tracked more than three decades ago. China’s December price reports are likely to show a mild letup in deflationary pressure, according to Bloomberg Economics, which also expects credit expansion to have slowed.\n\nCanadian Prime Minister Mark Carney will make an official visit to China next week as his government tries to rebuild relations with the Asian superpower and reduce the country’s economic reliance on the US.\n\nChina is testing Donald Trump’s support for America’s top ally in Asia by imposing export controls on Japan months after the US leader boasted he’d settled the rare earth issue “for the world.” Few countries are better prepared against China threatening their rare-earth supplies than Japan.\n\nChina’s central bank extended its gold-buying streak to 14 months, underscoring sustained official demand for bullion as prices surge to record.\n\n	https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iCBVMyjxZT2c/v0/1200x800.jpg	2026-01-08 02:56:43+03	7	f	2
14	‘Miracle’ update over Martyn as Aussie great sends first message to cricket world after coma	Former Test cricketer Damien Martyn is continuing to make strides in his recovery from a severe bout of meningitis, which left him in an induced coma.\n\nAussie cricketing legend and a former long-time teammate of Martyn, Adam Gilchrist, provided a positive update on Fox Cricket just before the start of Day 5 of the SCG Test.\n“A quick update on Damien Martyn. He’s home. He’s out of hospital and has made an amazing recovery,” Gilchrist revealed.\n\n“He still has a bit of a journey to go and has a bit to work through but fortunately, he’s been allowed to go home and complete that recovery.\n\n“He just wanted to pass on to the cricketing world thank you so much for the love, care and support and interest in his well being.\n\n“That is wonderful news. Not that long ago he was in an induced coma but now he’s at home and recovering.”Isa Guha said it’s “great news” while Mark Waugh replied: “It’s almost a miracle really.\n\n“He was looking in really bad shape when he was in the ICU, wasn’t he?”\n\n“The word from the medical staff was the ambulance officers who treated him as soon as they saw him could not have done it any more perfectly, which nipped the infection in the bud,” Gilchrist said.“He still has a bit of a journey to go, it was extreme, but great news.”\n\nIt’s a miraculous turnaround given the grave fears around Martyn’s health after the 54-year-old was rushed to hospital on Boxing Day and quickly placed into an induced coma.\n\nAnother former Aussie teammate and good friend Justin Langer also shared the news that Martyn is on the road to recovery.\n\n‘Really happy to hear that Damien Martyn has recovered well and is going home this afternoon from hospital,’ Langer said on Channel 7.\n\n‘It’s been a really tough time for him and his family. So, this is really pleasing news.’	https://content.api.news/v3/images/bin/dd0878ed18e9526bba141148bfffd086	2026-01-08 02:26:01+03	5	f	13
15	RISE with SAP: Cloud ERP Adoption Accelerates Ahead of 2027 Deadline - SAPinsider Benchmark Report	A new SAPinsider benchmark report, RISE with SAP 2025, shows adoption of SAP Cloud ERP Private, formerly known as RISE with SAP, accelerating as the 2027 end-of-maintenance deadline for legacy systems approaches.\n\nThe study of 122 SAP professionals finds legacy SAP ECC and SAP Business Suite use has dropped below 50% of respondents, while 30% are fully live on SAP S/4HANA Cloud Private, up from 19% last year. Generative AI is influencing decisions for 43% of respondents, even as security gaps and a shortage of skilled migration resources pose challenges.\n\nRobert Holland, vice president and research director at SAPinsider, will discuss these trends and migration strategies in the webinar RISE with SAP 2025: Adoption, AI, and Security Insights. The webinar, scheduled on Tuesday, January 13, 2026, at 2 p.m. ET, will provide expert analysis and guidance for the 2027 deadline.\n\nWhat the RISE with SAP 2025 Report Reveals About Migration\n\nThe latest benchmark data shows a clear acceleration in cloud ERP adoption, with organizations across industries moving quickly toward either SAP S/4HANA Cloud Private Edition or SAP S/4HANA Cloud Public Edition.\n\nAdoption Accelerates Across Industries\n\nLegacy SAP ECC and Business Suite use has fallen below 50% for the first time, while those who have fully transitioned to SAP S/4HANA Cloud Private Edition rose to 30% in 2025 from 19% last year. Overall, 73% of organizations are at some stage of the transition, from planning to full implementation, across industries.\n\nOrganizational Size Shapes Migration Pace\n\nSmaller organizations (under $2 billion revenue) are moving faster, with 26% fully live versus 14% of larger enterprises, which are more likely to be in the planning or exploration phases (35%) due to longer decision cycles and complex IT landscapes, reflecting longer decision cycles and more complex IT landscapes.\n\nGenerative AI Influences Decisions\n\nGenerative AI capabilities, particularly SAP’s generative AI assistant Joule, are becoming a strategic factor in migration planning. In 2025, 43% of respondents said AI influenced their ERP decisions, up sharply from 14% in 2023. Adoption is driven not only by AI but also by SAP’s dedicated migration support (51%) and license conversion credits (40%), highlighting the importance of commercial incentives alongside technology.\n\nChallenges Remain\n\nOrganizations report that remediating custom code, cleaning data, and securing business-unit support are the top obstacles they face in the transition. Cost and unclear business value are the main barriers for non-adopters, each cited by 43% of respondents. Security compliance gaps persist: only 62% of live users rigorously follow shared responsibility guidelines, and just one-third conduct regular monitoring and auditing.\n\nCloud Infrastructure and Migration Strategies\n\nMicrosoft Azure is the preferred cloud service provider for larger enterprises, while smaller organizations are more likely to select AWS. Hybrid and phased migration approaches remain common, but confidence in moving all SAP workloads to the cloud is growing, rising from 13% in 2024 to 20% in 2025. This reflects greater trust in cloud ERP’s ability to handle complex landscapes.\n\nLearn More About How Peers Are Preparing for the 2027 SAP Deadline\n\nHolland will unpack the report’s findings and offer guidance for organizations navigating SAP Cloud ERP Private adoption during the upcoming research findings webinar.\n\nWith adoption accelerating, smaller organizations moving faster, and larger enterprises still in planning or exploration phases, benchmarking your own migration plans is critical.\n\nHolland will show how peer adoption patterns, the influence of generative AI, and observed security and skills gaps from the benchmark data can inform organizations’ own ERP transition planning and governance before the 2027 end-of-maintenance deadline.\n\nThe session will provide actionable insights for aligning strategy with operational realities, reducing risk, and accelerating transformation across complex IT landscapes.\n\nWhat This Means for ERP Insiders\n\nSAP S/4HANA Cloud Private adoption is accelerating rapidly. The SAPinsider benchmark report shows legacy SAP use has dropped below 50% for the first time, while 30% of organizations are fully live. This milestone shows most enterprises are moving to modern ERP, creating urgency for remaining organizations to accelerate their own migrations.\n\nBenchmarking is essential during periods of technology change. Insights into adoption rates, generative AI influence, and security compliance help organizations prioritize workloads, allocate resources, and anticipate obstacles, strengthening governance ahead of the 2027 end-of-maintenance deadline.\n\nBenchmark with industry leaders. Engaging with peers and experts enables organizations to assess their ERP migration strategies against industry best practices. This comparison highlights gaps, informs resource allocation, and strengthens execution, helping companies protect ROI and maintain competitiveness during rapid cloud transformation.	https://erp.today/wp-content/uploads/2021/06/SAP-Logo.png	2026-01-08 02:25:35+03	1	t	14
16	When a family pillar falls hard	JOHOR BARU: Four years ago, Tan Gim Wai was earning a steady income to support his family. But today, he is bedridden and paralysed from the waist down.\n\nThe 36-year-old, who was then working as a supervisor at a bread factory, suffered a spinal injury while helping to carry heavy baking supplies during a staff shortage.\n\n“I was lugging a 50kg sack of sugar when I struck an object and collapsed.\n\n“The accident turned my life upside down and forced me out of work.\n\n\n“Despite undergoing surgery, my condition deteriorated and I can no longer feel my body from the waist down,” he said in an interview.\n\nAs the sole breadwinner, Tan’s sudden loss of income puts his family in financial hardship. He said he could no longer support his wife, three young children and elderly ­parents.\n\nThe family has since made painful decisions to cope, placing their six-year-old daughter and eight-year-old son at a children’s home, while their eldest son, aged 15, is staying in Penang under the care of Tan’s parents.The teenager has also taken up a part-time job after school to help ease the ­family’s financial burden.\n\n“After the accident and before I became bedridden, I learned leaf carving at home to earn some income, but it was insufficient to cover our expenses. I have also exhausted all my insurance compensation.\n\n“Currently, my wife is doing two jobs as a cleaner and also making leaf carvings to earn a living, while taking care of my daily needs. But it is not enough,” he said.\n\nTan said they are struggling to even cover daily living and medical expenses, let alone set aside funds for further surgery, which could cost up to RM150,000, exclu­ding post-operation rehabilitation.\n\n“I am still young and have my whole life ahead of me. I hope to one day stand up again, bring my children back and unite my whole family,” Tan said.\n\nIn his search for help, Tan found support from Yayasan Kebajikan Suria Johor Baru.\n\nIts founder James Ho said the organi­sation has been assisting Tan for the past few years, providing monthly aid of RM150, along with food and medical supplies.\n\n“Starting this month, we increased the monthly aid to RM550, which will be auto-debited until the end of this year and reviewed thereafter,” he said, adding that the foundation had also helped to settle Tan’s outstanding rent.\n\nHo said the organisation is now assisting the family with fundraising for the surgery and has been in touch with Tan’s doctor to explore more affordable post-surgery physiotherapy options.\n\n“We understand that another RM30,000 to RM40,000 is estimated for his rehabilitation, but we will try to work out a way for him to be referred to a public hospital to cut costs,” he added.	https://apicms.thestar.com.my/uploads/images/2026/01/08/3709789.jpeg	2026-01-08 02:24:56+03	7	f	15
19	Mustafizur Rahman controversy: Amid India-Bangladesh tensions, ex-Bangladesh player recalls help from Sachin Tendulkar, Sourav Ganguly	NEW DELHI: The past week was quite turbulent for the cricket world -- from Mustafizur Rahman being released by the Kolkata Knight Riders in the IPL, to the Bangladesh Cricket Board’s decision not to send its team to India for the upcoming T20 World Cup, and now the ICC stepping in to reassure the BCB.\nBilateral relations between India and Bangladesh have remained strained since the mass uprising in Bangladesh in 2024 that led to the removal of then-Prime Minister Sheikh Hasina, and the ripple effects are now being felt strongly in the sporting sphere as well.Amid this ongoing tussle between the two neighbours, former Bangladesh batter Rajin Saleh revisited a significant moment from his career, recalling the ‘big’ support he received from batting legend Sachin Tendulkar and former India captain Sourav Ganguly.\nSaleh took fans down memory lane to the 2004 tour, when India visited Bangladesh for a Test and ODI series. The assignment proved memorable not just on the field but also for the camaraderie and guidance he experienced from two of Indian cricket’s biggest icons.\n"I was struggling with the bat in that series. I scored two ducks in a Test match and then didn’t have a good outing in the ODIs either. I scored 14 and 0 in the first two matches.I was feeling so down and dejected. My morale was completely ..	https://static.toiimg.com/thumb/msid-126400350,width-1070,height-580,imgsize-39874,resizemode-75,overlay-toi_sw,pt-32,y_pad-500/photo.jpg	2026-01-08 02:45:00+03	5	t	16
21	Sewage in drinking water in Greater Noida: Several fall ill with vomiting, diarrhoea; residents fear Indore-like tragedy	NOIDA: Dozens of residents, including children, have complained of vomiting, diarrhoea and fever after sewage got mixed with the drinking water supply in Greater Noida's Sector Delta 1. On Wednesday, teams from GNIDA and the health department inspected the area, repaired the leak and distributed medicines, ORS, glucose and anti-inflammatory antacids. The authority also collected water samples from the area for tests.\nResidents fear an Indore-like tragedy that claimed multiple lives and left over a hundred hospitalised, and have demanded better monitoring, citing repeated leakages in its three-decade-old pipelines and substandard quality of supply water.GNIDA assistant manager (water dept) Manoj Choudhary told TO ..\nDr Narayan Kishore, CMS, CHC Kasna, told TOI that they recei ..\nPramod Bhati, RWA president of Sector Delta 1, claimed that  ..\n\nAccording to residents, blocked sewer lines in the area had  ..\n	https://static.toiimg.com/thumb/msid-126404411,width-1070,height-580,imgsize-32148,resizemode-75,overlay-toi_sw,pt-32,y_pad-500/photo.jpg	2026-01-08 02:55:00+03	7	t	16
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: rumeysatokur
--

COPY public.refresh_tokens (id, user_id, token_hash, expires_at, created_at) FROM stdin;
11	6	$2b$10$qlK5.pbWRzuQt8/GyzSFKew97zxPqPGT9yTqOhLgNleGlIa2kvLhu	2026-01-18 18:55:45.805	2026-01-11 18:55:45.805594
21	2	$2b$10$0TRJ7gyw.nZX.nU3R3CtfOXXBy0AdyOqFNsdSIz1FEjHAAdo5tl/u	2026-01-19 00:08:34.209	2026-01-12 00:08:34.209559
\.


--
-- Data for Name: sources; Type: TABLE DATA; Schema: public; Owner: rumeysatokur
--

COPY public.sources (id, name, logo_url) FROM stdin;
1	BBC News	https://logos-world.net/wp-content/uploads/2022/01/BBC-Logo.jpg
2	Bloomberg	https://www.shutterstock.com/image-vector/vinnytsia-ukraine-november-9-2023-600nw-2386274527.jpg
3	HealthLine	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLHD67kcOW7cdnRsB4YpiwLP6vpxNWc-CvNw&s
4	NASA	https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/2449px-NASA_logo.svg.png
5	ESPN	https://brandlogos.net/wp-content/uploads/2021/12/espn-brandlogo.net_.png
6	Variety	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-Gb1ny92U2gLvpNGND-hp14_m6tJ4PSA7vg&s
7	The Guardian	https://julianlennon.com/wp-content/uploads/2022/09/guardian-logo-square.jpeg
8	Wired	https://logowik.com/content/uploads/images/703_wired_logo.jpg
9	Forbes	https://logodownload.org/wp-content/uploads/2017/04/forbes-logo-0.png
10	Medical News Today	https://logos.example.com/medical.png
11	Daily Mail Online	https://i.dailymail.co.uk/i/sitelogos/DailyMail_Main.png
12	Bangor Daily News	https://i0.wp.com/bdn-data.s3.amazonaws.com/uploads/2024/09/Just_BDN_Square-180px.jpg?w=1200&ssl=1
13	Fox Sports	https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/FOX_Sports_logo.svg/1200px-FOX_Sports_logo.svg.png
14	ERP Today	https://media.licdn.com/dms/image/v2/C560BAQGMOsuDHGneag/company-logo_200_200/company-logo_200_200/0/1652804225968/erp_today_logo?e=2147483647&v=beta&t=BqaVjCtgsZrZEXtVzihQ59z47vg3ux-gh9uxQqiMVEc
15	The Star	https://cdn.starmediagroup.my/wp-content/uploads/2015/06/04173916/TheStar-logo-white-BG.png
16	Times of India	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRwT-XDAJgO5oCcfk3M6xiW56SBlas9I31Lg&s
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: rumeysatokur
--

COPY public.users (id, email, password, full_name, is_active, created_at) FROM stdin;
2	test@mail.com	$2b$10$7JpGe8wAp1S5tjUA78Ema..iN5FcxTr2N8eIgjyHKtb306.LU4p/y	Rümeysa Tokur	t	2026-01-10 22:17:46.388282
6	mehmet@gmail.com	$2b$10$O.xLo7NO/o3wjgyKC.0.qe8JqVfTJSvUOkEyqNYBqfFaM8B.z.P3G	Mehmet Can	t	2026-01-11 18:55:16.288406
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rumeysatokur
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- Name: news_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rumeysatokur
--

SELECT pg_catalog.setval('public.news_id_seq', 12, true);


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rumeysatokur
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 21, true);


--
-- Name: sources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rumeysatokur
--

SELECT pg_catalog.setval('public.sources_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rumeysatokur
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- Name: categories PK_24dbc6126a28ff948da33e97d3b; Type: CONSTRAINT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY (id);


--
-- Name: news PK_39a43dfcb6007180f04aff2357e; Type: CONSTRAINT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: sources sources_name_key; Type: CONSTRAINT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.sources
    ADD CONSTRAINT sources_name_key UNIQUE (name);


--
-- Name: sources sources_pkey; Type: CONSTRAINT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.sources
    ADD CONSTRAINT sources_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: news FK_12a76d9b0f635084194b2c6aa01; Type: FK CONSTRAINT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT "FK_12a76d9b0f635084194b2c6aa01" FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: news fk_news_source; Type: FK CONSTRAINT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.news
    ADD CONSTRAINT fk_news_source FOREIGN KEY (source_id) REFERENCES public.sources(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: refresh_tokens refresh_tokens_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rumeysatokur
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_userid_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict AGuBRwQf1rWV5E2Xe4BQiPV6tUEST9JIfsgUqpxe6Ema8HmXe6LVZM3w2r0a0dE


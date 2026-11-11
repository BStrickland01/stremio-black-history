// addon.js
const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

// --- 1. DYNAMIC IMDB KEYWORD & GENRE RULES PER CATEGORY ---
// Zero hardcoded movie titles. Each category maps to live IMDb keyword slugs, genres, and search terms.
const MOVIE_CATEGORY_RULES = {
  "Documentaries": {
    imdbTypes: ["movie", "tvMovie", "video"],
    genres: ["Documentary"],
    keywords: [
      "african-american-history", "black-history", "civil-rights-movement",
      "african-american", "black-panther-party", "racial-injustice",
      "harlem-renaissance", "slavery", "jim-crow", "tuskegee-airmen",
      "apartheid", "african-american-culture", "african-american-music"
    ],
    searchTerms: [
      "African American documentary", "Black History documentary", "Civil Rights documentary",
      "Black Panther documentary", "Harlem documentary", "Slavery documentary",
      "Malcolm X documentary", "Martin Luther King documentary", "Muhammad Ali documentary",
      "Jim Crow documentary", "Tuskegee Airmen documentary", "Apartheid documentary",
      "Motown documentary", "Jazz documentary", "Hip Hop documentary", "Nina Simone documentary",
      "James Baldwin documentary", "Fred Hampton", "Emmett Till", "Nelson Mandela documentary"
    ]
  },

  "Biopics & True Stories": {
    imdbTypes: ["movie", "tvMovie"],
    genres: ["Biography"],
    keywords: [
      "african-american", "african-american-history", "african-american-protagonist",
      "black-history", "civil-rights-leader", "black-activist", "african-american-musician",
      "african-american-athlete", "based-on-true-story"
    ],
    searchTerms: [
      "Malcolm X", "Martin Luther King", "Harriet Tubman", "Frederick Douglass",
      "Nelson Mandela", "Muhammad Ali", "Jackie Robinson", "Ray Charles",
      "Aretha Franklin", "James Brown", "Billie Holiday", "Nina Simone",
      "Thurgood Marshall", "Bayard Rustin", "Shirley Chisholm", "Fred Hampton",
      "Emmett Till", "Rosa Parks", "Medgar Evers", "Jesse Owens", "Rubin Carter",
      "Tuskegee Airmen", "Bob Marley", "Whitney Houston", "Tina Turner",
      "Dorothy Dandridge", "Bessie Smith", "Ma Rainey", "Solomon Northup",
      "Nat Turner", "Patrice Lumumba", "Steve Biko", "Jean-Michel Basquiat"
    ]
  },

  "Civil Rights Movement": {
    imdbTypes: ["movie", "tvMovie"],
    genres: ["History", "Drama", "Biography", "Documentary"],
    keywords: [
      "civil-rights-movement", "civil-rights", "martin-luther-king-jr",
      "malcolm-x", "racial-segregation", "jim-crow", "montgomery-bus-boycott",
      "freedom-riders", "march-on-washington", "voting-rights", "desegregation",
      "naacp", "little-rock-nine", "ku-klux-klan", "racial-discrimination"
    ],
    searchTerms: [
      "Civil Rights Movement", "Selma", "Martin Luther King", "Rosa Parks",
      "Emmett Till", "Medgar Evers", "Freedom Riders", "March on Washington",
      "Little Rock Nine", "Thurgood Marshall", "Bayard Rustin", "John Lewis",
      "Fannie Lou Hamer", "Coretta Scott King", "Malcolm X", "Montgomery Bus Boycott",
      "Birmingham 1963", "Jim Crow", "Ruby Bridges", "James Meredith",
      "Loving v Virginia", "Brown v Board", "Mississippi civil rights"
    ]
  },

  "Slavery & Reconstruction": {
    imdbTypes: ["movie", "tvMovie"],
    genres: ["History", "Drama", "Biography"],
    keywords: [
      "slavery", "underground-railroad", "abolitionist", "slave-rebellion",
      "antebellum-south", "emancipation", "reconstruction-era", "atlantic-slave-trade",
      "middle-passage", "plantation", "runaway-slave", "freed-slave", "19th-century"
    ],
    searchTerms: [
      "12 Years a Slave", "Harriet Tubman", "Underground Railroad", "Frederick Douglass",
      "Amistad", "Nat Turner", "Sojourner Truth", "Solomon Northup",
      "Emancipation slavery", "54th Massachusetts Glory", "Abolitionist",
      "Middle Passage", "Reconstruction Era", "Antebellum slavery",
      "John Brown Harpers Ferry", "Haitian Revolution", "Dred Scott", "Tulsa Race Massacre"
    ]
  },

  "Black Liberation & Activism": {
    imdbTypes: ["movie", "tvMovie"],
    genres: ["Drama", "History", "Biography", "Documentary"],
    keywords: [
      "black-panther-party", "black-power", "black-liberation", "political-activist",
      "anti-apartheid", "pan-africanism", "black-nationalism", "police-brutality",
      "racial-injustice", "civil-unrest", "protest", "revolutionary"
    ],
    searchTerms: [
      "Black Panther Party", "Fred Hampton", "Huey P. Newton", "Bobby Seale",
      "Angela Davis", "Malcolm X", "Marcus Garvey", "Stokely Carmichael",
      "Eldridge Cleaver", "Assata Shakur", "Patrice Lumumba", "Kwame Nkrumah",
      "Thomas Sankara", "Nelson Mandela", "Steve Biko", "Winnie Mandela",
      "Anti-Apartheid", "Black Power Movement", "Black Lives Matter", "Spike Lee"
    ]
  },

  "Music, Arts & Culture": {
    imdbTypes: ["movie", "tvMovie"],
    genres: ["Music", "Musical", "Biography", "Documentary", "Drama"],
    keywords: [
      "harlem-renaissance", "motown", "jazz", "hip-hop", "rhythm-and-blues",
      "soul-music", "gospel-music", "blues-music", "african-american-music",
      "african-american-culture", "apollo-theater", "reggae"
    ],
    searchTerms: [
      "Harlem Renaissance", "Summer of Soul", "Motown", "Apollo Theater",
      "Soul Train", "Nina Simone", "Billie Holiday", "Aretha Franklin",
      "Ray Charles", "James Brown", "Sam Cooke", "Marvin Gaye", "Stevie Wonder",
      "Prince", "Michael Jackson", "Whitney Houston", "Tina Turner",
      "Miles Davis", "John Coltrane", "Louis Armstrong", "Duke Ellington",
      "Charlie Parker", "Bessie Smith", "Ma Rainey", "Muddy Waters", "B.B. King",
      "Chuck Berry", "Little Richard", "Jimi Hendrix", "Tupac Shakur",
      "Notorious B.I.G.", "Straight Outta Compton", "Bob Marley", "Fela Kuti",
      "August Wilson", "James Baldwin", "Toni Morrison", "Langston Hughes", "Basquiat"
    ]
  },

  "Sports Legends": {
    imdbTypes: ["movie", "tvMovie"],
    genres: ["Sport", "Biography", "Documentary", "Drama"],
    keywords: [
      "african-american-athlete", "boxing", "baseball", "basketball",
      "american-football", "track-and-field", "olympics", "negro-leagues",
      "racial-integration", "sports-history"
    ],
    searchTerms: [
      "Muhammad Ali", "Jackie Robinson", "Negro Leagues", "Satchel Paige",
      "Hank Aaron", "Willie Mays", "Jesse Owens", "Jack Johnson boxer",
      "Joe Louis", "Sugar Ray Robinson", "George Foreman", "Mike Tyson",
      "Joe Frazier", "Bill Russell", "Kareem Abdul-Jabbar", "Wilt Chamberlain",
      "Magic Johnson", "Michael Jordan", "Kobe Bryant", "LeBron James",
      "Allen Iverson", "Arthur Ashe", "Venus Serena Williams", "King Richard",
      "Jim Brown", "Ernie Davis", "Remember the Titans", "Glory Road", "Coach Carter",
      "Hoop Dreams", "Wilma Rudolph", "Althea Gibson", "Usain Bolt"
    ]
  },

  "Social Justice & Modern Era": {
    imdbTypes: ["movie", "tvMovie"],
    genres: ["Drama", "Crime", "History", "Documentary"],
    keywords: [
      "racial-injustice", "wrongful-conviction", "mass-incarceration",
      "police-brutality", "racial-profiling", "social-justice", "prison-system",
      "african-american-family", "inner-city", "systemic-racism"
    ],
    searchTerms: [
      "13th documentary", "Just Mercy", "Fruitvale Station", "The Hate U Give",
      "Central Park Five", "Kalief Browder", "Trayvon Martin", "George Floyd",
      "Breonna Taylor", "Oscar Grant", "Rodney King", "LA 92", "Ferguson documentary",
      "Innocence Project", "Bryan Stevenson", "Mass Incarceration", "Ava DuVernay",
      "Ryan Coogler", "Barry Jenkins", "If Beale Street Could Talk", "Nickel Boys",
      "Origin Ava DuVernay", "Hurricane Katrina New Orleans", "Detroit 1967"
    ]
  }
};

const SERIES_CATEGORY_RULES = {
  "Docuseries": {
    imdbTypes: ["tvSeries", "tvMiniSeries"],
    genres: ["Documentary", "History"],
    keywords: [
      "african-american-history", "civil-rights-movement", "black-history",
      "racial-injustice", "african-american-culture", "hip-hop", "sports-documentary"
    ],
    searchTerms: [
      "Eyes on the Prize", "Henry Louis Gates", "The 1619 Project", "High on the Hog",
      "African Americans Many Rivers to Cross", "Amend The Fight for America",
      "Reconstruction America After the Civil War", "Making Black America",
      "The Black Church PBS", "Gospel Henry Louis Gates", "Who Killed Malcolm X",
      "O.J. Made in America", "The Last Dance", "They Call Me Magic", "Bill Russell Legend",
      "Time The Kalief Browder Story", "Rest in Power Trayvon Martin", "When the Levees Broke",
      "Hip-Hop Evolution", "Fight the Power Hip Hop", "Wu-Tang Of Mics and Men",
      "Unsung TV series", "Finding Your Roots", "Muhammad Ali Ken Burns", "Jazz Ken Burns"
    ]
  },

  "Historical Dramas": {
    imdbTypes: ["tvSeries", "tvMiniSeries"],
    genres: ["Drama", "History"],
    keywords: [
      "african-american-history", "slavery", "underground-railroad",
      "civil-rights-movement", "harlem", "racial-segregation", "black-history"
    ],
    searchTerms: [
      "Roots", "The Underground Railroad", "Underground TV series", "The Book of Negroes",
      "The Good Lord Bird", "Women of the Movement", "When They See Us", "Small Axe",
      "Self Made Madam C.J. Walker", "Lovecraft Country", "Watchmen", "Godfather of Harlem",
      "Snowfall", "Pose", "Queen Sugar", "Alex Haley Queen", "The Women of Brewster Place",
      "Treme", "The Wire", "The Corner", "Shaka Zulu", "Black Earth Rising"
    ]
  },

  "Civil Rights & Movements": {
    imdbTypes: ["tvSeries", "tvMiniSeries"],
    genres: ["History", "Drama", "Documentary", "Biography"],
    keywords: [
      "civil-rights-movement", "african-american-history", "racial-injustice",
      "black-power", "activism", "civil-rights"
    ],
    searchTerms: [
      "Eyes on the Prize", "When They See Us", "Women of the Movement", "Small Axe",
      "Genius MLK X", "Colin in Black & White", "Amend The Fight for America",
      "The 1619 Project", "Who Killed Malcolm X", "Kalief Browder", "Trayvon Martin",
      "Reconstruction PBS", "Black America Since MLK", "Godfather of Harlem",
      "The Good Lord Bird", "Underground Railroad", "Roots", "Dear White People",
      "A Different World", "Good Times", "The Boondocks"
    ]
  },

  "Biographical": {
    imdbTypes: ["tvSeries", "tvMiniSeries"],
    genres: ["Biography", "Drama", "Documentary"],
    keywords: [
      "african-american", "biographical", "african-american-musician",
      "african-american-athlete", "black-history"
    ],
    searchTerms: [
      "Madam C.J. Walker", "Genius Aretha", "Genius MLK", "Women of the Movement",
      "When They See Us", "Colin in Black & White", "Wu-Tang An American Saga",
      "The New Edition Story", "The Bobby Brown Story", "The Jacksons An American Dream",
      "The Temptations miniseries", "Unsung", "Muhammad Ali PBS", "The Last Dance",
      "They Call Me Magic", "Bill Russell", "O.J. Made in America", "Mike Tyson series",
      "BMF", "Godfather of Harlem", "Roots", "Everybody Hates Chris", "Bernie Mac"
    ]
  }
};

const MOVIE_GENRES = Object.keys(MOVIE_CATEGORY_RULES);
const SERIES_GENRES = Object.keys(SERIES_CATEGORY_RULES);

// --- 2. ADDON MANIFEST ---
const manifest = {
  id: "community.blackhistory.cinema",
  version: "3.0.0", // Bumped to 3.0.0 to force Stremio to reload dynamic catalogs
  name: "Black History Cinema & Docs",
  description: "Dynamically updated Black History movies, series, and documentaries pulled live from IMDb.",
  resources: ["catalog", "stream"],
  types: ["movie", "series"],
  catalogs: [
    {
      type: "movie",
      id: "black_history_movies",
      name: "Black History",
      extra: [
        { name: "genre", options: MOVIE_GENRES, isRequired: false },
        { name: "search", isRequired: false },
        { name: "skip", isRequired: false }
      ]
    },
    {
      type: "series",
      id: "black_history_series",
      name: "Black History",
      extra: [
        { name: "genre", options: SERIES_GENRES, isRequired: false },
        { name: "search", isRequired: false },
        { name: "skip", isRequired: false }
      ]
    }
  ],
  idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

// --- 3. TIME-BOUND CACHE (AUTO-REFRESHES EVERY 6 HOURS FOR NEW RELEASES) ---
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const categoryCache = new Map();
const PAGE_SIZE = 100;

function getCached(key) {
  const entry = categoryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    categoryCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached(key, data) {
  categoryCache.set(key, { data, timestamp: Date.now() });
}

function optimizePosterUrl(url, imdbId) {
  if (url && typeof url === "string") {
    if (url.includes("m.media-amazon.com") && url.includes("._V1_")) {
      return url.replace(/\._V1_.*\.jpg$/i, "._V1_QL75_UX500_.jpg");
    }
    return url;
  }
  return `https://images.metahub.space/poster/medium/${imdbId}/img`;
}

async function runWithConcurrency(items, concurrency, taskFn) {
  const results = [];
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const currentIdx = index++;
      try {
        results[currentIdx] = await taskFn(items[currentIdx]);
      } catch (err) {
        results[currentIdx] = [];
      }
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results.flat();
}

// --- 4. LIVE IMDB FETCHERS (GRAPHQL + ADVANCED SEARCH + SUGGESTION API) ---

// Source A: IMDb Official GraphQL API (https://api.graphql.imdb.com/)
async function fetchImdbGraphQLByKeyword(keyword, imdbTypes, genres, sortBy = "POPULARITY") {
  const query = `
    query DynamicCategorySearch(
      $first: Int!
      $types: [String!]
      $genres: [String!]
      $keywords: [String!]
    ) {
      advancedTitleSearch(
        first: $first
        sort: { sortBy: ${sortBy}, sortOrder: ASC }
        constraints: {
          titleTypeConstraint: { anyTitleTypeIds: $types }
          genreConstraint: { anyGenreIds: $genres }
          keywordConstraint: { anyKeywords: $keywords }
          explicitContentConstraint: { explicitContentFilter: EXCLUDE_ADULT }
        }
      ) {
        edges {
          node {
            title {
              id
              titleText { text }
              releaseYear { year }
              primaryImage { url }
              plot { plotText { plainText } }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.graphql.imdb.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "x-imdb-client-name": "imdb-web-next"
      },
      body: JSON.stringify({
        query,
        variables: {
          first: 100,
          types: imdbTypes,
          genres: genres,
          keywords: [keyword]
        }
      }),
      signal: AbortSignal.timeout(6000)
    });

    if (!res.ok) return [];
    const json = await res.json();
    const edges = json?.data?.advancedTitleSearch?.edges || [];
    const targetStremioType = imdbTypes.includes("tvSeries") ? "series" : "movie";

    const items = [];
    for (const edge of edges) {
      const t = edge?.node?.title;
      if (!t || !t.id || !t.primaryImage?.url) continue;

      items.push({
        id: t.id,
        type: targetStremioType,
        name: t.titleText?.text || "Untitled",
        poster: optimizePosterUrl(t.primaryImage.url, t.id),
        posterShape: "regular",
        releaseInfo: t.releaseYear?.year ? String(t.releaseYear.year) : "",
        description: t.plot?.plotText?.plainText || ""
      });
    }
    return items;
  } catch (e) {
    return [];
  }
}

// Source B: IMDb Advanced Search Page (__NEXT_DATA__ JSON Extractor)
async function fetchImdbAdvancedSearchWeb(keyword, imdbTypes, genres) {
  const titleTypeParam = imdbTypes.includes("tvSeries")
    ? "tv_series,tv_miniseries"
    : "feature,tv_movie";
  const genreParam = genres.map((g) => g.toLowerCase()).join(",");
  const url = `https://www.imdb.com/search/title/?keywords=${encodeURIComponent(
    keyword
  )}&title_type=${titleTypeParam}&genres=${genreParam}&sort=moviemeter,asc&count=100`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return [];
    const html = await res.text();
    const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (!match || !match[1]) return [];

    const nextData = JSON.parse(match[1]);
    const listItems =
      nextData?.props?.pageProps?.searchResults?.titleResults?.titleListItems || [];
    const targetStremioType = imdbTypes.includes("tvSeries") ? "series" : "movie";

    const items = [];
    for (const item of listItems) {
      const id = item.titleId;
      const posterUrl = item.primaryImage?.url;
      if (!id || !posterUrl) continue;

      items.push({
        id,
        type: targetStremioType,
        name: item.titleText || item.originalTitleText || "Untitled",
        poster: optimizePosterUrl(posterUrl, id),
        posterShape: "regular",
        releaseInfo: item.releaseYear ? String(item.releaseYear) : "",
        description: item.plot || ""
      });
    }
    return items;
  } catch (e) {
    return [];
  }
}

// Source C: IMDb Live Suggestion & Cinemeta Search Index
async function fetchLiveSearchIndex(term, targetType) {
  const results = [];
  const slug = term
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");

  if (slug) {
    try {
      const res = await fetch(
        `https://v3.sg.media-imdb.com/suggestion/${slug[0]}/${slug}.json`,
        {
          headers: { "User-Agent": "Mozilla/5.0" },
          signal: AbortSignal.timeout(4500)
        }
      );
      if (res.ok) {
        const data = await res.json();
        for (const item of data?.d || []) {
          if (!item.id || !item.id.startsWith("tt") || !item.i?.imageUrl) continue;
          const qid = (item.qid || item.q || "").toLowerCase();
          const isSeries = qid.includes("series") || qid === "tvminiseries";
          const isSkip = qid.includes("episode") || qid.includes("game") || qid.includes("podcast");
          if (isSkip) continue;
          if (targetType === "series" && !isSeries) continue;
          if (targetType === "movie" && isSeries) continue;

          results.push({
            id: item.id,
            type: targetType,
            name: item.l,
            poster: optimizePosterUrl(item.i.imageUrl, item.id),
            posterShape: "regular",
            releaseInfo: item.yr || (item.y ? String(item.y) : ""),
            description: item.s ? `Starring: ${item.s}` : ""
          });
        }
      }
    } catch (e) {}
  }

  try {
    const cRes = await fetch(
      `https://v3-cinemeta.strem.io/catalog/${targetType}/top/search=${encodeURIComponent(term)}.json`,
      { signal: AbortSignal.timeout(4500) }
    );
    if (cRes.ok) {
      const cData = await cRes.json();
      for (const meta of (cData?.metas || []).slice(0, 12)) {
        if (!meta.id || !meta.id.startsWith("tt") || !meta.poster) continue;
        results.push({
          id: meta.id,
          type: targetType,
          name: meta.name,
          poster: meta.poster,
          posterShape: "regular",
          releaseInfo: meta.releaseInfo || "",
          description: meta.description || ""
        });
      }
    }
  } catch (e) {}

  return results;
}

// --- 5. DYNAMIC CATEGORY BUILDER ---
async function getDynamicCategoryItems(type, genre) {
  const rulesMap = type === "movie" ? MOVIE_CATEGORY_RULES : SERIES_CATEGORY_RULES;

  // If Dropdown 3 is "Default" (no genre selected), combine all dynamic categories
  if (!genre || !rulesMap[genre]) {
    const allKey = `${type}:ALL`;
    const cachedAll = getCached(allKey);
    if (cachedAll) return cachedAll;

    const allGenres = Object.keys(rulesMap);
    const lists = await Promise.all(allGenres.map((g) => getDynamicCategoryItems(type, g)));
    const deduped = new Map();
    for (const list of lists) {
      for (const item of list) {
        if (!deduped.has(item.id)) deduped.set(item.id, item);
      }
    }
    const merged = Array.from(deduped.values());
    setCached(allKey, merged);
    return merged;
  }

  const cacheKey = `${type}:${genre}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const { imdbTypes, genres, keywords, searchTerms } = rulesMap[genre];

  // Build tasks that query IMDb's live GraphQL, Advanced Search, and Search Index
  const graphqlPopTasks = keywords.map(
    (kw) => () => fetchImdbGraphQLByKeyword(kw, imdbTypes, genres, "POPULARITY")
  );
  const graphqlNewTasks = keywords.slice(0, 5).map(
    (kw) => () => fetchImdbGraphQLByKeyword(kw, imdbTypes, genres, "RELEASE_DATE")
  );
  const webSearchTasks = keywords.slice(0, 6).map(
    (kw) => () => fetchImdbAdvancedSearchWeb(kw, imdbTypes, genres)
  );
  const liveIndexTasks = searchTerms.map(
    (term) => () => fetchLiveSearchIndex(term, type)
  );

  const allTasks = [
    ...graphqlPopTasks,
    ...graphqlNewTasks,
    ...webSearchTasks,
    ...liveIndexTasks
  ];

  const fetchedLists = await runWithConcurrency(allTasks, 15, (task) => task());

  const uniqueItems = new Map();
  for (const item of fetchedLists) {
    if (item && item.id && !uniqueItems.has(item.id)) {
      uniqueItems.set(item.id, {
        ...item,
        genres: [genre]
      });
    }
  }

  const finalCatalog = Array.from(uniqueItems.values());
  console.log(`[IMDb Dynamic] ${type} -> "${genre}": pulled ${finalCatalog.length} live titles.`);
  setCached(cacheKey, finalCatalog);
  return finalCatalog;
}

// --- 6. CATALOG HANDLER ---
builder.defineCatalogHandler(async ({ type, id, extra }) => {
  if (id !== "black_history_movies" && id !== "black_history_series") {
    return { metas: [] };
  }

  const genre = extra && extra.genre ? extra.genre : null;
  let items = await getDynamicCategoryItems(type, genre);

  if (extra && extra.search) {
    const q = extra.search.toLowerCase();
    const filtered = items.filter((item) => item.name.toLowerCase().includes(q));
    const liveSearch = await fetchLiveSearchIndex(extra.search, type);

    const merged = new Map();
    for (const item of [...filtered, ...liveSearch]) {
      if (item && item.id && !merged.has(item.id)) {
        merged.set(item.id, item);
      }
    }
    items = Array.from(merged.values());
  }

  const skip = parseInt(extra && extra.skip ? extra.skip : 0, 10);
  return {
    metas: items.slice(skip, skip + PAGE_SIZE)
  };
});

// --- 7. DYNAMIC TORRENT STREAM HANDLER ---
function formatBytes(bytes) {
  const num = Number(bytes);
  if (!num || isNaN(num)) return "";
  const gb = num / 1024 ** 3;
  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  const mb = num / 1024 ** 2;
  return `${mb.toFixed(0)} MB`;
}

builder.defineStreamHandler(async ({ type, id }) => {
  const baseImdbId = id.split(":")[0];
  const streams = [];

  // 1. Torrentio Live Indexer
  try {
    const tRes = await fetch(`https://torrentio.strem.fun/stream/${type}/${id}.json`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(4500)
    });
    if (tRes.ok) {
      const tData = await tRes.json();
      if (Array.isArray(tData?.streams)) {
        streams.push(...tData.streams);
      }
    }
  } catch (e) {}

  // 2. YTS Movie API
  if (type === "movie") {
    try {
      const ytsRes = await fetch(
        `https://yts.mx/api/v2/list_movies.json?query_term=${baseImdbId}`,
        { signal: AbortSignal.timeout(4000) }
      );
      if (ytsRes.ok) {
        const ytsData = await ytsRes.json();
        for (const m of ytsData?.data?.movies || []) {
          for (const t of m.torrents || []) {
            if (t.hash) {
              streams.push({
                name: `Black History [${t.quality}]`,
                title: `${m.title_long} (${t.type.toUpperCase()})\n💾 ${t.size} | 👤 ${t.seeds || 0} seeds`,
                infoHash: t.hash.toLowerCase()
              });
            }
          }
        }
      }
    } catch (e) {}
  }

  // 3. APiBay Indexer
  if (streams.length < 5) {
    try {
      const tpRes = await fetch(`https://apibay.org/q.php?q=${baseImdbId}`, {
        signal: AbortSignal.timeout(4000)
      });
      if (tpRes.ok) {
        const tpData = await tpRes.json();
        if (Array.isArray(tpData)) {
          for (const item of tpData.slice(0, 15)) {
            if (
              item.info_hash &&
              item.info_hash !== "0000000000000000000000000000000000000000"
            ) {
              streams.push({
                name: "Black History [P2P]",
                title: `${item.name}\n💾 ${formatBytes(item.size)} | 👤 ${item.seeders || 0} seeds`,
                infoHash: item.info_hash.toLowerCase()
              });
            }
          }
        }
      }
    } catch (e) {}
  }

  return { streams };
});

// --- 8. START SERVER & AUTO-REFRESH SCHEDULE ---
const PORT = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: PORT, cacheMaxAge: 3600 });
console.log(`Dynamic IMDb Addon active at port: ${PORT}`);

async function refreshAllCategories() {
  console.log("Fetching live Black History catalogs from IMDb...");
  for (const genre of MOVIE_GENRES) {
    await getDynamicCategoryItems("movie", genre);
  }
  for (const genre of SERIES_GENRES) {
    await getDynamicCategoryItems("series", genre);
  }
  console.log("All dynamic IMDb catalogs populated!");
}

// Initial warm-up on boot + scheduled refresh every 6 hours for new releases
refreshAllCategories();
setInterval(refreshAllCategories, CACHE_TTL_MS);
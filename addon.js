// addon.js
const express = require("express");
const { addonBuilder, getRouter } = require("stremio-addon-sdk");

const TMDB_API_KEY = process.env.TMDB_API_KEY || "";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w500";
const STREMIO_PAGE_SIZE = 40; // 2 TMDB pages (20 items each) per Stremio scroll request

const BLACK_PRIMARY_KEYWORDS = [
  "african american",
  "black history",
  "african american culture",
  "african american protagonist",
  "harlem",
  "black family",
  "african american family"
];

// --- 1. DYNAMIC CATEGORY DEFINITIONS (TMDB DISCOVER RULES) ---
const MOVIE_CATEGORY_CONFIG = {
  "Documentaries": {
    withGenres: "99", // Documentary
    primaryKeywords: [
      "african american",
      "black history",
      "civil rights",
      "black panther party",
      "harlem",
      "apartheid",
      "african american culture",
      "african american music"
    ],
    secondaryKeywords: [],
    fallbackQueries: [
      "Black History documentary",
      "African American documentary",
      "Civil Rights documentary"
    ]
  },
  "Biopics & True Stories": {
    withGenres: "36|18", // History OR Drama
    primaryKeywords: [
      "african american",
      "black history",
      "african american protagonist",
      "civil rights leader",
      "african american athlete",
      "african american musician"
    ],
    secondaryKeywords: ["biography", "based on true story", "biopic"],
    fallbackQueries: [
      "Malcolm X",
      "Harriet Tubman",
      "Thurgood Marshall",
      "Shirley Chisholm",
      "Bayard Rustin"
    ]
  },
  "Civil Rights Movement": {
    withGenres: "",
    primaryKeywords: [
      "civil rights movement",
      "civil rights",
      "martin luther king jr",
      "racial segregation",
      "jim crow",
      "freedom riders",
      "voting rights",
      "desegregation",
      "naacp"
    ],
    secondaryKeywords: [],
    fallbackQueries: [
      "Civil Rights Movement",
      "Selma",
      "Emmett Till",
      "Rosa Parks",
      "Medgar Evers"
    ]
  },
  "Slavery & Reconstruction": {
    withGenres: "",
    primaryKeywords: [
      "underground railroad",
      "abolitionist",
      "slave rebellion",
      "antebellum south",
      "reconstruction era",
      "middle passage",
      "atlantic slave trade"
    ],
    secondaryKeywords: [],
    fallbackQueries: [
      "Underground Railroad",
      "Frederick Douglass",
      "12 Years a Slave",
      "Amistad",
      "Nat Turner",
      "Harriet"
    ]
  },
  "Black Liberation & Activism": {
    withGenres: "",
    primaryKeywords: [
      "black panther party",
      "black power",
      "anti-apartheid",
      "pan-africanism",
      "black nationalism",
      "racial injustice"
    ],
    secondaryKeywords: [],
    fallbackQueries: [
      "Black Panther Party",
      "Fred Hampton",
      "Angela Davis",
      "Nelson Mandela",
      "Marcus Garvey"
    ]
  },
  "Music, Arts & Culture": {
    withGenres: "10402|99|18", // Music, Documentary, Drama
    primaryKeywords: [
      "harlem renaissance",
      "motown",
      "african american music",
      "african american culture",
      "hip hop",
      "jazz",
      "soul music",
      "gospel music",
      "blues"
    ],
    secondaryKeywords: [],
    fallbackQueries: [
      "Harlem Renaissance",
      "Motown",
      "Nina Simone",
      "Aretha Franklin",
      "Summer of Soul"
    ]
  },
  "Sports Legends": {
    withGenres: "",
    primaryKeywords: [
      "african american",
      "black history",
      "negro leagues",
      "racial integration"
    ],
    secondaryKeywords: [
      "boxing",
      "baseball",
      "basketball",
      "american football",
      "track and field",
      "olympics",
      "sports"
    ],
    fallbackQueries: [
      "Jackie Robinson",
      "Muhammad Ali",
      "Negro Leagues",
      "Jesse Owens",
      "Arthur Ashe"
    ]
  },
  "Social Justice & Modern Era": {
    withGenres: "18|80|99", // Drama, Crime, Documentary
    primaryKeywords: [
      "racial injustice",
      "wrongful conviction",
      "mass incarceration",
      "police brutality",
      "racial profiling",
      "systemic racism",
      "black lives matter"
    ],
    secondaryKeywords: [],
    fallbackQueries: [
      "Just Mercy",
      "Central Park Five",
      "Fruitvale Station",
      "Mass Incarceration",
      "Innocence Project"
    ]
  },
  "Business": {
    withGenres: "",
    primaryKeywords: [
      "african american",
      "black history",
      "african american culture",
      "african american protagonist",
      "harlem"
    ],
    secondaryKeywords: [
      "business",
      "entrepreneur",
      "startup",
      "entrepreneurship",
      "wall street",
      "banker",
      "mogul",
      "record label",
      "corporate",
      "ceo",
      "fashion industry"
    ],
    fallbackQueries: [
      "Black Wall Street",
      "Boss The Black Experience in Business",
      "Black business",
      "Black entrepreneurs",
      "Madam C.J. Walker",
      "The Banker",
      "Dolemite Is My Name",
      "She Did That"
    ]
  },
  "Stand-up comedy": {
    withGenres: "35", // Comedy (TMDB catalogs stand-up specials as Movies)
    primaryKeywords: [
      "stand-up comedy",
      "stand-up comedian",
      "comedy special"
    ],
    secondaryKeywords: [
      "african american",
      "black history",
      "african american culture",
      "harlem"
    ],
    fallbackQueries: [
      "Dave Chappelle",
      "Kevin Hart",
      "Katt Williams",
      "Chris Rock",
      "Def Comedy Jam",
      "Wanda Sykes",
      "Eddie Murphy",
      "Bernie Mac"
    ]
  }
};

const SERIES_CATEGORY_CONFIG = {
  "Docuseries": {
    withGenres: "99", // Documentary
    primaryKeywords: [
      "african american",
      "black history",
      "civil rights",
      "hip hop",
      "african american culture"
    ],
    secondaryKeywords: [],
    fallbackQueries: [
      "Eyes on the Prize",
      "Henry Louis Gates",
      "1619 Project",
      "High on the Hog"
    ]
  },
  "Historical Dramas": {
    withGenres: "18", // Drama
    primaryKeywords: [
      "african american",
      "black history",
      "underground railroad",
      "civil rights movement",
      "harlem"
    ],
    secondaryKeywords: [],
    fallbackQueries: [
      "Roots",
      "Underground Railroad",
      "Godfather of Harlem",
      "Small Axe",
      "When They See Us"
    ]
  },
  "Civil Rights & Movements": {
    withGenres: "",
    primaryKeywords: [
      "civil rights movement",
      "civil rights",
      "racial injustice",
      "black power",
      "african american history"
    ],
    secondaryKeywords: [],
    fallbackQueries: [
      "Women of the Movement",
      "Amend Fight for America",
      "Eyes on the Prize"
    ]
  },
  "Biographical": {
    withGenres: "18|99", // Drama OR Documentary
    primaryKeywords: ["african american", "black history"],
    secondaryKeywords: [
      "biography",
      "entrepreneur",
      "musician",
      "athlete",
      "based on true story"
    ],
    fallbackQueries: [
      "Self Made Madam C.J. Walker",
      "Wu-Tang An American Saga",
      "The Last Dance",
      "Genius Aretha"
    ]
  },
  "Comedies": {
    withGenres: "35", // Comedy
    primaryKeywords: BLACK_PRIMARY_KEYWORDS,
    secondaryKeywords: [],
    fallbackQueries: [
      "Atlanta",
      "Insecure",
      "Abbott Elementary",
      "Martin",
      "Living Single",
      "The Fresh Prince of Bel-Air",
      "Black-ish",
      "Everybody Hates Chris"
    ]
  },
  "Drama": {
    withGenres: "18", // Drama
    primaryKeywords: BLACK_PRIMARY_KEYWORDS,
    secondaryKeywords: [],
    fallbackQueries: [
      "Snowfall",
      "The Chi",
      "Queen Sugar",
      "Power",
      "Insecure",
      "Pose",
      "Bel-Air",
      "Greenleaf"
    ]
  },
  "Horror": {
    withGenres: "",
    primaryKeywords: BLACK_PRIMARY_KEYWORDS,
    secondaryKeywords: [
      "horror",
      "supernatural",
      "vampire",
      "zombie",
      "haunted",
      "monster",
      "occult",
      "slasher"
    ],
    fallbackQueries: [
      "Lovecraft Country",
      "Them",
      "Swarm",
      "From",
      "The Changeling",
      "Interview with the Vampire"
    ]
  },
  "Action": {
    withGenres: "10759", // Action & Adventure
    primaryKeywords: BLACK_PRIMARY_KEYWORDS,
    secondaryKeywords: [],
    fallbackQueries: [
      "Luke Cage",
      "Black Lightning",
      "The Equalizer",
      "Wu Assassins",
      "Cross",
      "Supacell"
    ]
  },
  "Romance": {
    withGenres: "",
    primaryKeywords: BLACK_PRIMARY_KEYWORDS,
    secondaryKeywords: [
      "romance",
      "love",
      "relationship",
      "romantic",
      "dating",
      "marriage"
    ],
    fallbackQueries: [
      "Insecure",
      "Love Life",
      "Harlem",
      "Run the World",
      "The Game",
      "Girlfriends",
      "Forever"
    ]
  },
  "Holiday": {
    withGenres: "",
    primaryKeywords: BLACK_PRIMARY_KEYWORDS,
    secondaryKeywords: [
      "christmas",
      "holiday",
      "thanksgiving",
      "kwanzaa",
      "new year"
    ],
    fallbackQueries: [
      "The Best Man The Final Chapters",
      "Merry Liddle Christmas",
      "Black Christmas",
      "Holiday"
    ]
  },
  "Western": {
    withGenres: "37", // Western
    primaryKeywords: [
      "african american",
      "black history",
      "civil war",
      "reconstruction era",
      "african american protagonist"
    ],
    secondaryKeywords: [],
    fallbackQueries: [
      "Lawmen Bass Reeves",
      "The Good Lord Bird",
      "Django",
      "Deadwood"
    ]
  },
  "Adventure": {
    withGenres: "10759", // Action & Adventure
    primaryKeywords: BLACK_PRIMARY_KEYWORDS,
    secondaryKeywords: [
      "adventure",
      "quest",
      "journey",
      "survival",
      "exploration"
    ],
    fallbackQueries: [
      "The Underground Railroad",
      "Supacell",
      "Outer Banks",
      "Lupin",
      "Raising Dion"
    ]
  },
  "Sci fi": {
    withGenres: "10765", // Sci-Fi & Fantasy
    primaryKeywords: BLACK_PRIMARY_KEYWORDS,
    secondaryKeywords: [],
    fallbackQueries: [
      "Watchmen",
      "Lovecraft Country",
      "Raising Dion",
      "Supacell",
      "The Changeling",
      "Kindred",
      "Intergalactic"
    ]
  },
  "Crime": {
    withGenres: "80", // Crime
    primaryKeywords: BLACK_PRIMARY_KEYWORDS,
    secondaryKeywords: [],
    fallbackQueries: [
      "The Wire",
      "Snowfall",
      "Power",
      "Godfather of Harlem",
      "BMF",
      "Top Boy",
      "Cross",
      "Lupin"
    ]
  },
  "Sports": {
    withGenres: "",
    primaryKeywords: BLACK_PRIMARY_KEYWORDS,
    secondaryKeywords: [
      "sports",
      "basketball",
      "american football",
      "boxing",
      "baseball",
      "track and field",
      "athlete"
    ],
    fallbackQueries: [
      "All American",
      "The Last Dance",
      "Swagger",
      "Winning Time",
      "Last Chance U",
      "Receiver",
      "They Call Me Magic"
    ]
  },
  "Music": {
    withGenres: "",
    primaryKeywords: BLACK_PRIMARY_KEYWORDS,
    secondaryKeywords: [
      "music",
      "hip hop",
      "rap",
      "jazz",
      "soul music",
      "rhythm and blues",
      "gospel music",
      "record label",
      "musician"
    ],
    fallbackQueries: [
      "Empire",
      "Atlanta",
      "Wu-Tang An American Saga",
      "Hip-Hop Evolution",
      "Unsung",
      "Rhythm + Flow",
      "The Get Down"
    ]
  }
};

const MOVIE_GENRES = Object.keys(MOVIE_CATEGORY_CONFIG);
const SERIES_GENRES = Object.keys(SERIES_CATEGORY_CONFIG);

// --- 2. ADDON MANIFEST ---
const manifest = {
  id: "community.blackhistory.cinema.v4",
  version: "4.2.0",
  name: "Black History Cinema & Docs",
  description:
    "Dynamic Black History movies, documentaries, business stories, stand-up, and TV shows powered by TMDB.",
  resources: ["catalog"],
  types: ["movie", "series"],
  catalogs: [
    {
      type: "movie",
      id: "black_history_movies",
      name: "Black History",
      genres: MOVIE_GENRES,
      extra: [
        { name: "genre", options: MOVIE_GENRES, optionsLimit: 1, isRequired: false },
        { name: "search", isRequired: false },
        { name: "skip", isRequired: false }
      ]
    },
    {
      type: "series",
      id: "black_history_series",
      name: "Black History",
      genres: SERIES_GENRES,
      extra: [
        { name: "genre", options: SERIES_GENRES, optionsLimit: 1, isRequired: false },
        { name: "search", isRequired: false },
        { name: "skip", isRequired: false }
      ]
    }
  ],
  idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

// --- 3. CACHES & DIAGNOSTIC STATS ---
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 hours
const keywordIdCache = new Map();
const externalIdCache = new Map();
const pageCache = new Map();
const stats = {
  startedAt: new Date().toISOString(),
  tmdbKeyConfigured: Boolean(TMDB_API_KEY),
  requestsServed: 0,
  recentRequests: [],
  lastErrors: []
};

function recordError(msg) {
  stats.lastErrors.unshift({ time: new Date().toISOString(), message: msg });
  if (stats.lastErrors.length > 15) stats.lastErrors.pop();
}

async function tmdbFetch(path, params = {}) {
  if (!TMDB_API_KEY) {
    recordError("TMDB_API_KEY environment variable is missing.");
    return null;
  }
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      url.searchParams.set(k, String(v));
    }
  }

  try {
    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(6000) });
    if (!res.ok) {
      recordError(`TMDB ${path} returned HTTP ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    recordError(`TMDB ${path} network error: ${err.message}`);
    return null;
  }
}

async function resolveKeywordIds(phrases) {
  const ids = new Set();
  await Promise.all(
    phrases.map(async (phrase) => {
      const key = phrase.toLowerCase().trim();
      if (keywordIdCache.has(key)) {
        keywordIdCache.get(key).forEach((id) => ids.add(id));
        return;
      }
      const data = await tmdbFetch("/search/keyword", { query: key });
      const matched = (data?.results || [])
        .filter((r) => r.name.toLowerCase() === key || r.name.toLowerCase().includes(key))
        .slice(0, 2)
        .map((r) => r.id);

      keywordIdCache.set(key, matched);
      matched.forEach((id) => ids.add(id));
    })
  );
  return Array.from(ids);
}

async function resolveImdbId(tmdbType, tmdbId) {
  const cacheKey = `${tmdbType}:${tmdbId}`;
  if (externalIdCache.has(cacheKey)) return externalIdCache.get(cacheKey);

  const data = await tmdbFetch(`/${tmdbType}/${tmdbId}/external_ids`);
  const imdbId = data?.imdb_id && data.imdb_id.startsWith("tt") ? data.imdb_id : null;
  externalIdCache.set(cacheKey, imdbId);
  return imdbId;
}

// Batched hydration (15 requests at a time) to prevent TMDB 429 rate-limits & Stremio timeouts
async function hydrateTmdbResults(rawItems, stremioType, genreLabel) {
  const tmdbType = stremioType === "series" ? "tv" : "movie";
  const validItems = rawItems.filter((item) => item && item.id && item.poster_path);
  const metas = [];
  const BATCH_SIZE = 15;

  for (let i = 0; i < validItems.length; i += BATCH_SIZE) {
    const batch = validItems.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        const imdbId = await resolveImdbId(tmdbType, item.id);
        if (!imdbId) return null;

        const title = item.title || item.name || "Untitled";
        const dateStr = item.release_date || item.first_air_date || "";
        const year = dateStr ? dateStr.slice(0, 4) : "";

        return {
          id: imdbId,
          type: stremioType,
          name: title,
          poster: `${TMDB_IMG_BASE}${item.poster_path}`,
          posterShape: "regular",
          releaseInfo: year,
          description: item.overview || "",
          genres: genreLabel ? [genreLabel] : []
        };
      })
    );
    metas.push(...batchResults);
  }

  const deduped = new Map();
  for (const m of metas) {
    if (m && !deduped.has(m.id)) deduped.set(m.id, m);
  }
  return Array.from(deduped.values());
}

// --- 4. ON-DEMAND PAGINATED DISCOVER ENGINE ---
async function fetchDiscoverSlice(stremioType, genreName, skip = 0) {
  const configMap = stremioType === "series" ? SERIES_CATEGORY_CONFIG : MOVIE_CATEGORY_CONFIG;
  const tmdbType = stremioType === "series" ? "tv" : "movie";
  const cacheKey = `${stremioType}:${genreName || "ALL"}:${skip}`;

  const cached = pageCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.metas;
  }

  const activeConfig =
    genreName && configMap[genreName]
      ? configMap[genreName]
      : {
          withGenres: "",
          primaryKeywords: [
            "african american",
            "black history",
            "civil rights movement",
            "harlem renaissance",
            "black panther party",
            "african american culture"
          ],
          secondaryKeywords: [],
          fallbackQueries: ["Black History", "African American"]
        };

  const primaryIds = await resolveKeywordIds(activeConfig.primaryKeywords);
  const secondaryIds = activeConfig.secondaryKeywords.length
    ? await resolveKeywordIds(activeConfig.secondaryKeywords)
    : [];

  let withKeywordsParam = "";
  if (primaryIds.length && secondaryIds.length) {
    withKeywordsParam = `${primaryIds.join("|")},${secondaryIds.join("|")}`;
  } else if (primaryIds.length) {
    withKeywordsParam = primaryIds.join("|");
  }

  const startTmdbPage = Math.floor(skip / 20) + 1;
  const pageNumbers = [startTmdbPage, startTmdbPage + 1];

  const discoverResponses = await Promise.all(
    pageNumbers.map((page) =>
      tmdbFetch(`/discover/${tmdbType}`, {
        sort_by: "popularity.desc",
        include_adult: "false",
        with_keywords: withKeywordsParam,
        with_genres: activeConfig.withGenres,
        page
      })
    )
  );

  let rawResults = discoverResponses.flatMap((res) => res?.results || []);

  if (skip === 0 && activeConfig.fallbackQueries?.length) {
    const fallbackResponses = await Promise.all(
      activeConfig.fallbackQueries.map((q) =>
        tmdbFetch(`/search/${tmdbType}`, { query: q, include_adult: "false", page: 1 })
      )
    );
    const fallbackItems = fallbackResponses.flatMap((res) => (res?.results || []).slice(0, 5));
    rawResults = [...rawResults, ...fallbackItems];
  }

  const metas = await hydrateTmdbResults(rawResults, stremioType, genreName);
  if (metas.length > 0) {
    pageCache.set(cacheKey, { metas, timestamp: Date.now() });
  }
  return metas;
}

// --- 5. CATALOG HANDLER ---
builder.defineCatalogHandler(async ({ type, id, extra }) => {
  if (id !== "black_history_movies" && id !== "black_history_series") {
    return { metas: [] };
  }

  stats.requestsServed++;
  stats.recentRequests.unshift({
    time: new Date().toISOString(),
    handler: true,
    type,
    id,
    extra: extra || {}
  });
  if (stats.recentRequests.length > 15) stats.recentRequests.pop();

  const skip = parseInt(extra?.skip || 0, 10);
  const genre = extra?.genre || null;

  if (extra?.search) {
    const tmdbType = type === "series" ? "tv" : "movie";
    const page = Math.floor(skip / 20) + 1;
    const searchRes = await tmdbFetch(`/search/${tmdbType}`, {
      query: extra.search,
      include_adult: "false",
      page
    });
    const metas = await hydrateTmdbResults(searchRes?.results || [], type, genre);
    return { metas };
  }

  const metas = await fetchDiscoverSlice(type, genre, skip);
  return { metas: metas.slice(0, STREMIO_PAGE_SIZE) };
});

// --- 6. EXPRESS SERVER & DIAGNOSTIC ROUTES ---
const app = express();
const PORT = process.env.PORT || 7000;

app.get("/status", (req, res) => {
  res.json({
    status: "ok",
    version: manifest.version,
    movieCategories: MOVIE_GENRES,
    seriesCategories: SERIES_GENRES,
    cachedPages: pageCache.size,
    resolvedKeywordsCount: keywordIdCache.size,
    ...stats
  });
});

// Log raw catalog URLs and normalize ?genre=... query params into Stremio's path format
app.use("/catalog", (req, res, next) => {
  stats.recentRequests.unshift({
    time: new Date().toISOString(),
    rawUrl: req.originalUrl
  });
  if (stats.recentRequests.length > 15) stats.recentRequests.pop();

  if (req.query.genre && !req.url.includes("genre=")) {
    const encodedGenre = encodeURIComponent(req.query.genre);
    req.url = req.url.replace(/\.json(\?.*)?$/, `/genre=${encodedGenre}.json`);
  }
  next();
});

app.use(getRouter(builder.getInterface()));

app.listen(PORT, () => {
  console.log(`Black History Stremio Addon v${manifest.version} running on port ${PORT}`);
});
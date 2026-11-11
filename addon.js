const { addonBuilder, serveHTTP } = require("stremio-addon-sdk");

// --- 1. FILTER DEFINITIONS (DROPDOWN 3) ---
const MOVIE_GENRES = [
  "Documentaries",
  "Biopics & True Stories",
  "Civil Rights Movement",
  "Slavery & Reconstruction",
  "Black Liberation & Activism",
  "Music, Arts & Culture",
  "Sports Legends",
  "Social Justice & Modern Era"
];

const SERIES_GENRES = [
  "Docuseries",
  "Historical Dramas",
  "Civil Rights & Movements",
  "Biographical"
];

// --- 2. ADDON MANIFEST ---
const manifest = {
  id: "community.blackhistory.cinema",
  version: "1.0.1",
  name: "Black History Cinema & Docs",
  description: "Curated Black History movies, series, and documentaries with torrent streams.",
  resources: ["catalog", "stream"],
  types: ["movie", "series"], // Dropdown 1
  catalogs: [
    // Catalog configuration when Dropdown 1 is "Movies"
    {
      type: "movie",
      id: "black_history_movies",
      name: "Black History", // Dropdown 2
      extra: [
        {
          name: "genre", // Dropdown 3
          options: MOVIE_GENRES,
          isRequired: false
        },
        { name: "search", isRequired: false },
        { name: "skip", isRequired: false }
      ]
    },
    // Catalog configuration when Dropdown 1 is "Series"
    {
      type: "series",
      id: "black_history_series",
      name: "Black History", // Dropdown 2
      extra: [
        {
          name: "genre", // Dropdown 3
          options: SERIES_GENRES,
          isRequired: false
        },
        { name: "search", isRequired: false },
        { name: "skip", isRequired: false }
      ]
    }
  ],
  idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

// --- 3. CURATED BLACK HISTORY DATABASE ---
// Replace the sample 40-character infoHash strings with active torrent infoHashes
const mediaDB = [
  // --- MOVIES ---
  {
    id: "tt5842602",
    type: "movie",
    name: "13th",
    year: 2016,
    categories: ["Documentaries", "Social Justice & Modern Era", "Civil Rights Movement"],
    description: "Ava DuVernay explores the intersection of race, justice, and mass incarceration in the United States.",
    streams: [
      {
        name: "Black History [P2P]",
        title: "13th (2016) 1080p NF WEBRip x264\n💾 2.1 GB | 👤 142 seeds",
        infoHash: "0000000000000000000000000000000000000000",
        fileIdx: 0
      }
    ]
  },
  {
    id: "tt0104797",
    type: "movie",
    name: "Malcolm X",
    year: 1992,
    categories: ["Biopics & True Stories", "Civil Rights Movement", "Black Liberation & Activism"],
    description: "Spike Lee's biographical epic tracing the life of Malcolm X from his youth to his leadership in the Nation of Islam.",
    streams: [
      {
        name: "Black History [P2P]",
        title: "Malcolm X (1992) 1080p BluRay x264\n💾 3.8 GB | 👤 95 seeds",
        infoHash: "0000000000000000000000000000000000000000",
        fileIdx: 0
      }
    ]
  },
  {
    id: "tt1020072",
    type: "movie",
    name: "Selma",
    year: 2014,
    categories: ["Biopics & True Stories", "Civil Rights Movement"],
    description: "A chronicle of Dr. Martin Luther King, Jr.'s 1965 campaign to secure equal voting rights via an epic march from Selma to Montgomery.",
    streams: [
      {
        name: "Black History [P2P]",
        title: "Selma (2014) 1080p BluRay DTS-HD\n💾 4.2 GB | 👤 118 seeds",
        infoHash: "0000000000000000000000000000000000000000",
        fileIdx: 0
      }
    ]
  },
  {
    id: "tt9784798",
    type: "movie",
    name: "Judas and the Black Messiah",
    year: 2021,
    categories: ["Biopics & True Stories", "Black Liberation & Activism", "Civil Rights Movement"],
    description: "The story of Chairman Fred Hampton of the Illinois Black Panther Party and FBI informant William O'Neal.",
    streams: [
      {
        name: "Black History [P2P]",
        title: "Judas and the Black Messiah (2021) 2160p 4K HDR\n💾 14.2 GB | 👤 230 seeds",
        infoHash: "0000000000000000000000000000000000000000",
        fileIdx: 0
      }
    ]
  },
  {
    id: "tt2024544",
    type: "movie",
    name: "12 Years a Slave",
    year: 2013,
    categories: ["Slavery & Reconstruction", "Biopics & True Stories"],
    description: "In the antebellum United States, Solomon Northup, a free Black man from upstate New York, is abducted and sold into slavery.",
    streams: [
      {
        name: "Black History [P2P]",
        title: "12 Years a Slave (2013) 1080p BluRay Remux\n💾 8.4 GB | 👤 167 seeds",
        infoHash: "0000000000000000000000000000000000000000",
        fileIdx: 0
      }
    ]
  },
  {
    id: "tt11418778",
    type: "movie",
    name: "Summer of Soul",
    year: 2021,
    categories: ["Documentaries", "Music, Arts & Culture"],
    description: "Over six weeks in the summer of 1969, thousands attend the Harlem Cultural Festival to celebrate Black history, music, and culture.",
    streams: [
      {
        name: "Black History [P2P]",
        title: "Summer of Soul (2021) 1080p Hulu WEBRip\n💾 3.1 GB | 👤 84 seeds",
        infoHash: "0000000000000000000000000000000000000000",
        fileIdx: 0
      }
    ]
  },
  {
    id: "tt13143964",
    type: "movie",
    name: "Ali: The Whole Story",
    year: 2021,
    categories: ["Documentaries", "Sports Legends", "Black Liberation & Activism"],
    description: "Ken Burns' documentary chronicling the life, boxing dominance, and civil rights resistance of Muhammad Ali.",
    streams: [
      {
        name: "Black History [P2P]",
        title: "Muhammad Ali (2021) Part 1 1080p PBS WEBRip\n💾 4.5 GB | 👤 62 seeds",
        infoHash: "0000000000000000000000000000000000000000",
        fileIdx: 0
      }
    ]
  },

  // --- SERIES ---
  {
    id: "tt7137906",
    type: "series",
    name: "When They See Us",
    year: 2019,
    categories: ["Historical Dramas", "Civil Rights & Movements"],
    description: "Five teens from Harlem become trapped in a nightmare following the wrongful conviction of an assault in Central Park.",
    streams: [
      {
        name: "Black History [P2P]",
        title: "When They See Us S01 1080p NF WEBRip DDP5.1\n💾 7.8 GB | 👤 198 seeds",
        infoHash: "0000000000000000000000000000000000000000",
        fileIdx: 0
      }
    ]
  },
  {
    id: "tt0075572",
    type: "series",
    name: "Roots (1977)",
    year: 1977,
    categories: ["Historical Dramas", "Biographical"],
    description: "A dramatization of author Alex Haley's family line from Kunta Kinte's capture to generations living through slavery and liberation.",
    streams: [
      {
        name: "Black History [P2P]",
        title: "Roots (1977) Complete Miniseries 720p BluRay\n💾 9.1 GB | 👤 75 seeds",
        infoHash: "0000000000000000000000000000000000000000",
        fileIdx: 0
      }
    ]
  },
  {
    id: "tt0092349",
    type: "series",
    name: "Eyes on the Prize",
    year: 1987,
    categories: ["Docuseries", "Civil Rights & Movements"],
    description: "The definitive documentary series examining the American Civil Rights Movement from 1954 to 1985.",
    streams: [
      {
        name: "Black History [P2P]",
        title: "Eyes on the Prize (1987) S01 Complete DVDRip\n💾 5.2 GB | 👤 41 seeds",
        infoHash: "0000000000000000000000000000000000000000",
        fileIdx: 0
      }
    ]
  }
];

// --- 4. CATALOG HANDLER (DISCOVER BROWSER) ---
builder.defineCatalogHandler(async ({ type, id, extra }) => {
  if (id === "black_history_movies" || id === "black_history_series") {
    // 1st Dropdown: Match content type ("movie" or "series")
    let results = mediaDB.filter((item) => item.type === type);

    // 3rd Dropdown: Filter by selected thematic genre
    if (extra && extra.genre) {
      results = results.filter((item) => item.categories.includes(extra.genre));
    }

    // Search bar query
    if (extra && extra.search) {
      const q = extra.search.toLowerCase();
      results = results.filter((item) => item.name.toLowerCase().includes(q));
    }

    // Pagination
    const skip = parseInt(extra && extra.skip ? extra.skip : 0);
    const paginated = results.slice(skip, skip + 30);

    return {
      metas: paginated.map((item) => ({
        id: item.id,
        type: item.type,
        name: item.name,
        // Automatically fetches official high-res posters from Stremio's MetaHub CDN using the IMDb ID
        poster: `https://images.metahub.space/poster/medium/${item.id}/img`,
        description: item.description,
        releaseInfo: String(item.year),
        genres: item.categories
      }))
    };
  }

  return { metas: [] };
});

// --- 5. STREAM HANDLER (PLAYBACK LINKS) ---
builder.defineStreamHandler(async ({ id }) => {
  const baseId = id.split(":")[0];
  const item = mediaDB.find((entry) => entry.id === baseId);

  if (item && item.streams && item.streams.length > 0) {
    return { streams: item.streams };
  }

  return { streams: [] };
});

// --- 6. START SERVER ---
const PORT = process.env.PORT || 7000;
serveHTTP(builder.getInterface(), { port: PORT });
console.log(`Addon active at port: ${PORT}`);
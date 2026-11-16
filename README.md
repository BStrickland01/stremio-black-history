# Black History Cinema & Docs — Stremio Add-on (v4.1.0)

A dynamic Stremio add-on built with `stremio-addon-sdk` and `express` that serves hundreds of Black History movies, documentaries, business stories, and TV series using The Movie Database (TMDB) `/discover` API with true `skip` pagination and IMDb `tt...` ID resolution.

---

## Hosting & Repository Locations

| Component | Location / URL |
| :--- | :--- |
| **Live Hosting Provider** | **Render** (Node.js Web Service: `stremio-black-history`) |
| **Live Base URL** | `https://stremio-black-history.onrender.com` |
| **Stremio Manifest URL** | `https://stremio-black-history.onrender.com/manifest.json` |
| **Diagnostics Endpoint** | `https://stremio-black-history.onrender.com/status` |
| **GitHub Repository** | `https://github.com/BStrickland01/stremio-black-history` (`main` branch) |
| **Local Project Path** | `C:\users\bstri\Code\stremio-black-history-addon` |

---

## Environment Variables & API Keys

| Variable | Required | Description |
| :--- | :--- | :--- |
| `TMDB_API_KEY` | **Yes** | Free **API Key (v3 auth)** from [themoviedb.org/settings/api](https://www.themoviedb.org/settings/api). Add this under **Environment** in your Render service dashboard. |
| `PORT` | Optional | HTTP port bound by Express (defaults to `7000`; Render injects this automatically). |

---

## Categories

* **Movies (9):** Documentaries, Biopics & True Stories, Civil Rights Movement, Slavery & Reconstruction, Black Liberation & Activism, Music, Arts & Culture, Sports Legends, Social Justice & Modern Era, Business.
* **Series / TV Shows (17):** Docuseries, Historical Dramas, Civil Rights & Movements, Biographical, Comedies, Drama, Horror, Action, Romance, Holiday, Western, Adventure, Sci fi, Stand-up comedy, Crime, Sports, Music.

---

## Deployment & Stremio Installation

1. **Configure Render:**
   * Add `TMDB_API_KEY` in Render $\rightarrow$ **Environment**.
   * Verify **Start Command** is `node addon.js` (or `npm start`).
2. **Push to GitHub:**
   ```powershell
   npm install
   git add package.json package-lock.json addon.js README.md
   git commit -m "Deploy TMDB v4.1.0 discover engine with skip pagination and /status route"
   git push origin main
import React, { useState, useEffect } from "react";
import LoginPage from './LoginPage.js';
import SignupPage from "./SignupPage.js";
const TMDB_API_KEY = "72ec76c99f52218577b3608de46c9f72";
const GENRES = {
  comedy: 35,
  action: 28,
  "rom-com": 10749,
  mystery: 9648,
  crime: 80,
  "sci-fi": 878,
};
const MOODS = [
  "happy", "sad", "excited", "depressed", "bored", "less motivated"
];
const PROVIDER_NAME_MAPPING = {
  "Amazon Video": "Amazon Prime", Netflix: "Netflix", "Prime Video": "Amazon Prime",
  "Disney Plus": "Disney+", Hulu: "Hulu", Aha: "Aha", Zee5: "ZEE5",
  JioCinema: "JioCinema", Hotstar: "Disney+ Hotstar"
};
const OTT_LINKS = {
  "Amazon Prime": "https://www.primevideo.com/", Netflix: "https://www.netflix.com/",
  "Disney+": "https://www.disneyplus.com/", Hulu: "https://www.hulu.com/",
  Aha: "https://www.aha.video/", ZEE5: "https://www.zee5.com/",
  JioCinema: "https://www.jiocinema.com/", "Disney+ Hotstar": "https://www.hotstar.com/"
};

// --- Helpers ---
async function fetchWithErrorHandling(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network error");
  return res.json();
}

// --- NavBar ---
function NavBar({ activePage, setActivePage, favoritesCount }) {
  const navBtnStyle = {
    background: "none", border: "none", cursor: "pointer",
    fontSize: 16, paddingBottom: 6, marginRight: 12
  };
  return (
    <nav style={{
      display: "flex", justifyContent: "center", gap: 24,
      padding: 20, backgroundColor: "#0d1117", color: "#c9d1d9",
      borderBottom: "1px solid #30363d"
    }}>
      {["home", "genres",
        `favorites${favoritesCount > 0 ? ` (${favoritesCount})` : ""}`,
        "surprise me"].map((page) => (
          <button key={page}
            onClick={() => setActivePage(page.replace(/\s*\(\d+\)/, ""))}
            style={{
              ...navBtnStyle,
              color: activePage === page.replace(/\s*\(\d+\)/, "") ? "#58a6ff" : "#8b949e",
              fontWeight: activePage === page.replace(/\s*\(\d+\)/, "") ? "bold" : "normal",
              borderBottom: activePage === page.replace(/\s*\(\d+\)/, "") ? "2px solid #58a6ff" : "none"
            }}>
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
    </nav>
  );
}

// --- ChatbotWidget ---
function ChatbotWidget({ minimized, toggleMinimize, onGroupMoodSelect }) {
  const [stage, setStage] = useState("greeting");
  const [selectedMood, setSelectedMood] = useState("");
  const [typing, setTyping] = useState(false);

  const moodGoodbyeNotes = {
    happy: "Keep shining! Enjoy your movie time 😊",
    sad: "Things will get better! Hope the movie comforts you ❤️",
    excited: "Get ready for an adventure! Have fun 🎉",
    depressed: "You're not alone. Wishing you peace and joy 🌟",
    bored: "Time to spice up! Enjoy the surprise 🎬",
    "less motivated": "You got this! Hope this movie inspires you ✨",
  };

  function handleMoodSelect(mood) {
    setSelectedMood(mood); setStage("talking"); setTyping(true);
    setTimeout(() => {
      setTyping(false); setStage("suggested"); onGroupMoodSelect([mood]);
    }, 1400);
  }
  function handleGoodbye() {
    setStage("goodbye"); setTimeout(() => {
      setSelectedMood(""); setStage("greeting");
    }, 3500);
  }

  if (minimized) {
    return (
      <div onClick={toggleMinimize}
        style={{
          position: "fixed", bottom: 24, right: 24, width: 110, height: 40,
          background: "#0078d4", borderRadius: 22, color: "#fff",
          fontWeight: "bold", fontSize: 15, textAlign: "center", cursor: "pointer",
          lineHeight: "40px", boxShadow: "0 4px 24px #3332", userSelect: "none",
          zIndex: 10001,
        }}
        aria-label="Open chatbot" tabIndex={0} title="Chat with CineMatch+">
        Chatbot
      </div>
    );
  }
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, width: 370, minHeight: 420,
      background: "#fff", borderRadius: 18, boxShadow: "0 6px 32px #0078d499",
      display: "flex", flexDirection: "column", zIndex: 10002, padding: 18,
      overflow: "hidden", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}
      role="region" aria-live="polite" aria-atomic="true">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ color: "#0078d4", fontWeight: "bold", fontSize: 17, userSelect: "none" }}>
          🎬 CineMatch+ Movie Buddy
        </div>
        <button style={{
          background: "none", border: "none", fontSize: 22, color: "#0078d4", cursor: "pointer"
        }}
          onClick={toggleMinimize} title="Minimize chat" aria-label="Minimize chatbot">
          &minus;
        </button>
      </div>
      <div style={{
        flex: 1, overflowY: "auto", margin: "16px 0", fontSize: 16, color: "#222"
      }}>
        {stage === "greeting" && (<>
          <p style={{ fontWeight: 500, marginBottom: 8 }}>
            Hello! How are you feeling right now? Choose a mood, and I'll find the perfect movie for you.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {MOODS.map((m) => (
              <button key={m} onClick={() => handleMoodSelect(m)}
                style={{
                  backgroundColor: "#0078d4", color: "#fff", border: "none",
                  borderRadius: 20, padding: "8px 16px", fontWeight: "bold", cursor: "pointer"
                }}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
        </>)}
        {stage === "talking" && (
          <p style={{ fontStyle: "italic", color: "#555" }}>
            {typing ? "Let me find some great movies for you..." : ""}
          </p>
        )}
        {stage === "suggested" && (<>
          <p>
            Here's a list of movies matching your mood "<b>{selectedMood}</b>".
          </p>
          <button onClick={handleGoodbye}
            style={{
              marginTop: 14, backgroundColor: "#0078d4", color: "#fff",
              fontWeight: "bold", fontSize: 16, padding: "8px 18px",
              border: "none", borderRadius: 20, cursor: "pointer"
            }}>
            Thanks!
          </button>
        </>)}
        {stage === "goodbye" && (
          <p style={{ fontStyle: "italic", color: "#666", marginTop: 20 }}>
            {moodGoodbyeNotes[selectedMood] || "Enjoy your movie night! 💫"}
          </p>
        )}
      </div>
    </div>
  );
}

// --- MAIN APP ---
function App() {
  const [user, setUser] = useState(null);
   const [authMode, setAuthMode] = useState("login");
   const [successMessage, setSuccessMessage] = useState("");
   useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const [activePage, setActivePage] = useState("home");
  const [movies, setMovies] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [chatMin, setChatMin] = useState(true);
  const [movieFeedback, setMovieFeedback] = useState({});
  const [surpriseBlockbusters, setSurpriseBlockbusters] = useState([]);
  const [surpriseHiddenGems, setSurpriseHiddenGems] = useState([]);
  const [surpriseLoading, setSurpriseLoading] = useState(false);

  useEffect(() => {
    if (activePage === "home") fetchTrending();
    else if (activePage === "favorites") setMovies(favorites);
    else if (activePage === "surprise me") fetchSurpriseMe();
  }, [activePage, favorites]);

  async function fetchTrending() {
    setLoading(true);
    try {
      const data = await fetchWithErrorHandling(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${TMDB_API_KEY}`
      );
      setMovies(data.results || []);
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }
  async function fetchSurpriseMe() {
    setSurpriseLoading(true);
    try {
      const randPage1 = Math.ceil(Math.random() * 10);
      const randPage2 = Math.ceil(Math.random() * 10);
      const blockbusterRes = await fetchWithErrorHandling(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&vote_count.gte=1000&page=${randPage1}`
      );
      const hiddenGemsRes = await fetchWithErrorHandling(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.asc&vote_count.gte=100&page=${randPage2}`
      );
      setSurpriseBlockbusters(blockbusterRes.results.slice(0, 10));
      setSurpriseHiddenGems(hiddenGemsRes.results.slice(0, 10));
    } catch {
      setSurpriseBlockbusters([]);
      setSurpriseHiddenGems([]);
    } finally {
      setSurpriseLoading(false);
    }
  }
  async function fetchMoviesByGenre(genreId) {
    setLoading(true);
    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`;
      const data = await fetchWithErrorHandling(url);
      setMovies(data.results || []);
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }
  async function fetchMovieDetails(movieId) {
    setLoading(true);
    try {
      const details = await fetchWithErrorHandling(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}`
      );
      const credits = await fetchWithErrorHandling(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`
      );
      const providers = await fetchWithErrorHandling(
        `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
      );
      const similar = await fetchWithErrorHandling(
        `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      const ottData = providers.results?.IN || providers.results?.US || {};
      const ottPlatforms = [
        ...(ottData.flatrate || []),
        ...(ottData.rent || []),
        ...(ottData.buy || []),
      ];
      const uniqueOttPlatforms = ottPlatforms.reduce((acc, curr) => {
        if (!acc.find((p) => p.provider_name === curr.provider_name)) acc.push(curr);
        return acc;
      }, []);
      setModalData({
        ...details,
        cast: credits.cast ? credits.cast.slice(0, 8) : [],
        ott: uniqueOttPlatforms,
        poster: details.poster_path,
        release: details.release_date,
      });
      setSimilarMovies(similar.results ? similar.results.slice(0, 8) : []);
      setModalOpen(true);
    } catch {
      setModalOpen(false);
      setSimilarMovies([]);
    } finally {
      setLoading(false);
    }
  }
  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      if (exists) return prev.filter((m) => m.id !== movie.id);
      return [...prev, movie];
    });
  };
  const isFav = (movie) => favorites.find((m) => m.id === movie.id);
  const handleGroupMoodSelect = async (moods) => {
    if (!moods || moods.length === 0) return;
    setLoading(true);
    try {
      const moodGenreMapping = {
        happy: [35, 10751, 12], sad: [18, 10749], excited: [28, 12, 53],
        depressed: [18, 10752], bored: [35, 99], "less motivated": [99, 10402],
      };
      const selectedGenresSet = new Set();
      moods.forEach((mood) => {
        (moodGenreMapping[mood] || []).forEach((gid) =>
          selectedGenresSet.add(gid)
        );
      });
      const genreIdParam = Array.from(selectedGenresSet).join(",");
      const data = await fetchWithErrorHandling(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreIdParam}&sort_by=popularity.desc`
      );
      setMovies(data.results || []);
      setActivePage("home");
    } catch {
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };
  const handlePostMovieFeedback = (movieId, mood) => {
    setMovieFeedback(prev => ({
      ...prev, [movieId]: mood
    }));
  };
  function movieCard(movie) {
    return (
      <div key={movie.id}
        style={{
          cursor: "pointer", background: "#181a20", borderRadius: 12, padding: 10
        }}
        onClick={() => fetchMovieDetails(movie.id)}>
        <img src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : "https://via.placeholder.com/160x240?text=No+Image"
        }
          alt={movie.title}
          style={{
            width: "100%", borderRadius: 8, marginBottom: 4,
            height: 240, objectFit: "cover"
          }} />
        <div style={{
          fontWeight: "bold", fontSize: 16, color: "#58a6ff",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
        }}>
          {movie.title}
        </div>
        <div style={{ fontSize: 13, color: "#b0b8c7" }}>
          {movie.overview ? movie.overview.substring(0, 110) + "..." : "No description available"}
        </div>
        <div style={{
          fontSize: 12, margin: "4px 0", fontWeight: 600, color: "#ffd700"
        }}>
          Rating: {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
        </div>
      </div>
    );
  }

if (!user) {
  return (
    <div>
      {successMessage && (
  <div style={{ margin: "20px auto", maxWidth: 360, padding: 12, backgroundColor: "#4caf50", color: "white", borderRadius: 8, textAlign: "center", fontWeight: "bold" }}>
    {successMessage}
  </div>
)}

      {authMode === "login" ? (
        <LoginPage
          onLogin={(email) => {
            setUser(email);
            setSuccessMessage("You've logged in successfully!");
          }}
          onSignupClick={() => setAuthMode("signup")}
        />
      ) : (
        <SignupPage
          onSignup={(email) => {
            setUser(email);
            setSuccessMessage("You've signed up successfully!");
          }}
          onLoginClick={() => setAuthMode("login")}
        />
      )}
    </div>
  );
}
  return (
    <div style={{
      minHeight: "100vh", backgroundColor: "#0d1117", color: "#c9d1d9",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <NavBar
        activePage={activePage}
        setActivePage={setActivePage}
        favoritesCount={favorites.length}
      />
      <main style={{ maxWidth: 960, margin: "auto", padding: "20px" }}>
        {activePage === "genres" && (<>
          <h2 style={{ marginBottom: 15 }}>Genres</h2>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: 24
          }}>
            {Object.keys(GENRES).map((genre) => (
              <button key={genre}
                onClick={() => { setActivePage("genres"); fetchMoviesByGenre(GENRES[genre]); }}
                style={{
                  backgroundColor: "#21262d", color: "#58a6ff", border: "none",
                  borderRadius: 20, padding: "8px 16px", fontWeight: "bold",
                  cursor: "pointer", fontSize: 14
                }}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
          {loading ? (<p>Loading...</p>) : movies.length === 0 ? (
            <p style={{ color: "#858585" }}>No movies to show for this genre.</p>
          ) : (
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
              gap: 20
            }}>
              {movies.map((movie) => movieCard(movie))}
            </div>
          )}
        </>)}
        {["home", "favorites"].includes(activePage) && (<>
          <h2 style={{ marginBottom: 15 }}>
            {activePage === "home" ? "Trending Movies" : "Your Favorites"}
          </h2>
          {loading ? (<p>Loading...</p>) : movies.length === 0 ? (
            <p>{activePage === "home"
              ? "No movies to show."
              : "You have no favorite movies yet."}
            </p>
          ) : (
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
              gap: 20
            }}>
              {movies.map((movie) => movieCard(movie))}
            </div>
          )}
        </>)}
        {activePage === "surprise me" && (<>
          <h2>Blockbuster Movies</h2>
          {surpriseLoading ? (<p>Loading...</p>) : (
            <ul style={{
              display: "flex", flexWrap: "wrap", gap: 16,
              paddingLeft: 0, listStyle: "none"
            }}>
              {surpriseBlockbusters.map((movie) => (
                <li style={{ width: 140 }} key={movie.id}>{movieCard(movie)}</li>
              ))}
            </ul>
          )}
          <h2 style={{ marginTop: 30 }}>Hidden Gem Movies</h2>
          {surpriseLoading ? (<p>Loading...</p>) : (
            <ul style={{
              display: "flex", flexWrap: "wrap", gap: 16,
              paddingLeft: 0, listStyle: "none"
            }}>
              {surpriseHiddenGems.map((movie) => (
                <li style={{ width: 140 }} key={movie.id}>{movieCard(movie)}</li>
              ))}
            </ul>
          )}
          <button onClick={fetchSurpriseMe}
            style={{
              marginTop: 24, padding: "10px 20px", backgroundColor: "#0078d4",
              color: "#fff", border: "none", borderRadius: 20, cursor: "pointer"
            }}>
            Refresh Surprise Me
          </button>
        </>)}
      </main>
      <div style={{ position: "fixed", bottom: 24, right: 24 }}>
        <ChatbotWidget
          minimized={chatMin}
          toggleMinimize={() => setChatMin((m) => !m)}
          onGroupMoodSelect={handleGroupMoodSelect}
        />
      </div>
      {modalOpen && modalData && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "rgba(0,0,0,0.95)", display: "flex",
          alignItems: "center", justifyContent: "center", padding: 20,
          zIndex: 100000, overflowY: "auto"
        }}
          onClick={() => setModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#181a20", color: "#c9d1d9", borderRadius: 20,
              padding: 36, width: "95%", maxWidth: 880, boxShadow: "0 0 40px #58a6ff",
              position: "relative", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              overflowY: "auto", maxHeight: "90vh"
            }}>
            <button onClick={() => toggleFavorite(modalData)}
              style={{
                position: "absolute", right: 38, top: 30, background: "rgba(40,45,70,0.90)",
                border: "none", color: isFav(modalData) ? "#ffc70b" : "#fff",
                borderRadius: "50%", width: 44, height: 44, fontSize: 26, cursor: "pointer", zIndex: 2
              }}
              aria-label={isFav(modalData) ? "Remove from favorites" : "Add to favorites"}
              title={isFav(modalData) ? "Remove from favorites" : "Add to favorites"}>
              {isFav(modalData) ? "★" : "☆"}
            </button>
            <button onClick={() => setModalOpen(false)}
              style={{
                position: "absolute", right: 9, top: 15, fontSize: 32,
                color: "#fff", background: "rgba(0,0,0,0.5)", border: "none",
                borderRadius: "50%", width: 44, height: 44, cursor: "pointer"
              }}
              aria-label="Close modal">×</button>
            <div style={{ display: "flex", gap: 32, flexWrap: "wrap", marginBottom: 18 }}>
              <img
                src={modalData.poster ? `https://image.tmdb.org/t/p/w400${modalData.poster}` : "https://via.placeholder.com/300x450?text=No+Image"}
                alt={modalData.title}
                style={{ borderRadius: 14, width: 270, height: "auto", boxShadow: "0 4px 24px #222c" }}
              />
              <div style={{ flex: 1, minWidth: 220 }}>
                <h2 style={{ margin: "0 0 8px 0", color: "#ffc70b" }}>{modalData.title}</h2>
                <div style={{ fontWeight: 600, fontSize: 15, color: "#cfc", marginBottom: 4 }}>
                  {modalData.release?.split("-")[0] || "Year N/A"} &bull; {modalData.runtime ? `${Math.floor(modalData.runtime / 60)}h ${modalData.runtime % 60}m` : "?"}
                  &nbsp;&bull;&nbsp; TMDB: {modalData.vote_average ? modalData.vote_average.toFixed(1) : "--"}
                </div>
                <div style={{ marginBottom: 10 }}>{modalData.overview || "No description available"}</div>
                {modalData.genres && (
                  <div style={{ marginBottom: 8, display: "flex", gap: 7, flexWrap: "wrap" }}>
                    {modalData.genres.map(genre => (<span key={genre.id}
                      style={{ background: "#222b", color: "#94e", borderRadius: 9, fontSize: 14, padding: "2px 11px" }}>
                      {genre.name}</span>
                    ))}
                  </div>
                )}
                <div style={{ color: "#fffa", fontSize: 15, marginTop: 7 }}>
                  <span style={{ fontWeight: 600 }}>Cast: </span>
                  {modalData.cast && modalData.cast.length > 0
                    ? modalData.cast.map((c) => c.name).slice(0, 5).join(", ")
                    : "No cast info"}
                </div>
                <div style={{ marginTop: 18 }}>
                  <div style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>Available On</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {modalData.ott && modalData.ott.length > 0
                      ? modalData.ott.map((provider) => {
                        const mappedName = PROVIDER_NAME_MAPPING[provider.provider_name] || provider.provider_name;
                        const url = OTT_LINKS[mappedName] || "https://www.themoviedb.org/";
                        return (
                          <a key={provider.provider_id} href={url} target="_blank"
                            rel="noopener noreferrer" title={mappedName}
                            style={{
                              background: "#181a24", borderRadius: 8, color: "#d9f", padding: 5,
                              width: 60, display: "flex", flexDirection: "column",
                              alignItems: "center", textDecoration: "none"
                            }}>
                            <img src={`https://www.themoviedb.org/t/p/w92${provider.logo_path}`}
                              alt={mappedName} style={{
                                maxWidth: "100%", borderRadius: 6, background: "#fff2", marginBottom: 4
                              }} />
                            <div style={{ fontSize: 13, textAlign: "center" }}>{mappedName}</div>
                          </a>
                        );
                      })
                      : <div style={{ color: "#888" }}>Not on major platforms</div>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #353", marginTop: 24, paddingTop: 22 }}>
              <div style={{ fontWeight: "bold", fontSize: 19, color: "#98f", marginBottom: 8 }}>
                More Like This
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {similarMovies.length > 0 ? (
                  similarMovies.map(movie => (
                    <div key={movie.id} style={{ width: 130, cursor: "pointer" }}
                      onClick={() => fetchMovieDetails(movie.id)}>
                      <img src={movie.poster_path ?
                        `https://image.tmdb.org/t/p/w300${movie.poster_path}` :
                        "https://via.placeholder.com/130x180?text=No+Image"}
                        alt={movie.title} style={{
                          width: "100%", borderRadius: 7, boxShadow: "0 2px 10px #111a"
                        }} />
                      <div style={{
                        fontSize: 13, marginTop: 4, color: "#58a6ff",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                      }}>
                        {movie.title}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: "#888" }}>No similar movies found.</div>
                )}
              </div>
            </div>
            <div style={{ marginTop: 32, borderTop: "1px solid #333", paddingTop: 22 }}>
              {!movieFeedback[modalData.id] ? (
                <div>
                  <label style={{ fontWeight: "bold", marginRight: 12 }}>How did this movie make you feel?</label>
                  <select
                    onChange={e => handlePostMovieFeedback(modalData.id, e.target.value)}
                    defaultValue=""
                    style={{ padding: 8, borderRadius: 6, fontSize: 15 }}
                  >
                    <option value="" disabled>Select a mood</option>
                    {MOODS.map(mood => (
                      <option key={mood} value={mood}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ color: "#33cc33", fontStyle: "italic", marginTop: 8 }}>
                  Thanks for sharing your feedback!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

```javascript
// Add or edit your YouTube videos here.
// Use the video ID from a YouTube link.
// Example: https://youtu.be/eAfsQoBngKY -> eAfsQoBngKY

const movies = [
  {
    title: "Movie 1",
    category: "Action",
    id: "eAfsQoBngKY"
  },
  {
    title: "Movie 2",
    category: "Entertainment",
    id: "V_pGNyKNrJw"
  },
  {
    title: "Movie 3",
    category: "Drama",
    id: "pjfXpRPHeVY"
  },
  {
    title: "Movie 4",
    category: "Featured",
    id: "CHWwf9nEXbI"
  },
  {
    title: "Movie 5",
    category: "Entertainment",
    id: "cU1zdg61yT4"
  }
];

const gallery = document.getElementById("movieGrid");
const savedGallery = document.getElementById("savedGrid");
const searchInput = document.getElementById("search");
const movieCount = document.getElementById("movieCount");
const emptyMessage = document.getElementById("emptyMessage");
const savedEmpty = document.getElementById("savedEmpty");
const modal = document.getElementById("playerModal");
const playerFrame = document.getElementById("playerFrame");
const playerTitle = document.getElementById("playerTitle");

let activeCategory = "All";
let currentMovies = movies;

function getSavedIds() {
  try {
    return JSON.parse(localStorage.getItem("cinescope-list") || "[]");
  } catch {
    return [];
  }
}

function saveIds(ids) {
  try {
    localStorage.setItem("cinescope-list", JSON.stringify(ids));
  } catch {
    alert("Your browser could not save the list.");
  }
}

function getThumbnail(movie) {
  return `https://i.ytimg.com/vi/${encodeURIComponent(movie.id)}/hqdefault.jpg`;
}

function createCard(movie) {
  const saved = getSavedIds().includes(movie.id);
  const card = document.createElement("article");
  card.className = "movie-card";

  const poster = document.createElement("div");
  poster.className = "poster";

  const image = document.createElement("img");
  image.src = getThumbnail(movie);
  image.alt = `${movie.title} poster`;
  image.loading = "lazy";
  image.onerror = () => {
    image.onerror = null;
    image.src = "https://placehold.co/640x400/10243a/47b8ff?text=Video";
  };

  const playOverlay = document.createElement("div");
  playOverlay.className = "play-overlay";

  const playButton = document.createElement("button");
  playButton.className = "play-button";
  playButton.textContent = "▶";
  playButton.setAttribute("aria-label", `Play ${movie.title}`);
  playButton.addEventListener("click", () => openPlayer(movie));

  const saveButton = document.createElement("button");
  saveButton.className = `save-button${saved ? " saved" : ""}`;
  saveButton.textContent = saved ? "♥" : "♡";
  saveButton.setAttribute("aria-label", saved ? "Remove from My List" : "Save to My List");
  saveButton.addEventListener("click", () => toggleSaved(movie.id));

  playOverlay.appendChild(playButton);
  poster.append(image, playOverlay, saveButton);

  const info = document.createElement("div");
  info.className = "movie-info";

  const title = document.createElement("h3");
  title.textContent = movie.title;

  const meta = document.createElement("div");
  meta.className = "movie-meta";

  const category = document.createElement("span");
  category.className = "category-tag";
  category.textContent = movie.category;

  const type = document.createElement("span");
  type.textContent = "▶ YouTube";

  meta.append(category, type);
  info.append(title, meta);
  card.append(poster, info);

  // Clicking the poster or title also opens the video.
  poster.addEventListener("dblclick", () => openPlayer(movie));
  title.style.cursor = "pointer";
  title.addEventListener("click", () => openPlayer(movie));

  return card;
}

function renderMovies() {
  const query = searchInput.value.trim().toLowerCase();

  currentMovies = movies.filter(movie => {
    const matchesSearch =
      movie.title.toLowerCase().includes(query) ||
      movie.category.toLowerCase().includes(query);

    const matchesCategory =
      activeCategory === "All" || movie.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  gallery.replaceChildren();

  currentMovies.forEach(movie => {
    gallery.appendChild(createCard(movie));
  });

  movieCount.textContent =
    `${currentMovies.length} ${currentMovies.length === 1 ? "title" : "titles"}`;

  emptyMessage.classList.toggle("hidden", currentMovies.length > 0);
}

function renderSaved() {
  const savedIds = getSavedIds();
  const savedMovies = movies.filter(movie => savedIds.includes(movie.id));

  savedGallery.replaceChildren();

  savedMovies.forEach(movie => {
    savedGallery.appendChild(createCard(movie));
  });

  savedEmpty.classList.toggle("hidden", savedMovies.length > 0);
}

function toggleSaved(id) {
  const savedIds = getSavedIds();
  const updatedIds = savedIds.includes(id)
    ? savedIds.filter(savedId => savedId !== id)
    : [...savedIds, id];

  saveIds(updatedIds);
  renderMovies();
  renderSaved();
}

function openPlayer(movie) {
  // The YouTube owner must allow embedding for playback to work.
  const url = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(movie.id)}?autoplay=1&rel=0`;

  playerTitle.textContent = movie.title;
  playerFrame.replaceChildren();

  const iframe = document.createElement("iframe");
  iframe.src = url;
  iframe.title = movie.title;
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";

  playerFrame.appendChild(iframe);
  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closePlayer() {
  modal.classList.add("hidden");
  document.body.classList.remove("modal-open");
  playerFrame.replaceChildren();
}

searchInput.addEventListener("input", renderMovies);

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  renderMovies();
});

document.getElementById("closePlayer").addEventListener("click", closePlayer);

modal.addEventListener("click", event => {
  if (event.target === modal) closePlayer();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closePlayer();
  }
});

// Initial display
renderMovies();
renderSaved();
```

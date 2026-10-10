
// Add or edit your YouTube videos here.
// Use the video ID from the YouTube URL, not the entire URL.
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
    category: "Comedy",
    id: "CHWwf9nEXbI"
  },
  {
    title: "Dhurandhar",
    category: "Entertainment",
    id: "OwXdQGSkoWskHuiR"
  }
];

const movieGrid = document.getElementById("movieGrid");
const savedGrid = document.getElementById("savedGrid");
const searchInput = document.getElementById("search");
const movieCount = document.getElementById("movieCount");
const listCount = document.getElementById("listCount");
const emptyMessage = document.getElementById("emptyMessage");
const savedEmpty = document.getElementById("savedEmpty");
const modal = document.getElementById("videoModal");
const modalTitle = document.getElementById("modalTitle");
const playerContainer = document.getElementById("playerContainer");

let selectedCategory = "All";
let savedIds = [];

try {
  savedIds = JSON.parse(localStorage.getItem("cinescopeSaved")) || [];
} catch {
  savedIds = [];
}

function saveList() {
  localStorage.setItem("cinescopeSaved", JSON.stringify(savedIds));
}

function getThumbnail(id) {
  return `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
}

function createMovieCard(movie) {
  const isSaved = savedIds.includes(movie.id);
  const card = document.createElement("article");
  card.className = "movie-card";

  const poster = document.createElement("div");
  poster.className = "poster";
  poster.tabIndex = 0;
  poster.setAttribute("role", "button");
  poster.setAttribute("aria-label", `Play ${movie.title}`);

  const img = document.createElement("img");
  img.src = getThumbnail(movie.id);
  img.alt = movie.title;
  img.loading = "lazy";

  const fallback = document.createElement("div");
  fallback.className = "poster-fallback";
  fallback.textContent = "▶";
  fallback.hidden = true;

  img.onerror = () => {
    img.hidden = true;
    fallback.hidden = false;
  };

  const badge = document.createElement("div");
  badge.className = "play-badge";
  badge.innerHTML = "<span>▶</span>";

  poster.append(img, fallback, badge);
  poster.addEventListener("click", () => playMovie(movie));
  poster.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      playMovie(movie);
    }
  });

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
  type.textContent = "YouTube";

  meta.append(category, type);

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const playButton = document.createElement("button");
  playButton.type = "button";
  playButton.textContent = "▶ Play";
  playButton.addEventListener("click", () => playMovie(movie));

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = isSaved ? "saved" : "";
  saveButton.textContent = isSaved ? "♥ Saved" : "♡ My List";
  saveButton.addEventListener("click", () => toggleSaved(movie.id));

  actions.append(playButton, saveButton);
  info.append(title, meta, actions);
  card.append(poster, info);

  return card;
}

function renderMovies() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = movies.filter(movie => {
    const matchesSearch =
      movie.title.toLowerCase().includes(query) ||
      movie.category.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "All" ||
      movie.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  movieGrid.replaceChildren(...filtered.map(createMovieCard));
  movieCount.textContent =
    `${filtered.length} ${filtered.length === 1 ? "title" : "titles"}`;

  emptyMessage.hidden = filtered.length > 0;

  document.querySelectorAll(".filter").forEach(button => {
    const active = button.dataset.category === selectedCategory;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  renderSaved();
}

function renderSaved() {
  const savedMovies = movies.filter(movie => savedIds.includes(movie.id));

  savedGrid.replaceChildren(...savedMovies.map(createMovieCard));
  listCount.textContent = savedMovies.length;
  savedEmpty.hidden = savedMovies.length > 0;
}

function toggleSaved(id) {
  if (savedIds.includes(id)) {
    savedIds = savedIds.filter(savedId => savedId !== id);
  } else {
    savedIds.push(id);
  }

  saveList();
  renderMovies();
}

function playMovie(movie) {
  modalTitle.textContent = movie.title;
  playerContainer.replaceChildren();

  const iframe = document.createElement("iframe");
  iframe.src =
    `https://www.youtube-nocookie.com/embed/${encodeURIComponent(movie.id)}`;
  iframe.title = movie.title;
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";

  playerContainer.appendChild(iframe);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closePlayer() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  playerContainer.replaceChildren();
}

searchInput.addEventListener("input", renderMovies);

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest(".filter");
  if (!button) return;

  selectedCategory = button.dataset.category;
  renderMovies();
});

document.getElementById("closeModal").addEventListener("click", closePlayer);

modal.addEventListener("click", event => {
  if (event.target === modal) closePlayer();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closePlayer();
});

document.getElementById("heroListButton").addEventListener("click", () => {
  document.getElementById("my-list").scrollIntoView({ behavior: "smooth" });
});

renderMovies();

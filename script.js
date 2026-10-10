
const movies = [
  {
    title: "Sample Movie 1",
    category: "Action",
    year: "2025",
    rating: "8.4",
    id: "eAfsQoBngKY"
  },
  {
    title: "Sample Movie 2",
    category: "Entertainment",
    year: "2025",
    rating: "7.8",
    id: "V_pGNyKNrJw"
  },
  {
    title: "Sample Movie 3",
    category: "Drama",
    year: "2025",
    rating: "8.1",
    id: "pjfXpRPHeVY"
  },
  {
    title: "Sample Movie 4",
    category: "Featured",
    year: "2025",
    rating: "7.6",
    id: "CHWwf9nEXbI"
  },
  {
    title: "Dhurandhar The Revenge",
    category: "Action",
    year: "2026",
    rating: "8.2",
    id: "QPuWL0ram2I"
  },
  {
    title: "Movie 6",
    category: "New Addition",
    year: "2025",
    rating: "7.9",
    id: "cU1zdg61yT4"
  }
];

const movieGrid = document.getElementById("movieGrid");
const savedGrid = document.getElementById("savedGrid");
const searchInput = document.getElementById("search");
const movieCount = document.getElementById("movieCount");
const noResults = document.getElementById("noResults");
const emptySaved = document.getElementById("emptySaved");
const modal = document.getElementById("videoModal");
const videoFrame = document.getElementById("videoFrame");
const modalTitle = document.getElementById("modalTitle");

let savedIds = [];

try {
  savedIds = JSON.parse(localStorage.getItem("cinescapeSaved") || "[]");
  if (!Array.isArray(savedIds)) savedIds = [];
} catch {
  savedIds = [];
}

function posterUrl(movie) {
  return `https://img.youtube.com/vi/${movie.id}/hqdefault.jpg`;
}

function createCard(movie) {
  const isSaved = savedIds.includes(movie.id);
  const card = document.createElement("article");
  card.className = "movie-card";

  const poster = document.createElement("button");
  poster.className = "poster";
  poster.type = "button";
  poster.setAttribute("aria-label", `Play ${movie.title}`);

  const img = document.createElement("img");
  img.src = posterUrl(movie);
  img.alt = `${movie.title} thumbnail`;
  img.loading = "lazy";
  img.onerror = () => {
    img.style.display = "none";
  };

  const play = document.createElement("span");
  play.className = "play-icon";
  play.textContent = "▶";

  poster.append(img, play);
  poster.addEventListener("click", () => openVideo(movie));

  const content = document.createElement("div");
  content.className = "card-content";

  const titleRow = document.createElement("div");
  titleRow.className = "card-title-row";

  const title = document.createElement("h3");
  title.textContent = movie.title;

  const saveButton = document.createElement("button");
  saveButton.className = `save-btn ${isSaved ? "saved" : ""}`;
  saveButton.type = "button";
  saveButton.textContent = isSaved ? "♥" : "♡";
  saveButton.setAttribute("aria-label", isSaved ? "Remove from My List" : "Add to My List");
  saveButton.addEventListener("click", () => toggleSaved(movie.id));

  titleRow.append(title, saveButton);

  const meta = document.createElement("div");
  meta.className = "card-meta";

  const rating = document.createElement("span");
  rating.className = "rating";
  rating.textContent = `★ ${movie.rating}`;

  const year = document.createElement("span");
  year.textContent = movie.year;

  meta.append(rating, year);

  const category = document.createElement("span");
  category.className = "card-category";
  category.textContent = movie.category;

  content.append(titleRow, meta, category);
  card.append(poster, content);

  return card;
}

function renderMovies() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = movies.filter(movie =>
    `${movie.title} ${movie.category} ${movie.year}`.toLowerCase().includes(query)
  );

  movieGrid.replaceChildren(...filtered.map(createCard));
  movieCount.textContent = `${filtered.length} ${filtered.length === 1 ? "title" : "titles"}`;
  noResults.hidden = filtered.length !== 0;

  renderSaved();
}

function renderSaved() {
  const savedMovies = movies.filter(movie => savedIds.includes(movie.id));

  savedGrid.replaceChildren(...savedMovies.map(createCard));
  emptySaved.hidden = savedMovies.length !== 0;
}

function saveList() {
  try {
    localStorage.setItem("cinescapeSaved", JSON.stringify(savedIds));
  } catch {
    alert("Your browser could not save this list. Check your storage settings.");
  }
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

function openVideo(movie) {
  modalTitle.textContent = movie.title;
  videoFrame.replaceChildren();

  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${movie.id}?autoplay=1&rel=0`;
  iframe.title = movie.title;
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = "strict-origin-when-cross-origin";

  videoFrame.appendChild(iframe);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeVideo() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  videoFrame.replaceChildren();
  document.body.style.overflow = "";
}

searchInput.addEventListener("input", renderMovies);
document.getElementById("closeModal").addEventListener("click", closeVideo);

modal.addEventListener("click", event => {
  if (event.target === modal) closeVideo();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeVideo();
});

renderMovies();

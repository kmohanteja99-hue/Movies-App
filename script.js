```javascript
/* PASSWORD */
const APP_PASSWORD = "varmateja";

function checkPassword() {
  const passwordInput = document.getElementById("passwordInput");
  const passwordError = document.getElementById("passwordError");
  const passwordScreen = document.getElementById("passwordScreen");
  const movieApp = document.getElementById("movieApp");

  if (passwordInput.value === APP_PASSWORD) {
    passwordScreen.style.display = "none";
    movieApp.classList.remove("hidden");
    passwordError.textContent = "";
  } else {
    passwordError.textContent = "❌ Wrong password";
    passwordInput.value = "";
    passwordInput.focus();
  }
}

/* MOVIE SEARCH */
function searchMovie() {
  const input = document.getElementById("search").value.toLowerCase();
  const movies = document.getElementsByClassName("movie");

  for (let i = 0; i < movies.length; i++) {
    const title = movies[i].innerText.toLowerCase();

    movies[i].style.display = title.includes(input) ? "block" : "none";
  }
}
```

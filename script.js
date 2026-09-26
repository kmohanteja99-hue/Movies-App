/* ================= PASSWORD ================= */

const APP_PASSWORD = "varmateja";


function checkPassword() {

  const passwordInput =
    document.getElementById("passwordInput");

  const passwordError =
    document.getElementById("passwordError");

  const passwordScreen =
    document.getElementById("passwordScreen");

  const movieApp =
    document.getElementById("movieApp");


  if (passwordInput.value === APP_PASSWORD) {

    // Hide password screen
    passwordScreen.style.display = "none";

    // Show movie app
    movieApp.classList.remove("hidden");

    // Clear error
    passwordError.textContent = "";

  }

  else {

    passwordError.textContent =
      "❌ Wrong password";

    passwordInput.value = "";

    passwordInput.focus();

  }

}


/* ================= MOVIE SEARCH ================= */

function searchMovie() {

  let input =
    document
      .getElementById("search")
      .value
      .toLowerCase();


  let movies =
    document.getElementsByClassName("movie");


  for (let i = 0; i < movies.length; i++) {

    let title =
      movies[i]
        .innerText
        .toLowerCase();


    if (title.includes(input)) {

      movies[i].style.display = "block";

    }

    else {

      movies[i].style.display = "none";

    }

  }

}

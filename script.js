function searchMovie() {
  let input = document.getElementById("search").value.toLowerCase();
  let movies = document.getElementsByClassName("movie");

  for (let i = 0; i < movies.length; i++) {
    let title = movies[i].innerText.toLowerCase();
    movies[i].style.display = title.includes(input) ? "block" : "none";
  }
}
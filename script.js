```javascript
// VarmaTeja app password
const APP_PASSWORD = "varmateja";

document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const password = document.getElementById("passwordInput").value;
    const error = document.getElementById("passwordError");

    if (password === APP_PASSWORD) {
      document.getElementById("passwordScreen").hidden = true;
      document.getElementById("movieApp").hidden = false;
      error.textContent = "";
    } else {
      error.textContent = "Incorrect password. Try again.";
      document.getElementById("passwordInput").value = "";
    }
  });
});
```

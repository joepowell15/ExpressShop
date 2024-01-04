function Logoff() {
  document.cookie =
    "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "login.html";
}

function CheckForAuthentication() {
  var cookie = document.cookie.split("authToken=")[1];
  var token = null;
  if (cookie) {
    token = JSON.parse(cookie).token;
    if (token) {
      $.getJSON("/Authenticate", { token }, (data) => {
        if (data.authenticated) {
          ShowProfile(true);
          document.querySelector("#TokenUsername").textContent = JSON.parse(cookie).username;
          var elems = document.querySelectorAll('.dropdown-trigger');
          M.Dropdown.init(elems, { coverTrigger: false });
        } else {
          ShowProfile(false);
        }
      });
    } else {
      ShowProfile(false);
    }
  } else {
    ShowProfile(false);
  }
}

function ShowProfile(show) {
  if (show) {
    $("#NavLogin").addClass("hide");
    $("#Profile").removeClass("hide");
  } else {
    $("#NavLogin").removeClass("hide");
    $("#Profile").addClass("hide");
  }
}

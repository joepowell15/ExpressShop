import React, { useEffect } from 'react';

function logoff(): void {
  document.cookie =
    "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "login.html";
}

async function checkForAuthentication() {
  var cookie = document.cookie.split("authToken=")[1];
  var token = null;
  if (cookie) {
    token = JSON.parse(cookie).token;
    if (token) {
      var res = await fetch(`/Authenticate?token=${token}`);
      var data = await res.json();

      if (data.authenticated) {
        showProfile(true);
        var tokenUserNameHolder = document.querySelector("#TokenUsername");
        if (tokenUserNameHolder) {
          tokenUserNameHolder.textContent = JSON.parse(cookie).username;
        }

        var elems = document.querySelectorAll('.dropdown-trigger');
        M.Dropdown.init(elems, { coverTrigger: false });
      } else {
        showProfile(false);
      }
    } else {
      showProfile(false);
    }
  } else {
    showProfile(false);
  }
}

function showProfile(show: boolean) {
  if (show) {
    document.querySelector("#NavLogin")?.classList.add("hide");
    document.querySelector("#Profile")?.classList.remove("hide");
  } else {
    document.querySelector("#NavLogin")?.classList.remove("hide");
    document.querySelector("#Profile")?.classList.add("hide");
  }
}

function NavBar(): React.JSX.Element {
  useEffect(() => {
    checkForAuthentication();
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems, {});
  }, []);

  return <div>
    <div className="navbar-fixed" style={{ marginBottom: '10px' }}>
      <nav>
        <div className="nav-wrapper">
          <a href="#" className="brand-logo logo-text">JP</a>
          <a href="#!" data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons">menu</i></a>
          <ul className="right hide-on-med-and-down">
            <li id="Index">
              <a href="index.html">
                <i className="small material-icons left amber-text">home</i>Home React</a>
            </li>
            <li id="VueIndex">
              <a href="vueIndex.html">
                <i className="small material-icons left blue-text">home</i>Home Vue</a>
            </li>
            <li id="Stock">
              <a href="stockTracker.html">
                <i className="large material-icons left red-text">pie_chart</i>Stock Tracker</a>
            </li>
            <li id="Projects">
              <a href="projects.html">
                <i className="small material-icons left light-blue-text">burst_mode</i>
                Projects Overview
              </a>
            </li>
            <li id="NavLogin" className="hide">
              <a href="login.html"
              ><i className="small material-icons left">account_circle</i>Login</a>
            </li>
            <li id="Profile" className="hide">
              <a href="#!" className="dropdown-trigger waves-effect waves-light" data-target="ProfileDropdown">
                <i className="small material-icons left green-text">account_circle</i><span id="TokenUsername"></span>
                <i className="small material-icons right">arrow_drop_down</i>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo">
        <li><a href="index.html">Home React</a></li>
        <li><a href="vueIndex.html">Home Vue</a></li>
        <li><a href="stockTracker.html">Stock Tracker</a></li>
        <li><a href="projects.html">Projects Overview</a></li>
        <li><a href="login.html">Login</a>
        </li>
      </ul>
    </div>

    <ul id="ProfileDropdown" className="dropdown-content">
      <li><a href="#!" onClick={logoff}>Logoff</a></li>
    </ul>
  </div>
}

export default NavBar;

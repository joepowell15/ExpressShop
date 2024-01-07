import React from 'react';

function logoff(): void {

}

function NavBar(): React.JSX.Element {
  return <div>
    <div className="navbar-fixed" style={{ marginBottom: '10px' }}>
      <nav>
        <div className="nav-wrapper">
          <a href="#" className="brand-logo logo-text">JP</a>
          <a href="#!" data-target="mobile-demo" className="sidenav-trigger"
          ><i className="material-icons">menu</i></a
          >
          <ul className="right hide-on-med-and-down">
            <li id="Index">
              <a href="vueIndex.html"
              ><i className="small material-icons left amber-text">home</i>Home</a
              >
            </li>
            <li id="Stock">
              <a href="stockTracker.html"
              ><i className="large material-icons left red-text">pie_chart</i>Stock
                Tracker</a
              >
            </li>
            <li id="Projects">
              <a href="projects.html"
              ><i className="small material-icons left light-blue-text">burst_mode</i>Projects
                Overview</a
              >
            </li>
            <li id="NavLogin" className="hide">
              <a href="login.html"
              ><i className="small material-icons left">account_circle</i>Login</a
              >
            </li>
            <li id="Profile" className="hide">
              <a href="#!" className="dropdown-trigger waves-effect waves-light" data-target="ProfileDropdown"
              ><i className="small material-icons left green-text">account_circle</i
              ><span id="TokenUsername"></span
              ><i className="small material-icons right">arrow_drop_down</i></a
              >
            </li>
          </ul>
        </div>
      </nav>

      <ul className="sidenav" id="mobile-demo">
        <li><a href="index.html">Home</a></li>
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

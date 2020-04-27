import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
  <div id="header">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow">
      <div class="container">
        <a class="navbar-brand" href="/">
          Traffic Anaylsis
        </a>
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <Link to="/" className="nav-link">
                <i class="far fa-video"></i> Map
              </Link>
            </li>
            <li class="nav-item">
              <Link to="/live-stream" className="nav-link">
                <i class="far fa-video"></i> Live Stream
              </Link>
            </li>
            <li class="nav-item">
              <Link to="/data" className="nav-link">
                <i class="far fa-video"></i> Data Visualization
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>
);

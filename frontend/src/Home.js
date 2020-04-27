import React from 'react';

export default () => (
  <>
    <div class="container">
      <h3 class="header">Traffic Camera Map</h3>

      <div id="camera-map-container"></div>
    </div>

    <script>const cameras = [];</script>

    <script src="/js/cameraMap.js"></script>
  </>
);

import React, { useEffect } from 'react';

export default () => {
  const initMap = async () => {
    const { L } = window;
    const map = L.map('camera-map-container').setView([45.52, -122.67], 12);
    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
      {
        maxZoom: 18,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
      },
    ).addTo(map);

    const res = await fetch('/api/cameras');
    const cameras = await res.json();

    cameras.forEach((camera) => {
      const marker = L.marker(camera.location, {
        title: camera.name,
        riseOnHover: true,
      });

      const link = window.location.href + 'live-stream?id=' + camera.id;
      marker
        .bindPopup(
          `<p><strong>id: </strong>${camera.id}</p>
          <p><strong>name: </strong>${camera.name}</p>
          <p><a href="${link}">Link</a></p>`,
        )
        .openPopup();

      marker.addTo(map);
    });
  };

  useEffect(() => {
    initMap();
  }, []);

  return (
    <div class="container">
      <h3 class="header">Traffic Camera Map</h3>

      <div id="camera-map-container"></div>
    </div>
  );
};

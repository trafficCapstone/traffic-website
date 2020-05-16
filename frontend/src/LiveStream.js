import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Spinner from './Spinner';

export default () => {
  const { id } = useParams();
  const [cameras, setCameras] = useState([]);
  const [currentCamera, setCurrentCamera] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const res = await fetch('/api/cameras');
    const data = await res.json();

    const camera = data.find((c) => c.id === Number(id)) || data[0];
    setCameras(data);
    setCurrentCamera(camera);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div class="row">
        <div class="col-12">
          <h3 class="header">
            <strong>{currentCamera.name}</strong>
          </h3>
        </div>
      </div>

      <div class="row">
        <div class="col-md-2">
          <table id="class-conf" class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Class</th>
                <th scope="col">Conf.</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>

        <div class="col-md-8">
          <div id="video-feed">
            <img class="ml-auto mr-auto" id="play" alt="stream" />
          </div>
        </div>

        <div class="col-md-2">
          <div class="list-group">
            {cameras.map((camera) => (
              <a
                href={`/live-stream/${camera.id}`}
                class={`list-group-item list-group-item-action ${
                  camera.id === currentCamera.id ? 'active' : ''
                }`}
              >
                {camera.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

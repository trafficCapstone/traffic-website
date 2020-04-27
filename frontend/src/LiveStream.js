import React from 'react';

const cameras = [];

export default () => (
  <>
    <div class="row">
      <div class="col-12">
        <h3 class="header">
          <strong>Test</strong>
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
          {cameras.map((camera, index) => (
            <a
              href={`/live-stream?id=${camera.id}`}
              class={`list-group-item list-group-item-action`}
            >
              Test
            </a>
          ))}
        </div>
      </div>
    </div>
  </>
);

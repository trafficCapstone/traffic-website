db.createUser({
  user: 'root',
  pwd: 'capstone2020',
  roles: [{ role: 'readWrite', db: 'main' }],
});

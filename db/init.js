db.createUser({
  user: 'user',
  pwd: 'capstone2020',
  roles: [{ role: 'readWrite', db: 'main' }],
});

const serverPort = 8081

require('./app')
  .listen(serverPort, () => console.log(`Server running on port ${serverPort}`));

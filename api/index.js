require('dotenv').config()

const db = require('./models')

const startApp = async () => {
  try {
    await db.sequelize.authenticate()
    console.log('DB Connection: SUCCESS')

    const serverPort = process.env['SERVER_PORT']
    require('./app')
      .listen(serverPort, () => console.log(`Server running on port ${serverPort}`));
  } catch (err) {
    console.error('DB Connection: FAILURE')
    process.exit()
  }
}

startApp()

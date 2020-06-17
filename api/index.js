require('dotenv').config()

const Sequelize = require('sequelize')
const connection = new Sequelize(process.env['DB_CONNECTION'])

const startApp = async () => {
  try {
    await connection.authenticate()
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

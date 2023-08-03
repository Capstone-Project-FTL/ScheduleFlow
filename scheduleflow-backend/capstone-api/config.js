require('dotenv').config()
require('colors')

// const PORT = process.env.PORT ? Number(process.env.PORT) : 3001
const PORT = process.env.DATABASE_URL || 3001


function getDatabaseURI() {
    const dbUser = process.env.DATABASE_USER || "postgres"
    const dbPass = process.env.DATABASE_USER ? encodeURI(process.env.DATABASE_PASS) : "postgres"
    const dbHost = process.env.DATABASE_HOST || "localhost"
    const dbPort = process.env.DATABASE_PORT || 5432
    const dbName = process.env.DATABASE_NAME || "capstone"

    return process.env.DATABASE_URL || `postgresq://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`
}

module.exports = {
PORT,
getDatabaseURI
}
const app = require('./scr/app')

const PORT = process.env.PORT || 3056

const server = app.listen(PORT, () => {
  console.log(`WSV Ecommerce start with ${PORT}`)
})

process.on('SIGINT', () => {
  server.close(() => console.log(`Exit Server Express`))
})

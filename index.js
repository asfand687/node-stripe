require("dotenv").config()
const express = require("express")
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

const PORT = process.env.PORT || 8080

const app = express()
app.use(express.json())
app.use(express.static("public"))


app.listen(process.env.PORT, () => {
  console.log(`App listening on port: ${PORT}`)
})

require("dotenv").config()
const cors = require("cors")
const express = require("express")
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)

const storeItems = new Map([
  [1, { priceInCents: 10000, name: "Learn React" }],
  [2, { priceInCents: 20000, name: "Learn CSS Today" }]
])

const PORT = process.env.PORT || 8080

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

app.post("/create-checkout-session", async (req, res) => {
  console.log(req.body)
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item.id)
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: storeItem.name
            },
            unit_amount: storeItem.priceInCents
          },
          quantity: item.quantity
        }
      }),
      success_url: `${process.env.SERVER_URL}/success.html`,
      cancel_url: `${process.env.SERVER_URL}/cancel.html`
    })
    res.json({ url: session.url })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(process.env.PORT, () => {
  console.log(`App listening on port: ${PORT}`)
})

const express = require("express")
const app = express()
const { FrontendApi, Configuration } = require("@ory/client")
require('dotenv').config()

const ory = new FrontendApi(
  new Configuration({
    basePath: `https://${process.env.PROJECT_SLUG}.projects.oryapis.com`,
  }),
)

app.get("/whatsup", async function (req, res) {
  const authHeader = req.headers.authorization
  const hasAuthHeader = authHeader.startsWith("Bearer ")
  const sessionToken = hasAuthHeader
    ? authHeader.slice(7, authHeader.length)
    : null

  const session = await ory
    .toSession({
      cookie: req.cookies.join("; "),
      xSessionToken: sessionToken,
    })
    .catch((err) => {
      // Check the error to see if it's a 401 / 403 -> not logged in
      res.status(401).json("unauthenticated")
    })

    res.status(200).json(session)
})

app.listen(3000, function () {
  console.log("Listening on http://localhost:3000")
})
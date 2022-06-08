require('dotenv').config({ path: './config/.env' })

const port = process.env.PORT || 8000

const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")
const knex = require("./db/knex")
const cookieSession = require("cookie-session")
const helmet = require("helmet")

const passport = require("./middleware/passport")

const app = express()


app.use(helmet())
app.use(cookieSession({
	name: 'session',
	maxAge: 24 * 60 * 60 * 1000,
	keys: [process.env.COOKIE_SECRET_N1, process.env.COOKIE_SECRET_N2]
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static(path.join(__dirname, '/statics')))

app.use("/users", require("./routes/user"))
app.use("/messages", require("./routes/message"))
app.use("/auth", require("./routes/auth"))

app.listen(port, () => {
	console.log("http://localhost:"+port)
})
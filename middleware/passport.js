const passport = require("passport")
const { Strategy } = require("passport-google-oauth20")

const knex = require("../db/knex")

passport.use(new Strategy({
	callbackURL: "/auth/google/callback",
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, async (accessToken, refreshToken, profile, done) => {
	let user = await knex.select().from('users').where({ email: profile._json.email }).first()
	if(!user) {
		const users = await knex('users').insert({
			email: profile._json.email,
			name: profile._json.name,
			picture_url: "/pictures/default-user.png",
			list_users: []

		})
		user = users[0]
	}
	done(null, user)
}))

passport.serializeUser((user, done) => {
	done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
	let user = await knex.select().from('users').where({id:id}).first()
	if(!user) done("User not found", null)
	done(null, user)
})

module.exports = passport
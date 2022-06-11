const passport = require("../middleware/passport")

module.exports.getGoogle = passport.authenticate("google", {
	scope: ["email", "profile"]
})

module.exports.getGoogleCallBack = passport.authenticate("google", {
	failureRedirect: "/auth/failure",
	successRedirect: "/auth/success",
	session: true
})

module.exports.failure = (req, res) => {
	// return res.json({ success: false, error: "failure log in" })
	return res.redirect("/")
}

module.exports.success = async (req, res) => {
	return res.redirect("/")
}
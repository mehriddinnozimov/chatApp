// module.exports = (req, res, done) => {
// 	if(!req.user) return res.json({success: false, err: "User not log in"})
// 	done()
// }


// mock auth

const knex = require("../db/knex")

module.exports = async (req, res, done) => {
	const user = await knex.select().from("users").where({ id: 6 }).first()
	req.user = user
	done()
}
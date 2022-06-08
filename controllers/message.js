const multer = require("multer")

const knex = require("../db/knex")

module.exports.getByUserId = async (req, res) => {
	try {
		const messages = await knex.select().from('messages').where({from:req.user.id,for: req.params.userId}).orWhere({ from: req.params.userId, for: req.user.id })
		if(!messages) throw "Message not found"
		return res.json({ success: true, messages })
	} catch (err) {
		if(err.message) err = err.message
		return res.json({ success: false, err })
	}
}

module.exports.create = async (req, res) => {
	try {
		const forUser = await knex.select().from("users").where({ id: req.params.userId }).first()
		if(!forUser) throw "user not found"
		let filename = ""
		if(req.file) filename = `/files/${req.file.filename}`
		const messages = await knex('messages').insert({
			content: req.body.content,
			for: forUser.id,
			from: req.user.id,
			file_url: filename
		}).returning("*")
		if(!req.user.list_users.includes(`${forUser.id}`)) {
			const users = await knex.select().from('users').where({ id: req.user.id }).orWhere({ id: forUser.id })
			users.forEach(async (user, i) => {
				let index = i == 0 ? 1 : 0
				if(users.length == 1) index = 0
				await knex.select().from("users").where({id: user.id}).first().update({
					list_users: knex.raw('array_append(list_users, ?)', [users[index].id])
				})
			})
		}

		const message = messages[0]
		
		return res.json({success: true, message})
	} catch (err) {
		if(err.message) err = err.message
		return res.json({ success: false, err })
	}
}

module.exports.update = async (req, res) => {
	try {
		const messages = await knex.select().from('messages').where({ id:req.params.messageId, from: req.user.id, for: req.params.userId }).first().update({
			content: req.body.content
		}).returning("*")
		if(!messages || messages.length == 0) throw "Message not found"
		const message = messages[0]
		return res.json({ success: true, message })
	} catch (err) {
		if(err.message) err = err.message
		return res.json({ success: false, err })
	}
}

module.exports.removeFile = async (req, res) => {
	try {
		const messages = await knex.select().from('messages').where({ id:req.params.messageId, from: req.user.id, for: req.params.userId }).first().update({
			file_url: ""
		}).returning("*")
		if(!messages || messages.length == 0) throw "Message not found"
		const message = messages[0]
		return res.json({ success: true, message })
	} catch (err) {
		if(err.message) err = err.message
		return res.json({ success: false, err })
	}
}


module.exports.updateDelevired = async (req, res) => {
	try {
		const messages = await knex.select().from('messages').where({ id:req.params.messageId, from: req.params.userId, for: req.user.id }).first().update({
			delevired: true
		}).returning("*")
		if(!messages) throw "Message not found"
		return res.json({ success: true })
	} catch (err) {
		if(err.message) err = err.message
		return res.json({ success: false, err })
	}
}

module.exports.remove = async (req, res) => {
	try {
		const message = await knex.select().from('messages').where({ id: req.params.messageId, from: req.user.id }).del()
		if(!message) throw "Message not found"
	return res.json({ success: true })
	} catch (err) {
		if(err.message) err = err.message
		return res.json({ success: false, err })
	}
}

module.exports.removeByUserId = async (req, res) => {
	try {
		const forUser = await knex.select().from("users").where({ id: req.params.userId }).first()
		if(!forUser) throw "user not found"

		const messages = await knex.select().from('messages').where({ for: req.params.userId, from: req.user.id }).del()
		if(!messages) throw "Messages not found"

		const users = await knex.select().from('users').where({ id: req.user.id }).orWhere({ id: forUser.id })
		users.forEach(async (user, i) => {
			let index = i == 0 ? 1 : 0
			await knex.select().from("users").where({id: user.id}).first().update({
				list_users: knex.raw('array_remove(list_users, ?)', [users[index].id])
			})
		})
		return res.json({ success: true })
	} catch (err) {
		if(err.message) err = err.message
		return res.json({ success: false, err })
	}
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../statics/files')
  },
  filename: async function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "-" + file.originalname)
  }
})

module.exports.upload = multer({
    limits: {
        fileSize: 1000000
    },
    storage: storage
})
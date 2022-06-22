const multer = require("multer")
const sharp = require("sharp")
const fs = require("fs")
const knex = require("../db/knex")

module.exports.getAll = async (req, res) => {
	const page = req.query.page || 1
	const users = await knex.select().from('users').paginate({
		perPage: 10,
		currentPage: page
	})
	return res.json({success: true, users: users.data})
}

module.exports.getUserLength = async (req, res) => {
	const users = await knex.select().from("users")
	return res.json({ success: true, length: users.length })
}

module.exports.getById = async (req, res) => {
	try {
		const user = await knex.select().from('users').where({id: req.params.userId}).first()
		if(!user) throw "User not found"
		return res.json({success: true, user})
	} catch (err) {
		return res.json({ success: false, err })
	}

}

module.exports.getMe = async (req, res) => {
	return res.json({ success: true, user: req.user })
}

module.exports.logout = async (req, res) => {
	req.logout()
	return res.json({ success: true })
}

module.exports.update = async (req, res) => {
	if(!req.body.bio) req.body.bio = ""
	try {
		await knex('users').where('id', req.user.id).update({
			name: req.body.name,
			bio: req.body.bio
		})
		return res.json({ success: true })
	} catch (err) {
		return res.json({ success: false, err })
	}
}

module.exports.remove = async (req, res) => {
	try {
		await knex('users').where({id: req.user.id }).del()
		return res.json({ success: true })
	} catch (err) {
		return res.json({ success: false, err})
	}
}







const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../statics/pictures')
  },
  filename: async function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
  }
})

module.exports.upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(new Error("please upload a jpg/jpeg/png"), null);
        cb(null, true)
    },
    storage: storage
})


module.exports.uploadImage = async (req, res, next) => {
	try {
		console.log(req)
		if(!req.file) throw "File not found"
		await fs.readFile(req.file.path, async (err, data) => {
			if(err) next("Something wrong", null);
			let buffer = Buffer.from(data)
			buffer = await sharp(buffer).resize({width:128, height:128}).png().toBuffer()
			await fs.writeFile(req.file.path, buffer, (err) => {
				if(err) next("Something wrong", null)
			})
		})
		await knex.select().from("users").where({ id: req.user.id }).update({
			picture_url: `/pictures/${req.file.filename}`
		})
		return res.json({ success: true })
	} catch (err) {
		if(err.message) err = err.message
	    return res.json({ success: false, err })
	}
}

module.exports.removePicture = async (req, res)=> {
    const user = await knex("users").where({ id: req.user.id }).upload({
    	picture_url: ""
    })
    return res.json({ success: true, user: req.user })
}
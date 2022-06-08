const router = require("express").Router()

const UserController = require("../controllers/user")
const auth = require("../middleware/auth")

router.get("/", auth, UserController.getAll)
router.get("/profile", auth, UserController.getMe)
router.get("/profile/logout", auth, UserController.logout)
router.get("/:userId", auth, UserController.getById)
router.put("/profile", auth, UserController.update)
router.delete("/profile", auth, UserController.remove)

router.post("/profile/picture", auth, UserController.upload.single("picture"), UserController.uploadImage)
router.delete("/profile/picture", auth, UserController.removePicture)

module.exports = router


const router = require("express").Router()

const MessageController = require("../controllers/message")
const auth = require("../middleware/auth")

router.get("/:userId", auth, MessageController.getByUserId)
router.get("/:userId/:messageId", auth, MessageController.updateDelevired)
router.post("/:userId", auth, MessageController.create)
router.post("/files/:userId", auth, MessageController.upload.single("file"), MessageController.create)
router.put("/:userId/:messageId", auth, MessageController.update)
router.delete("/:userId", auth, MessageController.removeByUserId)
router.delete("/:userId/:messageId", auth, MessageController.remove)

module.exports = router


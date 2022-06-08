const express = require("express")
const router = express.Router()

const AuthController = require("../controllers/auth")

router.get("/google", AuthController.getGoogle)
router.get("/google/callback", AuthController.getGoogleCallBack)
router.get("/failure", AuthController.failure)
router.get("/success", AuthController.success)

module.exports = router
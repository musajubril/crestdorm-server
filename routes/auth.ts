import express from "express"
var router = express.Router()
import cors from "cors"
import AuthController from '../controller/AuthController';
router.use(cors())

router.post("/login", (req, res)=> AuthController.Login(req, res))
router.post("/admin-register", (req, res)=> AuthController.CreateAdmin(req, res))

module.exports = router
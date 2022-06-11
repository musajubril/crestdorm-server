import express from "express"
var router = express.Router()
import cors from "cors"
import AdminController from '../controller/AdminController';
router.use(cors())

router.post("/login", (req, res)=> AdminController.Login(req, res))

module.exports = router
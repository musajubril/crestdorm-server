import express from "express"
var router = express.Router()
import cors from "cors"
import AuthController from '../controller/AuthController';
router.use(cors())

router.post("/login", (req, res)=> AuthController.Login(req, res))
router.post("/admin-register", (req, res)=> AuthController.CreateAdmin(req, res))
router.post("/student-register", (req, res)=> AuthController.CreateStudent(req, res))
router.post("/verify-bursar", (req, res)=> AuthController.VerifyBursar(req, res))

module.exports = router
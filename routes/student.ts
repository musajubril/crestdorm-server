import express from "express"
var router = express.Router()
import cors from "cors"
import StudentController from '../controller/StudentController';
router.use(cors())

router.get("/", (req, res)=> StudentController.GetStudents(req, res))
router.get("/rooms", (req, res)=> StudentController.GetAllRooms(req, res))
router.get("/latest", (req, res)=> StudentController.GetLatestRooms(req, res))
router.post("/login", (req, res)=> StudentController.Login(req, res))
router.post("/register", (req, res)=> StudentController.CreateAccount(req, res))
router.post("/book", (req, res)=> StudentController.BookARoom(req, res))

module.exports = router
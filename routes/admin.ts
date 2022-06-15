import express from "express"
var router = express.Router()
import cors from "cors"
import AdminController from '../controller/AdminController';
router.use(cors())

router.post("/bursar/:booking_id", (req, res)=> AdminController.SendDataToBursar(req, res))
router.delete("/room/:room_id", (req, res)=> AdminController.DeleteRoom(req, res))
router.post("/login", (req, res)=> AdminController.Login(req, res))
router.post("/add_room", (req, res)=> AdminController.AddRoom(req, res))
router.get("/rooms", (req, res)=> AdminController.GetAllRooms(req, res))
router.post("/add_bursar", (req, res)=> AdminController.CreateBursarAccount(req, res))
router.get("/get_bursar", (req, res)=> AdminController.GetBursar(req, res))
router.get("/get_bookings", (req, res)=> AdminController.GetAllBookings(req, res))

module.exports = router
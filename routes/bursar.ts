import express from "express"
var router = express.Router()
import cors from "cors"
import BursarController from '../controller/BursarController';
router.use(cors())

router.post("/login", (req, res)=> BursarController.Login(req, res))
router.get("/bookings", (req, res)=> BursarController.GetAllSentBookings(req, res))
router.get("/dashboard", (req, res)=> BursarController.DashboardData(req, res))
router.post("/not_verified:booking_id", (req, res)=> BursarController.SetNotVerified(req, res))
router.post("/verified:booking_id", (req, res)=> BursarController.SetVerified(req, res))

module.exports = router
import express from "express"
var router = express.Router()
import cors from "cors"
import BursarController from '../controller/BursarController';
router.use(cors())

router.post("/login", (req, res)=> BursarController.Login(req, res))
router.post("/not_verified", (req, res)=> BursarController.SetNotVerified(req, res))
router.post("/verified", (req, res)=> BursarController.SetVerified(req, res))

module.exports = router
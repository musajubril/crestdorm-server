"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const cors_1 = __importDefault(require("cors"));
const StudentController_1 = __importDefault(require("../controller/StudentController"));
router.use((0, cors_1.default)());
router.get("/", (req, res) => StudentController_1.default.GetStudents(req, res));
router.get("/rooms", (req, res) => StudentController_1.default.GetAllRooms(req, res));
router.get("/latest", (req, res) => StudentController_1.default.GetLatestRooms(req, res));
router.post("/login", (req, res) => StudentController_1.default.Login(req, res));
router.post("/register", (req, res) => StudentController_1.default.CreateAccount(req, res));
router.post("/book", (req, res) => StudentController_1.default.BookARoom(req, res));
module.exports = router;

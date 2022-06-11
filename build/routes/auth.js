"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const cors_1 = __importDefault(require("cors"));
const AuthController_1 = __importDefault(require("../controller/AuthController"));
router.use((0, cors_1.default)());
router.post("/login", (req, res) => AuthController_1.default.Login(req, res));
router.post("/admin-register", (req, res) => AuthController_1.default.CreateAdmin(req, res));
router.post("/student-register", (req, res) => AuthController_1.default.CreateStudent(req, res));
module.exports = router;

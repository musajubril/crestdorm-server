"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const cors_1 = __importDefault(require("cors"));
const BursarController_1 = __importDefault(require("controller/BursarController"));
router.use((0, cors_1.default)());
router.post("/login", (req, res) => BursarController_1.default.Login(req, res));
router.post("/not_verified", (req, res) => BursarController_1.default.SetNotVerified(req, res));
router.post("/verified", (req, res) => BursarController_1.default.SetVerified(req, res));
module.exports = router;

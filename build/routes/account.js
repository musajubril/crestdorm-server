"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const cors_1 = __importDefault(require("cors"));
const AccountController_1 = __importDefault(require("controller/AccountController"));
router.use((0, cors_1.default)());
router.get("/", (req, res) => AccountController_1.default.GetAccounts(req, res));
router.post("/add", (req, res) => AccountController_1.default.AddAccount(req, res));
module.exports = router;

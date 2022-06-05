"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Student_1 = __importDefault(require("models/Student"));
const HandleResponse_1 = require("HandleResponse");
const key = process.env.SECRET_KEY || "secret";
class AuthController {
    static AdminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            yield Student_1.default.findOne({ email }).then((user) => {
                if (user) {
                    if (bcryptjs_1.default.compareSync(password, user.password)) {
                        const payload = {
                            userId: user._id,
                            email: user.email,
                            phone_number: user.email
                        };
                        let token = jsonwebtoken_1.default.sign(payload, key);
                        res.json(token);
                    }
                    else {
                        res.json({ error: "Passwords do not match" });
                    }
                }
                else {
                    res.json({
                        error: "User does not exist",
                    });
                }
            });
        });
    }
    static BursarLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            yield Student_1.default.findOne({ email }).then((user) => {
                if (user) {
                    if (bcryptjs_1.default.compareSync(password, user.password)) {
                        const payload = {
                            userId: user._id,
                            email: user.email,
                            phone_number: user.phone_number
                        };
                        let token = jsonwebtoken_1.default.sign(payload, key);
                        res.json(token);
                    }
                    else {
                        res.json({ error: "Passwords do not match" });
                    }
                }
                else {
                    res.json({
                        error: "User does not exist",
                    });
                }
            });
        });
    }
    static StudentLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            // console.log(req.body);
            yield Student_1.default.findOne({ email }).then((user) => {
                if (user) {
                    if (bcryptjs_1.default.compareSync(password, user.password)) {
                        const payload = {
                            userId: user._id,
                            email: user.email,
                            phone_number: user.email
                        };
                        let token = jsonwebtoken_1.default.sign(payload, key);
                        res.json(token);
                    }
                    else {
                        res.json({ error: "Passwords do not match" });
                    }
                }
                else {
                    res.json({
                        error: "User does not exist",
                    });
                }
            });
        });
    }
    static CreateAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, email, phone_number } = req.body;
            const NewUser = {
                password,
                email,
                phone_number
            };
            bcryptjs_1.default.hash(password, 10, (err, hash) => {
                Student_1.default.findOne({ email }).then((user) => {
                    if (user) {
                        console.log(user);
                        (0, HandleResponse_1.HandleResponse)(res, 500, `${email} exists already`, user);
                    }
                    if (!user) {
                        // console.log(users)
                        Student_1.default.create({
                            password: hash,
                            email,
                            phone_number
                        }).then(() => {
                            (0, HandleResponse_1.HandleResponse)(res, 200, `${email} added to the user list successfully`, NewUser);
                        });
                    }
                })
                    .catch((err) => {
                    res.send("error" + err);
                });
            });
        });
    }
    static GetUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Student_1.default.find().then(users => {
                console.log(users);
                users && res.json({ message: "All users Retrieved Successfully", data: users, total: users.length });
                !users && res.json({ message: "Unexpected Error" });
            });
        });
    }
}
exports.default = AuthController;

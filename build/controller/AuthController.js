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
const Student_1 = __importDefault(require("../models/Student"));
const Bursar_1 = __importDefault(require("../models/Bursar"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const HandleResponse_1 = require("../HandleResponse");
const key = process.env.SECRET_KEY || "secret";
class AuthController {
    static VerifyBursar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const NewUser = {
                email: email.toLowerCase(), password, phone_number: null, account_type: "Bursar"
            };
            console.log(NewUser);
            yield Bursar_1.default.findOne({ email: email.toLowerCase() })
                .then((bursar) => __awaiter(this, void 0, void 0, function* () {
                console.log(bursar);
                if (bursar) {
                    yield Bursar_1.default.findOneAndUpdate({ email: email.toLowerCase() }, {
                        $set: { verified: true }
                    }, {
                        new: true,
                        runValidators: true,
                        upsert: true,
                        returnOriginal: false,
                        returnNewDocument: true
                    }).exec()
                        .then(() => {
                        bcryptjs_1.default.hash(password, 10, (err, hash) => __awaiter(this, void 0, void 0, function* () {
                            NewUser.password = hash;
                            NewUser.phone_number = bursar.phone_number;
                            yield User_1.default.create(NewUser).then((user) => __awaiter(this, void 0, void 0, function* () {
                                yield Bursar_1.default.findOneAndUpdate({ email: email.toLowerCase() }, {
                                    $set: { user_id: user._id }
                                }, {
                                    new: true,
                                    runValidators: true,
                                    upsert: true,
                                    returnOriginal: false,
                                    returnNewDocument: true
                                }).exec()
                                    .then(() => {
                                    (0, HandleResponse_1.HandleResponse)(res, 200, `${bursar.full_name} account verification successful`, bursar);
                                });
                            }));
                        }));
                    });
                }
                else {
                    (0, HandleResponse_1.HandleResponse)(res, 500, `can't find an account with email: ${email}`, email);
                }
            }));
        });
    }
    static Login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            console.log(email, password);
            yield User_1.default.findOne({ email: email.toLowerCase() }).then((user) => {
                if (user) {
                    if (user.account_type === "Student") {
                        console.log("Student");
                        if (bcryptjs_1.default.compareSync(password, user.password)) {
                            Student_1.default.findOne({ student_id: user._id }).then(student => {
                                const payload = {
                                    userId: user._id,
                                    email: user.email,
                                    phone_number: user.email,
                                    account_type: user.account_type,
                                    full_name: student.full_name,
                                    matric_number: student.matric_number,
                                    jamb_number: student.jamb_number,
                                    gender: student.gender,
                                    date_created: student.created,
                                    date_modified: student.modified
                                };
                                let token = jsonwebtoken_1.default.sign(payload, key);
                                res.json(token);
                            });
                        }
                        else {
                            res.status(500).json({ error: "Passwords do not match" });
                        }
                    }
                    if (user.account_type === "Bursar") {
                        console.log("Bursar");
                        if (bcryptjs_1.default.compareSync(password, user.password)) {
                            Bursar_1.default.findOne({ user_id: user._id }).then(bursar => {
                                const payload = {
                                    userId: user._id,
                                    email: user.email,
                                    phone_number: user.email,
                                    account_type: user.account_type,
                                    full_name: bursar.full_name,
                                    admin_id: bursar.admin_id,
                                    date_created: bursar.created,
                                    date_modified: bursar.modified
                                };
                                let token = jsonwebtoken_1.default.sign(payload, key);
                                res.json(token);
                            });
                        }
                        else {
                            res.status(500).json({ error: "Passwords do not match" });
                        }
                    }
                    if (user.account_type === "Admin") {
                        console.log("Admin");
                        if (bcryptjs_1.default.compareSync(password, user.password)) {
                            const payload = {
                                admin_id: user._id,
                                email: user.email,
                                phone_number: user.email,
                                account_type: user.account_type
                            };
                            let token = jsonwebtoken_1.default.sign(payload, key);
                            res.json(token);
                        }
                        else {
                            res.json({ error: "Passwords do not match" });
                        }
                    }
                }
                else {
                    res.status(401).json({
                        error: "User does not exist",
                    });
                }
            });
        });
    }
    static CreateStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, email, phone_number, full_name, matric_number, jamb_number, gender, admin_id } = req.body;
            const NewStudent = {
                email, phone_number, full_name, matric_number, jamb_number, gender, student_id: "", admin_id
            };
            const NewUser = {
                password, email, phone_number, account_type: "Student"
            };
            bcryptjs_1.default.hash(password, 10, (err, hash) => {
                User_1.default.findOne({ email: email.toLowerCase(), phone_number }).then((user) => {
                    if (user) {
                        console.log(user);
                        (0, HandleResponse_1.HandleResponse)(res, 500, `An account with the email: ${full_name} exists already`, user);
                    }
                    if (!user) {
                        NewUser.password = hash;
                        User_1.default.create(NewUser).then(() => __awaiter(this, void 0, void 0, function* () {
                            yield User_1.default.findOne({ email: email.toLowerCase(), phone_number, account_type: "Student" })
                                .then(verifiedUser => {
                                NewStudent.student_id = verifiedUser._id;
                                Student_1.default.create(NewStudent).then(() => {
                                    (0, HandleResponse_1.HandleResponse)(res, 200, `${full_name} registration successful`, Object.assign(Object.assign({}, NewStudent), { created: verifiedUser.created, modified: verifiedUser.modified }));
                                });
                            });
                        }));
                    }
                })
                    .catch((err) => {
                    res.send("error" + err);
                });
            });
        });
    }
    static CreateAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, email, phone_number } = req.body;
            const NewUser = {
                password, email, phone_number, account_type: "Admin"
            };
            bcryptjs_1.default.hash(password, 10, (err, hash) => {
                User_1.default.findOne({ email: email.toLowerCase(), phone_number, account_type: "Admin" }).then((user) => {
                    if (user) {
                        console.log(user);
                        (0, HandleResponse_1.HandleResponse)(res, 500, `An account with the email: ${email} exists already`, user);
                    }
                    if (!user) {
                        NewUser.password = hash;
                        User_1.default.create(NewUser).then(() => {
                            (0, HandleResponse_1.HandleResponse)(res, 200, `${email} registration successful`, email);
                        });
                    }
                    ;
                })
                    .catch((err) => {
                    res.send("error" + err);
                });
            });
        });
    }
    static GetUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield User_1.default.find().then(user => {
                console.log(user);
                user && res.json({ message: "All user Retrieved Successfully", data: user, total: user.length });
                !user && res.json({ message: "Unexpected Error" });
            });
        });
    }
}
exports.default = AuthController;

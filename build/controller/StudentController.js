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
const Room_1 = __importDefault(require("./../models/Room"));
const Booking_1 = __importDefault(require("./../models/Booking"));
const key = process.env.SECRET_KEY || "secret";
class StudentController {
    static Login(req, res) {
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
    static CreateAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { password, email, phone_number, full_name, matric_number, jamb_number, gender } = req.body;
            const NewUser = {
                password, email, phone_number, full_name, matric_number, jamb_number, gender
            };
            bcryptjs_1.default.hash(password, 10, (err, hash) => {
                Student_1.default.findOne({ email, phone_number, gender }).then((user) => {
                    if (user) {
                        console.log(user);
                        (0, HandleResponse_1.HandleResponse)(res, 500, `${full_name} exists already`, user);
                    }
                    if (!user) {
                        NewUser.password = hash;
                        Student_1.default.create(NewUser).then(() => {
                            (0, HandleResponse_1.HandleResponse)(res, 200, `${full_name} registration successful`, NewUser);
                        });
                    }
                })
                    .catch((err) => {
                    res.send("error" + err);
                });
            });
        });
    }
    static GetStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Student_1.default.find().then(users => {
                console.log(users);
                users && res.json({ message: "All users Retrieved Successfully", data: users, total: users.length });
                !users && res.json({ message: "Unexpected Error" });
            });
        });
    }
    static BookARoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            const { room_number, room_id, hostel_name, proof_of_payment_school_fee, proof_of_payment_hostel_fee } = req.body;
            yield Room_1.default.findOne({ room_number, hostel_name, id: room_id, gender: decode.gender })
                .then(room => {
                if (room) {
                    if (room.number_acceptable >= 1 + room.number_in_room) {
                        const NewBooking = {
                            room_number, room_id, hostel_name, proof_of_payment_school_fee, proof_of_payment_hostel_fee
                        };
                        const updateRoom = {
                            number_of_bookings: room.number_of_bookings + 1
                        };
                        Booking_1.default.create(NewBooking)
                            .then(() => {
                            Room_1.default.findOneAndUpdate({ room_number, hostel_name, id: room_id, gender: decode.gender }, {
                                $set: updateRoom
                            }, {
                                new: true,
                                runValidators: true,
                                upsert: true,
                                returnOriginal: false,
                                returnNewDocument: true
                            }).exec()
                                .then(() => {
                                (0, HandleResponse_1.HandleResponse)(res, 200, `${hostel_name} room number ${room_number} booked successfully`, room);
                            });
                        });
                    }
                    if (room.number_acceptable < 1 + room.number_in_room) {
                        (0, HandleResponse_1.HandleResponse)(res, 200, `${hostel_name} room number ${room_number} booking failed`, room);
                    }
                }
            });
        });
    }
    static GetLatestRooms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            yield Room_1.default.find({ availability: true, gender: decode.gender })
                .sort({ created: -1 })
                .then(rooms => {
                (0, HandleResponse_1.HandleResponse)(res, 200, `All rooms retieved successfully`, rooms);
            });
        });
    }
    static GetAllRooms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            yield Room_1.default.find({ gender: decode.gender })
                .sort({ created: -1 })
                .then(rooms => (0, HandleResponse_1.HandleResponse)(res, 200, `All rooms retrieved successfully`, rooms));
        });
    }
}
exports.default = StudentController;

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
const Student_1 = __importDefault(require("../models/Student"));
const HandleResponse_1 = require("../HandleResponse");
const Room_1 = __importDefault(require("./../models/Room"));
const Bursar_1 = __importDefault(require("./../models/Bursar"));
const Booking_1 = __importDefault(require("./../models/Booking"));
const Student_2 = __importDefault(require("../models/Student"));
const key = process.env.SECRET_KEY || "secret";
class AdminController {
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
    static AddRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { type, image, video, room_number, number_acceptable, hostel_name, gender, price } = req.body;
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            const NewRoom = {
                type,
                image,
                video,
                room_number,
                number_acceptable,
                hostel_name,
                gender,
                price,
                admin_id: decode.admin_id
            };
            Room_1.default.findOne({ room_number, hostel_name, gender })
                .then(room => {
                if (!room) {
                    Room_1.default.create(NewRoom)
                        .then(() => (0, HandleResponse_1.HandleResponse)(res, 200, `${hostel_name} room number ${room_number} added successfully`, NewRoom));
                }
                else {
                    (0, HandleResponse_1.HandleResponse)(res, 500, `${hostel_name} room number ${room_number} exists already`, room);
                }
            });
        });
    }
    static CreateBursarAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: send email or message once Bursar account creates successfully
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            const { email, phone_number, full_name, admin_id } = req.body;
            const NewBursar = {
                email: email.toLowerCase(),
                full_name,
                phone_number,
                admin_id
            };
            yield Bursar_1.default.findOne({ admin_id: decode.admin_id })
                .then((bursar) => __awaiter(this, void 0, void 0, function* () {
                if (!bursar) {
                    Bursar_1.default.create(NewBursar)
                        .then(() => (0, HandleResponse_1.HandleResponse)(res, 200, `${full_name}'s account created successfully`, NewBursar));
                }
                else {
                    yield Bursar_1.default.findOneAndUpdate({ admin_id: decode.admin_id }, {
                        $set: { email: email.toLowerCase(),
                            full_name,
                            phone_number,
                            admin_id }
                    }, {
                        new: true,
                        runValidators: true,
                        upsert: true,
                        returnOriginal: false,
                        returnNewDocument: true
                    }).exec()
                        .then(() => {
                        (0, HandleResponse_1.HandleResponse)(res, 200, `${full_name}'s account updated successfully`, bursar);
                    });
                }
            }));
        });
    }
    static DeleteRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { room_id } = req.params;
            yield Room_1.default.findOneAndDelete({ _id: room_id })
                .then(() => {
                (0, HandleResponse_1.HandleResponse)(res, 200, `Room deleted successfully`, {});
            });
        });
    }
    static SendDataToBursar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { booking_id } = req.params;
            yield Booking_1.default.findOneAndUpdate({ _id: booking_id }, {
                $set: { send_to_bursar: true }
            }, {
                new: true,
                runValidators: true,
                upsert: true,
                returnOriginal: false,
                returnNewDocument: true
            }).exec()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                yield Booking_1.default.find()
                    .then(bookings => {
                    (0, HandleResponse_1.HandleResponse)(res, 200, `All Bookings found successfully`, bookings);
                });
            }));
        });
    }
    static GetAllRooms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            yield Room_1.default.find({ admin_id: decode.admin_id })
                .sort({ created: -1 })
                .then(rooms => (0, HandleResponse_1.HandleResponse)(res, 200, `All rooms retrieved successfully`, rooms));
        });
    }
    static GetAllBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            yield Booking_1.default.find({ admin_id: decode.admin_id })
                .sort({ created: -1 })
                .then(bookings => (0, HandleResponse_1.HandleResponse)(res, 200, `All booking retrieved successfully`, bookings));
        });
    }
    static GetBursar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            yield Bursar_1.default.findOne({ admin_id: decode.admin_id })
                .then(bursar => (0, HandleResponse_1.HandleResponse)(res, 200, `Bursar info retrieval was a success`, bursar));
        });
    }
    static DashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            yield Booking_1.default.find({ admin_id: decode.admin_id })
                .then((bookings) => __awaiter(this, void 0, void 0, function* () {
                yield Student_2.default.find()
                    .then((student) => __awaiter(this, void 0, void 0, function* () {
                    Bursar_1.default.findOne({ admin_id: decode.admin_id })
                        .then((bursar) => __awaiter(this, void 0, void 0, function* () {
                        yield Room_1.default.find({ admin_id: decode.admin_id })
                            .then((rooms) => __awaiter(this, void 0, void 0, function* () {
                            yield Room_1.default.find({ admin_id: decode.admin_id, type: "Private" })
                                .then((special) => __awaiter(this, void 0, void 0, function* () {
                                yield Room_1.default.find({ admin_id: decode.admin_id, type: "General" })
                                    .then((general) => __awaiter(this, void 0, void 0, function* () {
                                    yield Booking_1.default.find({ verified: true })
                                        .then(verified => {
                                        const sum = (input) => {
                                            if (toString.call(input) !== "[object Array]")
                                                return false;
                                            var total = 0;
                                            for (var i = 0; i < input.length; i++) {
                                                if (isNaN(input[i])) {
                                                    continue;
                                                }
                                                total += Number(input[i]);
                                            }
                                            return total;
                                        };
                                        // const verifiedBooking = bookings?.filter(book=>book?.verified)
                                        const dashData = {
                                            bursar_name: bursar === null || bursar === void 0 ? void 0 : bursar.full_name,
                                            bursar_phone_number: bursar === null || bursar === void 0 ? void 0 : bursar.phone_number,
                                            bursar_email: bursar === null || bursar === void 0 ? void 0 : bursar.email,
                                            general: general === null || general === void 0 ? void 0 : general.length,
                                            special: special === null || special === void 0 ? void 0 : special.length,
                                            bookings: bookings === null || bookings === void 0 ? void 0 : bookings.length,
                                            rooms: rooms === null || rooms === void 0 ? void 0 : rooms.length,
                                            student: student === null || student === void 0 ? void 0 : student.length,
                                            bookingPrice: sum(verified === null || verified === void 0 ? void 0 : verified.map(book => book === null || book === void 0 ? void 0 : book.price)),
                                            totalPrice: sum(rooms === null || rooms === void 0 ? void 0 : rooms.map(room => Number(room === null || room === void 0 ? void 0 : room.number_acceptable) * Number(room === null || room === void 0 ? void 0 : room.price))),
                                            privatePrice: sum(special === null || special === void 0 ? void 0 : special.map(room => Number(room === null || room === void 0 ? void 0 : room.number_acceptable) * Number(room === null || room === void 0 ? void 0 : room.price))),
                                            generalPrice: sum(general === null || general === void 0 ? void 0 : general.map(room => Number(room === null || room === void 0 ? void 0 : room.number_acceptable) * Number(room === null || room === void 0 ? void 0 : room.price))),
                                        };
                                        console.log(dashData);
                                        (0, HandleResponse_1.HandleResponse)(res, 200, "Dashboard Data Found successfully", dashData);
                                    });
                                }));
                            }));
                        }));
                    }));
                }));
            }));
        });
    }
}
exports.default = AdminController;

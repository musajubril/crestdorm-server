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
const Bursar_1 = __importDefault(require("./../models/Bursar"));
const Booking_1 = __importDefault(require("./../models/Booking"));
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
            const NewRoom = {
                type,
                image,
                video,
                room_number,
                number_acceptable,
                hostel_name,
                gender,
                price
            };
            Room_1.default.findOne({ room_number, hostel_name, gender })
                .then(room => {
                if (!room) {
                    Room_1.default.create(NewRoom)
                        .then(() => (0, HandleResponse_1.HandleResponse)(res, 200, `${hostel_name} room number ${room_number} added successfully`, NewRoom));
                }
                else {
                    (0, HandleResponse_1.HandleResponse)(res, 200, `${hostel_name} room number ${room_number} exists already`, room);
                }
            });
        });
    }
    static CreateBursarAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: send email or message once Bursar account creates successfully
            var decode = jsonwebtoken_1.default.verify(req.headers['authorization'], key);
            const { email, phone_number, full_name } = req.body;
            const NewBursar = {
                email,
                full_name,
                phone_number
            };
            yield Bursar_1.default.findOne({ admin_id: decode._id })
                .then(bursar => {
                if (!bursar) {
                    Bursar_1.default.create(NewBursar)
                        .then(() => (0, HandleResponse_1.HandleResponse)(res, 200, `${full_name}'s account created successfully`, NewBursar));
                }
                else {
                    (0, HandleResponse_1.HandleResponse)(res, 200, `${full_name}'s account creation failed, you can't have more than one Bursar`, bursar);
                }
            });
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
}
exports.default = AdminController;

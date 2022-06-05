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
const Booking_1 = __importDefault(require("./../models/Booking"));
const key = process.env.SECRET_KEY || "secret";
class BursarController {
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
    static GetAllSentBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Booking_1.default.find({ send_to_bursar: true })
                .then(bookings => {
                (0, HandleResponse_1.HandleResponse)(res, 200, `All bookings retrieved successfully`, bookings);
            });
        });
    }
    static SetVerified(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { booking_id } = req.params;
            yield Booking_1.default.findOneAndUpdate({ _id: booking_id }, {
                $set: { verified: true }
            }, {
                new: true,
                runValidators: true,
                upsert: true,
                returnOriginal: true,
                returnNewDocument: true,
            }).exec()
                .then(() => __awaiter(this, void 0, void 0, function* () {
                yield Booking_1.default.find()
                    .then(bookings => {
                    (0, HandleResponse_1.HandleResponse)(res, 200, `All Bookings found successfully`, bookings);
                });
            }));
        });
    }
    static SetNotVerified(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { booking_id } = req.params;
            yield Booking_1.default.findOneAndUpdate({ _id: booking_id }, {
                $set: { verified: false }
            }, {
                new: true,
                runValidators: true,
                upsert: true,
                returnOriginal: true,
                returnNewDocument: true,
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
exports.default = BursarController;

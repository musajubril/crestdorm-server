import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Student";
import { HandleResponse } from "../HandleResponse";
import Booking from './../models/Booking';
const key = process.env.SECRET_KEY || "secret";
class BursarController {
  static async Login(req, res) {
    const { email, password } = req.body;
    await Users.findOne({ email }).then((user) => {
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          const payload = {
            userId: user._id,
            email: user.email,
            phone_number: user.email
          };
          let token = jwt.sign(payload, key);
          res.json(token);
        } else {
          res.json({ error: "Passwords do not match" });
        }
      } else {
        res.json({
          error: "User does not exist",
        });
      }
    });
  }
  static async GetAllSentBookings(req, res) {
    await Booking.find({send_to_bursar: true})
    .then(bookings=>{
      HandleResponse(res, 200, `All bookings retrieved successfully`, bookings)
    })
  }
  static async SetVerified(req, res) {
    const{booking_id} = req.params
    await Booking.findOneAndUpdate({_id: booking_id}, {
      $set: {verified: true}
    }, {
      new: true,
      runValidators: true,
      upsert: true,
      returnOriginal: true,
      returnNewDocument: true,
    }).exec()
    .then(async ()=>{
      await Booking.find()
      .then(bookings=>{
        HandleResponse(res, 200, `All Bookings found successfully`, bookings)
      })
    })
  }
  static async SetNotVerified(req, res) {
    const{booking_id} = req.params
    await Booking.findOneAndUpdate({_id: booking_id}, {
      $set: {verified: false}
    }, {
      new: true,
      runValidators: true,
      upsert: true,
      returnOriginal: true,
      returnNewDocument: true,
    }).exec()
    .then(async ()=>{
      await Booking.find()
      .then(bookings=>{
        HandleResponse(res, 200, `All Bookings found successfully`, bookings)
      })
    })
  }
}
export default BursarController;

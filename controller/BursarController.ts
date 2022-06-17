import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Student";
import { HandleResponse } from "../HandleResponse";
import Booking from './../models/Booking';
import Room from "./../models/Room";
const key = process.env.SECRET_KEY || "secret";
class BursarController {
  static async Login(req, res) {
    const { email, password } = req.body;
    await Users.findOne({ email }).then((user) => {
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          const payload = {
            userId: user._id,
            email: user.email.toLowerCase(),
            phone_number: user.email
          };
          let token = jwt.sign(payload, key);
          res.json(token);
        } else {
          res.status(500).json({ error: "Passwords do not match" });
        }
      } else {
        res.status(500).json({
          error: "User does not exist",
        });
      }
    });
  }
  static async GetAllSentBookings(req, res) {
    var decode = jwt.verify(req.headers['authorization'],key)
    await Booking.find({send_to_bursar: true, admin_id: decode.admin_id})
    .then(bookings=>{
      HandleResponse(res, 200, `All bookings retrieved successfully`, bookings)
    })
  }
  static async SetVerified(req, res) {
    var decode = jwt.verify(req.headers['authorization'],key)
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
    var decode = jwt.verify(req.headers['authorization'],key)
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
  static async DashboardData(req, res){
    var decode = jwt.verify(req.headers['authorization'],key)
    await Booking.find({verified: true, admin_id: decode.admin_id})
    .then(async verified=>{
      await Booking.find({admin_id:decode.admin_id, send_to_bursar:true})
      .then(async send=>{
        await Room.find({admin_id: decode.admin_id})
        .then(async rooms=>{
          await Room.find({admin_id: decode.admin_id, type: "General"})
          .then(async general=>{
            await Room.find({admin_id: decode.admin_id, type: "Private"})
            .then(special=>{
              const sum=(input)=>{
                if(toString.call(input)!=="[object Array]")
          return false
          var total = 0
          for (var i = 0; i<input.length;i++){
            if(isNaN(input[i])){
              continue
            }
            total += Number(input[i])
          }
          return total
        }
        HandleResponse(res,200,"",{sent: send?.length, verified: verified?.length,bookingPrice: sum(verified?.map(book=>book?.price)),
          totalPrice: sum(rooms?.map(room=>Number(room?.number_acceptable)*Number(room?.price))),
          privatePrice: sum(special?.map(room=>Number(room?.number_acceptable)*Number(room?.price))),
          generalPrice: sum(general?.map(room=>Number(room?.number_acceptable)*Number(room?.price)))})
        })
      })
    })
      })
    })
  }
}
export default BursarController;

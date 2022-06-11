import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Student";
import { HandleResponse } from "../HandleResponse";
import Room from './../models/Room';
import Bursar from './../models/Bursar';
import Booking from './../models/Booking';
const key = process.env.SECRET_KEY || "secret";
class AdminController {
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
  static async AddRoom(req, res) {
    const {
      type,
      image,
      video,
      room_number,
      number_acceptable,
      hostel_name,
      gender,
      price
    } = req.body
    const NewRoom = {
      type,
      image,
      video,
      room_number,
      number_acceptable,
      hostel_name,
      gender,
      price
    }
    Room.findOne({room_number, hostel_name, gender})
    .then(room=>{
      if (!room) {
        Room.create(NewRoom)
        .then(()=>HandleResponse(res, 200, `${hostel_name} room number ${room_number} added successfully`, NewRoom))
      }
      else {
        HandleResponse(res, 200, `${hostel_name} room number ${room_number} exists already`, room)
      }
    })
  }
  static async CreateBursarAccount(req, res) {
    // TODO: send email or message once Bursar account creates successfully
    var decode = jwt.verify(req.headers['authorization'],key)
    const { email, phone_number, full_name} = req.body
    const NewBursar = {
      email,
      full_name,
      phone_number
    }
    await Bursar.findOne({admin_id: decode._id})
    .then(bursar=>{
      if(!bursar) {
        Bursar.create(NewBursar)
        .then(()=>HandleResponse(res, 200, `${full_name}'s account created successfully`, NewBursar))
      }
      else {
        HandleResponse(res, 200, `${full_name}'s account creation failed, you can't have more than one Bursar`, bursar)
      }
    })
  }
  static async DeleteRoom(req,res) {
    const {room_id} = req.params
    await Room.findOneAndDelete({_id: room_id})
    .then(()=>{
      HandleResponse(res, 200 , `Room deleted successfully`, {})
    })
  }
  static async SendDataToBursar(req, res) {
    const {booking_id} = req.params
    await Booking.findOneAndUpdate({_id: booking_id}, {
      $set: {send_to_bursar: true}
  }, {
      new: true,
      runValidators: true,
      upsert: true,
      returnOriginal: false,
      returnNewDocument: true
  }).exec()
  .then(async ()=>{
    await Booking.find()
    .then(bookings=>{
      HandleResponse(res, 200, `All Bookings found successfully`, bookings)
    })
  })
  }
}
export default AdminController;

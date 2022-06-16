import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Student";
import { HandleResponse } from "../HandleResponse";
import Room from './../models/Room';
import Bursar from './../models/Bursar';
import Booking from './../models/Booking';
import Student from '../models/Student';
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
    var decode = jwt.verify(req.headers['authorization'],key)
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
    }
    Room.findOne({room_number, hostel_name, gender})
    .then(room=>{
      if (!room) {
        Room.create(NewRoom)
        .then(()=>HandleResponse(res, 200, `${hostel_name} room number ${room_number} added successfully`, NewRoom))
      }
      else {
        HandleResponse(res, 500, `${hostel_name} room number ${room_number} exists already`, room)
      }
    })
  }
  static async CreateBursarAccount(req, res) {
    // TODO: send email or message once Bursar account creates successfully
    var decode = jwt.verify(req.headers['authorization'],key)
    const { email, phone_number, full_name, admin_id} = req.body
    const NewBursar = {
      email: email.toLowerCase(),
      full_name,
      phone_number,
      admin_id
    }
    await Bursar.findOne({admin_id: decode.admin_id})
    .then(async bursar=>{
      if(!bursar) {
        Bursar.create(NewBursar)
        .then(()=>HandleResponse(res, 200, `${full_name}'s account created successfully`, NewBursar))
      }
      else {
        await Bursar.findOneAndUpdate({admin_id: decode.admin_id}, {
          $set: {email: email.toLowerCase(),
            full_name,
            phone_number,
            admin_id}
      }, {
          new: true,
          runValidators: true,
          upsert: true,
          returnOriginal: false,
          returnNewDocument: true
      }).exec()
      .then(()=>{
        HandleResponse(res, 200, `${full_name}'s account updated successfully`, bursar)
      })
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
  static async GetAllRooms(req, res) {
    var decode = jwt.verify(req.headers['authorization'],key)
    await Room.find({admin_id: decode.admin_id})
    .sort({created: -1})
    .then(rooms=> HandleResponse(res, 200, `All rooms retrieved successfully`, rooms))
  }
  static async GetAllBookings(req, res) {
    var decode = jwt.verify(req.headers['authorization'],key)
    await Booking.find({admin_id: decode.admin_id})
    .sort({created: -1})
    .then(bookings=> HandleResponse(res, 200, `All booking retrieved successfully`, bookings))
  }
  static async GetBursar(req, res) {
    var decode = jwt.verify(req.headers['authorization'],key)
    await Bursar.findOne({admin_id: decode.admin_id})
    .then(bursar=> HandleResponse(res, 200, `Bursar info retrieval was a success`, bursar))
  }
  static async DashboardData(req, res){
    var decode = jwt.verify(req.headers['authorization'],key)
    await Booking.find({admin_id: decode.admin_id})
    .then(async bookings=>{
      await Student.find()
      .then(async student=>{
        Bursar.findOne({admin_id: decode.admin_id})
        .then(async bursar=>{
          await Room.find({admin_id: decode.admin_id})
          .then(async rooms=>{
            await Room.find({admin_id: decode.admin_id, type: "Private"})
            .then(async special=>{
              await Room.find({admin_id: decode.admin_id, type: "General"})
              .then(async general=>{
                await Booking.find({verified: true})
                .then(verified=>{
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
                  // const verifiedBooking = bookings?.filter(book=>book?.verified)
                  const dashData = {
                    bursar_name: bursar?.full_name,
                    bursar_phone_number: bursar?.phone_number,
                    bursar_email: bursar?.email,
                    general: general?.length,
                    special: special?.length,
                    bookings: bookings?.length,
                    rooms: rooms?.length,
                    student: student?.length,
                    bookingPrice: sum(verified?.map(book=>book?.price)),
                    totalPrice: sum(rooms?.map(room=>Number(room?.number_acceptable)*Number(room?.price))),
                    privatePrice: sum(special?.map(room=>Number(room?.number_acceptable)*Number(room?.price))),
                    generalPrice: sum(general?.map(room=>Number(room?.number_acceptable)*Number(room?.price))),
                  }
                  console.log(dashData)
                  HandleResponse(res, 200, "Dashboard Data Found successfully", dashData)
                })
              })
            })
          })
        })
      })
    })
  }
}
export default AdminController;

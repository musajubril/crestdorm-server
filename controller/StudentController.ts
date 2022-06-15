import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/Student";
import { HandleResponse } from "../HandleResponse";
import Room from './../models/Room';
import Booking from './../models/Booking';
const key = process.env.SECRET_KEY || "secret";
class StudentController {
  static async Login(req, res) {
    const { email, password } = req.body;
    await Student.findOne({ email }).then((user) => {
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
          res.status(500).json({ error: "Passwords do not match" });
        }
      } else {
        res.status(500).json({
          error: "User does not exist",
        });
      }
    });
  }
  static async CreateAccount(req, res) {
    const { password, email, phone_number, full_name, matric_number, jamb_number, gender } = req.body
    const NewUser = {
      password, email: email.toLowerCase(), phone_number, full_name, matric_number, jamb_number, gender
    }
    bcrypt.hash(password, 10, (err, hash) => {
      Student.findOne({ email: email.toLowerCase(), phone_number, gender }).then((user) => {
        if (user) {
          console.log(user);
          HandleResponse(res, 500, `${full_name} exists already`, user)
        }
        if (!user) {
          NewUser.password = hash          
          Student.create(NewUser).then(() => {
            HandleResponse(res, 200, `${full_name} registration successful`, NewUser)
          });
        }
      })
        .catch((err) => {
          res.send("error" + err);
        })
    })
  }
  static async GetStudents(req, res) {
    await Student.find().then(users => {
      console.log(users)
      users && res.json({ message: "All users Retrieved Successfully", data: users, total: users.length })
      !users && res.json({ message: "Unexpected Error" })
    })
  }
  static async BookARoom(req, res) {
    var decode = jwt.verify(req.headers['authorization'],key)
    const { room_number, room_id, hostel_name, proof_of_payment_school_fee, proof_of_payment_hostel_fee, price } = req.body
    await Booking.findOne({student_id: decode.userId}).then(async book=>{
      if(!book) {
        await Room.findOne({room_number, hostel_name, id: room_id, gender: decode.gender})
        .then(room=>{
          if(room) {
            if(room.number_acceptable >= 1 + room.number_in_room) {
              const NewBooking = {
                room_number, room_id, hostel_name, proof_of_payment_school_fee, proof_of_payment_hostel_fee, price,
                matric_number: decode.matric_number, full_name: decode.full_name,phone_number:decode.phone_number
              }
              const updateRoom = {
                number_of_bookings: room.number_of_bookings + 1
              }
              Booking.create(NewBooking)
              .then(()=>{
                Room.findOneAndUpdate({room_number, hostel_name, id: room_id, gender: decode.gender}, {
                  $set: updateRoom
              }, {
                  new: true,
                  runValidators: true,
                  upsert: true,
                  returnOriginal: false,
                  returnNewDocument: true
              }).exec()
              .then(()=>{
                HandleResponse(res, 200, `${hostel_name} room number ${room_number} booked successfully`, room)
              })
              })
            }
            if(room.number_acceptable < 1 + room.number_in_room){
              HandleResponse(res, 500, `${hostel_name} room number ${room_number} booking failed`, room )
            }
          }
          else {
            HandleResponse(res, 500, `you can't make more than one booking`, {} )
          }
        })
      }
    })
  }
  static async GetLatestRooms(req, res) {
    var decode = jwt.verify(req.headers['authorization'],key)
    await Room.find({availability: true, gender: decode.gender})
    .sort({created: -1})
    .then(async rooms=>{
      await Booking.findOne({student_id: decode.userId}).then(book=>{
          const newRooms = rooms.map(room=>{
            const returnRoom = { 
              number_in_room: room.number_in_room,
              _id: room._id,
              type: room.type,
              image: room.image,
              availability: room.availability,
              room_number: room.room_number,
              number_acceptable: room.number_acceptable,
              hostel_name: room.hostel_name,
              gender: room.gender,
              price: room.price,
              modified: room.modified,
              created: room.created,
              __v: 0,
              admin_id: '62a4306f6ee2e92822bf3b1e', bookedStatus: room._id===book?.room_id ? true : false}
            return returnRoom
          })
          HandleResponse(res, 200, `All rooms retieved successfully`, newRooms)
      })
      // HandleResponse(res, 200, `All rooms retieved successfully`, rooms)
    })
  }
  static async GetAllRooms(req, res) {
    var decode = jwt.verify(req.headers['authorization'],key)
    await Room.find({gender: decode.gender})
    .sort({created: -1})
    .then(async rooms=>{
      await Booking.findOne({student_id: decode.userId}).then(book=>{
          const newRooms = rooms.map(room=>{
            // console.log(room)
            const returnRoom = { 
              number_in_room: room.number_in_room,
              _id: room._id,
              type: room.type,
              image: room.image,
              availability: room.availability,
              room_number: room.room_number,
              number_acceptable: room.number_acceptable,
              hostel_name: room.hostel_name,
              gender: room.gender,
              price: room.price,
              modified: room.modified,
              created: room.created,
              __v: 0,
              admin_id: '62a4306f6ee2e92822bf3b1e', bookedStatus: room._id===book?.room_id ? true : false}
            return returnRoom
          })
          HandleResponse(res, 200, `All rooms retieved successfully`, newRooms)
      })
      // HandleResponse(res, 200, `All rooms retieved successfully`, rooms)
    })
  }
}
export default StudentController;

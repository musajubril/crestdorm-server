import Student from '../models/Student';
import Bursar from '../models/Bursar';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { HandleResponse } from "../HandleResponse";
const key = process.env.SECRET_KEY || "secret";
class AuthController {
  static async Login(req, res) {
    const { email, password } = req.body;
    console.log(email, password)
    await User.findOne({ email }).then((user) => {
      if (user) {
        if(user.account_type==="Student") {
          console.log("Student")
          if (bcrypt.compareSync(password, user.password)) {
            Student.findOne({student_id: user._id}).then(student=>{
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
              let token = jwt.sign(payload, key);
              res.json(token);
              
            })
        } else {
          res.json({ error: "Passwords do not match" });
        }
      }
      if(user.account_type==="Bursar") {
        console.log("Bursar")
        if (bcrypt.compareSync(password, user.password)) {
          Bursar.findOne({user_id: user._id}).then(bursar=>{
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
            let token = jwt.sign(payload, key);
            res.json(token);
            
          })
      } else {
        res.json({ error: "Passwords do not match" });
      }
      }
        if(user.account_type==="Admin") {
          console.log("Admin")
          if (bcrypt.compareSync(password, user.password)) {
            const payload = {
              admin_id: user._id,
              email: user.email,
              phone_number: user.email,
              account_type: user.account_type
            };
            let token = jwt.sign(payload, key);
            res.json(token);
          } else {
            res.json({ error: "Passwords do not match" });
          }
        }
      } else {
        res.json({
          error: "User does not exist",
        });
      }
    });
  }
  static async CreateStudent(req, res) {
    const { password, email, phone_number, full_name, matric_number, jamb_number, gender, admin_id } = req.body
    const NewStudent = {
      email, phone_number, full_name, matric_number, jamb_number, gender, student_id: "", admin_id
    }
    const NewUser = {
      password, email, phone_number, account_type: "Student"
    }
    bcrypt.hash(password, 10, (err, hash) => {
      User.findOne({ email, phone_number }).then((user) => {
        if (user) {
          console.log(user);
          HandleResponse(res, 500, `An account with the email: ${full_name} exists already`, user)
        }
        if (!user) {
          NewUser.password = hash          
          User.create(NewUser).then(async() => {
            await User.findOne({email, phone_number, account_type: "Student"})
            .then(verifiedUser=>{
              NewStudent.student_id = verifiedUser._id
              Student.create(NewStudent).then(()=>{
                HandleResponse(res, 200, `${full_name} registration successful`, {...NewStudent,
                created:verifiedUser.created,
                modified:verifiedUser.modified,
                })
              })
            })
          });
        }
      })
        .catch((err) => {
          res.send("error" + err);
        })
    })
  }
  static async CreateAdmin(req, res) {
    const { password, email, phone_number } = req.body
    const NewUser = {
      password, email, phone_number, account_type: "Admin"
    }
    bcrypt.hash(password, 10, (err, hash) => {
      User.findOne({ email, phone_number, account_type: "Admin" }).then((user) => {
        if (user) {
          console.log(user);
          HandleResponse(res, 500, `An account with the email: ${email} exists already`, user)
        }
        if (!user) {
          NewUser.password = hash          
          User.create(NewUser).then(() => {
                HandleResponse(res, 200, `${email} registration successful`, email)
            })
          };
      })
        .catch((err) => {
          res.send("error" + err);
        })
    })
  }
  static async GetUsers(req, res) {
    await User.find().then(user => {
      console.log(user)
      user && res.json({ message: "All user Retrieved Successfully", data: user, total: user.length })
      !user && res.json({ message: "Unexpected Error" })
    })
  }
}
export default AuthController;

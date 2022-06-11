import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Users from "../models/Student";
import { HandleResponse } from "../HandleResponse";
const key = process.env.SECRET_KEY || "secret";
class AuthController {
  static async AdminLogin(req, res) {
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
  static async BursarLogin(req, res) {
    const { email, password } = req.body;
    await Users.findOne({ email }).then((user) => {
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          const payload = {
            userId: user._id,
            email: user.email,
            phone_number: user.phone_number
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
  static async StudentLogin(req, res) {
    const { email, password } = req.body;
    // console.log(req.body);
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
  static async CreateAccount(req, res) {
    const { password, email, phone_number } = req.body
    const NewUser = {
      password,
      email,
      phone_number
    }
    bcrypt.hash(password, 10, (err, hash) => {
      Users.findOne({email}).then((user) => {
        if (user) {
          console.log(user);
          HandleResponse(res, 500, `${email} exists already`, user)
        }
        if (!user) {
          // console.log(users)
          Users.create({
            password: hash,
      email,
      phone_number
          }).then(() => {
            HandleResponse(res, 200, `${email} added to the user list successfully`, NewUser)
          });
        }
      })
        .catch((err) => {
          res.send("error" + err);
        })
    })
  }
  static async GetUsers(req, res) {
    await Users.find().then(users => {
      console.log(users)
      users && res.json({ message: "All users Retrieved Successfully", data: users, total: users.length })
      !users && res.json({ message: "Unexpected Error" })
    })
  }
}
export default AuthController;

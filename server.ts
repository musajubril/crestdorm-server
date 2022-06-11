import express from "express"
import path from "path"
import cors from "cors"
import mongoose from "mongoose"
require('dotenv').config()
const app = express();
var StudentRouter = require('./routes/student')
var AdminRouter = require('./routes/admin')
var AuthRouter = require('./routes/auth')
var BursarRouter = require('./routes/bursar')
const PORT = process.env.PORT || 8000;
const mongoURI = process.env.ATLAS_URI || "mongodb://localhost/CrescentDorm"
 const connection = mongoose.connect(mongoURI)
 .then(()=>console.log('MongoDB database connected successfully'))
 .catch(error=>console.error(error))

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/student', StudentRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/bursar', BursarRouter);
app.use('/api/auth', AuthRouter);
app.get('/', (req, res) => res.send(`CrestDorm ⚡️[server]: Server is running at https://localhost:${PORT}`));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
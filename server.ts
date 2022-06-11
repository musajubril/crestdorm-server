import express from "express"
import path from "path"
import cors from "cors"
import mongoose from "mongoose"
require('dotenv').config()
const app = express();
var StudentRouter = require('./routes/student')
var AdminRouter = require('./routes/admin')
var BursarRouter = require('./routes/bursar')
const PORT = process.env.PORT || 8000;
const mongoURI = process.env.ATLAS_URI || "mongodb://localhost/CrescentDorm"
 const connection = mongoose.connect(mongoURI)
 .then(()=>console.log('MongoDB database connected successfully'))
 .catch(error=>console.error(error))

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/student', StudentRouter);
app.use('/admin', AdminRouter);
app.use('/bursar', BursarRouter);
app.get('/', (req, res) => res.send(`CrestDorm ⚡️[server]: Server is running at https://localhost:${PORT}`));
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
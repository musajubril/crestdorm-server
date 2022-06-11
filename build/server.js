"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const app = (0, express_1.default)();
var StudentRouter = require('./routes/student');
var AdminRouter = require('./routes/admin');
var AuthRouter = require('./routes/auth');
var BursarRouter = require('./routes/bursar');
const PORT = process.env.PORT || 8000;
const mongoURI = process.env.ATLAS_URI || "mongodb://localhost/CrescentDorm";
const connection = mongoose_1.default.connect(mongoURI)
    .then(() => console.log('MongoDB database connected successfully'))
    .catch(error => console.error(error));
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use('/api/student', StudentRouter);
app.use('/api/admin', AdminRouter);
app.use('/api/bursar', BursarRouter);
app.use('/api/auth', AuthRouter);
app.get('/', (req, res) => res.send(`CrestDorm ⚡️[server]: Server is running at https://localhost:${PORT}`));
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

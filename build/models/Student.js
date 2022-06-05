"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const UsersSchema = new mongoose.Schema({
    email: String,
    password: String,
    phone_number: String,
    full_name: String,
    matric_number: String,
    jamb_number: String,
    gender: String,
    modified: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    }
});
const Users = mongoose.model('Users', UsersSchema);
exports.default = Users;

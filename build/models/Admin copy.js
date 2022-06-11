"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const AdminSchema = new mongoose.Schema({
    email: String,
    password: String,
    phone_number: String,
    modified: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    }
});
const Admin = mongoose.model('Admin', AdminSchema);
exports.default = Admin;

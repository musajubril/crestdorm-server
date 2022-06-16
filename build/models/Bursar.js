"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const BursarSchema = new mongoose.Schema({
    email: String,
    full_name: String,
    user_id: {
        default: "",
        type: String
    },
    admin_id: String,
    password: {
        default: "",
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
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
const Bursar = mongoose.model('Bursar', BursarSchema);
exports.default = Bursar;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const StudentSchema = new mongoose.Schema({
    email: String,
    student_id: String,
    admin_id: String,
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
const Student = mongoose.model('Student', StudentSchema);
exports.default = Student;

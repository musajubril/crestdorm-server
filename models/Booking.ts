const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    type: String,
    student_id: String,
    price: String,
    admin_id: String,
    send_to_bursar: {
        type: Boolean,
        default: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    matric_number: String,
    full_name: String,
    phone_number: String,
    room_number: String,
    hostel_name: String,
    proof_of_payment_school_fee: String,
    proof_of_payment_hostel_fee: String,
    room_id: String,
    modified: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    }
})
const Booking = mongoose.model('Booking', BookingSchema);
export default Booking;

const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    type: String,
    image: String,
    admin_id: String,
    video: String,
    availability: {
        type: Boolean,
        default: true
    },
    room_number: String,
    number_of_bookings: String,
    number_acceptable: String,
    number_in_room: String,
    hostel_name: String,
    gender: String,
    price: String,
    modified: {
        type: Date,
        default: Date.now
    },
    created:{
        type: Date,
        default: Date.now
    }
})
const Room = mongoose.model('Room', RoomSchema);
export default Room;

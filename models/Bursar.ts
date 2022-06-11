const mongoose = require('mongoose');

const BursarSchema = new mongoose.Schema({
    email: String,
    full_name: String,
    user_id: String,
    admin_id: String,
    password: String,
    verified: {
        type: Boolean,
        default: false
    },
    phone_number: String,
    modified: {
        type: Date,
        default: Date.now
    },
    created:{
        type: Date,
        default: Date.now
    }
})
const Bursar = mongoose.model('Bursar', BursarSchema);
export default Bursar;

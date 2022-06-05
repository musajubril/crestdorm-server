const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email: String,
    password: String,
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
const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;

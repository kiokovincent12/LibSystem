import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    name: String,
    phone:Number,
    adminEmail: {
        type: String,
        required: true
    },
    keyCode: {
        type: String,
        required: true
    }
});

export const Admin = mongoose.model('libsecret', adminSchema);
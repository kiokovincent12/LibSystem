import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    body: String,
    time: {
        type: Date,
        default:new Date()
    },
    read: {
        type: Boolean,
        default: false
    }
});

export const Notification = mongoose.model('messages', notificationSchema);
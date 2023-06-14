const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refresh_token: { type: String },
    refresh_token_expiry: { type: Date, default: Date.now },
    reset_token: { type: String, default: null },

}, {
    versionKey: false,
});

module.exports = mongoose.model('Customer', customerSchema);

const mongoose = require('mongoose');
const { Schema } = mongoose;

const customerSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    fname: { type: String, default: "" },
    lname: { type: String, default: "" },
    email: { type: String, default: "" },
    address: {
        street_address: { type: String, default: "" },
        apart_or_unit: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zip: { type: String, default: "" },
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order',
    }]
}, {
    versionKey: false,
});

module.exports = mongoose.model('Customer', customerSchema);

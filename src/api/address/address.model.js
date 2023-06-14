const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
    address: {
        street_address: { type: String },
        apart_or_unit: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String },
    },
}, {
    versionKey: false, // Disable the version key
});

module.exports = mongoose.model('Address', addressSchema);

const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    orderId: { type: String, required: true },
    order_details: {
        date_time: { type: Date, required: true },
        product_list: [{
            name: { type: String, required: true },
            dose: { type: String, required: true },
            url: { type: String, required: true },
            quantity: { type: Number, required: true },
            n_price: { type: Number, required: true },
            s_price: { type: Number, default: null },
        }],
    },
    ship_type: { type: String },
    coupon_used: { type: String, default: null },
    costs: {
        total_product_cost: { type: Number, required: true },
        ship_cost: { type: Number, required: true },
        total_saving: { type: Number, required: true },
        total_paid: { type: Number, required: true },
        payment: { type: Number, required: true }
    },
    status_tracking: {
        status: { type: Number, required: true },
        track_number: { type: String },
    },
}, {
    versionKey: false,
});

module.exports = mongoose.model('Order', orderSchema);

const mongoose = require('mongoose');
const { Schema } = mongoose;

const couponSchema = new Schema(
    {
        value: { type: Number, required: true },
        code: { type: String, required: true, index: true },
        totalUses: { type: Number, default: 0 },
        products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    },
    {
        versionKey: false,
    }
);

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;


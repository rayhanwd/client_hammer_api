const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderProductSchema = new Schema({
  name: { type: String, required: true },
  dose: { type: String, required: true },
  url: { type: String, required: true },
  quantity: { type: Number, required: true },
  nPrice: { type: Number, required: true },
  sPrice: { type: Number, default: null },
}, { _id: false });

const orderSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  customerMail: {
    type: String,
    require: true
  },
  orderId: {
    type: String,
    required: true,
  },
  orderDetails: {
    type: {
      dateTime: {
        type: Date,
        required: false,
        default: new Date()
      },
      productList: {
        type: [orderProductSchema],
        default: [],
      },
    },
    required: true,
    _id: false
  },
  shipType: {
    type: String,
  },
  couponUsed: {
    type: String,
    default: null,
  },
  costs: {
    type: {
      totalProductCost: {
        type: Number,
        required: true,
      },
      shipCost: {
        type: Number,
        required: true,
      },
      totalSaving: {
        type: Number,
        required: true,
      },
      totalPaid: {
        type: Number,
        required: true,
      },
      payment: {
        type: Number,
        required: true,
      },
    },
    required: true,
    _id: false
  },
  statusTracking: {
    type: {
      status: {
        type: Number,
        required: true,
      },
      trackNumber: {
        type: Number,
        default: null,
      },
    },
    required: true,
    _id: false
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('Order', orderSchema);


const Order = require('./order.model');
const Customer = require('../customer/customer.model');

exports.createOrder = async (userId, fname, lname, address, orderId, orderDetails, shipType, couponUsed, costs, statusTracking) => {
  try {

    const customer = await Customer.findOne({ userId: userId });

    const order = await Order.create({
      customerId: customer._id,
      customerMail: customer.email,
      orderId,
      orderDetails,
      shipType,
      couponUsed,
      costs,
      statusTracking
    });
    await Customer.findByIdAndUpdate(customer._id, {
      $push: { orders: order._id },
      $set: {
        fname: fname,
        lname: lname,
        email: customer.email,
        address: address
      },
    });

    return order;
  } catch (error) {
    console.error('Failed to create order from services:', error);
    throw new Error('Failed to create order');

  }
};

// Get a single order by orderId

exports.getSingleOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate("customerId");
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  } catch (error) {
    console.log(error)
    throw new Error('Failed to fetch order');
  }
};


const Order = require('./order.model');
const Customer = require('../customer/customer.model');

exports.createOrder = async (orderData) => {
  try {
    const order = await Order.create(orderData);
    return order;
  } catch (error) {

    throw new Error('Failed to create order');
  }
};

exports.getCustomerOrders = async (customerId) => {
  try {
    const customer = await Customer.findById(customerId).select('-password -refresh_token');
    if (!customer) {
      throw new Error('Customer not found');
    }

    const orders = await Order.find({ customerId }).populate('customerId', '_id');

    // Calculate the counts
    const totalOrders = orders.length;

    const pendingOrders = orders.filter(order => order.status_tracking.status === 0 || order.status_tracking.status === 1).length;

    const shippingOrders = orders.filter(order => order.status_tracking.status === 2 && order.status_tracking.track_number !== '').length;

    return {
      totalOrders,
      pendingOrders,
      shippingOrders,
      orders
    };
  } catch (error) {
    throw new Error('Failed to fetch customer orders');
  }
};

exports.getOneCustomerOneOrder = async (customerId, orderId) => {
  try {
    const customer = await Customer.findById(customerId).select('-password -refresh_token');
    if (!customer) {
      throw new Error('Customer not found');
    }

    const order = await Order.findOne({ _id: orderId, customerId }).populate('customerId', '_id');

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
    
  } catch (error) {
    throw new Error('Failed to fetch customer order');
  }

}

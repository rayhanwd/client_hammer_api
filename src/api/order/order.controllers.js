const orderService = require('./order.services');


exports.createOrder = async (req, res) => {
  try {
    const { userId, fname, lname, address, orderId, orderDetails, shipType, couponUsed, costs, statusTracking } = req.body;

    const order = await orderService.createOrder(userId, fname, lname, address, orderId, orderDetails, shipType, couponUsed, costs, statusTracking);

    res.status(201).json({ order });
  } catch (error) {
    console.error('Failed to create order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

exports.getOrdersById = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Check if userId is provided
    if (!customerId) {
      return res.status(400).json({ error: 'customerId is required' });
    }

    const orders = await orderService.getOrdersById(customerId);

    res.status(200).json(orders);
  } catch (error) {
    console.error('Failed to get customer orders:', error);
    res.status(500).json({ error: 'Failed to get customer orders' });
  }
};


// Get a single order
exports.getSingleOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.getSingleOrder(orderId);

    res.json(order);
  } catch (error) {

    res.status(500).json({ error: 'Failed to fetch order' });
  }
};

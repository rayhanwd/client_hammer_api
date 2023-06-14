
const orderService = require('./order.services');

exports.createOrder = async (req, res) => {
    try {
        const { customerId, orderId, order_details, ship_type, coupon_used, costs, status_tracking } = req.body;

        const orderData = {
            customerId,
            orderId,
            order_details,
            ship_type,
            coupon_used,
            costs,
            status_tracking
        };

        const order = await orderService.createOrder(orderData);
console.log(order)
        return res.status(201).json({ order });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to create order' });
    }
};


exports.getCustomerOrders = async (req, res) => {
    try {
        const { customerId } = req.params;
        const orders = await orderService.getCustomerOrders(customerId);
        return res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to fetch customer orders' });
    }
};

exports.getOneCustomerOneOrder = async (req, res) => {
    try {
        const { customerId, orderId } = req.params;
        const orders = await orderService.getOneCustomerOneOrder(customerId, orderId);
        return res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to fetch customer orders' });
    }
};

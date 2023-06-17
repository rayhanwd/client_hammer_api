const Customer = require('./customer.model');
const Order = require('../order/order.model');


exports.getCustomerById = async (customerId) => {
    try {
        const customer = await Customer.findById(customerId);
        return customer;
    } catch (error) {
        //console.log(error);
        throw error;
    }
};

exports.getOrdersById = async (customerId) => {
    try {
        
        const orders = await Order.find({ customerId }).populate('customerId', '-orders').lean();
        return orders;
    } catch (error) {
        console.error('Failed to get customer orders:', error);
        throw new Error('Failed to get customer orders');
    }
};


exports.updateCustomerInfo = async (customerId, fname, lname) => {
    try {
        // Check if userId is valid
        if (!customerId) {
            throw new Error('userId is required');
        }

        await Customer.findByIdAndUpdate(customerId, { fname, lname });

    } catch (error) {
        console.error('Failed to update customer info:', error);
        throw new Error('Failed to update customer info from services');
    }
};

exports.updateAddressInfo = async (customerId, address) => {
    try {
        // Check if userId is valid
        if (!customerId) {
            throw new Error('userId is required');
        }

        await Customer.findByIdAndUpdate(customerId, { address });
    } catch (error) {
        console.error('Failed to update address info:', error);
        throw new Error('Failed to update address info from services');
    }
};



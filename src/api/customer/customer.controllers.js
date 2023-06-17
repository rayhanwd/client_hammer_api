const CustomerService = require('./customer.services');

exports.getCustomerById = async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const customer = await CustomerService.getCustomerById(customerId);
        res.json(customer);
    } catch (error) {
        //console.log(error)
        res.status(500).json({ error: 'Failed to fetch customer' });
    }
};

exports.getOrdersById = async (req, res) => {
    try {
        const { customerId } = req.params;

        // Check if userId is provided
        if (!customerId) {
            return res.status(400).json({ error: 'customerId is required' });
        }

        const orders = await CustomerService.getOrdersById(customerId);

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Failed to get customer orders:', error);
        res.status(500).json({ error: 'Failed to get customer orders' });
    }
};

exports.updateCustomerInfo = async (req, res) => {
    try {
        const { customerId, fname, lname } = req.body;

        // Check if userId is provided
        if (!customerId) {
            return res.status(400).json({ error: 'customerId is required' });
        }
        await CustomerService.updateCustomerInfo(customerId, fname, lname);

        res.status(200).json({ message: 'Customer information updated successfully' });
    } catch (error) {

        console.error('Failed to update customer info:', error);
        res.status(500).json({ error: 'Failed to update customer info' });
    }
};

exports.updateAddressInfo = async (req, res) => {
    try {
        const { customerId, address } = req.body;

        // Check if userId is provided
        if (!customerId) {
            return res.status(400).json({ error: 'customerId is required' });
        }

        await CustomerService.updateAddressInfo(customerId, address);

        res.status(200).json({ message: 'Address information updated successfully' });

    } catch (error) {
        console.error('Failed to update address info:', error);
        res.status(500).json({ error: 'Failed to update address info' });
    }
};


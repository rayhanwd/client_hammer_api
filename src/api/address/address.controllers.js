const addressModel = require('./address.model');
const addressServices = require('./address.services');

exports.createAddress = async (req, res) => {
  try {
    const { customerId, address } = req.body;
    const addressData = await addressServices.createAddress(customerId, address);
    res.status(201).json({ addressData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create address' });
  }
};


exports.getCustomerAddress = async (req, res) => {
  try {
    const customerId  = req.params.customerId;

    const address = await addressServices.getCustomerAddress(customerId);

    return res.status(200).json(address);
  } catch (error) {

    return res.status(500).json({ error: 'Failed to fetch customer address' });
  }
};


exports.updateAddress = async (req, res) => {
  try {
    const { customerId, address } = req.body;

    await addressModel.findOneAndUpdate({ customerId }, { address }, { new: true });

    res.status(200).json({ message: 'Customer address updated successfully' });

  } catch (error) {
    // Handle any errors that occur during the update process
    console.error('Error updating customer address:', error);
    res.status(500).json({ error: 'Failed to update customer address' });
  }
};

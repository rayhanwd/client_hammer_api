const Address = require('./address.model');
const Customer = require('../customer/customer.model');

exports.createAddress = async (customerId, address) => {
  try {
    const customer = await Customer.findById({ _id: customerId });

    if (customer) {
      const addressData = await Address.findOneAndUpdate({ customerId }, { address }, { new: true });
      return addressData;
    }
    else {
      const addressData = await Address.create({ customerId, address });
      return addressData;
    }
  } catch (error) {
    console.log(error)
    throw new Error('Failed to create address');
  }
};


exports.getCustomerAddress = async (customerId) => {
  try {
    const customer = await Customer.findById(customerId).select('-password -refresh_token -reset_token -refresh_token_expiry');
    if (!customer) {
      throw new Error('Customer not found');
    }

    const address = await Address.find({ customerId }).populate('customerId', '-password -refresh_token -reset_token');

    return address;
  } catch (error) {
    throw new Error('Failed to fetch customer address');
  }
};

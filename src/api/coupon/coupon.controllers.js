const couponService = require('./coupon.services');

exports.createCoupon = async (req, res) => {
  try {
    const { value, code, productIds } = req.body;

    // Call the service layer to create the coupon
    const coupon = await couponService.createCoupon(value, code, productIds);

    res.status(201).json({ coupon });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create coupon' });
  }
};

exports.getCouponByCode = async (req, res) => {
  try {
    // Call the service layer to get the coupon
    const coupon = await couponService.getCouponByCode(req.body);
    res.status(200).json(coupon);

  } catch (error) {
    res.status(500).json(error);
  }
}

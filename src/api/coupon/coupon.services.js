const Coupon = require('./coupon.model');
const { Product } = require('../product/product.model');


exports.createCoupon = async (value, code, productIds) => {
    try {
        // Find the products based on the provided productIds
        const products = await Product.find({ _id: { $in: productIds } });

        // Create the coupon with the related products
        const coupon = await Coupon.create({ value, code, products });

        return coupon;
    } catch (error) {

        throw new Error('Failed to create coupon');
    }
};

exports.getCouponByCode = async (data) => {
    try {
        const { code, product } = data;

        const coupon = await Coupon.findOne({ code }).populate('products');

        if (!coupon) {
            return ('Invalid coupon or expired');
        }

        const matchingProductIds = coupon.products
            .filter((couponProduct) => product.includes(couponProduct._id.toString()))
            .map((couponProduct) => couponProduct._id);

        if (matchingProductIds.length === 0) {
            return ('No matching products found for the coupon');
        }

        return {
            code: coupon.code,
            value: coupon.value,
            productIds: matchingProductIds,
        };
    } catch (error) {
        return error
    }
};




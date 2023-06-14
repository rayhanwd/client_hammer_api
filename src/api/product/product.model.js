const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true },
    dose: { type: String, required: true },
    normalPrice: { type: Number, required: true },
    url: { type: String, required: true },
    salePrice: {
        sales: { type: Boolean, required: true },
        value: { type: Number, required: true },
    },
    stock: { type: Boolean, required: true },
    feature: { type: Boolean, required: true },
    category: [{ type: String, required: true }],
    description: { type: String, required: true },
    keywords: [{ type: String, required: true }],
}, { discriminatorKey: 'productType', versionKey: false, });

// Add a text index to the keywords field
productSchema.index({ keywords: 'text' });

// Testosterone product schema
const testosteroneSchema = new Schema({
    effectiveTime: { type: String, required: true },
    benefits: [{ type: String, required: true }],
});

// Cycle product schema
const cycleSchema = new Schema({
    productsIncluded: [{
        name: { type: String, required: true },
        quantity: { type: String, required: true },
        dosage: { type: String, required: true },
    }],
    cycleLength: { type: String, required: true },
});

// Define the models
const Product = mongoose.model('Product', productSchema);
const Testosterone = Product.discriminator('Testosterone', testosteroneSchema);
const Cycle = Product.discriminator('Cycle', cycleSchema);

module.exports = { Product, Testosterone, Cycle };

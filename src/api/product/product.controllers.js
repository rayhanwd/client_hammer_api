const productService = require('./product.services');


// Controller function to insert default data
exports.insertDefaultData = (req, res) => {
    productService.insertDefaultData()
        .then((insertedData) => {
            res.status(200).json({ message: 'Default data inserted', data: insertedData });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Failed to insert default data', error });
        });
};

// Controller method to get all Product Collections

exports.getProductCollections = async (req, res) => {
    try {
        const { category, page, pageSize } = req.query;

        const products = await productService.getProductCollections(category, page, pageSize);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch product collections', error });
    }
};


// controller method to get all product who has active the onsale

exports.getCurrentDeals = async (req, res, next) => {
    try {
        const { sort, page, pageSize } = req.query;

        const result = await productService.getCurrentDeals(page, sort, pageSize);

        if ('error' in result) {
            return res.status(400).json({ error: result.error });
        }

        return res.json(result);
    } catch (error) {
        return next(error);
    }
};

// Controller method to get all products


exports.getFeatureProducts = async (req, res) => {
    try {
        const { filterBy } = req.query;
        const products = await productService.getFeatureProducts(filterBy);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller method to get a specific product by ID
exports.getProductById = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await productService.getProductById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Add more controller methods as needed

exports.searchProducts = async (req, res) => {
    try {
        const { searchQuery, page, pageSize } = req.query;

        const searchResult = await productService.searchProducts(searchQuery, page, pageSize);
        res.json(searchResult);
    } catch (error) {

        res.status(500).json({ error: 'Internal server error' });
    }
};



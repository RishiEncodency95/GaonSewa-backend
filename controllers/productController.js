import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
    try {
        const product = await Product.create({
            ...req.body,
            companyId: req.tenant.companyId,
            branchId: req.tenant.branchId || req.body.branchId
        });
        res.status(201).json({
            status: 'success',
            data: { product }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ companyId: req.tenant.companyId });
        res.status(200).json({
            status: 'success',
            results: products.length,
            data: { products }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.params.id, companyId: req.tenant.companyId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            status: 'success',
            data: { product }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({ 
            _id: req.params.id, 
            companyId: req.tenant.companyId 
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

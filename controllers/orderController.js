import Order from '../models/Order.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

export const createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { items, deliveryAddress, paymentMethod } = req.body;

        let totalAmount = 0;
        const processedItems = [];

        // 1. Validate items and calculate total
        for (const item of items) {
            const product = await Product.findById(item.productId).session(session);
            
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.name}`);
            }

            totalAmount += product.price * item.quantity;
            processedItems.push({
                productId: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.price
            });
        }

        // 2. Create Order
        const order = await Order.create([{
            companyId: req.tenant.companyId,
            branchId: req.tenant.branchId || req.user.branchId,
            customerId: req.user._id,
            items: processedItems,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            orderStatus: 'pending'
        }], { session });

        await session.commitTransaction();
        res.status(201).json({
            status: 'success',
            data: { order: order[0] }
        });
    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    } finally {
        session.endSession();
    }
};

export const updateOrderStatus = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { status } = req.body;
        const order = await Order.findOne({ 
            _id: req.params.id, 
            companyId: req.tenant.companyId 
        }).session(session);

        if (!order) {
            throw new Error('Order not found');
        }

        // If status is changing to 'confirmed', reduce inventory
        if (status === 'confirmed' && order.orderStatus === 'pending') {
            for (const item of order.items) {
                const product = await Product.findById(item.productId).session(session);
                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product ${product.name}`);
                }
                product.stock -= item.quantity;
                await product.save({ session });
            }
        }

        order.orderStatus = status;
        await order.save({ session });

        await session.commitTransaction();
        res.status(200).json({
            status: 'success',
            data: { order }
        });
    } catch (err) {
        await session.abortTransaction();
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    } finally {
        session.endSession();
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.user._id });
        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: { orders }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

export const getCompanyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ companyId: req.tenant.companyId });
        res.status(200).json({
            status: 'success',
            results: orders.length,
            data: { orders }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

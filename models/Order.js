import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    companyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: true, 
        index: true 
    },
    branchId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Branch', 
        required: true, 
        index: true 
    },
    customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true
    },
    items: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product', 
            required: true 
        },
        name: String, // Snapshot of name at time of order
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true } // Snapshot of price at time of order
    }],
    totalAmount: { type: Number, required: true },
    paymentStatus: { 
        type: String, 
        enum: ['pending', 'paid', 'partial', 'failed', 'refunded'], 
        default: 'pending' 
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'upi', 'card', 'wallet', 'credit'],
        default: 'cash'
    },
    orderStatus: { 
        type: String, 
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
        default: 'pending' 
    },
    deliveryAddress: {
        address: String,
        city: String,
        state: String,
        zip: String,
        phone: String
    },
    notes: String
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;

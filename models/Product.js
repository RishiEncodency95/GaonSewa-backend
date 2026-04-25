import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    companyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: true, 
        index: true 
    },
    branchId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Branch', 
        index: true 
    },
    name: { type: String, required: true, trim: true },
    description: String,
    category: { type: String, index: true },
    sku: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    unit: { 
        type: String, 
        enum: ['kg', 'litre', 'pcs', 'packet', 'gram', 'ml'], 
        default: 'pcs' 
    },
    stock: { type: Number, default: 0, min: 0 },
    images: [String],
    status: { 
        type: String, 
        enum: ['Active', 'Inactive', 'Out of Stock'], 
        default: 'Active' 
    }
}, { timestamps: true });

// Compound index for faster searching within a company
productSchema.index({ companyId: 1, name: 'text', category: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;

import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
    companyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: true, 
        index: true 
    },
    name: { type: String, required: true },
    location: {
        address: String,
        city: String,
        state: String,
        zip: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    isMainBranch: { type: Boolean, default: false },
    status: { 
        type: String, 
        enum: ['Active', 'Inactive'], 
        default: 'Active' 
    }
}, { timestamps: true });

const Branch = mongoose.model('Branch', branchSchema);
export default Branch;

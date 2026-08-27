import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            title: {
                type: String,
                required: true
            },
            image:{
                type: String,
                required: true
            },

            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    address: {
        fullName: String,
        phone: Number,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
    },
    totalAmount: Number,
    paymentMethod: {
        type: String,
        enum: ['COD', 'card'],
        default: 'COD'
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered'],
        default: 'pending'
    },

}, { timestamps: true });

export default mongoose.model('Order', orderSchema);

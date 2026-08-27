import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ['men', 'women', 'unisex'],
        required: true,
        default: 'unisex'
    },
    images: {
        type: [String],
        required: true,
        validate: {
            validator: (arr) => arr.length > 0,
            message: 'At least one image is required'
        }
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    keyFeatures: {
        type: [String],
        default: []
    },
    usage: {
        type: String,
        trim: true
    },
    material: {
        type: String,
        trim: true
    },
    careInstructions: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
}, {
    timestamps: true,
});

const product = mongoose.model("Product", productSchema);

export default product;

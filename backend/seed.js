import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const productSchema = new mongoose.Schema({
    title: String, price: Number, description: String, category: String,
    gender: String, images: [String], stock: Number, rating: Number,
    keyFeatures: [String], usage: String, careInstructions: String, material: String
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const products = [
    {
        title: "Women's Brown Leather Tote Bag", category: "Handbags > Tote Bags", price: 1800, material: "Leather",
        description: "A classic brown tote bag with a spacious interior and polished everyday look.",
        keyFeatures: ["Large compartment", "zip closure", "inner pockets", "dual handles"],
        usage: "Office, college, commute", careInstructions: "Wipe with soft dry cloth; keep away from excess moisture.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/9a5292a12681c8022f345beb85d10d0968936022.jpg"],
        gender: "women", stock: 50, rating: 4
    },
    {
        title: "Women's Classic Brown Handbag", category: "Handbags > Shoulder Bags", price: 1500, material: "Leather",
        description: "A timeless shoulder bag with a refined shape for casual and semi-formal wear.",
        keyFeatures: ["Adjustable strap", "multiple compartments", "magnetic closure"],
        usage: "Office, shopping, outings", careInstructions: "Clean with dry cloth; avoid direct sunlight.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/e6663c1da4de5cd2670e2b057a22444c1e64bd80.jpg"],
        gender: "women", stock: 40, rating: 4
    },
    {
        title: "Vintage Brown Satchel Bag", category: "Handbags > Satchel Bags", price: 2400, material: "Leather",
        description: "A structured satchel with vintage styling and practical storage.",
        keyFeatures: ["Top handle", "shoulder strap", "buckle detail", "roomy compartment"],
        usage: "College, office, travel", careInstructions: "Wipe gently and store in a cool, dry place.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/a2017a78c1a92d3e7c9917800eee996a6e390a54.jpg"],
        gender: "women", stock: 30, rating: 4
    },
    {
        title: "Leather Crossbody Bag for Women", category: "Handbags > Crossbody Bags", price: 1800, material: "Leather",
        description: "A compact hands-free crossbody bag for light everyday carry.",
        keyFeatures: ["Adjustable strap", "zip closure", "compact interior"],
        usage: "Daily outings, travel, casual use", careInstructions: "Avoid water exposure; wipe with dry cloth.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/941722b225657f9fd19000f7c285d7b97812eef0.jpg"],
        gender: "women", stock: 45, rating: 4
    },
    {
        title: "Vintage Leather Hobo Bag", category: "Handbags > Hobo Bags", price: 2100, material: "Leather",
        description: "A relaxed hobo bag with a soft silhouette and roomy interior.",
        keyFeatures: ["Shoulder strap", "zip-top closure", "inner pockets"],
        usage: "Shopping, casual outings, daily use", careInstructions: "Keep away from moisture and wipe with soft cloth.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/c39359b416ad21c5919152fc004640350f6f1741.jpg"],
        gender: "women", stock: 35, rating: 4
    },
    {
        title: "Leather Wristlet Purse Clutch", category: "Handbags > Clutches", price: 1700, material: "Leather",
        description: "A compact wristlet clutch for carrying essentials in a sleek format.",
        keyFeatures: ["Wrist strap", "zip closure", "card slots", "slim profile"],
        usage: "Evenings, parties, events", careInstructions: "Wipe with dry cloth; avoid water and chemicals.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/e6663c1da4de5cd2670e2b057a22444c1e64bd80.jpg"],
        gender: "women", stock: 60, rating: 4
    },
    {
        title: "Black Vertical Backpack", category: "Backpacks > Casual Backpacks", price: 1200, material: "Polyester",
        description: "A slim black backpack with a modern vertical profile and organized compartments.",
        keyFeatures: ["Durable fabric", "multiple sections", "padded straps", "water resistance"],
        usage: "College, commute, office", careInstructions: "Wipe with damp cloth and air dry.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/4a3fed9eb78d6c3a5dd9f50104cec683f4a5c6b3.jpg"],
        gender: "unisex", stock: 70, rating: 4
    },
    {
        title: "Brown Leather Backpack for Women", category: "Backpacks > Casual Backpacks", price: 1800, material: "Leather",
        description: "A stylish leather backpack with a vintage-inspired finish and practical storage.",
        keyFeatures: ["Adjustable straps", "zip closure", "interior compartments"],
        usage: "College, travel, office", careInstructions: "Wipe with dry cloth and condition occasionally.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/16c86c9c0b6624386bd4a193fc41ac1923f8e5bd.jpg"],
        gender: "women", stock: 40, rating: 4
    },
    {
        title: "Vintage Leather Travel Backpack", category: "Backpacks > Travel Backpacks", price: 2400, material: "Leather",
        description: "A rugged backpack made for travel and longer day trips.",
        keyFeatures: ["Large compartment", "front pocket", "padded straps", "reinforced stitching"],
        usage: "Travel, hiking, weekend trips", careInstructions: "Clean gently and condition leather periodically.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/7fd93ef5901a473c793ee44d5d3102b76d64dd8b.jpg"],
        gender: "unisex", stock: 25, rating: 4
    },
    {
        title: "Classic Leather Backpack", category: "Backpacks > Casual Backpacks", price: 2000, material: "Leather",
        description: "A clean and timeless leather backpack suited to work and casual settings.",
        keyFeatures: ["Smooth finish", "laptop sleeve", "adjustable straps", "zip closure"],
        usage: "Office, college, commute", careInstructions: "Wipe with soft dry cloth.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/16c86c9c0b6624386bd4a193fc41ac1923f8e5bd.jpg"],
        gender: "unisex", stock: 35, rating: 4
    },
    {
        title: "Women's Brown Leather Backpack", category: "Backpacks > Casual Backpacks", price: 1900, material: "Leather",
        description: "A compact women's leather backpack with a sleek profile and everyday versatility.",
        keyFeatures: ["Matte finish", "zip closure", "organized pockets"],
        usage: "Daily use, college, outings", careInstructions: "Keep away from moisture and wipe dry.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/16c86c9c0b6624386bd4a193fc41ac1923f8e5bd.jpg"],
        gender: "women", stock: 40, rating: 4
    },
    {
        title: "Vintage Leather Weekender Bag", category: "Luggage > Weekender Bags", price: 3200, material: "Leather",
        description: "A spacious weekender bag built for short trips and stylish travel.",
        keyFeatures: ["Large main section", "dual handles", "shoulder strap", "side pockets"],
        usage: "Weekend trips, short travel", careInstructions: "Wipe with damp cloth and air dry.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/8866e3df5c17cf4f4d28348c448caadaedf39d62.jpg"],
        gender: "unisex", stock: 20, rating: 4
    },
    {
        title: "Slim Leather Laptop Backpack", category: "Backpacks > Laptop Backpacks", price: 2200, material: "Leather",
        description: "A professional slim backpack designed to carry a laptop and essentials without bulk.",
        keyFeatures: ["Padded laptop compartment", "sleek build", "adjustable straps"],
        usage: "Office, business travel, college", careInstructions: "Wipe with dry cloth and store in a cool place.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/16c86c9c0b6624386bd4a193fc41ac1923f8e5bd.jpg"],
        gender: "unisex", stock: 30, rating: 4
    },
    {
        title: "Leather Duffel Bag for Men", category: "Duffel & Gym Bags > Duffels", price: 1800, material: "Leather",
        description: "A rugged duffel bag with a roomy build for gym sessions and travel.",
        keyFeatures: ["Large compartment", "reinforced handles", "shoulder strap", "zip closure"],
        usage: "Gym, sports, travel", careInstructions: "Wipe with damp cloth; condition leather as needed.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/8866e3df5c17cf4f4d28348c448caadaedf39d62.jpg"],
        gender: "men", stock: 35, rating: 4
    },
    {
        title: "Slim Leather Backpack", category: "Backpacks > Casual Backpacks", price: 1600, material: "Leather",
        description: "A compact minimalist backpack for users who prefer a light and clean design.",
        keyFeatures: ["Slim body", "zip compartment", "adjustable straps"],
        usage: "Commute, casual outings, college", careInstructions: "Wipe with dry cloth and avoid harsh chemicals.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/16c86c9c0b6624386bd4a193fc41ac1923f8e5bd.jpg"],
        gender: "unisex", stock: 50, rating: 4
    },
    {
        title: "Crossbody Phone Bag for Women", category: "Handbags > Crossbody Bags", price: 1100, material: "Faux Leather",
        description: "A small crossbody phone bag for quick-access essentials on the go.",
        keyFeatures: ["Adjustable strap", "phone pocket", "zip closure", "compact size"],
        usage: "Travel, outings, events", careInstructions: "Wipe with dry cloth and avoid moisture.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/e6663c1da4de5cd2670e2b057a22444c1e64bd80.jpg"],
        gender: "women", stock: 55, rating: 4
    },
    {
        title: "Compact Leather Waist Pack", category: "Handbags > Waist Bags", price: 1400, material: "Leather",
        description: "A hands-free waist pack designed for convenience and compact storage.",
        keyFeatures: ["Adjustable strap", "zip compartments", "lightweight design"],
        usage: "Travel, outdoor use, daily errands", careInstructions: "Store in a cool, dry place and wipe clean.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/941722b225657f9fd19000f7c285d7b97812eef0.jpg"],
        gender: "unisex", stock: 45, rating: 4
    },
    {
        title: "Leather Belt Bag for Women", category: "Handbags > Waist Bags", price: 1500, material: "Leather",
        description: "A fashionable belt bag with a modern compact silhouette.",
        keyFeatures: ["Adjustable belt strap", "zip closure", "small inner pocket"],
        usage: "Festivals, travel, casual wear", careInstructions: "Wipe with dry cloth and avoid water.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/941722b225657f9fd19000f7c285d7b97812eef0.jpg"],
        gender: "women", stock: 40, rating: 4
    },
    {
        title: "Vintage Leather Backpack", category: "Backpacks > Casual Backpacks", price: 2100, material: "Leather",
        description: "A durable vintage backpack with a textured finish and classic utility.",
        keyFeatures: ["Padded straps", "zip compartment", "reinforced stitching"],
        usage: "College, office, travel", careInstructions: "Clean gently and air dry after wiping.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/7fd93ef5901a473c793ee44d5d3102b76d64dd8b.jpg"],
        gender: "unisex", stock: 30, rating: 4
    },
    {
        title: "Slim Backpack for Women", category: "Backpacks > Casual Backpacks", price: 1300, material: "Faux Leather",
        description: "A lightweight slim backpack with a neat shape for daily essentials.",
        keyFeatures: ["Compact form", "zip closure", "adjustable straps", "inner pocket"],
        usage: "College, commute, daily use", careInstructions: "Wipe with dry cloth and keep away from water.",
        images: ["https://pplx-res.cloudinary.com/image/upload/pplx_search_images/16c86c9c0b6624386bd4a193fc41ac1923f8e5bd.jpg"],
        gender: "women", stock: 50, rating: 4
    }
];

await Product.insertMany(products);
console.log('✅ All 20 products inserted successfully!');
await mongoose.disconnect();

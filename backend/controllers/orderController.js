import Order from "../models/Order.js";
import Cart from "../models/cart.js";
import Product from "../models/products.js";

export const buyNowOrder = async (req, res) => {
    try {
        const { userId, productId, quantity, address } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

        const totalAmount = product.price * quantity;

        const order = await Order.create({
            userId,
            items: [{
                productId:product._id,
                title: product.title,
                quantity, 
                price: product.price,
                image: product.image 
                }],
            totalAmount,
            address,
            paymentMethod: "COD"
        });

        product.stock -= quantity;
        await product.save();

        res.status(201).json({ message: "Order Placed Successfully", orderId: order._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const placeOrder = async (req, res) => {
    try {
        const { userId, address } = req.body;
        console.log("userId:", userId);
        console.log("address:", address);
        
        //Get Cart
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        if(!cart || cart.items.length === 0){
            return res.status(400).json({ message: 'Cart is empty' });
        }

        //Prepare Order Items
        const orderItems = cart.items.map(item => ({
            productId: item.productId._id,
            title: item.productId.title,
            image: item.productId.image,
            quantity: item.quantity,
            price: item.productId.price
        }));

        //Calculate total amount 
        const totalAmount = orderItems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        //Create Order
        const order = await Order.create({
            userId,
            items: orderItems,
            totalAmount,
            address,
            paymentMethod: "COD"
        });

        //Deduct Stock From Products
        for(let item of cart.items){
            const product = await Product.findById(item.productId._id);
            if(product){
                product.stock -= item.quantity;
                await product.save();
            }
        }

        await Cart.findOneAndUpdate({ userId }, { items: [] });
        res.status(201).json({ message: "Order Placed Successfully", orderId: order._id });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getOrdersByUser = async (req, res) => {
    try{
        const orders = await Order.find({ userId: req.params.userId }).populate('items.productId');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getOrderDetails = async (req, res) => {
    try{
        //const details = await Order.findById(req.params.id).populate('items.productId')

        const details = await Order.findById(req.params.id).populate('items.productId');
        if (!details) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(details);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

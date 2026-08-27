import cart from '../models/cart.js';


export const addtoCart = async (req, res)=> {
    try{
        const {userId, productId} = req.body;
        let addcart = await cart.findOne({userId});

        if(!addcart){
            addcart = await cart.create({userId, items: [
                { productId, quantity:1 }
            ]});
        }
        else{
            const item = addcart.items.find(item => item.productId == productId);
            if(item){
                item.quantity += 1;
            }
            else{
                addcart.items.push({productId, quantity:1})
            }
        }

        await addcart.save();
        res.json({
            message: 'Item added to cart successfully',
            cart: addcart
        })
    }
    catch(error){
        console.log('addToCart error:', error);
        res.status(500).json ({message: error.message});
    }
}

//Remove from cart

export const removeFromCart = async (req, res)=> {
    try{
        const {userId, productId} = req.body;
        let removecart = await cart.findOne({userId});

        if(!removecart){
            return res.status(404).json({message: 'Cart not found'});
        }

        removecart.items = removecart.items.filter(item => item.productId != productId);
        await removecart.save();

        res.json({
            message: 'Item removed from cart successfully',
            cart: removecart
        })
    }
    catch(error){
        res.status(500).json ({message: error.message});
    }
}

//Update cart in quantity 

export const updateQuantity = async (req, res)=> {
    try{
        const {userId, productId, quantity} = req.body;
        const updatecart = await cart.findOne({userId});

        if(!updatecart){
            return res.status(404).json({message: 'Cart not found'});
        }

        const item = updatecart.items.find(item => item.productId == productId);

        if(!item){
            return res.status(404).json({message: 'Item not found in cart'});
        }

        item.quantity = quantity;
        await updatecart.save();

        res.json({
            message: 'Cart quantity updated successfully',
            cart: updatecart
        })
    }
    catch(error){
        res.status(500).json ({message: error.message});
    }
}

//get cart by userid

export const getCartByUserId = async (req, res)=> {
    try{
        const {userId} = req.params;
        const cartData = await cart.findOne({userId}).populate('items.productId');

        if(!cartData){
            return res.status(404).json({message: 'Cart not found'});
        }

        res.json({
            cart: cartData
        })
    }
    catch(error){
        res.status(500).json ({message: error.message});
    }
}


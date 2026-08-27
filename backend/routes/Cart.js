import express from 'express';
import { addtoCart, removeFromCart, updateQuantity, getCartByUserId} from '../controllers/cartController.js';

const router = express.Router();

//Add item to cart
router.post('/add', addtoCart);

//Remove item from cart
router.post('/remove', removeFromCart);

//Update item quantity in cart
router.put('/update', updateQuantity);

//Get users cart
router.get('/:userId', getCartByUserId);

export default router;
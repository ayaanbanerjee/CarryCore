import { placeOrder, getOrderDetails, getOrdersByUser, buyNowOrder } from "../controllers/orderController.js";
import express from "express";
import { requireAuth } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post('/buy-now', requireAuth, buyNowOrder);
router.post('/place', requireAuth, placeOrder);
router.get('/user/:userId', requireAuth, getOrdersByUser);
router.get('/:id', requireAuth, getOrderDetails);

export default router;

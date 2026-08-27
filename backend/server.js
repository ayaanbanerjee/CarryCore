import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"
import authRoute from './routes/authRouter.js'
import productRoutes from "./routes/productsRoutes.js"
import Cart from "./routes/Cart.js"
import addressRoutes from "./routes/addressRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import adminRouter from "./routes/adminRouter.js"


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use('/api/auth' , authRoute);
app.use('/api/product', productRoutes);
app.use('/api/cart', Cart);
app.use('/api/address', addressRoutes);
app.use('/api/order' , orderRoutes)
app.use('/api/admin', adminRouter)
app.get('/', function(req, res){
    res.send('api is running');
})

connectDB();

app.listen(5001);
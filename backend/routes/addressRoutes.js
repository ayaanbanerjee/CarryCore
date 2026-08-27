import express from 'express';
import {saveAddress, getAddress, deleteAddress, updateAddress} from "../controllers/addressController.js";

const router = express.Router();

//Save Address  
router.post('/add', saveAddress);

//Get Address   
router.get('/:userId', getAddress);

//Delete Address
router.delete('/delete/:id', deleteAddress);

//Update Address
router.put('/update/:id', updateAddress);

export default router;
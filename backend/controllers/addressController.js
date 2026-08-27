import addressModel from '../models/Address.js';


//Save Address
export const saveAddress = async (req, res) =>{
    try{
         const address = await addressModel.create(req.body);
         res.status(200).json({
            message: 'Address Save Successfully',
             address
         })
    } 
    catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

//Get Address

export const getAddress = async (req, res) =>{
    try{
         const address = await addressModel.find({userId: req.params.userId});
         res.status(200).json(address)
    }
    catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

//Delete Address
export const deleteAddress = async (req, res) =>{
    try{
         const address = await addressModel.findByIdAndDelete(req.params.id);
         if(!address) return res.status(404).json({ message: 'Address not found' });
         res.status(200).json({
            message: 'Address Delete Successfully'
         })
    }
    catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

//Update Address
export const updateAddress = async (req, res) =>{
    try{
         const address = await addressModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
         if(!address) return res.status(404).json({ message: 'Address not found' });
         res.status(200).json({
            message: 'Address Update Successfully'
         })
    }
    catch(error){
        res.status(500).json({
            message: error.message
        })
    }
}

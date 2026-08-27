import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'User', 
        required:true
    },
    fullname:{
        type:String,
         required:true
},
    phone:{
        type:Number,
         required:true
    },
    street:{
        type:String,
         required:true
    },
    city:{
        type:String,
         required:true
    },
    state:{
        type:String,
         required:true
    },
    zipCode:{
        type:String,
         required:true
    },
    country:{
        type:String,
         required:true
    }
},{timestamps:true});

export default mongoose.model('Address', addressSchema);
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



//Register user
export const signupUser = async (req, res)=>{
    try{
        const {name, email, password, role } = req.body;

        //Check user exist or not
        const checkUser = await User.findOne({email});
        if(checkUser) return res.status(400).json({message: "User already registerd"});

        //HASH PASSWORD
        const hashpassword = await bcrypt.hash(password , 10)

       //Create User
       await User.create({
        name,
        email,
        password: hashpassword,
        role: req.body.role || "user"
       });

       res.status(200).json({message: "User created successfully"});
    }
    catch(error){
        res.status(500).json({message: error.message, error});
    }
};

//Login user
export const loginUser = async(req, res)=>{
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message: "User not found"});
        const matchPassword = await bcrypt.compare(password, user.password);
        if(!matchPassword) return res.status(400).json({message: "Invalid Credentials"});

        //Generate JWT token
        const token = jwt.sign(
            {userId: user._id, role: user.role}, 
            process.env.JWT_SECRET, 
            {expiresIn: '1d'})

        res.json({message : "Login successful",
            token,
            user:{
                id: user._id,
                role: user.role,
                name: user.name,
                email: user.email
            }
        });

    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}
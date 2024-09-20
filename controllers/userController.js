const bcrypt = require('bcrypt');
const UserModel = require("../models/UserModel")
const register = async(req, res) => {

    try {
        const { username, email, password, con_password } = req.body;

        //validation
        if (!username || !email || !password || !con_password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        //check email exists or not
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exist" })
        }

        // bcrypt password
        const bcryptPass = await bcrypt.hash(password, 10);

        //save user
        const userModel = await UserModel.create({
            username,
            email,
            password: bcryptPass
        })
        delete userModel.password;

        return res.status(201).json({ success: true, message: "User created successfully", user: userModel })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong", error: error.message })
    }

}


// login

const login = async(req, res) => {

    try {
        const { email, password } = req.body;
        const userModel = await UserModel.findOne({ email });
        if (!userModel) {
            return res.status(404).json({ message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, userModel.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        delete userModel.password;

        return res.status(200).json({ success: true, message: "Login successfully", user: userModel })

    } catch (error) {
        return res.status(500).json({ success: false, message: "Something went wrong", error: error.message })
    }
}

const setAvatar = async(req, res) => {
    try {
        const {id} = req.params
        const userModel = await UserModel.findByIdAndUpdate(id,{isAvatarImageSet:true,avatarImage:req.body.avatar},{new:true})
        if(!userModel){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json({success:true,message:"Avatar image set successfully",user:userModel})
    } catch (error) {
        return res.status(500).json({success:false,message:"Something went wrong",error:error.message})
    }
}


// get all user

const getAlluser = async(req,res)=>{
    // return console.log(req.params)
    try {
        const {id} = req.params
        const allUser = await UserModel.find({_id:{$ne:id}}).select([
            "email",
            "username",
            'avatarImage',
            "_id" 
        ]);
        return res.status(200).json({success:true,message:"All user",allUser})
    } catch (error) {
        return res.status(500).json({success:false,message:"Something went wrong",error:error.message})
    }
}


module.exports = { register, login,setAvatar,getAlluser }
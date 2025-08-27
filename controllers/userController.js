import User from "../models/User";
import bcrypt from "bcryptjs";


// Generate JWT Token 
const generateToken = (user) => {
    const payload = user_id;
          return jwt.sign(payload,process.env.JWT_SECRET)
    };
   

// Register User
export const registerUser = async (req, res) => {
    try{

        const { username, email, password } = req.body;

        if(!username || !email ||!password|| password.length<8 ){
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await User.findByEmail(email);
        if(userExists){
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create ({name,email,password:hashedPassword});
        const token = generateToken(user._id.toString());
        res.json({ success: true,token})
    }catch(error){
        console.error("Error registering user:", error);
        res.json({sucess:false, message: error.message });
    }
}

//Login User

export const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.json({ success:false,message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({ success:false,message: "Invalid credentials" });
        }
        const token = generateToken(user._id.toString());
        res.json({ success: true,token})
    } catch(error){
        console.log(error.message);
        res.json({sucess:false,message: error.message });
    }
}

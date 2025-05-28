import UserModel from "../models/user.js"
import bcrypt from 'bcryptjs'

export async function registerUserController(request,response) {
    try{
        const {name, email, password} = request.body

        if(!name || !email ||!password){
            return response.status(400).json({
                message: "Please provide name, email and password",
                error: true,
                success: false
            })
        }

        const user = await UserModel.findOne({ email })

        if(user){
            return response.json({
                message: "Already registered email",
                error: true,
                success: false
            })
        }
        
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()

    } catch (error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
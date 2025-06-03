import sendEmail from "../config/sendEmail.js"
import UserModel from "../models/user.js"
import bcrypt from 'bcryptjs'
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js"
import generatedAccessToken from "../utils/generateAccessToken.js"
import generatedRefreshToken from "../utils/generateRefreshToken.js"
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js"
import generatedOtp from "../utils/generatedOtp.js"
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js"
import jwt from 'jsonwebtoken'

export async function registerUserController(request,response) {
    try{
        const {name, email, password} = request.body || {}

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
        
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const payload = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new UserModel(payload)
        const save = await newUser.save()

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save._id}`

        const verifyEmail = await sendEmail({
                sendTo: email,
                subject: "Verification email from Nexus",
                html: verifyEmailTemplate({
                    name,
                    url: VerifyEmailUrl
                })
        })

        return response.json({
            message: "User registered, Kumbaya!!",
            success: true,
            error: false,
            data: save
        })

    } catch (error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function verifyEmailController(request, response) {
    try {
        const { code } = request.body

        const user = await UserModel.findOne({_id: code})

        if(user) {
            return response.status(400).json({
                message: "Invalid code",
                error: true,
                success: false
            })
        }

        const updateUser = await UserModel.updateOne({_id: code},{
            verify_email: true
        })

        return response.json({
            message: "verification of email success",
            success: true,
            error: false
        })

    } catch(error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: true
        })
    }
}

export async function loginController(request, response) {
    try{
        const { email, password } = request.body

        if(!email || !password){
            return response.status(400).json({
                message: "Provide email and password",
                error: true,
                success: false
            })
        }
        const user = await UserModel.findOne({ email })
        if (!user) {
            return response.status(400).json({
                message: "User not registered",
                error: true,
                success: false
            })
        }

        if(user.status !== "Active") {
            return response.status(400).json({

            })
        }

        const checkPassword = await bcrypt.compare(password, user.password)
        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false.valueOf
            })
        }

        const accessToken = await generatedAccessToken(user._id)
        const refreshToken = await generatedRefreshToken(user._id)


        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date: new Date()
        })

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
        response.cookie('accessToken', accessToken, cookiesOption)
        response.cookie('refreshToken', refreshToken, cookiesOption)

        return response.json({
            message: "Login Successful, Kumbaya!",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken
            }
        })

    } catch (error){
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function logoutController(request, response) {
    try {
        const userid = request.userId
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        response.clearCookie("accessToken")
        response.clearCookie("refreshToken")

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_token: ""
        })

        return response.json({
            message: "Logout Successful, Kumbaya!",
            success: true,
            error: false
        })
    } catch(error) {
        return response.status(500).json({
            message: error.message || message,
            error: true,
            success: false
        })
    }
}

export async function uploadAvatar(request, response) {
    try{
        const userId = request.userId
        const image = request.file 
        const upload = await uploadImageCloudinary(image)

        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        })
        return response.json({
            message: "Upload profile",
            data: {
                avatar: upload.url,
                _id: userId
            }
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function updateUserDetails(request, response) {
    try{
        const { name, email, mobile, password } = request.body
        const userId  = request.userId
        let hashPassword = ""
        if(password) {
            const salt = await bcrypt.genSalt(10)
            hashPassword = await bcrypt.hash(password, salt)
        }
        const updateUser = await UserModel.updateOne({_id : userId}, {
            ...(name && { name: name}),
            ...(email && { email: email}),
            ...(mobile && { mobile: mobile}),
            ...(password && { password: hashPassword}),
        })
        return response.json({
            message: "Updated user details, Kumbaya!",
            error: false,
            success: true,
            data: updateUser
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function forgotPasswordController(request, response) {
    try{
        const { email } = request.body
        const user = await UserModel.findOne({ email })

        if(!user) {
            return response.status(400).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        const otp = generatedOtp()
        const expireTime = new Date() + 60 * 60 * 1000

        const update = await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo: email,
            subject: "Forgot password OTP from Nexus",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp,
            })
        })

        return response.json({
            message: "OTP sent to your email",
            error: false,
            success: true
        })

        

    } catch(error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export async function verifyForgotPasswordOtp(request, response) {
  try {
    const { email, otp } = request.body;

    if (!email || !otp) {
      return response.status(400).json({
        message: "Provide the required fields",
        error: true,
        success: false
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false
      });
    }

    const currentTime = new Date().toISOString();

    if (user.forgot_password_expiry < currentTime) {
      return response.status(400).json({
        message: "OTP expired",
        error: true,
        success: false
      });
    }

    if (otp !== user.forgot_password_otp) {
      return response.status(400).json({
        message: "OTP invalid",
        error: true,
        success: false
      });
    }

    const updateUser = await UserModel.findByIdAndUpdate(user._id, {
        forgot_password_otp : "",
        forgot_password_expiry: ""
    })


    return response.json({
      message: "OTP verified, Kumbaya!",
      success: true,
      error: false
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}


export async function resetPassword(request, response) {
    try{
        const { email, newPassword, confirmPassword } = request.body
        
        if(!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "provide required fields",
            })
        }
        const user = await UserModel.findOne({ email })

        if(!user) {
            return response.status(400).json({
                message: "Email is not available",
                error: true,
                success: true
            })
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "Passwords don't match check your confirm password",
                error: true,
                success: false
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(newPassword, salt)

        const update = await UserModel.findByIdAndUpdate(user._id, {
            password: hashPassword
        })

        return response.json({
            message: "Password reset done, Kumbaya!",
            error: false,
            success: true
        })

    }catch(error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function refreshToken(request, response) {
    try{
        const refreshToken = request.cookies.refreshToken || 
        request?.headers?.authorization?.split(" ")[1]


        if(!refreshToken){
            return response.status(401).json({
                message: "Unauthorized access",
                error: true,
                success: false
            })
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN)

        if(!verifyToken) {
            return response.status(401).json({

                message: "Token is expired",
                error: true,
                success: false
            })
        }

        const userId = verifyToken?._id

        const newAccessToken = await generatedAccessToken(userId)

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }


        response.cookie('accessToken', newAccessToken, cookiesOption)

        return response.json({
            message: "New access token generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        })



    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export async function userDetails(request, response) {
    try{
        const userId = request.userId

        const user = await UserModel.findById(userId).select('-password -refresh_token')

        return response.json({
            message: 'User Details',
            data: user,
            error: false,
            success: true
        })

    }
    
    catch(error) {
        return response.status(500).json({
            message:"Something is wrong",
            error: true,
            success: false
        })
    }
}
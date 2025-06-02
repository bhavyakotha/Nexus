import React, { useEffect, useState, Link } from 'react'
import { useLocation, useNavigate } from 'react-router-dom' 
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { FaRegEyeSlash } from 'react-icons/fa6'
import { FaRegEye } from 'react-icons/fa6'

const ResetPassword = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [data, setData] =useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
    })
const validValue = Object.values(data).every(el => el)
const handleChange = (e) => {
    const {name, value} = e.target
    setData((prev) => {
        return{
            ...prev,
            [name] : value
        }
    })
}

const handleSubmit = async(e) => {
        e.preventDefault() 
    
        try {
            const response = await Axios({
                ...SummaryApi.reset_password,
                data: data
            })
    
            if (response.data.error){
                toast.error(response.data.message)
            }
    
            if(response.data.success) {
                toast.success(response.data.message)
                navigate("/login")
                setData({
                    email: "",
                    newPassword: "",
                    confirmPassword: ""
                })
            }
    
        } catch (error) {
            AxiosToastError(error)
        }
        
}

useEffect(() => {
        if(!(location?.state?.data?.success)){
            navigate("/")
        }

        if(location?.state?.email){
            setData((prev) => {
                return{
                    ...prev,
                    email: location?.state?.email
                }
            })
        }

}, [])


  return (
    <section className='w-full container mx-auto px-2'>
        <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-9'>
        <p className='font-bold text-lg mb-2'>Enter your password</p>
            <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                    <label htmlFor='newPassword'>New Password: </label>
                    <div className='bg-blue-50 p-2 border rounded flex items-center'>
                        <input 
                            type={showConfirmPassword ? "text": "password"}
                            id='password'
                            className='w-full outline-none'
                            name = 'newPassword'
                            value={data.newPassword}
                            onChange={handleChange}
                            placeholder='Enter your new password'
                        ></input>
                        <div onClick={() => {
                            setShowConfirmPassword(prev => !prev)
                        }} className='cursor-pointer'>
                            {
                                showPassword ? (
                                    <FaRegEye/>
                                ) : (
                                    <FaRegEyeSlash/>
                                )
                            }
                        </div>
                    </div>
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='confirmPassword'>Confirm Password: </label>
                    <div className='bg-blue-50 p-2 border rounded flex items-center'>
                        <input 
                            type={showPassword ? "text": "password"}
                            id='password'
                            className='w-full outline-none'
                            name = 'confirmPassword'
                            value={data.confirmPassword}
                            onChange={handleChange}
                            placeholder='Enter your password again'
                        ></input>
                        <div onClick={() => {
                            setShowPassword(prev => !prev)
                        }} className='cursor-pointer'>
                            {
                                showPassword ? (
                                    <FaRegEye/>
                                ) : (
                                    <FaRegEyeSlash/>
                                )
                            }
                        </div>
                    </div>
                </div>
                <button disabled = {!validValue} className={` ${validValue ? "bg-secondary-100 hover:bg-primary-100" : "bg-gray-300"} text-white py-2 rounded font-semibold my-3 tracking-wider`}>Change Password</button>
            </form>
        </div>
    </section>
  )
}

export default ResetPassword
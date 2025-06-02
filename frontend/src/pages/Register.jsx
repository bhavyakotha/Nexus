import React, { useState } from 'react'
import { FaRegEyeSlash } from 'react-icons/fa6'
import { FaRegEye } from 'react-icons/fa6'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useNavigate } from 'react-router-dom'


const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const navigate = useNavigate()

const handleChange = (e) => {
    const {name, value} = e.target
    setData((prev) => {
        return{
            ...prev,
            [name] : value
        }
    })
}
const validValue = Object.values(data).every(el => el)

const handleSubmit = async(e) => {
    e.preventDefault()
    if(data.password !== data.confirmPassword){
        toast.error(
            "Password and confirm password must be same!"
        )
        return 
    }
    try {
        const response = await Axios({
            ...SummaryApi.register,
            data: data
        })

        if (response.data.error){
            toast.error(response.data.message)
        }

        if(response.data.success) {
            toast.success(response.data.message)
            setData({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
            })
            navigate("/login")
        }

    } catch (error) {
        AxiosToastError
    }
    
}
    

  return (
    <section className='w-full container mx-auto px-2'>
        <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-9'>
            <p>Welcome to Nexus!</p>
            <form className='grid gap-4 mt-6' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                    <label htmlFor='name'>Name: </label>
                    <input 
                        type='text'
                        autoFocus
                        id='name'
                        className='bg-blue-50 p-2 border rounded outline-none focus: border-primary-100'
                        name = 'name'
                        value={data.name}
                        onChange={handleChange}
                        placeholder='Enter your name'
                    ></input>
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='email'>Email: </label>
                    <input 
                        type='email'
                        id='email'
                        className='bg-blue-50 p-2 border rounded outline-none focus: border-primary-100'
                        name = 'email'
                        value={data.email}
                        onChange={handleChange}
                        placeholder='Enter your email'
                    ></input>
                </div>
                <div className='grid gap-1'>
                    <label htmlFor='password'>Password: </label>
                    <div className='bg-blue-50 p-2 border rounded flex items-center'>
                        <input 
                            type={showPassword ? "text": "password"}
                            id='password'
                            className='w-full outline-none'
                            name = 'password'
                            value={data.password}
                            onChange={handleChange}
                            placeholder='Enter your password'
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
                <div className='grid gap-1'>
                    <label htmlFor='confirmPassword'>Confirm Password: </label>
                    <div className='bg-blue-50 p-2 border rounded flex items-center'>
                        <input 
                            type={showConfirmPassword ? "text": "password"}
                            id='confirmPassword'
                            className='w-full outline-none'
                            name = 'confirmPassword'
                            value={data.confirmPassword}
                            onChange={handleChange}
                            placeholder='Enter the same password again'
                        ></input>
                        <div onClick={() => {
                            setShowConfirmPassword(prev => !prev)
                        }} className='cursor-pointer'>
                            {
                                showConfirmPassword ? (
                                    <FaRegEye/>
                                ) : (
                                    <FaRegEyeSlash/>
                                )
                            }
                        </div>
                    </div>
                </div>
                <button disabled = {!validValue} className={` ${validValue ? "bg-secondary-100 hover:bg-primary-100" : "bg-gray-300"} text-white py-2 rounded font-semibold my-3 tracking-wider`}>Register</button>
            </form>
            <p>Already have an account? <Link to= {"/login"} className='font-semibold text-primary-100'>Login</Link></p>
        </div>
    </section>
  )
}

export default Register
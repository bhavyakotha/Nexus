import React, { useState } from 'react'
import { FaRegEyeSlash } from 'react-icons/fa6'
import { FaRegEye } from 'react-icons/fa6'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useNavigate } from 'react-router-dom'
import fetchUserDetails from '../utils/fetchUserDetails'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../store/userSlice'


const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

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

    try {
        const response = await Axios({
            ...SummaryApi.login,
            data: data
        })

        if (response.data.error){
            toast.error(response.data.message)
        }

        if(response.data.success) {
            toast.success(response.data.message)
            localStorage.setItem('accessToken', response.data.data.accessToken)
            localStorage.setItem('refreshToken', response.data.data.refreshToken)

            const userDetails = await fetchUserDetails()
            dispatch(setUserDetails(userDetails.data))

            setData({
                email: "",
                password: ""
            })
            navigate("/")
        }

    } catch (error) {
        AxiosToastError(error)
    }
    
}
    

  return (
    <section className='w-full container mx-auto px-2'>
        <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-9'>
            <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
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
                    <Link to={"/forgot-password"} className='block ml-auto hover:text-primary-100'>Forgot Password?</Link>
                </div>
                <button disabled = {!validValue} className={` ${validValue ? "bg-secondary-100 hover:bg-primary-100" : "bg-gray-300"} text-white py-2 rounded font-semibold my-3 tracking-wider`}>Login</button>
            </form>
            <p>Don't have an account? <Link to= {"/register"} className='font-semibold text-primary-100'>Register</Link></p>
        </div>
    </section>
  )
}

export default Login
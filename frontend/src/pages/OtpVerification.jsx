import React, { useState, useRef, useEffect } from 'react'
import { FaRegEyeSlash } from 'react-icons/fa6'
import { FaRegEye } from 'react-icons/fa6'
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useLocation, useNavigate } from 'react-router-dom'


const OtpVerification = () => {
    const [data, setData] = useState(["", "", "", "", "", ""])
    const navigate = useNavigate()
    const validValue = data.every(el => el)
    const inputRef = useRef([])
    const location = useLocation()

    useEffect(() => {
      if(!location?.state?.email) {
        navigate("/forgot-password")
      }
    }, [])

  const handleSubmit = async(e) => {
    e.preventDefault() 

    try {
        const response = await Axios({
            ...SummaryApi.verify_otp,
            data: {
              otp: data.join(""),
              email : location?.state?.email
            }
        })

        if (response.data.error){
            toast.error(response.data.message)
        }

        if(response.data.success) {
            toast.success(response.data.message)
            setData(["", "", "", "", "", ""])
            navigate("/reset-password", {
              state: {
                data: response.data,
                email: location?.state?.email
              }
            })
        }

    } catch (error) {
        AxiosToastError(error)
    }
    
}
    

  return (
    <section className='w-full container mx-auto px-2'>
        <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-9'>
        <p className='font-bold text-lg mb-2'>OTP Verification</p>
            <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                <div className='grid gap-1'>
                    <label htmlFor='email'>Enter your OTP: </label>
                    <div className='flex items-center gap-3 justify-between mt-3'>
                      {
                        data.map((element, index) => {
                          return(
                              <input 
                                ref = {(ref) => {
                                    inputRef.current[index] = ref
                                    return ref
                                }}
                                onChange={(e) => {
                                  const value= e.target.value
                                  const newData = [...data]
                                  newData[index] = value
                                  setData(newData)
                                  if(value && index < 5) {
                                    inputRef.current[index + 1].focus()
                                  }
                                }}
                                key = {"otp" + index}
                                type='text'
                                id='otp'
                                maxLength={1}
                                value = {data[index]}
                                className='bg-blue-50 w-full max-w-14 p-2 border rounded outline-none 
                                focus: border-primary-100 text-center font-semibold'
                              ></input>
                          )
                        })
                      }
                    </div>
                    
                </div>
                <button disabled = {!validValue} className={` ${validValue ? "bg-secondary-100 hover:bg-primary-100" : "bg-gray-300"} text-white py-2 rounded font-semibold my-3 tracking-wider`}>Verify OTP</button>
            </form>
        </div>
    </section>
  )
}

export default OtpVerification
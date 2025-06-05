import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaRegUserCircle } from 'react-icons/fa'
import UserProfileAvatarEdit from '../components/UserProfileAvatarEdit'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'
import { setUserDetails } from '../store/userSlice'
import fetchUserDetails from '../utils/fetchUserDetails'

const Profile = () => {
    const user = useSelector(state => state.user)
    const [openProfileAvatarEdit, setProfileAvatarEdit] = useState(false)
    const [userData, setUserData] = useState({
        name: user.name,
        email: user.email,
        mobile: user.mobile,
    })

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()


    useEffect(() => {
        setUserData({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
        })
    }, [])

    const handleOnChange =(e) => {
        const { name, value } = e.target
        
        setUserData((prev) => {
            return{
                ...prev,
                [name] : value
            }
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()

        try{
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.updateUserDetails,
                data: userData
            })

            const { data: responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                const userData = await fetchUserDetails()
                dispatch(setUserDetails(userData.data))
            }

        }catch(error) {
            AxiosToastError(error)   
            
        } finally{
            setLoading(false)
        }
    }

  return (
    <div className='ml-6'>
        <div className='w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
            {
                user.avatar ? (
                    <img
                        alt = {user.name}
                        src = {user.avatar}
                        className='w-full h-full'
                    />
                ) : (
                    <FaRegUserCircle size={65}/>
                )
            }
        </div>
        <button onClick={() => setProfileAvatarEdit(true)} className='text-sm min-w-20 border border-primary-200 hover:border-primary-100 hover:bg-primary-100
         hover:text-white px-3 py-1 rounded-full mt-5'>Edit</button>

        {
            openProfileAvatarEdit && (
                <UserProfileAvatarEdit close = {() => setProfileAvatarEdit(false)}/>
            )
        }


        <form className='my-4 grid gap-4' onSubmit={handleSubmit}>
            <div className='grid'>
                <label>
                    Name
                </label>
                <input
                    type='text'
                    placeholder='Enter your name'
                    className='p-2 bg-[#FAF0E6] outline-primary-200 border focus-within:border-primary-100 rounded'
                    value={userData.name}
                    name = 'name'
                    onChange={handleOnChange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='email'>
                    Email
                </label>
                <input
                    type='email'
                    id='email'
                    placeholder='Enter your email'
                    className='p-2 bg-[#FAF0E6] outline-primary-200 border focus-within:border-primary-100 rounded'
                    value={userData.email}
                    name = 'email'
                    onChange={handleOnChange}
                    required
                />
            </div>
            <div className='grid'>
                <label htmlFor='mobile'>
                    Mobile
                </label>
                <input
                    type='text'
                    id='mobile'
                    placeholder='Enter your mobile number'
                    className='p-2 bg-[#FAF0E6] outline-primary-200 border focus-within:border-primary-100 rounded'
                    value={userData.mobile}
                    name = 'mobile'
                    onChange={handleOnChange}
                    required
                />
            </div>

            <button className='border px-4 font-semibold bg-primary-200 hover:bg-primary-100 py-2 hover:text-white rounded'>

                {
                    loading ? "Loading..." : "Submit"
                }

            </button>
        </form>

    </div>
  )
}

export default Profile
import React, { useEffect, useState } from 'react'
import UploadCategoryModel from '../components/UploadCategoryModel'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import EditCategory from '../components/EditCategory'
import ConfirmBox from '../components/ConfirmBox'
import AxiosToastError from '../utils/AxiosToastError'
import toast from 'react-hot-toast'

const CategoryPage = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false)
    const [loading, setLoading] = useState(false)
    const [categoryData, setCategoryData] = useState([])
    const [openEdit, setOpenEdit] = useState(false)
    const [editData, setEditData] = useState({
        name: "",
        image: "",
    })

    const [openConfirmBoxDelete, setOpenConfirmBoxDelete] = useState(false)
    
    const [deleteCategory,setDeleteCategory] = useState({
        _id : ""
    })

    const handleDeleteCategory = async()=>{
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data : deleteCategory
            })

            const { data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchCategory()
                setOpenConfirmBoxDelete(false)
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const fetchCategory = async()=>{
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getCategory
            })
            const { data : responseData } = response

            if(responseData.success){
                setCategoryData(responseData.data)
            }
        } catch (error) {
            //hdbhd
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategory()
    },[])


  return (
    <section>
        <div className='p-2 bg-white shadow-md justify-between flex items-center'>
            <h2 className='font-semibold'>Category</h2>
            <button onClick={() => setOpenUploadCategory(true)} className='text-sm border border-primary-200 hover:bg-primary-100 bg-primary-200 
            rounded py-2 px-3 hover:text-white'>Add Category</button>
        </div>


        {
            !categoryData[0] && !loading && (
                <NoData/>
            )
        }

    <div className='p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2'>
        {
            categoryData.map((category, index) => {
                return(
                    <div key={category._id} className='w-32 h-56 overflow-hidden shadow-md'>
                        <img
                            alt={category.name}
                            src={category.image}
                            className='w-52 object-scale-down'
                        />
                        <div className='items-center h-9 flex gap-1'>
                            <button onClick={() => {setOpenEdit(true) 
                                setEditData(category)}
                            } className='flex-1 bg-purple-200 hover:bg-purple-300 text-primary-100 font-medium py-1 text-sm'>
                                Edit
                            </button>
                            <button onClick={() => {
                                setOpenConfirmBoxDelete(true)
                                setDeleteCategory(category)
                            }} className='flex-1 bg-red-200 hover:bg-red-300 text-red-700 font-medium py-1 text-sm'>
                                Delete
                            </button>
                        </div>

                    </div>
                )
            })
        }
    </div>



        {
            loading && (
                <Loading/>
            )
        }



        {
            openUploadCategory && (
                <UploadCategoryModel fetchData={fetchCategory} close = {() => setOpenUploadCategory(false)}/>
            )
        }

        {
            openEdit && (
                <EditCategory data={editData} close={() => setOpenEdit(false)}/>
            )
        }


        {
            openConfirmBoxDelete && (
                <ConfirmBox close={() => setOpenConfirmBoxDelete(false)} cancel={() => setOpenConfirmBoxDelete(false)} confirm={handleDeleteCategory}/>
            )
        }
        
    </section>
  )
}

export default CategoryPage
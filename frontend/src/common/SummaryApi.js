export const baseURL = "http://localhost:3000"

const SummaryApi = {
    register :{
        url: '/api/user/register',
        method: 'post'
    },
    login : {
        url: '/api/user/login',
        method: 'post'
    },
    forgot_password: {
        url: '/api/user/forgot-password',
        method: 'put'
    },
    verify_otp: {
        url: '/api/user/verify-otp',
        method: 'put'
    },
    reset_password: {
        url: '/api/user/reset-password',
        method: 'put'
    },
    refreshToken: {
        url: '/api/user/refresh-token',
        method: 'post'
    },
    userDetails: {
        url: '/api/user/user-details',
        method: 'get'
    },
    logout: {
        url: '/api/user/logout',
        method: 'get'
    },
    uploadAvatar: {
        url: '/api/user/upload-avatar',
        method: 'put'
    },
    updateUserDetails: {
        url: '/api/user/update-user',
        method: 'put'
    },
    addCategory: {
        url: '/api/category/add-category',
        method: 'post'
    },
    uploadImage: {
        url: '/api/file/upload',
        method: 'post'
    },
    getCategory: {
        url: '/api/category/get',
        method: 'get'
    },
    updateCategory: {
        url: '/api/category/update',
        method: 'put'
    },
    deleteCategory: {
        url: '/api/category/delete',
        method: 'delete'
    },
    createSubCategory: {
        url: '/api/subcategory/create',
        method: 'post'
    },
    getSubCategory: {
        url: '/api/subcategory/get',
        method: 'post'
    },
    updateSubCategory: {
        url: '/api/subcategory/update',
        method: 'put'
    },
    deleteSubCategory: {
        url: '/api/subcategory/delete',
        method: 'delete'
    },
    createProduct: {
        url: '/api/product/create',
        method: 'post'
    },
    getProduct: {
        url: '/api/product/get',
        method: 'post'
    }
}

export default SummaryApi
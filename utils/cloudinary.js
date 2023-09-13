const cloudinary = require('cloudinary')
cloudinary.config({
    // cloud_name: process.env.CLOUD_NAME,
    // api_key: process.env.API_KEY,
    // api_secret: process.env.SECRET_KEY
    cloud_name:'dt8flx8k4', 
    api_key:'273484383856223',
    api_secret:'d9bi26wcrUJulx_QQA4tyGIEjE8'
})

const cloudinaryUploadImg = async (fileToUpload) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUpload, (result) => {
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id
            }, {
                resource_type: "auto"
            })
        })
    })
}

const cloudinaryDeleteImg = async (fileToDelete) => {
    return new Promise((resolve) => {
        cloudinary.uploader.destroy(fileToDelete, (result) => {
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id
            }, {
                resource_type: "auto"
            })
        })
    })
}

module.exports = { cloudinaryUploadImg, cloudinaryDeleteImg }
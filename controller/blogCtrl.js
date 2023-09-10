const fs = require('fs')
const blogs = require("../models/blogModel")
const users = require("../models/userModel")
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbid')
const { cloudinaryUploadImg } = require('../utils/cloudinary')

// Create Blog
const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await blogs.create(req.body)
        res.status(200).json(newBlog)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Update Blog
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updateBlog = await blogs.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updateBlog)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get Blog
const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getBlog = await blogs.findById(id).populate("likes").populate("dislikes")
        const updateViews = await blogs.findByIdAndUpdate(id, {
            $inc: { numViews: 1 }
        }, { new: true })
        res.status(200).json(getBlog)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get all Blogs
const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await blogs.find()
        res.status(200).json(getBlogs)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Delete Blog
const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedBlog = await blogs.findByIdAndDelete(id)
        res.status(200).json(deletedBlog)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Like the Blog
const liketheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body
    validateMongoDbId(blogId)
    // find the blog which you want to be liked
    const blog = await blogs.findById(blogId)
    // find the login user
    const loginUserId = req?.user?._id
    // find the user has liked the post
    const isLiked = blog?.isLiked
    // find if the user has dislike the post
    const alreadyDisliked = blog?.dislikes?.find((userId) => userId?.toString() === loginUserId?.toString())
    if (alreadyDisliked) {
        const blog = await blogs.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, { new: true })
        res.json(blog)
    }
    if (isLiked) {
        const blog = await blogs.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, { new: true })
        res.json(blog)
    }
    else {
        const blog = await blogs.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true
        }, { new: true })
        res.json(blog)
    }
})

// Dislike the Blog
const disliketheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body
    validateMongoDbId(blogId)
    // find the blog which you want to be liked
    const blog = await blogs.findById(blogId)
    // find the login user
    const loginUserId = req?.user?._id
    // find the user has liked the post
    const isDisLiked = blog?.isDisliked
    // find if the user has dislike the post
    const alreadyLiked = blog?.likes?.find((userId) => userId?.toString() === loginUserId?.toString())
    if (alreadyLiked) {
        const blog = await blogs.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, { new: true })
        res.json(blog)
    }
    if (isDisLiked) {
        const blog = await blogs.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, { new: true })
        res.json(blog)
    }
    else {
        const blog = await blogs.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            isDisliked: true
        }, { new: true })
        res.json(blog)
    }
})

// Upload Images
const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images")
        const urls = []
        const files = req.files
        for (const file of files) {
            const { path } = file
            const newPath = await uploader(path)
            urls.push(newPath)
            fs.unlinkSync(path)
        }
        const findBlog = await blogs.findByIdAndUpdate(id, {
            images: urls.map((file) => { return file }),
        }, {
            new: true
        })
        res.json(findBlog)
    }
    catch (error) {
        throw new Error(error)
    }
})

module.exports = { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, liketheBlog, disliketheBlog, uploadImages }

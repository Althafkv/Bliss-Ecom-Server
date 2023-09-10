const products = require('../models/productModel')
const users = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
const validateMongoDbId = require('../utils/validateMongodbid')

// create product
const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await products.create(req.body)
        res.status(200).json(newProduct)
    }
    catch (error) {
        throw new Error(error)
    }
})

// update product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updateProduct = await products.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.status(200).json(updateProduct)
    }
    catch (error) {
        throw new Error(error)
    }
})

// delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deleteProduct = await products.findOneAndDelete(id)
        res.status(200).json(deleteProduct)
    }
    catch (error) {
        throw new Error(error)
    }
})

// get a product
const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const findProduct = await products.findById(id).populate("color")
        res.status(200).json(findProduct)
    }
    catch (error) {
        throw new Error(error)
    }
})

// get all product
const getAllProduct = asyncHandler(async (req, res) => {
    try {
        // filter
        const queryObj = { ...req.query }
        const excludeFields = ["page", "sort", "limit", "fields"]
        excludeFields.forEach((el) => delete queryObj[el])
        console.log(queryObj);

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

        let query = products.find(JSON.parse(queryStr))

        // sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(",").join(" ")
            query = query.sort(sortBy)
        } else {
            query = query.sort("-createdAt")
        }

        // limiting the field
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ")
            query = query.select(fields)

        } else {
            query = query.select('-__v')
        }

        // pagination
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)
        if (req.query.page) {
            const productCount = await products.countDocuments()
            if (skip >= productCount) throw new Error("This Page doesnot exist")
        }
        console.log(page, limit, skip);


        const product = await query
        res.status(200).json(product)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Add to Wishlist
const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { prodId } = req.body
    try {
        const user = await users.findById(_id)
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId)
        if (alreadyadded) {
            let user = await users.findByIdAndUpdate(_id, {
                $pull: { wishlist: prodId }
            }, { new: true })
            res.json(user)
        } else {
            let user = await users.findByIdAndUpdate(_id, {
                $push: { wishlist: prodId }
            }, { new: true })
            res.status(200).json(user)
        }
    }
    catch (error) {
        throw new Error(error)
    }
})

// Rating
const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { star, prodId, comment } = req.body
    try {
        const product = await products.findById(prodId)
        let alreadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString()
        )
        if (alreadyRated) {
            const updateRating = await products.updateOne(
                {
                    ratings: { $elemMatch: alreadyRated }
                },
                {
                    $set: { "ratings.$.star": star, "ratings.$.comment": comment }
                }, {
                new: true
            }
            )

        } else {
            const rateProduct = await products.findByIdAndUpdate(
                prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id
                        }
                    }
                }, { new: true }
            )

        }
        const getallratings = await products.findById(prodId)
        let totalRating = getallratings.ratings.length
        let ratingsum = getallratings.ratings
            .map((item) => item.star)
            .reduce((prev, curr) => prev + curr, 0)
        let actualRating = Math.round(ratingsum / totalRating)
        let finalproduct = await products.findByIdAndUpdate(
            prodId,
            {
                totalrating: actualRating
            },
            {
                new: true
            }
        )
        res.json(finalproduct)
    }
    catch (error) {
        throw new Error(error)
    }
})


module.exports = { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishlist, rating }

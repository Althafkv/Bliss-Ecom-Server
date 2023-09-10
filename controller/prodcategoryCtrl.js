const categories = require('../models/prodcategoryModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbid')

// Create Cat
const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await categories.create(req.body)
        res.status(200).json(newCategory)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Update Cat
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedCategory = await categories.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updatedCategory)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Delete Cat
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedCategory = await categories.findByIdAndDelete(id)
        res.status(200).json(deletedCategory)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get Cat
const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getaCategory = await categories.findById(id)
        res.status(200).json(getaCategory)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get all Cat
const getallCategory = asyncHandler(async (req, res) => {
    try {
        const getallCategory = await categories.find()
        res.status(200).json(getallCategory)
    }
    catch (error) {
        throw new Error(error)
    }
})


module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getallCategory }
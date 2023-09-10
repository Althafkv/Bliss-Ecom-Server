const bcategories = require('../models/blogCatModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbid')

// Create Category
const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await bcategories.create(req.body)
        res.status(200).json(newCategory)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedCategory = await bcategories.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updatedCategory)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedCategory = await bcategories.findByIdAndDelete(id)
        res.status(200).json(deletedCategory)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get Category
const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getaCategory = await bcategories.findById(id)
        res.status(200).json(getaCategory)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get all Category
const getallCategory = asyncHandler(async (req, res) => {
    try {
        const getallCategory = await bcategories.find()
        res.status(200).json(getallCategory)
    }
    catch (error) {
        throw new Error(error)
    }
})

module.exports = { createCategory, updateCategory, deleteCategory, getCategory, getallCategory }
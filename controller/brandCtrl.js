const brands = require('../models/brandModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbid')

// Create Brand
const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await brands.create(req.body)
        res.status(200).json(newBrand)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Update Brand
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedBrand = await brands.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updatedBrand)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Delete Brand
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedBrand = await brands.findByIdAndDelete(id)
        res.status(200).json(deletedBrand)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get Brand
const getBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getaBrand = await brands.findById(id)
        res.status(200).json(getaBrand)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get all Brand
const getallBrand = asyncHandler(async (req, res) => {
    try {
        const getBrands = await brands.find()
        res.status(200).json(getBrands)
    }
    catch (error) {
        throw new Error(error)
    }
})


module.exports = { createBrand, updateBrand, deleteBrand, getBrand, getallBrand }
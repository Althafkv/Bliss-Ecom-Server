const colors = require('../models/colorModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbid')

// Create Color
const createColor = asyncHandler(async (req, res) => {
    try {
        const newColor = await colors.create(req.body)
        res.status(200).json(newColor)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Update Color
const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedColor = await colors.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updatedColor)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Delete Color
const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedColor = await colors.findByIdAndDelete(id)
        res.status(200).json(deletedColor)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get Color
const getColor = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getaColor = await colors.findById(id)
        res.status(200).json(getaColor)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get all Color
const getallColor = asyncHandler(async (req, res) => {
    try {
        const getallColor = await colors.find()
        res.status(200).json(getallColor)
    }
    catch (error) {
        throw new Error(error)
    }
})


module.exports = { createColor, updateColor, deleteColor, getColor, getallColor }
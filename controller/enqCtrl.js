const enquiries = require('../models/enqModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbid')

// Create Enq
const createEnquiry = asyncHandler(async (req, res) => {
    try {
        const newEnquiry = await enquiries.create(req.body)
        res.status(200).json(newEnquiry)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Update Enq
const updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedEnquiry = await enquiries.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updatedEnquiry)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Delete Enq
const deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedEnquiry = await enquiries.findByIdAndDelete(id)
        res.status(200).json(deletedEnquiry)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get Enq
const getEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getaEnquiry = await enquiries.findById(id)
        res.status(200).json(getaEnquiry)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get all Enq
const getallEnquiry = asyncHandler(async (req, res) => {
    try {
        const getallEnquiry = await enquiries.find()
        res.status(200).json(getallEnquiry)
    }
    catch (error) {
        throw new Error(error)
    }
})


module.exports = { createEnquiry, updateEnquiry, deleteEnquiry, getEnquiry, getallEnquiry }
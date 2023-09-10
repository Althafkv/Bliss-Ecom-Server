const coupons = require('../models/couponModel')
const validateMongoDbId = require('../utils/validateMongodbid')
const asyncHandler = require('express-async-handler')

// Create Coupon
const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await coupons.create(req.body)
        res.status(200).json(newCoupon)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get all Coupon
const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const allCoupon = await coupons.find()
        res.status(200).json(allCoupon)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Update Coupon
const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const updatedCoupon = await coupons.findByIdAndUpdate(id, req.body, { new: true })
        res.status(200).json(updatedCoupon)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Delete Coupon
const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const deletedCoupon = await coupons.findByIdAndDelete(id)
        res.status(200).json(deletedCoupon)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get Coupon
const getCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const getACoupon = await coupons.findById(id)
        res.status(200).json(getACoupon)
    }
    catch (error) {
        throw new Error(error)
    }
})

module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon, getCoupon }
const { generateToken } = require('../config/jwtToken')
const users = require('../models/userModel')
const products = require('../models/productModel')
const carts = require('../models/cartModel')
const coupons = require('../models/couponModel')
const orders = require('../models/orderModel')
const uniqid = require('uniqid');
const asyncHandler = require('express-async-handler')
const { use } = require('../routes/authRoute')
const validateMongoDbId = require('../utils/validateMongodbid')
const { generateRefreshToken } = require('../config/refreshtoken')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const sendEmail = require('./emailCtrl')

// register a user
const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email
    const findUser = await users.findOne({ email: email })
    if (!findUser) {
        // create a new user
        const newUser = await users.create(req.body)
        res.status(200).json(newUser)
    } else {
        throw new Error("user Already Exist")
    }
})

// login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    // console.log(email,password);
    // check user exist or not
    const findUser = await users.findOne({ email })
    if (findUser && (await findUser.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findUser?._id)
        const updateuser = await users.findByIdAndUpdate(findUser.id, {
            refreshToken: refreshToken
        }, { new: true })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        res.status(200).json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        })
    } else {
        throw new Error("Invalid Credentials")
    }
})

// admin login
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    // console.log(email,password);
    // check user exist or not
    const findAdmin = await users.findOne({ email })
    if (findAdmin.role !== 'admin') throw new Error("Not Authorized")
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        const refreshToken = await generateRefreshToken(findAdmin?._id)
        const updateuser = await users.findByIdAndUpdate(findAdmin.id, {
            refreshToken: refreshToken
        }, { new: true })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        res.status(200).json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)
        })
    } else {
        throw new Error("Invalid Credentials")
    }
})

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    // console.log(cookie);
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies")
    const refreshToken = cookie.refreshToken
    console.log(refreshToken);
    const user = await users.findOne({ refreshToken })
    if (!user) throw new Error("No refresh token present in DB or not matched")
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token")
        }
        const accessToken = generateToken(user?._id)
        res.status(200).json({ accessToken })
    })
})

// logout
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies")
    const refreshToken = cookie.refreshToken
    const user = await users.findOne({ refreshToken })
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204)
    }
    await users.findOneAndUpdate({ refreshToken }, {
        refreshToken: "",
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    })
    res.sendStatus(204)
})

// update a user
const updateaUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const updateaUser = await users.findByIdAndUpdate(_id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        }, {
            new: true
        })
        res.status(200).json(updateaUser)
    }
    catch (error) {
        throw new Error(error)
    }
})

// save user address
const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const updateaUser = await users.findByIdAndUpdate(_id, {
            address: req?.body?.address,
        }, {
            new: true
        })
        res.status(200).json(updateaUser)
    }
    catch (error) {
        throw new Error(error)
    }
})

// get all users
const getallUser = asyncHandler(async (req, res) => {
    try {
        const getUsers = await users.find().populate("wishlist")
        res.status(200).json(getUsers)
    }
    catch (err) {
        throw new Error(err)
    }
})

// get a single user
const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    // console.log(id);
    validateMongoDbId(id)
    try {
        const getaUser = await users.findById(id)
        res.status(200).json(getaUser)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Delete user
const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    // console.log(id);
    validateMongoDbId(id)
    try {
        const deleteaUser = await users.findByIdAndDelete(id)
        res.status(200).json(deleteaUser)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Block User
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const blockusr = await users.findByIdAndUpdate(
            id,
            {
                isBlocked: true
            },
            {
                new: true
            }
        )
        res.status(200).json(blockusr)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Unblock User
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const unblock = await users.findByIdAndUpdate(
            id,
            {
                isBlocked: false
            },
            {
                new: true
            }
        )
        res.status(200).json("User Unblocked")
    }
    catch (error) {
        throw new Error(error)
    }
})

// Update Pass
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { password } = req.body
    validateMongoDbId(_id)
    const user = await users.findById(_id)
    if (password) {
        user.password = password
        const updatedPassword = await user.save()
        res.status(200).json(updatedPassword)
    } else {
        res.json(user)
    }
})

// Forgot Pass
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await users.findOne({ email })
    if (!user) throw new Error("User not found with this email")
    try {
        const token = await user.createPasswordResetToken()
        await user.save()
        const resetURL = `Please follow this link to Reset your Password. The link is valid till 10 min from now. <a href='https://bliss-ecom.netlify.app/reset-password/${token}'>Click Here</>`
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot passwod Link",
            htm: resetURL
        }
        sendEmail(data)
        res.json(token)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Reset Pass
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body
    const { token } = req.params
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const user = await users.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    })
    if (!user) throw new Error("Token Expired, Please try again")
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save()
    res.json(user)
})

// Get Wishlist
const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user
    try {
        const findUser = await users.findById(_id).populate("wishlist")
        res.status(200).json(findUser)
    }
    catch (error) {
        throw new Error(error)
    }
})

// User Cart
const userCart = asyncHandler(async (req, res) => {
    const { productId, color, quantity, price } = req.body
    const { _id } = req.user
    validateMongoDbId(_id)
    try {

        let newCart = await new carts({
            userId: _id,
            productId,
            color,
            price,
            quantity
        }).save();
        res.json(newCart)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get User Cart
const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const cart = await carts.find({ userId: _id }).populate("productId").populate("color")
        res.json(cart)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Remove Product From Cart
const removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { cartItemId } = req.params
    validateMongoDbId(_id)
    try {
        const deleteProductFromCart = await carts.deleteOne({ userId: _id, _id: cartItemId })
        res.json(deleteProductFromCart)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Empty Cart
const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongoDbId(_id)
    try {
        const deleteCart = await carts.deleteMany({ userId: _id })
        res.json(deleteCart)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Update Product Quantity in Cart
const updateProductQuantityFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { cartItemId, newQuantity } = req.params
    validateMongoDbId(_id)
    try {
        const cartItem = await carts.findOne({ userId: _id, _id: cartItemId })
        cartItem.quantity = newQuantity
        cartItem.save()
        res.json(cartItem)
    }
    catch (error) {
        throw new Error(error)
    }
})

// Create Order
const createOrder = asyncHandler(async (req, res) => {
    const { shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount, paymentInfo } = req.body
    const { _id } = req.user
    try {
        const order = await orders.create({
            shippingInfo, orderItems, totalPrice, totalPriceAfterDiscount, paymentInfo, user: _id
        })
        res.json({
            order,
            success: true
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get my Orders
const getMyOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user
    try {
        const getorders = await orders.find({ user: _id }).populate("user").populate("orderItems.product").populate("orderItems.color")
        res.json({
            getorders
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get all Orders
const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const getorders = await orders.find().populate("user")
        // .populate("orderItems.product").populate("orderItems.color")
        res.json({
            getorders
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get Single Orders
const getSingleOrders = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const getorders = await orders.findOne({ _id: id }).populate("orderItems.product").populate("orderItems.color")
        res.json({
            getorders
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

// Update Order
const updateOrder = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const getorders = await orders.findById(id)
        getorders.orderStatus = req.body.status
        await getorders.save()
        res.json({
            getorders
        })
    }
    catch (error) {
        throw new Error(error)
    }
})

// Get Monthwise Order Income
const getMonthWiseOrderIncome = asyncHandler(async (req, res) => {
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let d = new Date()
    let endDate = "";
    d.setDate(1)
    for (let index = 0; index < 11; index++) {
        d.setMonth(d.getMonth() - 1)
        endDate = monthNames[d.getMonth()] + " " + d.getFullYear()

    }
    // console.log(endDate);
    const data = await orders.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate)
                }
            }
        }, {
            $group: {
                _id: {
                    month: "$month"
                }, amount: { $sum: "$totalPriceAfterDiscount" }, count: { $sum: 1 }
            }
        }
    ])
    res.json(data)
})

// Get Yearly Total Orders
const getYearlyTotalOrders = asyncHandler(async (req, res) => {
    let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    let d = new Date()
    let endDate = ""
    d.setDate(1)
    for (let index = 0; index < 11; index++) {
        d.setMonth(d.getMonth() - 1)
        endDate = monthNames[d.getMonth()] + " " + d.getFullYear()
    }
    const data = await orders.aggregate([
        {
            $match: {
                createdAt: {
                    $lte: new Date(),
                    $gte: new Date(endDate)
                }
            }
        }, {
            $group: {
                _id: null,
                count: { $sum: 1 },
                amount: { $sum: "$totalPriceAfterDiscount" }
            }
        }
    ])
    res.json(data)
})

module.exports = { createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, updateaUser, blockUser, unblockUser, handleRefreshToken, logout, updatePassword, forgotPasswordToken, resetPassword, loginAdmin, getWishlist, saveAddress, userCart, getUserCart, removeProductFromCart, createOrder, updateProductQuantityFromCart, getMyOrders, getMonthWiseOrderIncome, getYearlyTotalOrders, getAllOrders, getSingleOrders, updateOrder, emptyCart }

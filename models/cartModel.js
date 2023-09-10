const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products"
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "colors"
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('carts', cartSchema);

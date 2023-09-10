const { default: mongoose } = require('mongoose')

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.DATABASE)
        console.log('Database Connected Successfully');
    }
    catch (error) {
        console.log('Database Connection Error');
    }
}

module.exports = dbConnect
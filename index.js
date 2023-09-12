const express = require('express')
const cors = require('cors')
const dbConnect = require('./config/dbConnect')
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 5000
const authRouter = require('./routes/authRoute')
const productRouter = require('./routes/productRoute')
const blogRouter = require('./routes/blogRoute')
const categoryRouter = require('./routes/prodcategoryRouter')
const bcategoryRouter = require('./routes/blogCatRoute')
const brandRouter = require('./routes/brandRoute')
const colorRouter = require('./routes/colorRoute')
const enqRouter = require('./routes/enqRoutes')
const uploadRouter = require('./routes/uploadRoute')
const couponRouter = require('./routes/couponRoute')
const bodyParser = require('body-parser')
const { notFound, errorHandler } = require('./middlewares/errorHandler')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
// const cors = require('cors')
dbConnect()

app.use(
    cors({
        origin: "http://localhost:3000/",
        methods: ["GET", "POST", "PUT", "DELETE"]
    })
)
app.use(morgan("dev"))
// app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/user', authRouter)
app.use('/api/product', productRouter)
app.use('/api/blog', blogRouter)
app.use('/api/category', categoryRouter)
app.use('/api/blogcategory', bcategoryRouter)
app.use('/api/brand', brandRouter)
app.use('/api/coupon', couponRouter)
app.use('/api/color', colorRouter)
app.use('/api/enquiry', enqRouter)
app.use('/api/upload', uploadRouter)

app.use(notFound)
app.use(errorHandler)

// app.get("/", (req,res) => {
//     res.setHeader("Access-Control-Allow-Credentials","true")
//     res.send("Server Running...")
// })

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
})

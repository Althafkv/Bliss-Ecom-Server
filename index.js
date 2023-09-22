const express = require('express')
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
const cors = require('cors')
dbConnect()

app.use(morgan("dev"))
app.use(cors({
    origin: ["https://bliss-ecom.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://bliss-ecom.netlify.app");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
    res.setHeader('content-type', 'application/json');
    next();
  });

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

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
})

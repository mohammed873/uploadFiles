const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()


//database connection 
mongoose.connect(process.env.MONGO_URI , {
    useNewUrlParser: true,
    useUnifiedTopology : true,
})
.then(()=> console.log('MongoDB is connected successfully'))
.catch(err=> console.log(err));


// Use Middlewares 
app.use(express.json())

// routes
app.use('/user' , require('./routes/user'))

const port = process.env.PORT || 5000
app.listen(port , () => console.log(`Server is running at ${port}`))
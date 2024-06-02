//instead of common js syntax
//const express = require('express')
// using es syntax, because in package.json, “type”: “module” 
import express from 'express' 
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import productRoutes from './routes/productRoutes.js'

import products from './data/products.js'

const port = process.env.PORT || 5000//frontend is running on 3000

connectDB(); // connect to MongoDB

const app = express()

//create home '/' route
// app.get('/', (req, res) => {
//     res.send('Home API is running..')
// })

app.use('/api/products', productRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => 
    console.log(`Server running on port ${port}`))


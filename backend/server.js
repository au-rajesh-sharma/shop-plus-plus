//instead of common js syntax
//const express = require('express')
// using es syntax, because in package.json, “type”: “module” 
import express from 'express' 
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

//import products from './data/products.js'

const port = process.env.PORT || 5000//frontend is running on 3000

connectDB(); // connect to MongoDB

const app = express()

//let server get req body data as json object thru this parser middleware
app.use(express.json()) 

//let server get req body data from url
app.use(express.urlencoded({extended: true})) 

//use cookie parser middleware. 
//It will allow to access req.cookies.jwt
app.use(cookieParser())


app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

//add the route to pay pal. send res as paypal client id from .env file
app.get('/api/config/paypal', (req, res) => res.send({
    clinetid: process.env.PAYPAL_CLIENT_ID}))

app.use(notFound)
app.use(errorHandler)

app.listen(port, () => 
    console.log(`Server running on port ${port}`))


//instead of common js syntax
//const express = require('express')
// using es syntax, because in package.json, “type”: “module” 
import express from 'express' 
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'


import products from './data/products.js'

const port = process.env.PORT || 5000//frontend is running on 3000

connectDB(); // connect to MongoDB

const app = express()

//create home '/' route
// app.get('/', (req, res) => {
//     res.send('Home API is running..')
// })

app.get('/api/products', (req, res) => {
    res.json(products)
})

app.get('/api/products/:id', (req, res) => {
    const product = products.find((p) => p._id === req.params.id)
    res.json(product)
    console.log(product)
})

app.listen(port, () => 
    console.log(`Server running on port ${port}`))


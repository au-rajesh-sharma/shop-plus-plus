import asynchandler from "../middleware/asynchandler.js";
import Order from "../models/orderModel.js";

//@desc     create new order
//@route    POST /api/orders
//@acess    private (could be private or private admin)
const addOrderItems = asynchandler(async (req, res) => {
        
    //get all items/details from req body for creating order 
    const {
        orderItems, //an array of cartItems
        shippingAddress, paymentMethod, itemsPrice, 
        tax, shippingPrice, totalPrice
    } = req.body

    //if no items in cart, throw error
    if(orderItems && orderItems.length === 0){
        res.status(400)
        throw new Error('No order items')
    } else {
        //create a new order
        const order = new Order({
            //map thru order items array, 
            orderItems: orderItems.map((x) => 
                ({...x, product: x._id,//adding product id for each item 
                    _id: undefined})),//and making _id undefined for each item
            user: req.user._id,
            shippingAddress, paymentMethod, itemsPrice, tax,
            shippingPrice, totalPrice
        })

        //save the created order from order variable
        const createdOrder = await order.save()
        res.status(201).json(createdOrder)//return response
    }
    
    //res.status(201).json(response)//return response
})

//@desc     get logged in user's orders
//@route    GET /api/orders/myorders
//@acess    private (could be private or private admin)
const getMyOrders = asynchandler(async (req, res) => {
    const orders = await Order.find({User: req.user._id})
    res.status(200).json(orders)//return orders
})

//@desc     get order by id
//@route    GET /api/orders/:id
//@acess    private (could be private or private admin)
const getOrderById = asynchandler(async (req, res) => {
    //find order from Order collection by order id from the url param
    //also, add user name and email to this order info
    const order = await Order.findById(req.params.id).populate(
        'user', //populate the user from user collection
        'name email' //name email fields
    )

    if(order){//order found
        res.status(200).json(order)//return order
    } else {//throw error
        res.status(404)
        throw new Error('Order not found')
    }
})

//@desc     update order to paid (set isPaid to true in orderModel)
//@route    PUT /api/orders/:id/pay
//@acess    private (could be private or private admin)
const updateOrderToPaid = asynchandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    if(order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {//all values will come from paypal
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        }
        const updatedOrder = await order.save()
        res.status(200).json(updatedOrder)
    } else {
        res.status(404)
        throw new Error('Order not found')
    }
})

//@desc     update order to delivered (set isDelivered to true in orderModel)
//@route    PUT /api/orders/:id/deliver
//@acess    private/admin 
const updateOrderToDelivered = asynchandler(async (req, res) => {
    const products = await Product.find({})
   
   
    res.send('updateOrderToDelivered')
})

//@desc     get all orders
//@route    GET /api/orders
//@acess    private/admin 
const getOrders = asynchandler(async (req, res) => {
    //const products = await Product.find({})
    res.send('getOrders')
})

export {addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, 
    updateOrderToDelivered, getOrders};
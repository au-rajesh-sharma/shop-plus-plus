
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, ListGroup, Image, Card, ListGroupItem } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrderDetailsQuery, useGetPayPalClientIdQuery, 
    usePayOrderMutation } from '../slices/ordersApiSlice';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const OrderScreen = () => {
    //get id from url, name it orderId
    const {id: orderId} = useParams()

    //get order details by calling query passing order id
    const {data: order, refetch, isLoading, error} 
        = useGetOrderDetailsQuery(orderId)
    
    //initialize function for payOrder
    const [payOrder, {isLoading:loadingPay}] = usePayOrderMutation()

    //get paypal dispatch and isPending for use
    const [{isPending}, paypalDispatch] = usePayPalScriptReducer()
  
    //get user info from state
    const userInfo = useSelector((state) => state.auth)
    
    //initialize getPayPalClientId query for use
    const {data: paypal, isLoading: loadingPayPal, error: errorPayPal} 
        = useGetPayPalClientIdQuery()

    //create use effect to load paypal script
    useEffect(() => {
        //check for no errors
        if(!errorPayPal && !loadingPayPal && paypal.clientId){
           //create async function to load paypal script
           const loadPayPalScript = async () => {
            //use paypal dispatch
            paypalDispatch({//the arguments to dispatch 
                type: 'resetOptions',
                value: {
                    'client-id': paypal.clientId,
                    currency: 'AUD',
                }
            })
            //dispatch with arguments
            paypalDispatch({type: 'setLoadingStatus', value: 'pending'})
           } 
           if(order && !order.isPaid) {//if order exist and not paid
                if(!window.paypal){//if script is not already loaded
                    loadPayPalScript()//load it 
                }
           }
        }//give dependencies
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal])

    //handler functions on paypal buttons (are in sandbox mode)
    async function onApproveTest() {
        //call payOrder mutation, set details to empty payer object
        await payOrder({orderId, details: {payer: {} } })
        refetch()//refetch after marked as paid 
        toast.success('Payment successful')
     }
     
    function createOrder(data, actions) {
        //create order entry thru paypal actions  with total paid amount
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice
                    },
                },
            ],
        })//it returns a promise, so resolve by returning orderId
        .then((orderId) => {
            return orderId
        })//end .then
     }

    function onApprove(data, actions) { 
        //actions trigger paypal. after paypal is approved, 
        //capture the order pmt details, and call 
        //async function passing details
        return actions.order.capture().then(async function (details) { 
            try {
               await payOrder({orderId, details})//call payOrder mutation
               refetch()//refetch after marked as paid 
               toast.success('Payment successful')
            } catch (err) {
                toast.error(err?.data?.message || err.message)
            }
        })
    }

    function onError(err) {
        toast.error(err.message) 
     }

  return (
    isLoading ? <Loader /> : error ? <Message variant='danger' /> : (
        <>
            <h1>Order: {order._id}</h1>
            <Row>
                <Col md={8}>
                   <ListGroup variant='flush'> 
                        <ListGroupItem>
                            <h5><strong>Shipping</strong></h5>
                            <p><strong>Name:{' '}</strong>
                                {order.user.name}</p> 
                            <p><strong>Email:{' '}</strong>
                                {order.user.email}</p>  
                            <p><strong>Address:{' '}</strong>
                                {order.shippingAddress.address},{' '}
                                 {order.shippingAddress.city},{' '}
                                 {order.shippingAddress.postCode},{' '}
                                 {order.shippingAddress.country}
                            </p>
                            </ListGroupItem>
                            <ListGroupItem>
                                <h5><strong>Delivery Status:</strong></h5>
                                {order.isDelivered ? (
                                <Message variant='success'>
                                    Delivered on {order.deliveredAt}
                                </Message>
                            ) : (
                                <Message variant="danger">
                                    Not Delivered 
                                </Message>
                            )}   
                        </ListGroupItem>
                        <ListGroupItem>
                            <h5><strong>Payment Method:</strong></h5>
                            <p><strong>{order.paymentMethod}</strong></p>
                            {order.isPaid ? (
                                <Message variant='success'>
                                    Paid on {order.paidAt}
                                </Message>
                            ) : (
                                <Message variant='danger'>
                                    Not Paid 
                                </Message>
                            )}   
                        </ListGroupItem>
                        <ListGroupItem>
                            <h5><strong>Order Items</strong></h5>
                            {order.orderItems.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={2}>
                                        <Image
                                            src={item.image} alt={item.name}
                                            fluid rounded
                                        />
                                        </Col>
                                        <Col>
                                        <Link to={`/product/${item._id}`}>
                                            {item.name}
                                        </Link>
                                        </Col>
                                        <Col md={4}>
                                        {item.qty} x ${item.price} = $
                                        {/* for creating 2 decimal places *100 /100 */}
                                        {(item.qty * (item.price * 100)) / 100}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}    
                        </ListGroupItem>
                   </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h5>Order Summary</h5>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {/* PAY ORDER BUTTON if order not paid */}
                            {!order.isPaid && (//if order not paid, then
                                <ListGroup.Item>
                                    {/*if loadingPay, then show loader*/}
                                    {loadingPay && <Loader />}
                                    {/*if pending, then show loader, otherwise*/}
                                    {isPending ? (<Loader />) : (
                                        //show button for test payment
                                        <div>
                                            <Button onClick={onApproveTest} style={{marginBottom: '10px'}}
                                            >Test Pay Order
                                            </Button>
                                            <div>
                                                {/* buttons like PayPal and Debit or Credit Card  */}
                                                <PayPalButtons 
                                                    // handler functions on button clicks
                                                    createOrder={createOrder}
                                                    onApprove={onApprove}
                                                    onError={onError}
                                                ></PayPalButtons>
                                            </div>
                                        </div>
                                    )}

                                </ListGroup.Item>
                            )}
                            
                            
                            {/* MARK AS DELIVERED BUTTON PLACEHOLDER */}

                        </ListGroup>
                    </Card> 
                </Col>
            </Row>
        </>
    )
)}

export default OrderScreen;
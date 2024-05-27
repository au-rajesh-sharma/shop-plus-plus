import {useEffect, useState} from 'react'
import {useParams} from "react-router-dom"
import {Link} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Card, Button} from 'react-bootstrap'
import Rating from "../components/Rating"
import axios from 'axios'

const ProductScreen = () => {
  // get id from url. id must be declared as object {}
  const {id} = useParams()
  
  //const product = products.find((p) => id === p._id );
  const maxRating = 5 //highest possible (stars) rating 
  
  //get the product object for this id from api
  //setProducts will be used to update product state
  const [product, setProduct] = useState([])

  //2nd arg will load product when id changes
  //get products using axios
  useEffect(() => {
    const fetchProduct = async () => {
      //use a back tick ` here
      const {data} = await axios.get(`/api/products/${id}`)
      setProduct(data)
    };
  
    fetchProduct()
  }, [id])//reload every time productId changes

    return (
    <>
                
        <Link className='btn btn-Light my-3' to='/'>
            Back
        </Link>

        <Row>
            <Col md={5}>
                <Image src={product.image} alt={product.name} fluid />
            </Col>  
            <Col md={4}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h3>{product.name}</h3>    
                    </ListGroup.Item> 
                    <ListGroup.Item>
                        <Rating rating={product.rating} 
                            numReviewText={`${product.numReviews} reviews`} 
                        /> 
                    </ListGroup.Item> 
                    {/* <ListGroup.Item>Price: ${product.price}</ListGroup.Item>    */}
                    <ListGroup.Item>Description: {product.description}</ListGroup.Item>   
                </ListGroup>
            </Col> 
            <Col md={3}>
                <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <Row>
                            <Col>Price:</Col>
                            <Col><strong>${product.price}</strong></Col>
                        </Row>
                    </ListGroup.Item> 
                    <ListGroup.Item>
                        <Row>
                            <Col>Status:</Col>
                            <Col><strong>{product.countInStock > 0 ? `In Stock: ${product.countInStock}` : 'Out of Stock'}</strong></Col>
                        </Row>
                    </ListGroup.Item> 
                    <ListGroup.Item>
                        <Button className='btn-block' type='button' 
                            disabled={product.countInStock === 0}
                            >Add to Cart
                        </Button>
                    </ListGroup.Item> 
                </ListGroup>    
                </Card>
            </Col> 
        </Row>
    </>
  )
}

export default ProductScreen
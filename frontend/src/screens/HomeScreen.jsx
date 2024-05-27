import {useEffect, useState} from 'react'
import {Row, Col} from 'react-bootstrap'
import Product from '../components/Product'
import axios from 'axios'
//import products from '../products'


const HomeScreen = () => {
  //products is an empty array. setProducts will be used to update products state
  const [products, setProducts] = useState([])
  
  //empty array as 2nd arg will load products only once
  //get products using axios
  useEffect(() => {
    const fetchProducts = async () => {
      const {data} = await axios.get('/api/products')
      setProducts(data)
    };
  
    fetchProducts()
  }, [])

  return (
    <>
        <h1>Latest Products</h1>
        <Row>
            {products.map((product) => (
                // responsive: small screen, take 12 columns, medium - 6 col, large - 4, xl - 3  
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product}/>
                </Col>
            ))}
        </Row>
    </>
  );
};

export default HomeScreen;
import {Row, Col} from 'react-bootstrap'
import Product from '../components/ProductCard'
import { useGetProductsQuery } from '../slices/productsApiSlice';

  const HomeScreen = () => {

  //use productsApiSlice get query to get products
  const {data: products, isLoading, error} = useGetProductsQuery()
  

  return (
    <>
      { isLoading ? (<h2>Loading...</h2>) 
      : error ? 
      (<div>{error?.data?.message || error.error}</div>) 
      : ( //rendering of actual poroducts
        <>
          <h1>Latest Products</h1>
          <Row>
              {products.map((p) => (
                  // responsive: small screen, take 12 columns, medium - 6 col, large - 4, xl - 3  
                  <Col key={p._id} sm={12} md={6} lg={4} xl={3}>
                      <Product product={p}/>
                  </Col>
              ))}
          </Row>
        </>
      ) }
    </>
  )
};

export default HomeScreen;
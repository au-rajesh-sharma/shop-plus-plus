import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
 } from 'react-router-dom'

 //import paypal provider
 import {PayPalScriptProvider} from '@paypal/react-paypal-js'

 import { Provider } from 'react-redux';
 import store from './store' 

//import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/bootstrap.custom.css'; //this is custom css styles file
import './assets/styles/index.css'; //this is css styles file
//import './index.css';
import App from './App';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import PrivateRoutes from './components/PrivateRoutes';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route index={true} path='/' element={<HomeScreen />} /> 
      <Route path='/product/:id' element={<ProductScreen />} /> 
      <Route path='/cart' element={<CartScreen />} /> 
      <Route path='/login' element={<LoginScreen />} /> 
      {/* <Route path='/auth' element={<LoginScreen />} />  */}
      <Route path='/register' element={<RegisterScreen />} /> 
      
   

    {/* add private routes component, and private routes withinb it */}
    {/* so, admin routes, as well as routes to profile will be private */}
    <Route path='' element={<PrivateRoutes />} >
        <Route path='/shipping' element={<ShippingScreen />} /> 
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} /> 
        <Route path='/order/:id' element={<OrderScreen />} /> 
    </Route>

    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* we wrap router provider with Provider {store}
    for rendering */}
    <Provider store = {store}>
      <PayPalScriptProvider diferLoading={true}>
        <RouterProvider router = {router}/>
      </PayPalScriptProvider>
    </Provider>
  </React.StrictMode>
);

reportWebVitals();

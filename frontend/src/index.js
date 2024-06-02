import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
 } from 'react-router-dom'

 import { Provider } from 'react-redux';
 import store from './store' 

//import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/bootstrap.custom.css'; //this is custom css styles file
import './assets/styles/index.css'; //this is css styles file
//import './index.css';
import App from './App';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route index={true} path='/' element={<HomeScreen />} /> 
      <Route path='/product/:id' element={<ProductScreen />} /> 
    </Route>
  )
)
  


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* we wrap router provider with Provider {store}
    for rendering */}
    <Provider store = {store}>
      <RouterProvider router = {router}/>
    </Provider>
  </React.StrictMode>
);


reportWebVitals();

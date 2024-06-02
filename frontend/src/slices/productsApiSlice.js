import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

//productsApiSlice is injecting endpoint reducers into parent apiSlice
export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: PRODUCTS_URL,
            }), 
            keepUnusedDataFor: 5 //5 seconds
        }),

        getProductById: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }), 
            keepUnusedDataFor: 5 //5 seconds
        })
    }),
})

export const {useGetProductsQuery, 
    useGetProductByIdQuery} = productsApiSlice;
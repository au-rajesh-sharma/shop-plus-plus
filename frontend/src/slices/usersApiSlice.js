import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

//usersApiSlice is injecting endpoint reducers into parent apiSlice
//login action will be dispatched from login screen
export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({//its a POST request
            query: (data) => ({//send email, pw in data
                //url: `${USERS_URL}/auth`,
                url: `${USERS_URL}/login`,
                method: 'POST',
                body: data,
            }), 
           
        }),

        register: builder.mutation({//its a POST request
            query: (data) => ({//send email, pw in data
                url: `${USERS_URL}`,//req on base url only
                //url: `${USERS_URL}/register`,
                method: 'POST',
                body: data,
            }), 
           
        }),


        logout: builder.mutation({//its a POST request
            query: () => ({
                //url: `${USERS_URL}/auth`,
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }), 
        }),
    })
})
    
export const {useLoginMutation, useLogoutMutation, 
    useRegisterMutation} = usersApiSlice;
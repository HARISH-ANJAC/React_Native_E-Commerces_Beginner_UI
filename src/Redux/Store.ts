import {configureStore} from '@reduxjs/toolkit';
import ProductReducer from './Products/ProductSlice';
import CartReducer from './Cart/CartSlice';
const Store=configureStore({
    reducer:{
        // Add your reducers here
        products:ProductReducer,
        cart: CartReducer,
    },

});
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export default Store;
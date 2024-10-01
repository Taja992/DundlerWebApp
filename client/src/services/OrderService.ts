// src/services/OrderService.ts
import axios from 'axios';
import { Order } from './Api';

const apiBaseUrl = 'http://localhost:5193';

export const fetchOrders = async (): Promise<Order[]> => {
    try {
        const response = await axios.get(`${apiBaseUrl}/Orders`, {
            headers: {
                'Accept': 'application/json',
            },
        });
        if (!Array.isArray(response.data)) {
            throw new Error('Invalid API response');
        }
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};


export const fetchCustomerOrders = async (customerId: string): Promise<Order[]> => {
    try {
        const response = await axios.get(`${apiBaseUrl}/Orders/Customer/${customerId}`, {
            headers: {
                'Accept': 'application/json',
            },
        });
        return response.data
    } catch (error) {
        console.error('Error Fetching Customers Orders:', error)
        throw error;
    }
};

                                //takes orderData object as parameter, all properties of order but the omitted ones
                                //id is managed by the server
export const createOrder = async (orderData: Omit<Order, 'id'>): Promise<Order> => {
        // Setting up some front end validation
        if(!orderData.orderDate) {
            return Promise.reject(new Error('Order date is required'))
        }
        if(!orderData.totalAmount && orderData.totalAmount !== 0){
            return Promise.reject(new Error('Total amount is required'));
        }
        if (orderData.totalAmount < 0) {
            return Promise.reject(new Error('Total amount cannot be negative'));
        }
        //auto setting the status to pending for new orders, maybe should be done in backend
        const includeStatus = { ...orderData, status: 'Pending' };
    try {
        const response = await axios.post(`${apiBaseUrl}/Orders`, includeStatus, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};







import {Customer} from "./Api.ts";
import axios from "axios";


const apiBaseurl = 'http://localhost:5193';

//fetch all customers
export const fetchCustomers = async (): Promise<Customer[]> => {
    try {
        const response = await axios.get(`${apiBaseurl}/Customers`, {
            headers: {
                'Accept': 'application/json',
            },
        });
        if (!Array.isArray(response.data)) {
            throw new Error('Invalid API response')
        }
        console.log('API Response:', response.data);
        return response.data
    } catch (error) {
        console.error('Error fetching customers:', error)
        throw error;
    }
}

//fetch a specific customer
export const fetchCustomer = async (customerId: string): Promise<Customer> => {
        try {
            const response = await axios.get(`${apiBaseurl}/Customers/${customerId}`,{
                headers: {
                    'Accept': 'application/json',
                },
            });
            return response.data
        } catch (error) {
            console.error('Error fetching customer:', error);
            throw error;
        }
    };


export const generateRandomCustomer = (): Omit<Customer, 'id'> => {
    const randomString = (length: number) => Math.random().toString(36).substring(2, 2 + length);
    return {
        name: `Customer_${randomString(5)}`,
        address: `${randomString(3)} Ave`,
        phone: `${Math.floor(Math.random() * 9000000) + 1000000}`,
        email: `${randomString(5)}@example.com`,
    };
};

export const createCustomer = async (customer: Omit<Customer, 'id'>): Promise<Customer> => {
    try {
        const response = await axios.post(`${apiBaseurl}/Customers`, customer, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
};
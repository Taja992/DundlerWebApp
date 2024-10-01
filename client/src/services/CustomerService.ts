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

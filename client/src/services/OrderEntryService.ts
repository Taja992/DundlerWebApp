import {Api, CreateOrderWithEntriesDto, OrderEntry} from "./Api.ts";
import axios from "axios";


const apiBaseUrl = 'http://localhost:5193';

const api = new Api({baseURL: apiBaseUrl});


export const createOrderEntry = async (orderEntry: OrderEntry): Promise<OrderEntry> => {
    try {
        const response = await axios.post(`${apiBaseUrl}/orderentries`, orderEntry, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error Creating Order Entry', error);
        throw error;
    }
}

export const createOrderWithEntries = async (orderData: CreateOrderWithEntriesDto) => {
    try {
        const response = await api.orders.createWithEntriesCreate(orderData);
        console.log('Order created', response.data);
        return response;
    } catch (error) {
        console.error('Error creating order with entries:', error);
        throw error;
    }
};

export const addEntriesToExistingOrder = async (orderId: number, productId: number, orderEntriesData: Omit<OrderEntry, 'id' | 'orderId'>[]): Promise<OrderEntry[]> => {
    try {
        const createdOrderEntries: OrderEntry[] = [];
        for (const entryData of orderEntriesData) {
            const orderEntry = {...entryData, orderId, productId};
            const createdEntry = await createOrderEntry(orderEntry);
            createdOrderEntries.push(createdEntry);
        }
        return createdOrderEntries;
    } catch (error) {
        console.error('Error Adding Entry to Existing Order', error);
        throw error;
    }
}





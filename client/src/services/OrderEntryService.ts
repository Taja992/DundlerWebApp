import {OrderEntry} from "./Api.ts";
import axios from "axios";


const apiBaseUrl = 'http://localhost:5193';


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

// export const placeOrderWithEntries = async ( orderData: Omit<Order, 'id'>, orderEntriesData: Omit<OrderEntry, 'id'>[]) : Promise<{order: Order, orderEntries: OrderEntry[]}> => {
//     try {
//         const createdOrder = await createOrder(orderData);
//
//         const createdOrderEntries: OrderEntry[] = [];
//         for (const entryData of orderEntriesData) {
//             const orderEntry = {...entryData, orderId: createdOrder.id};
//             const createdEntry = await createOrderEntry(orderEntry);
//             createdOrderEntries.push(createdEntry);
//         }
//
//         return {order: createdOrder, orderEntries: createdOrderEntries};
//     } catch (error) {
//         console.error('Error Placing order with Entries', error);
//         throw error;
//     }
// }

//     export const addEntriesToExistingOrder = async (orderId: number, orderEntriesData: Omit<OrderEntry, 'id' | 'orderId'>[]): Promise<OrderEntry[]> => {
//         try {
//             const createdOrderEntries: OrderEntry[] = [];
//             for (const entryData of orderEntriesData) {
//                 const orderEntry = {...entryData, orderId};
//                 const createdEntry = await createOrderEntry(orderEntry);
//                 createdOrderEntries.push(createdEntry);
//         }
//             return createdOrderEntries;
//     } catch (error) {
//             console.error('Error Adding Entry to Existing Order', error);
//             throw error;
//         }
// }


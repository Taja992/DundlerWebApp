import { useAtom } from 'jotai';
import { ordersAtom } from '../atoms/atoms';
import { Api } from './Api';
import { useCallback } from 'react'; // Import useCallback

const api = new Api({ baseURL: 'http://localhost:5193' });

export const useFetchOrders = () => {
    const [, setOrders] = useAtom(ordersAtom);


    const fetchOrders = useCallback(async () => {
        try {
            const response = await api.orders.ordersList();
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    }, [setOrders]);

    return fetchOrders;
};
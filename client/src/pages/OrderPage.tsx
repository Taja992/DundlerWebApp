import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { ordersAtom } from '../atoms/atoms';
import { useFetchOrders } from '../services/useApi';

const OrderPage: React.FC = () => {
    const [orders] = useAtom(ordersAtom);
    const fetchOrders = useFetchOrders();

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return (
        <>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Order Date</th>
                    <th>Delivery Date</th>
                    <th>Status</th>
                    <th>Total Amount</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.orderDate}</td>
                        <td>{order.deliveryDate}</td>
                        <td>{order.status}</td>
                        <td>{order.totalAmount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default OrderPage;
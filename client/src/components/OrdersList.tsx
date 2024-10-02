import React from 'react';
import { Order } from '../services/Api.ts';

interface OrderListProps {
    orders: Order[];
    selectedOrder: Order | null;
    handleSelectOrder: (order: Order) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, selectedOrder, handleSelectOrder }) => {
    return (
        <div>
            <h2 className="text-xl font-semi">Orders:</h2>
            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-3">
                <ul>
                    {orders?.map(order => (
                        <li
                            key={order.id}
                            className={`flex justify-between cursor-pointer ${selectedOrder?.id === order.id ? 'bg-gray-700' : ''}`}
                            onClick={() => handleSelectOrder(order)} >
                            <span>Order#{order.id}:</span>
                            <span> {order.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderList;
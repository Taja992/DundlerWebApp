import {Order, Paper} from '../services/Api.ts';
import React, {useState} from "react";
import {createOrder} from "../services/OrderService.ts";
import Draggable from "react-draggable";
import PaperList from "./PaperList.tsx";

interface CreateOrderFormProps {
    newOrder: Order;
    setNewOrder: (order: Order) => void;
    customerId: number;
    setOrders: (orders: Order[]) => void;
    orders: Order[];
    papers: Paper[];
    handleCloseBox: () => void;
}

const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ newOrder, setNewOrder, customerId, setOrders, orders, papers, handleCloseBox }) => {
    const [error, setError] = useState<string | null>(null);

    const handleCreateOrder = async () => {
        try {
            const orderToCreate = { ...newOrder, customerId };
            const createdOrder = await createOrder(orderToCreate);
            setOrders([...orders, createdOrder]);
            setNewOrder({
                orderDate: new Date().toISOString(),
                deliveryDate: null,
                status: 'Pending',
                totalAmount: 0,
                customerId: null,
                orderEntries: []
            });
            setError(null);
        } catch {
            setError('Failed to create order (Delivery date needs to be filled in)');
        }
    };

    return (
        <Draggable>
            <div id="div 4" className="fixed inset-0 flex items-center justify-center bg-opacity-50">
                <div className="bg-black p-4 rounded shadow-lg">
                    <div className="flex space-x-3">
                        <div>
                    <h2 className="text-xl font-semibold">Create a New Order</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateOrder();
                    }} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-500">Order Date:</label>
                            <input
                                type="text"
                                value={newOrder.orderDate ? new Date(newOrder.orderDate).toLocaleString() : ''}
                                readOnly
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-900 text-gray-500 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500">Status:</label>
                            <input
                                type="text"
                                value="Pending"
                                readOnly
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-900 text-gray-500 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500">Total Amount:</label>
                            <input
                                type="number"
                                value={newOrder.totalAmount}
                                onChange={(e) => setNewOrder({
                                    ...newOrder,
                                    totalAmount: parseFloat(e.target.value)
                                })}
                                required
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Create Order
                        </button>
                        <button className="m-2" onClick={handleCloseBox}>Close</button>
                    </form>
                        </div>

                    <PaperList papers={papers}/>
                    {error && (
                        <div className="text-red-500 mt-2">
                            {error}
                        </div>
                    )}
                    </div>
                </div>
                </div>
        </Draggable>
);
};

export default CreateOrderForm;
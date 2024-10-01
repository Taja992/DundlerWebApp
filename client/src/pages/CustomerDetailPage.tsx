import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchCustomer} from '../services/CustomerService.ts';
import {createOrder, fetchCustomerOrders} from "../services/OrderService.ts";
import {useAtom} from "jotai";
import {createOrderAtom, ordersAtom, selectedCustomer} from "../atoms/Atoms.ts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomerDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [customer, setCustomer] = useAtom(selectedCustomer);
    const [orders, setOrders] = useAtom(ordersAtom);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [newOrder, setNewOrder] = useAtom(createOrderAtom);

    useEffect(() => {
        const loadCustomer = async () => {
            if (!id) {
                setError('Customer ID is missing');
                setLoading(false);
                return;
            }
            try {
                const [fetchedCustomer, fetchedOrders] = await Promise.all([
                    fetchCustomer(id),
                    fetchCustomerOrders(id)
                ]);
                setCustomer(fetchedCustomer);
                setOrders(fetchedOrders);
            } catch {
                setError('Failed to fetch customer details');
            } finally {
                setLoading(false);
            }
        };
        loadCustomer();
    }, [id]);

    useEffect(() => {
        setNewOrder((prevOrder) => ({
            ...prevOrder,
            orderDate: new Date().toISOString(),
        }));
    }, [setNewOrder]);

    const handleCreateOrder = async () => {
        if (!id) {
            setError('Customer ID is missing');
            return;
        }
        try {
            const orderToCreate = { ...newOrder, customerId: parseInt(id) };
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
            setError('Failed to create order(Delivery date needs to be filled in)');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!customer) {
        return <div>No customer found</div>;
    }

    return (
        <>
            <div className="flex flex-col items-center">
                <h1>Customer Page</h1>
                <div className="flex gap-20">
                    <div>
                        <h2 className="text-xl font-semi">Customer Info:</h2>
                        <div className="flex flex-col">
                            <p>ID: {customer.id}</p>
                            <p>Name: {customer.name}</p>
                            <p>Address: {customer.address}</p>
                            <p>Phone: {customer.phone}</p>
                            <p>Email: {customer.email}</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semi">Orders:</h2>
                        <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-3">
                            <ul>
                                {orders?.map(order => (
                                    <li key={order.id} className="flex justify-between">
                                        <span>Order#{order.id}:</span>
                                        <span> {order.status}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div id="div 4" className="w-full">
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
                                <label className="block text-sm text-gray-500">Delivery Date:</label>
                                <DatePicker
                                    selected={newOrder.deliveryDate ? new Date(newOrder.deliveryDate) : null}
                                    onChange={(date) => setNewOrder({
                                        ...newOrder,
                                        deliveryDate: date ? date.toISOString().split('T')[0] : null
                                    })}
                                    dateFormat="yyyy-MM-dd"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                        </form>
                    </div>
                </div>
                {error && (
                    <div className="text-red-500 mt-2">
                        {error}
                    </div>
                )}
            </div>
        </>
    );
};

export default CustomerDetailPage;
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchCustomer} from '../services/CustomerService.ts';
import {createOrder, fetchCustomerOrders} from "../services/OrderService.ts";
import {useAtom} from "jotai";
import {
    createOrderAtom,
    isBoxVisibleAtom,
    ordersAtom,
    paperAtom, quantityAtom,
    selectedCustomer,
    selectedOrderAtom, selectedPaperIdAtom
} from "../atoms/Atoms.ts";
import {fetchPapers} from "../services/PaperService.ts";
import {addEntriesToExistingOrder} from "../services/OrderEntryService.ts";
import {Order} from "../services/Api.ts";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Draggable from 'react-draggable';

const CustomerDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [customer, setCustomer] = useAtom(selectedCustomer);
    const [orders, setOrders] = useAtom(ordersAtom);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [newOrder, setNewOrder] = useAtom(createOrderAtom);
    const[papers, setPapers] = useAtom(paperAtom);
    const [selectedOrder, setSelectedOrder] = useAtom(selectedOrderAtom);
    const [isBoxVisible, setIsBoxVisible] = useAtom(isBoxVisibleAtom);
    const [selectedPaperId, setSelectedPaperId] = useAtom(selectedPaperIdAtom);
    const [quantity, setQuantity] = useAtom(quantityAtom);

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
            deliveryDate: null
        }));
    }, [setNewOrder]);

    useEffect(() => {
        const fetchedPapers = async () => {
            const fetchedPapers = await fetchPapers();
            setPapers(fetchedPapers);
        };
        fetchedPapers();
    }, [setPapers]);

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

    const handleCreateEntry = async () => {
        if (selectedOrder && selectedOrder.id !== undefined && selectedPaperId !== null && quantity > 0) {
            try {
                await addEntriesToExistingOrder(selectedOrder.id, selectedPaperId, [{ quantity }]);
                setError(null);
                handleCloseBox();
            } catch {
                setError('Failed to create order entry');
            }
        } else {
            setError('Please select a paper and enter a valid quantity');
        }
    };

    const handleSelectOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsBoxVisible(true)
    };

    const handleCloseBox = () => {
        setIsBoxVisible(false);
        setSelectedOrder(null);
    }

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


                    {isBoxVisible && selectedOrder && (
                        <Draggable>
                        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
                            <div className="bg-black p-4 rounded shadow-lg">
                                <h2 className="text-xl font-semibold">Order Details</h2>
                                <p>Order ID: {selectedOrder.id}</p>
                                <p>Status: {selectedOrder.status}</p>
                                <p>Total Amount: {selectedOrder.totalAmount}</p>
                                <label className="block text-sm text-gray-500 mt-4">Select Paper:</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    onChange={(e) => setSelectedPaperId(parseInt(e.target.value))} >
                                    <option value="">Select a paper</option>
                                    {papers.map(paper => (
                                        <option key={paper.id} value={paper.id}>
                                            {paper.name} | Availability: {paper.stock}
                                        </option>
                                    ))}
                                </select>
                                <div>
                                    <label className="block text-sm text-gray-500">How many:</label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        required
                                        className="rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <button className="m-2"
                                onClick={handleCreateEntry}
                                >Create Entry</button>
                                <button className="m-2"
                                    onClick={handleCloseBox} >
                                    Close
                                </button>
                            </div>
                        </div>
                        </Draggable>
                    )}

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
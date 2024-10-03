import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {fetchCustomer} from '../services/CustomerService.ts';
import {fetchCustomerOrders} from "../services/OrderService.ts";
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
import CustomerInfo from "../components/CustomerInfo.tsx";
import CreateOrderForm from "../components/CreateOrderForm.tsx";
import OrderDetailsBox from "../components/OrderDetailsBox.tsx";
import OrderList from "../components/OrdersList.tsx";
import PaperList from "../components/PaperList.tsx";

const CustomerDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [customer, setCustomer] = useAtom(selectedCustomer);
    const [orders, setOrders] = useAtom(ordersAtom);
    const [, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [newOrder, setNewOrder] = useAtom(createOrderAtom);
    const[papers, setPapers] = useAtom(paperAtom);
    const [selectedOrder, setSelectedOrder] = useAtom(selectedOrderAtom);
    const [isBoxVisible, setIsBoxVisible] = useAtom(isBoxVisibleAtom);
    const [selectedPaperId, setSelectedPaperId] = useAtom(selectedPaperIdAtom);
    const [quantity, setQuantity] = useAtom(quantityAtom);
    const [isCreateOrderFormVisible, setIsCreateOrderFormVisible] = useState<boolean>(false);

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


    const handleCreateEntry = async () => {
        if (selectedOrder && selectedOrder.id !== undefined && selectedPaperId !== null && quantity > 0) {
            try {
                await addEntriesToExistingOrder(selectedOrder.id, selectedPaperId, [{ quantity }]);
                setError(null);
                handleCloseOrderBox();
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

    const handleCloseOrderBox = () => {
        setIsBoxVisible(false);
        setSelectedOrder(null);
    }

    const handleStartNewOrder = () => {
        setIsBoxVisible(false);
        setIsCreateOrderFormVisible(true);
        setSelectedOrder(null);
    };

    const handleCloseCreateOrderBox = () => {
        setIsCreateOrderFormVisible(false);
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
                    <CustomerInfo customer={customer}/>
                    <div className="flex flex-col items-center space-y-4">
                        <OrderList
                            orders={orders}
                            selectedOrder={selectedOrder}
                            handleSelectOrder={handleSelectOrder}
                        />

                        <button onClick={handleStartNewOrder} className="">Start New Order</button>

                    </div>
                    {isBoxVisible && selectedOrder && (
                        <OrderDetailsBox
                            selectedOrder={selectedOrder}
                            papers={papers}
                            quantity={quantity}
                            setQuantity={setQuantity}
                            setSelectedPaperId={setSelectedPaperId}
                            handleCreateEntry={handleCreateEntry}
                            handleCloseBox={handleCloseOrderBox}
                        />
                    )}

                    {isCreateOrderFormVisible && id && (
                        <CreateOrderForm
                            newOrder={newOrder}
                            setNewOrder={setNewOrder}
                            customerId={parseInt(id)}
                            setOrders={setOrders}
                            orders={orders}
                            papers={papers}
                            handleCloseBox={handleCloseCreateOrderBox}
                        />
                    )}

                    <PaperList papers={papers}/>
                </div>
            </div>
        </>
    );
};

export default CustomerDetailPage;
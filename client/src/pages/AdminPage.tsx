// src/pages/AdminPage.tsx
import React, {useEffect} from "react";
import {useAtom} from "jotai";
import {
    isBoxVisibleAtom,
    paperAtom,
    quantityAtom,
    selectedPaperAtom
} from "../atoms/Atoms.ts";
import {fetchPapers, updatePaper} from "../services/PaperService.ts";
import {fetchAllOrders, updateOrder} from '../services/OrderService';
import {ordersAtom} from '../atoms/Atoms';
import {Paper} from "../services/Api.ts";
import AddPropertyForm from "../components/AddPropertyForm";
import AddPaperForm from "../components/AddPaperForm.tsx";
import PaperList from "../components/PaperList.tsx";
import PaperDetailsBox from "../components/PaperDetailsBox.tsx";




const AdminPage: React.FC = () => {
    const[papers, setPapers] = useAtom(paperAtom);
    const [orders, setOrders] = useAtom(ordersAtom);
    const [selectedPaper, setSelectedPaper] = useAtom(selectedPaperAtom);
    const [isBoxVisible, setIsBoxVisible] = useAtom(isBoxVisibleAtom);
    const [quantity, setQuantity] = useAtom(quantityAtom);



    useEffect(() => {
        const loadData = async () => {
            try {
                const [fetchedOrders, fetchedPapers] = await Promise.all([
                    fetchAllOrders(),
                    fetchPapers()
                ]);
                setOrders(fetchedOrders);
                setPapers(fetchedPapers)
            } catch (error) {
                console.error('Error fetching:', error)

            }
        };
        loadData();

    }, [setPapers, setOrders]);


    const handleUpdateOrder = async (orderId: number, updatedStatus: string) => {
        try {
            const orderToUpdate = orders.find(order => order.id === orderId);
            if (orderToUpdate) {
                const updatedOrder = { ...orderToUpdate, status: updatedStatus };
                await updateOrder(updatedOrder);
                const fetchedOrders = await fetchAllOrders();
                setOrders(fetchedOrders);
            }
        } catch (error) {
            console.error('Error updating order', error);
        }
    };


    const handleUpdatePaper = async () => {
        try {
            if (selectedPaper) {
                const updatedPaper = {...selectedPaper, stock: quantity};
                await updatePaper(updatedPaper)
                handleCloseBox();
                const fetchedPapers = await fetchPapers();
                setPapers(fetchedPapers);
            }
        } catch (error) {
            console.error('Error updating paper', error);
        }
    }

    const handleSelectPaper = (paper: Paper) => {
        setSelectedPaper(paper);
        setIsBoxVisible(true)
    };

    const handleCloseBox = () => {
        setIsBoxVisible(false);
        setSelectedPaper(null);
    }



    return (
        <div className="flex flex-col items-center">
            <h1>Admin Page</h1>
            <div className="flex gap-20">
                <PaperList
                    papers={papers}
                    selectedPaper={selectedPaper}
                    handleSelectPaper={handleSelectPaper}
                />

                <AddPaperForm />

                {isBoxVisible && selectedPaper && (
                    <PaperDetailsBox
                        selectedPaper={selectedPaper}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        handleUpdatePaper={handleUpdatePaper}
                        handleCloseBox={handleCloseBox}
                        setSelectedPaper={setSelectedPaper}
                    />
                )}

                <AddPropertyForm />

                <div>
                    <h2 className="text-xl font-semi">Orders:</h2>
                    <div className="max-h-64 overflow-y-auto overflow-x-hidden border border-gray-300 rounded-md p-3">
                        <ul>
                            {orders?.map(order => (
                                <li
                                    key={order.id}
                                    className={"flex justify-between items-center"}>
                                    <span className="inline-block w-20">Order#{order.id}:&nbsp; </span>
                                    <select
                                        className="w-40"
                                        value={order.status || ""}
                                        onChange={(e) => {
                                            if (order.id !== undefined) {
                                                handleUpdateOrder(order.id, e.target.value);
                                            }
                                        }}>
                                        <option value="">Set Status</option>
                                        {["Pending", "Processing", "Confirmed", "Shipped", "On Hold", "Completed", "Failed"].map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
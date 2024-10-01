// src/pages/AdminPage.tsx
import React, {useEffect} from "react";
import {useAtom} from "jotai";
import {
    isBoxVisibleAtom,
    newPaperAtom,
    newPropertyAtom,
    paperAtom,
    quantityAtom,
    selectedPaperAtom
} from "../atoms/Atoms.ts";
import {createPaper, fetchPapers, updatePaper} from "../services/PaperService.ts";
import {createProperty} from "../services/PropertyService.ts";
import {fetchAllOrders, updateOrder} from '../services/OrderService';
import {ordersAtom} from '../atoms/Atoms';
import {Paper} from "../services/Api.ts";
import Draggable from "react-draggable";




const AdminPage: React.FC = () => {
    const[papers, setPapers] = useAtom(paperAtom);
    const[newProperty, setNewProperty] = useAtom(newPropertyAtom);
    const [orders, setOrders] = useAtom(ordersAtom);
    const [newPaper, setNewPaper] = useAtom(newPaperAtom);
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



    const handleCreateProperty = async () => {
        try {
            await createProperty({ propertyName: newProperty.propertyName || "" });
            setNewProperty({ ...newProperty, propertyName: "" });

        } catch (error) {
            console.error('Error creating property:', error);
        }
    }

    const handleCreatePaper = async () => {
        try {
            await createPaper({ name: newPaper.name || "" });
            setNewPaper({ ...newPaper, name: "" });
            const fetchedPapers = await fetchPapers();
            setPapers(fetchedPapers);
        } catch (error) {
            console.error('Error creating paper:', error);
        }
    }

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
            <div  className="flex gap-20">
                <div>
                    <h2>Available Paper:</h2>
                    <div className="max-h-64 overflow-y-auto overflow-x-hidden border border-gray-300 rounded-md p-2 pr-6">
                        <ul>
                            {papers?.map(paper => (
                                <li key={paper.id}
                                className={`cursor-pointer ${selectedPaper?.id === paper.id ? 'bg-gray-700' : ''}`}
                                onClick={() => handleSelectPaper(paper)} >
                                    <div className="flex justify-between whitespace-nowrap">
                                        <span className={paper.discontinued ? 'text-red-900' : ''}>Paper: {paper.name} | Availability: {paper.stock} </span>
                                    </div>
                                    {Array.isArray(paper.properties) && (
                                        <ul className="ml-4">
                                            {paper.properties.map((property, index) => (
                                                <li key={index}>{String(property)}{"<--Broken properties 👍"}</li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {isBoxVisible && selectedPaper && (
                        <Draggable>
                            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
                                <div className="bg-black p-4 rounded shadow-lg">
                                    <h2 className="text-xl font-semibold">Order Details</h2>
                                    <p>Paper ID: {selectedPaper.id}</p>
                                    <p>Paper: {selectedPaper.name}</p>
                                    <p>Total Amount: {selectedPaper.stock}</p>
                                    <label className="block text-sm text-gray-500 mt-4">Discontinued:</label>
                                    <input
                                        type="checkbox"
                                        checked={selectedPaper.discontinued}
                                        onChange={(e) => setSelectedPaper({
                                            ...selectedPaper,
                                            discontinued: e.target.checked
                                        })}
                                    />
                                    <label className="block text-sm text-gray-500 mt-4">Update Quantity:</label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    />

                                    <button className="m-2"
                                            onClick={handleUpdatePaper}
                                    >Update Paper
                                    </button>
                                    <button className="m-2"
                                            onClick={handleCloseBox}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </Draggable>
                    )}
                    <div>


                        <h2>Add New Paper:</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleCreatePaper();
                        }}>
                            <label className="block text-sm text-gray-500">Paper Name:</label>
                            <input
                                type="text"
                                onChange={(e) => setNewPaper({...newPaper, name: e.target.value})}
                                required
                                className="mt-1 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-900 text-gray-500"/>
                            <button
                                type="submit"
                            >Add Paper
                            </button>
                        </form>
                    </div>
                </div>
                <div>
                    <h2>Add New Property:</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateProperty();
                    }}>
                        <label className="block text-sm text-gray-500">Property Type:</label>
                        <input
                            type="text"
                            onChange={(e) => setNewProperty({...newProperty, propertyName: e.target.value})}
                            required
                            className="mt-1 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-900 text-gray-500"/>
                        <button
                            type="submit"
                        >Create Property
                        </button>
                    </form>
                </div>


                <div>
                    <h2 className="text-xl font-semi">Orders:</h2>
                    <div className="max-h-64 overflow-y-auto overflow-x-hidden border border-gray-300 rounded-md p-3 pr-8">
                        <ul>
                            {orders?.map(order => (
                                <li
                                    key={order.id}
                                    className={`flex justify-between`}>
                                    <span>Order#{order.id}:&nbsp; </span>
                                    <select
                                        className="w-30"
                                        value={order.status || ""}
                                        onChange={(e) => {
                                            if (order.id !== undefined) {handleUpdateOrder(order.id, e.target.value)}}}>
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
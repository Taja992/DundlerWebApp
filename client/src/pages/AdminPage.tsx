// src/pages/AdminPage.tsx
import React, {useEffect} from "react";
import {useAtom} from "jotai";
import {newPropertyAtom, paperAtom} from "../atoms/Atoms.ts";
import {fetchPapers} from "../services/PaperService.ts";
import {createProperty} from "../services/PropertyService.ts";
import { fetchAllOrders } from '../services/OrderService';
import {ordersAtom} from '../atoms/Atoms';




const AdminPage: React.FC = () => {
    const[papers, setPapers] = useAtom(paperAtom);
    const[newProperty, setNewProperty] = useAtom(newPropertyAtom);
    const [orders, setOrders] = useAtom(ordersAtom);



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



    return (
        <div className="flex flex-col items-center">
            <h1>Admin Page</h1>
            <div  className="flex gap-20">
            <div>
                <h2>Available Paper:</h2>
                <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-2">
                    <ul>
                        {papers?.map(paper => (
                            <li key={paper.id}>
                                Paper: {paper.name} Availability: {paper.stock}
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
            </div>
            <div>
                <h2>Add New Property:</h2>
                <form onSubmit={(e) => {e.preventDefault();
                handleCreateProperty();}}>
                <label className="block text-sm text-gray-500">Property Type:</label>
                    <input
                        type="text"
                        onChange={(e) => setNewProperty({ ...newProperty, propertyName: e.target.value })}
                        required
                        className="mt-1 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-900 text-gray-500" />
                    <button
                        type="submit"
                        >Create Property</button>
                </form>
            </div>
            <div>
                <h2>All Orders:</h2>
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>Order#: {order.id} Status: {order.status}</li>
                    ))}
                </ul>
            </div>
            </div>
        </div>
    );
};

export default AdminPage;
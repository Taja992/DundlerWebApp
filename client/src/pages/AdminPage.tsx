// src/pages/AdminPage.tsx
import React, {useEffect} from "react";
import {useAtom} from "jotai";
import {
    checkedPropertiesAtom,
    isBoxVisibleAtom,
    paperAtom, propertiesAtom, propertyNameAtom,
    quantityAtom,
    selectedPaperAtom, totalPriceAtom
} from "../atoms/Atoms.ts";
import {fetchPapersAlternative, updatePaper} from "../services/PaperService.ts";
import {fetchAllOrders, updateOrder} from '../services/OrderService';
import {ordersAtom} from '../atoms/Atoms';
import {Paper} from "../services/Api.ts";
import CreatePropertyForm from "../components/CreatePropertyForm.tsx";
import CreatePaperForm from "../components/CreatePaperForm.tsx";
import PaperList from "../components/PaperList.tsx";
import UpdatePaperBox from "../components/UpdatePaperBox.tsx";
import PropertyList from "../components/PropertyList.tsx";
import {fetchProperties} from "../services/PropertyService.ts";





const AdminPage: React.FC = () => {
    const[papers, setPapers] = useAtom(paperAtom);
    const [orders, setOrders] = useAtom(ordersAtom);
    const [selectedPaper, setSelectedPaper] = useAtom(selectedPaperAtom);
    const [isBoxVisible, setIsBoxVisible] = useAtom(isBoxVisibleAtom);
    const [quantity, setQuantity] = useAtom(quantityAtom);
    const [price, setPrice] = useAtom(totalPriceAtom);
    const [checkedProperties, ] = useAtom(checkedPropertiesAtom);
    const [properties, setProperties] = useAtom(propertiesAtom);
    const [propertyName, setPropertyName] = useAtom(propertyNameAtom);



    useEffect(() => {
        const loadData = async () => {
            try {
                const [fetchedOrders, fetchedPapers] = await Promise.all([
                    fetchAllOrders(),
                    fetchPapersAlternative()
                ]);
                setOrders(fetchedOrders);
                setPapers(fetchedPapers)
            } catch (error) {
                console.error('Error fetching:', error)

            }
        };
        loadData();

    }, [setPapers, setOrders]);

    useEffect( () => {
        const loadProperties = async () =>{
            const fetchedProperties = await fetchProperties();
            setProperties(fetchedProperties);
        }
        loadProperties();
    }, [setProperties]);




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


    // const handleUpdatePaper = async () => {
    //     try {
    //         if (selectedPaper) {
    //             const updatedPaper = {...selectedPaper, stock: quantity, price: price};
    //             await updatePaper(updatedPaper)
    //             handleCloseBox();
    //             const fetchedPapers = await fetchPapers();
    //             setPapers(fetchedPapers);
    //         }
    //     } catch (error) {
    //         console.error('Error updating paper', error);
    //     }
    // }

    const handleUpdatePaperWithProperties = async () => {
        if (selectedPaper) {
            // Get the selected property IDs from the checked properties
            const selectedPropertyIds = Object.keys(checkedProperties)
                .filter((key) => checkedProperties[parseInt(key)].checked)
                .map((key) => parseInt(key));

            // Update the paper with the new properties
            const updatedPaper = {
                ...selectedPaper,
                propertyIds: selectedPropertyIds, // Use the selected properties
                stock: quantity,
                price: price,
            };

            try {
                await updatePaper(updatedPaper);
                handleCloseBox();
                const fetchedPapers = await fetchPapersAlternative();
                setPapers(fetchedPapers);
            } catch (error) {
                console.error('Error updating paper', error);
            }
        }
    };

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

                <CreatePaperForm />

                {isBoxVisible && selectedPaper && (
                    <UpdatePaperBox
                        selectedPaper={selectedPaper}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        price={price}
                        setPrice={setPrice}
                        handleUpdatePaper={handleUpdatePaperWithProperties}
                        handleCloseBox={handleCloseBox}
                        setSelectedPaper={setSelectedPaper}
                    />
                )}
                <div>
                    <PropertyList
                        properties={properties}
                        showCheckBoxes={false}
                    />

                    <CreatePropertyForm
                        propertyName={propertyName}
                        setPropertyName={setPropertyName}
                        properties={properties}
                        setProperties={setProperties}
                    />
                </div>

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
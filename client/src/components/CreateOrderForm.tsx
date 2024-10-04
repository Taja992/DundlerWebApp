import {Paper} from '../services/Api.ts';
import React, { useState } from "react";
import Draggable from "react-draggable";
import PaperList from "./PaperList.tsx";
import {checkedPapersAtom, newOrderAtom, ordersAtom, totalPriceAtom} from "../atoms/Atoms.ts";
import { useAtom } from "jotai";
import { createOrderWithEntries } from "../services/OrderEntryService.ts";

interface CheckedPaper {
    checked: boolean;
    quantity: number;
}

interface CreateOrderFormProps {
    customerId: number;
    papers: Paper[];
    handleCloseBox: () => void;
}

const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ customerId, papers, handleCloseBox }) => {
    const [newOrder, setNewOrder] = useAtom(newOrderAtom);
    const [orders, setOrders] = useAtom(ordersAtom);
    const [checkedPapers, setCheckedPapers] = useAtom<{ [key: number]: CheckedPaper }>(checkedPapersAtom);
    const [totalPrice, setTotalPrice] = useAtom(totalPriceAtom);
    const [error, setError] = useState<string | null>(null);

    const handleCheckboxChange = (paperId: number, checked: boolean) => {
        const paper = papers.find(p => p.id === paperId);
        if (!paper) return;

        const newCheckedPapers = { ...checkedPapers, [paperId]: { checked, quantity: 1 } };
        setCheckedPapers(newCheckedPapers);


        const newTotalPrice = Object.keys(newCheckedPapers)
            .filter(id => newCheckedPapers[parseInt(id)].checked)
            .reduce((sum, id) => {
                const paper = papers.find(p => p.id === parseInt(id));
                if (!paper) return sum;
                const price = paper.price ?? 0;
                return sum + price * newCheckedPapers[parseInt(id)].quantity;
            }, 0);
        setTotalPrice(newTotalPrice);
    };

    const handleQuantityChange = (paperId: number, quantity: number) => {
        const paper = papers.find(p => p.id === paperId);
        if (!paper) return;

        const newCheckedPapers = {
            ...checkedPapers,
            [paperId]: { ...checkedPapers[paperId], quantity }
        };
        setCheckedPapers(newCheckedPapers);

        const newTotalPrice = Object.keys(newCheckedPapers)
            .filter(id => newCheckedPapers[parseInt(id)].checked)
            .reduce((sum, id) => {
                const paper = papers.find(p => p.id === parseInt(id));
                if (!paper) return sum;
                const price = paper.price ?? 0;
                return sum + price * newCheckedPapers[parseInt(id)].quantity;
            }, 0);
        setTotalPrice(newTotalPrice);
    };

    const handleCreateOrder = async () => {
        const orderEntries = Object.keys(checkedPapers)
            .filter(paperId => checkedPapers[parseInt(paperId)].checked) // Filter checked papers
            .map(paperId => ({
                quantity: checkedPapers[parseInt(paperId)].quantity, // Get quantity
                productId: parseInt(paperId) // Get productId
            }));

        const orderData = { ...newOrder, customerId, orderEntries };

        try {
            const response = await createOrderWithEntries(orderData);
            setOrders([...orders, response.data]);
            setNewOrder({
                orderDate: new Date().toISOString(),
                deliveryDate: null,
                status: 'Pending',
                totalAmount: 0,
                customerId: null,
                orderEntries: []
            });
            setError(null);
            handleCloseBox();
        } catch {
            setError('Failed to create order with entries');
        }
    };

    return (
        <Draggable>
            <div id="div 4" className="fixed inset-0 flex items-center justify-center bg-opacity-50">
                <div className="bg-black p-4 rounded shadow-lg">
                    <div className="flex space-x-3">
                        <div>
                            <h2 className="text-xl font-semibold">Create a New Order</h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleCreateOrder();
                                }}
                                className="space-y-4"
                            >
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
                                    <label className="block text-sm text-gray-500">
                                        Total Amount: {isNaN(totalPrice) ? "Price not available" : totalPrice.toLocaleString('da-DK', {style: 'currency', currency: 'DKK'})}</label>

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

                        <PaperList
                            papers={papers}
                            showCheckboxes={true}
                            checkedPapers={checkedPapers}
                            handleCheckboxChange={handleCheckboxChange}
                            handleQuantityChange={handleQuantityChange}
                        />
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
import React from 'react';
import Draggable from 'react-draggable';
import { Paper, Order } from '../services/Api.ts';

interface OrderDetailsBoxProps {
    selectedOrder: Order;
    papers: Paper[];
    quantity: number;
    setQuantity: (quantity: number) => void;
    setSelectedPaperId: (id: number) => void;
    handleCreateEntry: () => void;
    handleCloseBox: () => void;
}

const UpdateOrderBox: React.FC<OrderDetailsBoxProps> = ({
                                                             selectedOrder,
                                                             papers,
                                                             quantity,
                                                             setQuantity,
                                                             setSelectedPaperId,
                                                             handleCreateEntry,
                                                             handleCloseBox,
                                                         }) => {

    const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
    };
    return (
        <Draggable>
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
                <div className="bg-black p-4 rounded shadow-lg">
                    <h2 className="text-xl font-semibold">Add Paper to:</h2>
                            <p>Order ID: {selectedOrder.id}</p>
                            <p>Status: {selectedOrder.status}</p>
                            <p>Total Amount: {selectedOrder.totalAmount}</p>
                    <label className="block text-sm text-gray-500 mt-4">Select Paper:</label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        onChange={(e) => setSelectedPaperId(parseInt(e.target.value))}
                        onMouseDown={stopPropagation}
                        onClick={stopPropagation}
                        onKeyDown={stopPropagation}
                    >
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
                            onMouseDown={stopPropagation}
                            onClick={stopPropagation}
                            onKeyDown={stopPropagation}
                            required
                            className="rounded-md focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button className="m-2" onClick={handleCreateEntry}>Add Paper</button>
                    <button className="m-2" onClick={handleCloseBox}>Close</button>
                </div>
            </div>
        </Draggable>
    );
};

export default UpdateOrderBox;
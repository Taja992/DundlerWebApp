import React, {useState} from "react";
import Draggable from "react-draggable";
import { Paper } from "../services/Api.ts";

interface OrderDetailsBoxProps {
    selectedPaper: Paper | null;
    quantity: number;
    setQuantity: (quantity: number) => void;
    price: number;
    setPrice: (price: number) => void;
    handleUpdatePaper: () => void;
    handleCloseBox: () => void;
    setSelectedPaper: (paper: Paper | null) => void;
}

const PaperDetailsBox: React.FC<OrderDetailsBoxProps> = ({
                                                             selectedPaper,
                                                             quantity,
                                                             setQuantity,
                                                             price,
                                                             setPrice,
                                                             handleUpdatePaper,
                                                             handleCloseBox,
                                                             setSelectedPaper
                                                         }) => {
    const [inputValue, setInputValue] = useState<string>(price.toString());

    if (!selectedPaper) return null;

    const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);

        if (value === "") {
            setPrice(0);
            return;
        }

        const parsedValue = parseFloat(value);
        if (!isNaN(parsedValue)) {
            setPrice(parsedValue);
        }
    };


    return (
        <Draggable>
            <div className="fixed inset-0 flex items-center justify-center bg-opacity-50" >
                <div className="bg-black p-4 rounded shadow-lg">
                    <div className="handle cursor-move">
                        <h2 className="text-xl font-semibold">Paper Details</h2>
                    </div>
                    <p>Paper ID: {selectedPaper.id}</p>
                    <p>Paper: {selectedPaper.name}</p>
                    <p>Total Amount: {selectedPaper.stock}</p>

                    <div className="flex item-center space-x-3">
                    <label className="block text-sm text-gray-500 mt-4">Discontinued:</label>
                    <input
                        type="checkbox"
                        checked={selectedPaper.discontinued}
                        onChange={(e) => setSelectedPaper({
                            ...selectedPaper,
                            discontinued: e.target.checked
                        })}
                        onMouseDown={stopPropagation}
                        onClick={stopPropagation}
                        onKeyDown={stopPropagation}
                    />
                    <label className="block text-sm text-gray-500 mt-4">Update Price:</label>
                    <input className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        type="text"
                        value={inputValue}
                        onChange={handlePriceChange}
                        onMouseDown={stopPropagation}
                        onClick={stopPropagation}
                        onKeyDown={stopPropagation}
                    />
                    </div>

                    <label className="block text-sm text-gray-500 mt-4">Update Quantity:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        onMouseDown={stopPropagation}
                        onClick={stopPropagation}
                        onKeyDown={stopPropagation}
                    />

                    <button className="m-2" onClick={handleUpdatePaper}>Update Paper</button>
                    <button className="m-2" onClick={handleCloseBox}>Close</button>
                </div>
            </div>
        </Draggable>
    );
};

export default PaperDetailsBox;
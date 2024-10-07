import {Paper} from "../services/Api.ts";
import React, {useState} from "react";
import {useAtom} from "jotai/index";
import {searchAtom} from "../atoms/Atoms.ts";


interface CheckedPaper {
    checked: boolean;
    quantity: number;
}

interface PaperListProps {
    papers: Paper[];
    selectedPaper?: Paper | null;
    handleSelectPaper?: (paper: Paper) => void;
    showCheckboxes?: boolean;
    checkedPapers?: { [key: number]: CheckedPaper };
    handleCheckboxChange?: (paperId: number, checked: boolean) => void;
    handleQuantityChange?: (paperId: number, quantity: number) => void;
}

const PaperList: React.FC<PaperListProps> = ({ papers,
                                                 selectedPaper,
                                                 handleSelectPaper,
                                                 showCheckboxes = false,
                                                 checkedPapers = {},
                                                 handleCheckboxChange,
                                                handleQuantityChange,}) => {

    const [searchTerm, setSearchTerm] = useAtom(searchAtom);
    const [minPriceFilter, setMinPriceFilter] = useState<string>('');
    const [maxPriceFilter, setMaxPriceFilter] = useState<string>('');


    const stopPropagation = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
    };

    const filteredPapers = papers.filter(paper =>
        (paper.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) &&
        (minPriceFilter === '' || (paper.price ?? 0) >= parseFloat(minPriceFilter)) &&
        (maxPriceFilter === '' || (paper.price ?? 0) <= parseFloat(maxPriceFilter))
    );

    return (
        <>
            <div>
                <div className='flex space-x-5 pb-3'>
                <h2 className="text-xl font-semi ">Paper:</h2>
                <input className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                       type="text"
                       placeholder="Search"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}
                       onMouseDown={stopPropagation}
                       onClick={stopPropagation}
                       onKeyDown={stopPropagation}
                    />

                </div>
                <div className="flex flex-col">
                <div className="flex space-x-2 pb-2">
                    <label>Price Filter:</label>
                    <input
                        type="text"
                        value={minPriceFilter}
                        placeholder="Minimum Price"
                        onChange={(e) => setMinPriceFilter(e.target.value)}
                        className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <input
                        type="text"
                        value={maxPriceFilter}
                        placeholder="Maximum Price"
                        onChange={(e) => setMaxPriceFilter(e.target.value)}
                        className="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="max-h-64 overflow-y-auto overflow-x-hidden border border-gray-300 rounded-md p-2 pr-6">
                    <ul>
                        {filteredPapers?.map((paper, index) => (
                            <React.Fragment key={paper.id}>
                            <li key={paper.id}
                                className={`cursor-pointer ${selectedPaper?.id === paper.id ? 'bg-gray-700' : ''}`}
                                onClick={() => handleSelectPaper && handleSelectPaper(paper)}>


                                <div className="flex items-center">

                                    {showCheckboxes && paper.id !== undefined && (
                                        <input
                                            type="checkbox"
                                            checked={checkedPapers[paper.id]?.checked || false}
                                            onChange={(e) => handleCheckboxChange && handleCheckboxChange(paper.id!, e.target.checked)}
                                            onClick={(e) => e.stopPropagation()}
                                            />
                                    )}

                                    <span className={`flex-1 pl-1 ${paper.discontinued ? 'text-red-900 font-semibold italic' : 'font-semibold'}`}>{paper.name}</span>
                                    <div className='flex flex-col'>
                                    <span>{paper.price},-&nbsp;</span>
                                    {paper.stock !== undefined && (
                                        <span className={`${paper.stock > 15 ? 'text-green-500' : paper.stock >= 3 ? 'text-yellow-200' : 'text-red-500'}`}>
                                            <span className='flex-none text-right'> Availability: </span>
                                        <span className="text-right">{paper.stock}</span>
                                    </span>
                                    )}
                                    </div>

                                </div>

                                {showCheckboxes && paper.id !== undefined && checkedPapers[paper.id]?.checked && (
                                    <div className="flex mt-2">
                                        <input
                                            type="number"
                                            value={checkedPapers[paper.id]?.quantity}
                                            onChange={(e) => handleQuantityChange && handleQuantityChange(paper.id!, parseInt(e.target.value))}
                                            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            onMouseDown={stopPropagation}
                                            onClick={stopPropagation}
                                            onKeyDown={stopPropagation}
                                        />
                                    </div>
                                )}

                                {Array.isArray(paper.properties) && (
                                    <ul className="ml-4 text-sm">
                                        {paper.properties.map((property, index) => (
                                            <li key={index}>{String(property)}{"<--Broken properties 👍"}</li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                                {index < papers.length - 1 && <hr className="my-4" />}
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
                </div>
            </div>
        </>
    )
}

export default PaperList;
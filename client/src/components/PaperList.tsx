import {Paper} from "../services/Api.ts";
import React from "react";


interface PaperListProps {
    papers: Paper[];
    selectedPaper?: Paper | null;
    handleSelectPaper?: (paper: Paper) => void;
}

const PaperList: React.FC<PaperListProps> = ({ papers, selectedPaper, handleSelectPaper }) => {
    return (
        <>
            <div>
                <h2 className="text-xl font-semi">Available Paper:</h2>
                <div className="max-h-64 overflow-y-auto overflow-x-hidden border border-gray-300 rounded-md p-2 pr-6">
                    <ul>
                        {papers?.map(paper => (
                            <li key={paper.id}
                                className={`cursor-pointer ${selectedPaper?.id === paper.id ? 'bg-gray-700' : ''}`}
                                onClick={() => handleSelectPaper && handleSelectPaper(paper)}>
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
            </div>
        </>
    )
}

export default PaperList;
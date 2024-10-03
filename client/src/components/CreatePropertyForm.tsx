import { useAtom } from "jotai";
import {newPropertyAtom, propertyNameAtom} from "../atoms/Atoms";
import { createProperty } from "../services/PropertyService";
import React from "react";

const CreatePropertyForm: React.FC = () => {
    const [newProperty, setNewProperty] = useAtom(newPropertyAtom);
    const [propertyName, setPropertyName] = useAtom(propertyNameAtom);

    const handleCreateProperty = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProperty({ propertyName });
            setNewProperty({ ...newProperty, propertyName: "" });
            setPropertyName("");
        } catch (error) {
            console.error('Error creating property:', error);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semi">Add New Property:</h2>
            <form onSubmit={handleCreateProperty}>
                <label className="block text-sm text-gray-500">Property Type:</label>
                <input
                    type="text"
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    required
                    className="mt-1 mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-900 text-gray-500"
                />
                <button type="submit">Create Property</button>
            </form>
        </div>
    );
};

export default CreatePropertyForm;
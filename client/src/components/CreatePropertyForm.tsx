
import { createProperty } from "../services/PropertyService";
import React from "react";
import {Property} from "../services/Api.ts";

interface CreatePropertyFormProps {
    propertyName: string;
    setPropertyName: (name: string) => void;
    properties: Property[];
    setProperties: (properties: Property[]) => void;
}

const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({ propertyName, setPropertyName, properties, setProperties }) => {



    const handleCreateProperty = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newProperty = await createProperty({ propertyName });
            setProperties([...properties, newProperty]);
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
import React from 'react';
import { createCustomer, fetchCustomers, generateRandomCustomer } from '../services/CustomerService.ts';
import { useAtom } from 'jotai';
import { customersAtom } from '../atoms/Atoms';

const CreateCustomerButton: React.FC = () => {
    const [, setCustomers] = useAtom(customersAtom);

    const handleCreateCustomer = async () => {
        const randomCustomer = generateRandomCustomer();
        try {
            await createCustomer(randomCustomer);
            const fetchedCustomers = await fetchCustomers();
            setCustomers(fetchedCustomers);
        } catch (error) {
            console.error('Failed to create customer', error);
        }
    };

    return (
        <button
            className="m-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={handleCreateCustomer}
        >
            Create Customer
            <br />
            <span className="text-sm">(This creates a random customer)</span>
        </button>
    );
};

export default CreateCustomerButton;
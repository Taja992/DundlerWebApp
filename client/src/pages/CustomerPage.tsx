import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import {customersAtom} from '../atoms/Atoms';
import { fetchCustomers } from '../services/CustomerService.ts';
import {Link} from "react-router-dom";

const CustomerPage: React.FC = () => {

    const [customers, setCustomers] = useAtom(customersAtom);
    const [customersError, setCustomersError] = useState<string | null>(null);
    const [loadingCustomers, setLoadingCustomers] = useState<boolean>(true);



    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const fetchedCustomers = await fetchCustomers();
                setCustomers(fetchedCustomers);
            }catch (err) {
                console.error('Error fetching customers:', err);
                setCustomersError('Failed to fetch customers');
            } finally {
                setLoadingCustomers(false);
            }
        };
        loadCustomers()
    }, [setCustomers]);





    if (customersError) {
        return <div>Error: {customersError}</div>;
    }

    if (loadingCustomers) {
        return <div>Loading...</div>;
    }

    return (
        <div>

            <h1>Customers:</h1>
            <ul>                {customers.map(customer => (
                <li key={customer.id}>
                    <Link to={`/customer/${customer.id}`}>{customer.name}</Link>
                </li>))}
            </ul>
        </div>
    );
};

export default CustomerPage;
import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import {customersAtom} from '../atoms/Atoms';
import {fetchCustomers} from '../services/CustomerService.ts';
import CreateCustomerButton from "../components/CreateCustomerButton.tsx";
import CustomerList from "../components/CustomerList.tsx";


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
        <>
            <div className='flex items-center justify-center min-h-screen'>
                <div className="text-center">
            <CustomerList customers={customers}/>
            <CreateCustomerButton />
                </div>
            </div>
        </>
    );
};

export default CustomerPage;
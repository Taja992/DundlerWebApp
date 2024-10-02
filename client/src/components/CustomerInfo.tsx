import React from 'react';
import { Customer } from '../services/Api.ts';

interface CustomerInfoProps {
    customer: Customer;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ customer }) => {
    return (
        <div>
            <h2 className="text-xl font-semi">Customer Info:</h2>
            <div className="flex flex-col">
                <p>ID: {customer.id}</p>
                <p>Name: {customer.name}</p>
                <p>Address: {customer.address}</p>
                <p>Phone: {customer.phone}</p>
                <p>Email: {customer.email}</p>
            </div>
        </div>
    );
};

export default CustomerInfo;
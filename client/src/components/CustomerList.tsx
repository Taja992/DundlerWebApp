import {Link} from "react-router-dom";
import React from "react";
import {Customer} from "../services/Api.ts";

interface CustomerListProps {
    customers: Customer[];
}




const CustomerList: React.FC<CustomerListProps> = ({ customers}) => {
    return(

        <>
            <div>
                <h2 className="text-xl font-semi" >Customers:</h2>
                <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-3">
                    <ul>                {customers.map(customer => (
                        <li key={customer.id}>
                            <Link to={`/customer/${customer.id}`}>{customer.name}</Link>
                        </li>))}
                    </ul>

                </div>
            </div>
        </>

    )
}

export default CustomerList;
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { customersAtom, newCustomerAtom } from './atoms/customerAtoms';
import './App.css';

// Define the Customer type
interface Customer {
    id: number;
    name: string;
}

function App() {
    const [customers, setCustomers] = useAtom(customersAtom);
    const [newCustomer, setNewCustomer] = useAtom(newCustomerAtom);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [editingName, setEditingName] = useState('');

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('http://localhost:5193/customers'); // Replace with your ASP.NET Core backend URL
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: Customer[] = await response.json();
                setCustomers(data);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };

        fetchCustomers();
    }, [setCustomers]);

    const handleCreateCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5193/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newCustomer.name }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const createdCustomer: Customer = await response.json();
            setCustomers([...customers, createdCustomer]);
            setNewCustomer({ name: '' });
        } catch (error) {
            console.error('Error creating customer:', error);
        }
    };

    const handleEditCustomer = (customer: Customer) => {
        setEditingCustomer(customer);
        setEditingName(customer.name);
    };

    const handleSaveCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingCustomer) return;

        try {
            const response = await fetch(`http://localhost:5193/customers/${editingCustomer.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...editingCustomer, name: editingName }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const updatedCustomer: Customer = { ...editingCustomer, name: editingName };
            setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
            setEditingCustomer(null);
            setEditingName('');
        } catch (error) {
            console.error('Error updating customer:', error);
        }
    };

    return (
        <div className="App">
            <h1>Customer Management</h1>
            <form onSubmit={handleCreateCustomer}>
                <input
                    type="text"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="New Customer Name"
                    required
                />
                <button type="submit">Add Customer</button>
            </form>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {customers.map((customer) => (
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                            {editingCustomer && editingCustomer.id === customer.id ? (
                                <form onSubmit={handleSaveCustomer}>
                                    <input
                                        type="text"
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        required
                                    />
                                    <button type="submit">Save</button>
                                    <button type="button" onClick={() => setEditingCustomer(null)}>Cancel</button>
                                </form>
                            ) : (
                                customer.name
                            )}
                        </td>
                        <td>
                            <button onClick={() => handleEditCustomer(customer)}>Edit</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
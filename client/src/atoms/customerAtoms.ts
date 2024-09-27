// src/atoms/customerAtoms.ts
import { atom } from 'jotai';

// Define the Customer type
interface Customer {
    id: number;
    name: string;
}

export const customersAtom = atom<Customer[]>([]);
export const newCustomerAtom = atom<{ name: string }>({ name: '' });
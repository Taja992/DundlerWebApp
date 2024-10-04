import { atom } from 'jotai';
import { Customer } from "../services/Api.ts";
import { Order } from "../services/Api.ts";
import {OrderEntry} from "../services/Api.ts";
import {Paper} from "../services/Api.ts";
import {Property} from "../services/Api.ts";


// Customer Atoms
export const customersAtom = atom<Customer[]>([]);
export const selectedCustomer = atom<Customer | null>(null);
export const newCustomerAtom = atom<{ name: string }>({ name: '' });

// Order Atoms
export const ordersAtom = atom<Order[]>([]);
export const selectedOrderAtom = atom<Order | null>(null);
export const customerOrderAtom = atom<Order[]>([]);
export const createOrderAtom = atom<Order>({
    orderDate: '',
    deliveryDate: '',
    status: 'Pending',
    totalAmount: 0,
    customerId: null,
    orderEntries: []
})



// OrderEntryAtoms
export const orderEntriesAtom = atom<OrderEntry[]>([]);
export const selectedOrderEntryAtom = atom<OrderEntry | null>(null);
export const newOrderAtom = atom<Order>({
    orderDate: new Date().toISOString(),
    deliveryDate: null,
    status: 'Pending',
    totalAmount: 0,
    customerId: null,
    orderEntries: []
});


// Paper Atoms
export const paperAtom = atom<Paper[]>([]);
export const selectedPaperAtom = atom<Paper | null>(null);
export const newPaperAtom = atom<Paper>({
    id: 0,
    name: '',
    discontinued: false,
    stock: 0,
    price: 0,
    orderEntries: [],
    properties: []
});
export const totalPriceAtom = atom<number>(0)
export const quantityAtom = atom<number>(0);

// Property Atoms
export const propertiesAtom = atom<Property[]>([]);
export const selectedPropertyAtom = atom<Property | null>(null);
export const newPropertyAtom = atom<Property>({
    id: 0,
    propertyName: '',
    papers: []
});
export const propertyNameAtom = atom<string>('');

// UI State Atoms
export const isBoxVisibleAtom = atom<boolean>(false);
export const selectedPaperIdAtom = atom<number | null>(null);
export const checkedPapersAtom = atom<{ [key: number]: { checked: boolean; quantity: number } }>({});
export const searchAtom = atom<string>("");




import {Property} from "./Api.ts";
import axios from "axios";


const apiBaseUrl = 'http://localhost:5193';

export const createProperty = async (newProperty: {propertyName: string}): Promise<Property> => {

    try{
        const response = await axios.post(`${apiBaseUrl}/Properties`, newProperty, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': "application/json",
            },
        });
            return response.data
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}
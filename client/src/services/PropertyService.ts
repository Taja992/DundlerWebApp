import {Api, Property, PropertyDto} from "./Api.ts";
import axios from "axios";


const apiBaseUrl = 'http://localhost:5193';

const api = new Api({ baseURL: apiBaseUrl });

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


export const fetchProperties = async (): Promise<PropertyDto[]> => {
    try {
        const response = await api.properties.propertiesList()
        return response.data;
    } catch (error) {
        console.error('Error fetching properties', error);
        throw error;
    }
}
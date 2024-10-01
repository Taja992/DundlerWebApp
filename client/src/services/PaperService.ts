import {Paper} from "./Api.ts";
import axios from "axios";


const apiBaseurl = 'http://localhost:5193';

//fetch all papers(products)
export const fetchPapers = async (): Promise<Paper[]> => {
    try {
        const response = await axios.get(`${apiBaseurl}/paper`, {
            headers: {
                'Accept': 'application/json',
            }
        });
        if (!Array.isArray(response.data)) {
            throw new Error('Invalid API response')
        }
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching papers:', error);
        throw error
    }
}
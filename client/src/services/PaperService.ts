import {Api, Paper, UpdatePaperDto} from "./Api.ts";
import axios from "axios";


const apiBaseurl = 'http://localhost:5193';

const api = new Api( {baseURL: apiBaseurl});



// Here I implemented both the types of fetch that we talked about in the meeting
// I use fetchpapers on my CustomerDetail Page and fetchPapersAlternative, I was expecting
// the axios method to use Paper object and the alternative to use the DTO, however they are both able to give me
// paper.propertyNames and I don't understand why, I guess because the PaperList uses PaperDto but then, what is the difference between the fetch methods?
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

export const fetchPapersAlternative = async () => {
    const response = await api.paper.paperList()
    return response.data;
}

export const createPaper = async (paper: Paper): Promise<Paper> => {
    try{
        const response = await axios.post(`${apiBaseurl}/paper/`, paper, {
            headers:{
                'Accept': 'application/json',
                'Content-Type': "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating paper.', error);
        throw error;
    }
}

export const updatePaper = async (paper: UpdatePaperDto): Promise<Paper> => {
    try {
        const response = await axios.put(`${apiBaseurl}/paper/${paper.id}`, paper, {
            headers: {
                'Accept': 'application/json',
                'Content-type': 'application/json',
            },
        })
        return response.data
    } catch (error) {
        console.error('Error updating customer', error);
        throw error;
    }
}
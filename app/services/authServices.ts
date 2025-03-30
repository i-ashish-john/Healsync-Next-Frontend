import axios from "axios";
import {SignupData} from "../Types/types"
  
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL ||"http://localhost:5000/api"

export const signupUser = async (userData: SignupData) => {
    try {
        console.log('Frontend sending:', userData);
        const response = await axios.post(`${API_URL}/signup`, userData);
        console.log('Response received:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Frontend error:', error.response?.data || error.message);
        throw new Error('Process failed');
    }
};
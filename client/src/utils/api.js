import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const postData = async (url, data) => {
    try {
        // Check if data is FormData or regular object
        const isFormData = data instanceof FormData;
        
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                // Don't set Content-Type for FormData, let the browser set it with boundary
                ...(isFormData ? {} : { 'Content-Type': 'application/json' })
            },
            body: isFormData ? data : JSON.stringify(data)
        });

        if(response.ok){
            const responseData = await response.json();
            return responseData;
        } else {
            const errorData = await response.json();
            return errorData;
        }

    } catch (error) {
        console.log(error)
        return { success: false, message: "Network error occurred" };
    }
}

export const fetchDataFromApi = async (url) => {
    try {
        const response = await axios.get(apiUrl + url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    
    } catch (error) {
        console.log(error);
        if (error.response?.status === 401) {
            // Unauthorized - clear tokens and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
            window.location.href = '/login';
        }
        return { success: false, message: error.response?.data?.message || "Request failed" };
    }
}

export const uploadImage = async (url, updatedData) => {
     try {
        const response = await axios.put(apiUrl + url, updatedData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                // Don't set Content-Type for FormData, let the browser set it with boundary
            },
        });
        return response.data;

    } catch (error) {
        console.error("Error in uploadImage:", error);
        if (error.response?.status === 401) {
            // Unauthorized - clear tokens and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
            window.location.href = '/login';
        }
        return { success: false, message: error.response?.data?.message || "Request failed" };
    }
}

export const editData = async (url, updatedData) => {
     try {
        const response = await axios.put(apiUrl + url, updatedData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;

    } catch (error) {
        console.error("Error in editData:", error);
        return { success: false, error };
    }
}

export const putData = async (url, data) => {
    try {
        const response = await axios.put(apiUrl + url, data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;

    } catch (error) {
        console.error("Error in putData:", error);
        if (error.response?.status === 401) {
            // Unauthorized - clear tokens and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
            window.location.href = '/login';
        }
        return { success: false, message: error.response?.data?.message || "Request failed" };
    }
}
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const postData = async (url, formData) => {
    try {
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if(response.ok){
            const data = await response.json();
            return data;
        }else {
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
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;

    } catch (error) {
        console.error("Error in uploadImage:", error);
        return { success: false, error };
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
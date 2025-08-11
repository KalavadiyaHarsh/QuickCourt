import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;


export const postData = async (url, formData) => {
    try {
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
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
    }
}

export const fetchDataFromApi = async (url) => {
    try {
        const response = await axios.get(apiUrl + url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accesstoken")}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    
    } catch (error) {
        console.log(error);
        return error;
    }
}


export const uploadImage = async (url, updatedData) => {
     try {
        const response = await axios.put(apiUrl + url, updatedData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accesstoken")}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;

    } catch (error) {
        console.error("Error in editData:", error);
        return { success: false, error };
    }
}


export const editData = async (url, updatedData) => {
     try {
        const response = await axios.put(apiUrl + url, updatedData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accesstoken")}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;

    } catch (error) {
        console.error("Error in editData:", error);
        return { success: false, error };
    }
}
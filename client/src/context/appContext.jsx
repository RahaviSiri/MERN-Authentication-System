import { createContext, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import axios from 'axios'
// React Context is used to share data (state, functions, or any other values) between components without having to pass props manually down the component tree. It's particularly helpful when you have global data that multiple components need to access, 

export const AppContent = createContext();
// This creates a Context object called AppContent.

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;
    // With API calls we are sending cookies.
    // To avoid loss of login when page is refreshed. 
    
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn,setIsLoggedIn] = useState(false);
    const [userData,setUserData] = useState(false);

    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendURL + "/api/user/data");
            if(data.success){
                setUserData(data.userData);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendURL + "/api/auth/isAuth");
            if(data.success){
                setIsLoggedIn(true);
                getUserData();
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getAuthState();
    },[])

    const value = {
        backendURL,
        isLoggedIn,
        setIsLoggedIn,
        userData, 
        setUserData,
        getUserData,
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}
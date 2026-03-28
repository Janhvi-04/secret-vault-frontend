import { createContext, useEffect, useState } from 'react'
import API from '../api/axios'
export const AuthContext=createContext();
export const AuthProvider = ({children}) => {
    const [user,setUser]=useState(()=>{
        const savedUser=localStorage.getItem("user");
        return savedUser?JSON.parse(savedUser):null;
    });
    const [loading,setLoading]=useState(true);
    useEffect(()=>{
        const checkUser=async()=>{
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res=await API.get('/auth/user');
                setUser(res.data);
            } catch (err) {
                console.error("Auth check failed:", err.response?.data?.msg || "Unauthorized");
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                }
            } finally {
                setLoading(false);
            }
        };
        checkUser();
    },[])
    const login=(token,userData)=>{
        localStorage.setItem('token',token);
        localStorage.setItem("user",JSON.stringify(userData));
        setUser(userData);
    };
    const logout=()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };
  return (
    <AuthContext.Provider value={{user,setUser,loading,login,logout}}>
        {children}
    </AuthContext.Provider>
  );
};


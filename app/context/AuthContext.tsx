import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';


interface AuthProps {
    authState?: { token: string | null, authenticated: boolean | null, userId?: string | null };
    onRegister?: (email: string, password: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'userToken';
export const API_URL = 'http://192.168.0.14:3000';
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: any) => {

    const [authState, setAuthState] = useState<{
        token: string | null,
        authenticated: boolean | null,
        userId: string | null
    }>({
        token: null,
        authenticated: null,
        userId: null
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            console.log('Guardado:', token);

            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                let userId = null;
                try {
                    const decoded: any = jwtDecode(token);
                    userId = decoded?.id || decoded?.userId || null;
                } catch (e) {
                    userId = null;
                }
                setAuthState({
                    token: token,
                    authenticated: true,
                    userId: userId
                });
            }
        }
        loadToken();
    }, [])

    const register = async (email: string, password: string) => {
        try {
            return await axios.post(`${API_URL}/api/auth/register`, {
                email,
                password
            });
        } catch (error) {
            return { error: true, msg: (error as any).response.data.message };
        }


    };

    const login = async (email: string, password: string) => {
        try {
            const result = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password
            });
            const { token, user } = result.data;

            setAuthState({
                token: result.data.token,
                authenticated: true,
                userId: user?.id || null
            });

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;

            await SecureStore.setItemAsync(TOKEN_KEY, result.data.token);
            return result;

        } catch (error) {
            return { error: true, msg: (error as any).response.data.message };
        }
    };

    const logout = async () => {
        await SecureStore.deleteItemAsync(TOKEN_KEY);

        axios.defaults.headers.common['Authorization'] = '';

        setAuthState({
            token: null,
            authenticated: false,
            userId: null
        });
    };





    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
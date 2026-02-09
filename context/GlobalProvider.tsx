import { getCurrentUser } from "@/lib/appwrite";
import React, { createContext, useContext, useEffect } from "react";

type GlobalContextType = {
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    isLoading: boolean;
    setRefreshFeed: React.Dispatch<React.SetStateAction<boolean>>;
    refreshFeed: boolean;
};

const GlobalContext = createContext<GlobalContextType | null>(null);

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error("useGlobalContext must be used within GlobalProvider");
    }

    return context;
};

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [user, setUser] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [refreshFeed, setRefreshFeed] = React.useState(false);

    useEffect(() => {
        let mounted = true;
        console.log("Checking current user...");
        getCurrentUser()
            .then(res => {
                if (!mounted) return;
                if (res) {
                    setIsLoggedIn(true);
                    setUser(res);
                }
                else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                if (mounted) setIsLoading(false);
            })

        return () => {
            mounted = false;
        };
    }, [])

    return (
        <GlobalContext.Provider value={{
            isLoggedIn,
            setIsLoggedIn,
            user,
            setUser,
            isLoading,
            setRefreshFeed,
            refreshFeed
        }}>
            {children}
        </GlobalContext.Provider>
    );
}

export default GlobalProvider;
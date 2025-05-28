import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface SyncContextProps {
    sheetURL: string;
    setSheetURL: React.Dispatch<React.SetStateAction<string>>;
}

const SyncContext = createContext<SyncContextProps | undefined>(undefined);


export const SyncContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sheetURL, setSheetURL] = useState<string>('');

    useEffect(() => {
        const storedURL = localStorage.getItem('sheetURL');
        if (storedURL) {
            setSheetURL(storedURL);
        }
    }, []);

    return (
        <SyncContext.Provider
            value={{
                sheetURL,
                setSheetURL
            }}
        >
            {children}
        </SyncContext.Provider>
    );
};

export const useSyncContext = () => {
    const context = useContext(SyncContext);
    if (!context) {
        throw new Error("useSegment must be used within a SyncProvider");
    }
    return context;
};

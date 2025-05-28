import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface LifecycleContextProps {
    timeRange: number;
    setTimeRange: React.Dispatch<React.SetStateAction<number>>;
    startDate: Date;
    setStartDate: React.Dispatch<React.SetStateAction<Date>>;
    endDate: Date;
    setEndDate: React.Dispatch<React.SetStateAction<Date>>;
}

const LifecycleContext = createContext<LifecycleContextProps | undefined>(undefined);


export const LifecycleContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [timeRange, setTimeRange] = useState<number>(1) // timeRange = 1 thang
    const [startDate, setStartDate] = useState<Date>()
    const [endDate, setEndDate] = useState<Date>()

    return (
        <LifecycleContext.Provider
            value={{
                timeRange,
                setTimeRange,
                startDate,
                setStartDate,
                endDate,
                setEndDate
            }}
        >
            {children}
        </LifecycleContext.Provider>
    );
};

export const useLifeContext = () => {
    const context = useContext(LifecycleContext);
    if (!context) {
        throw new Error("useSegment must be used within a SegmentProvider");
    }
    return context;
};

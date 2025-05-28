import { useState } from "react";
import MetricsLineGraph from "@/components/blocks/customerLifecycle/line-graph-component";
import { Card, CardContent } from "@/components/ui/card";

const LifecycleGMVCard = ({ GMVData }) => {
    const [selectedTab, setSelectedTab] = useState("new");

    const sortOrder = ["new", "early", "mature", "loyal"];
    const tabKeys = sortOrder.filter((key) => key in GMVData);

    return (
        <>
            {/* Tabs */}
            <div className="mb-4 flex gap-2" >
                {
                    tabKeys.map((key) => (
                        <button
                            key={key}
                            className={`px-4 py-1 rounded ${selectedTab === key ? "bg-primary text-white" : "bg-gray-100 text-gray-700"
                                }`}
                            onClick={() => setSelectedTab(key)}
                        >
                            <p className="text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                        </button>
                    ))
                }
            </div >

            {/* Chart */}
            < MetricsLineGraph data={GMVData[selectedTab] || []} />
        </>
    );
};

export default LifecycleGMVCard;

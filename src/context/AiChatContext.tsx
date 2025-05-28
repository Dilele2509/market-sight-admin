import { axiosPrivate } from "@/API/axios";
import { Segment } from "@/types/segmentTypes";
import { Condition, defineDatasetName, generateSQLPreview } from "@/utils/segmentFunctionHelper";
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useSegmentToggle } from "./SegmentToggleContext";
import { ChatMessage, dataDetailResponse, HistoryResult, ResponseData } from "@/types/aichat";
import { toast } from "sonner";

interface AiChatContextProps {
    segmentName: string;
    setSegmentName: React.Dispatch<React.SetStateAction<string>>;
    segmentId: string;
    setSegmentId: React.Dispatch<React.SetStateAction<string>>;
    attributes: any[];
    setAttributes: React.Dispatch<React.SetStateAction<any[]>>;
    selectedDataset: any;
    setSelectedDataset: React.Dispatch<React.SetStateAction<any>>;
    datasets: Record<string, any>;
    setDatasets: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    previewData: any[];
    setPreviewData: React.Dispatch<React.SetStateAction<any[]>>;
    rootOperator: string;
    setRootOperator: React.Dispatch<React.SetStateAction<string>>;
    conditions: Condition[];
    setConditions: React.Dispatch<React.SetStateAction<Condition[]>>;
    conditionGroups: any[];
    setConditionGroups: React.Dispatch<React.SetStateAction<any[]>>;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    editableSql: string;
    setEditableSql: React.Dispatch<React.SetStateAction<string>>;
    sqlError: any;
    setSqlError: React.Dispatch<React.SetStateAction<any>>;
    initialConditions: any[];
    setInitialConditions: React.Dispatch<React.SetStateAction<any[]>>;
    initialConditionGroups: any[];
    setInitialConditionGroups: React.Dispatch<React.SetStateAction<any[]>>;
    initialRootOperator: string;
    setInitialRootOperator: React.Dispatch<React.SetStateAction<string>>;
    initialSegmentName: string;
    setInitialSegmentName: React.Dispatch<React.SetStateAction<string>>;
    initialDescription: string;
    setInitialDescription: React.Dispatch<React.SetStateAction<string>>;
    relatedDatasetNames: any;
    setRelatedDatasetNames: React.Dispatch<React.SetStateAction<any>>;
    selectRelatedDataset: any;
    setSelectRelatedDataset: React.Dispatch<React.SetStateAction<any>>;
    availableSegments: any;
    setAvailableSegments: Record<string, any>;
    selectionMode: string
    setSelectionMode: React.Dispatch<React.SetStateAction<string>>;
    connectionUrl: string;
    setConnectionUrl: React.Dispatch<React.SetStateAction<string>>;
    CONNECTION_STORAGE_KEY: string;
    CONNECTION_EXPIRY_KEY: string;
    ONE_HOUR_MS: number;
    sqlQuery: string;
    setSqlQuery: React.Dispatch<React.SetStateAction<string>>;
    selectedTable: string;
    setSelectedTable: React.Dispatch<React.SetStateAction<string>>;
    tables: Record<string, any>;
    setTables: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    responseData: ResponseData;
    setResponseData: React.Dispatch<React.SetStateAction<ResponseData>>;
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
    chatHistory: ChatMessage[];
    setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    historyResult: HistoryResult[];
    setHistoryResult: React.Dispatch<React.SetStateAction<HistoryResult[]>>;
    displayData: dataDetailResponse;
    setDisplayData: React.Dispatch<React.SetStateAction<dataDetailResponse>>;
}

const AiChatContext = createContext<AiChatContextProps | undefined>(undefined);

const formattedData = async (inputData: any) => {
    return {
        "Customer Profile": {
            name: "customers",
            description: "Customer information",
            fields: Object.keys(inputData.customers).filter(key => key !== "business_id"),
            schema: "public"
        },
        "Transactions": {
            name: "transactions",
            description: "Transaction records",
            fields: Object.keys(inputData.transactions).filter(key => key !== "business_id"),
            schema: "public"
        },
        "Stores": {
            name: "stores",
            description: "Store information",
            fields: Object.keys(inputData.stores).filter(key => key !== "business_id"),
            schema: "public"
        },
        "Product Line": {
            name: "product_lines",
            description: "Product information",
            fields: Object.keys(inputData.product_lines),
            schema: "public"
        }
    };
};


export const AiChatContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        {
            user: "",
            ai: "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn tạo phân khúc khách hàng dựa trên dữ liệu của bạn. Bạn muốn phân khúc khách hàng như thế nào?",
        },
    ])
    const [historyResult, setHistoryResult] = useState<HistoryResult[]>([])
    const { logged } = useSegmentToggle()
    const [connectionUrl, setConnectionUrl] = useState();
    const CONNECTION_STORAGE_KEY = 'postgres_connection';
    const CONNECTION_EXPIRY_KEY = 'postgres_connection_expiry';
    const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hour in milliseconds

    const [datasets, setDatasets] = useState<Record<string, any>>({});
    const [inputMessage, setInputMessage] = useState<string>("")
    const [selectedDataset, setSelectedDataset] = useState<any>({
        name: "customers",
        fields: [
            "customer_id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "gender",
            "birth_date",
            "registration_date",
            "address",
            "city"
        ],
        description: "Customer information",
        schema: "public"
    });
    const [responseData, setResponseData] = useState<ResponseData>(null);
    const [displayData, setDisplayData] = useState<dataDetailResponse>(responseData?.data ?? null);

    const [segmentName, setSegmentName] = useState<string>("High Value Users (new)");
    const [segmentId, setSegmentId] = useState<string>("segment:high-value-users-new");
    const [attributes, setAttributes] = useState<any[]>([]);

    const [previewData, setPreviewData] = useState<any[]>([]);

    const [rootOperator, setRootOperator] = useState<string>("AND");
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [conditionGroups, setConditionGroups] = useState<any[]>([]);
    const [description, setDescription] = useState<string>('');

    useEffect(() => { console.log('history result: ', historyResult); }, [historyResult])
    useEffect(() => { console.log('conversation history result: ', chatHistory); }, [chatHistory])

    useEffect(() => {
        console.log('responseData in context: ', responseData);
        if(responseData === null) {
            setConditions([]);
            setConditionGroups([]);
            setRootOperator("AND");
            setSqlQuery("")
            return;
        }
        setDisplayData(responseData ? responseData?.data : null)
    }, [responseData])

    useEffect(() => {
        console.log('display in context: ', displayData);
        const filter = displayData?.filter_criteria;
        if (filter) {
            setConditions(filter.conditions || []);
            setConditionGroups(filter.conditionGroups || []);
            setRootOperator(filter.rootOperator || "AND");
            const sql = generateSQLPreview(selectedDataset, filter.conditions, filter.conditionGroups, filter.rootOperator)
            setSqlQuery(displayData ? sql : "")
        }
    }, [displayData])

    //fetch 4 tables of dataset
    useEffect(() => {
        const fetchTables = async () => {
            try {
                const tables = await axiosPrivate.get('/data/tables');

                if (tables.status === 200) {
                    const formatted = await formattedData(tables.data.data);
                    setDatasets(formatted);
                }
            } catch (error) {
                console.error("Failed to fetch tables:", error);
            }
        };
        if (logged) fetchTables();
    }, [connectionUrl, logged]);
    //fetch info if had responseData

    useEffect(() => {
        if (!datasets || Object.keys(datasets).length === 0) return;
        //console.log('check segment in context: ', responseData?.data?.filter_criteria.conditions);

        setRootOperator(responseData ? responseData?.data?.filter_criteria.rootOperator : "AND");
        setConditions(responseData ? responseData?.data?.filter_criteria.conditions : []);
        setConditionGroups(responseData ? responseData?.data?.filter_criteria.conditionGroups : []);
    }, [responseData]);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const res = await axiosPrivate.post('/data/related-tables', { tableName: 'transactions' });

                if (res.status === 200 && res.data.data) {
                    //console.log('Related tables data:', res.data.data);
                    setRelatedDatasetNames(res.data.data);

                    const firstValidData = res.data.data.find((data) => data.trim() !== 'customers');

                    if (firstValidData) {
                        const datasetKey = defineDatasetName(firstValidData);
                        const dataset = datasets[datasetKey];

                        //console.log('Trying to select dataset key:', datasetKey);
                        //console.log('Dataset selected:', dataset);

                        if (dataset) {
                            setSelectRelatedDataset(dataset);
                        } else {
                            console.warn('Dataset not found in datasets object');
                            setSelectRelatedDataset(undefined);
                        }
                    } else {
                        console.warn('No valid related dataset found');
                        setSelectRelatedDataset(undefined);
                    }
                } else {
                    console.error('Error when fetching related tables');
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (logged && Object.keys(datasets).length > 0) {
            fetchRelated();
        }
    }, [datasets, logged]);

    useEffect(() => {
        if (logged && responseData) {
            console.log('check all Condition of edit segment: ', conditions);
        }
    }, [conditions || logged || responseData])

    const [editableSql, setEditableSql] = useState<string>("");
    const [sqlError, setSqlError] = useState<any>(null);

    const [initialConditions, setInitialConditions] = useState([]);
    const [initialConditionGroups, setInitialConditionGroups] = useState([]);
    const [initialRootOperator, setInitialRootOperator] = useState('AND');
    const [initialSegmentName, setInitialSegmentName] = useState('High Value Users (new)');
    const [initialDescription, setInitialDescription] = useState('');

    // General state
    const [relatedDatasetNames, setRelatedDatasetNames] = useState([]);
    const [selectRelatedDataset, setSelectRelatedDataset] = useState<any>({})

    const [availableSegments, setAvailableSegments] = useState([
        { id: "segment:recent-customers", name: "Recent Customers", count: 456 },
        { id: "segment:vip-users", name: "VIP Users", count: 123 },
        { id: "segment:high-spenders", name: "High Spenders", count: 78 }
    ]);

    const [selectionMode, setSelectionMode] = useState("include"); // 'include' or 'exclude'

    const [selectedTable, setSelectedTable] = useState('');
    const [sqlQuery, setSqlQuery] = useState('');
    const [tables, setTables] = useState<Record<string, any>>({});


    return (
        <AiChatContext.Provider
            value={{
                segmentName,
                setSegmentName,
                segmentId,
                setSegmentId,
                attributes,
                setAttributes,
                selectedDataset,
                setSelectedDataset,
                datasets,
                setDatasets,
                previewData,
                setPreviewData,
                rootOperator,
                setRootOperator,
                conditions,
                setConditions,
                conditionGroups,
                setConditionGroups,
                description,
                setDescription,
                editableSql,
                setEditableSql,
                sqlError,
                setSqlError,
                initialConditions,
                setInitialConditions,
                initialConditionGroups,
                setInitialConditionGroups,
                initialRootOperator,
                setInitialRootOperator,
                initialSegmentName,
                setInitialSegmentName,
                initialDescription,
                setInitialDescription,
                availableSegments,
                setAvailableSegments,
                selectionMode,
                setSelectionMode,
                connectionUrl,
                setConnectionUrl,
                CONNECTION_STORAGE_KEY,
                CONNECTION_EXPIRY_KEY,
                ONE_HOUR_MS,
                selectedTable,
                setSelectedTable,
                sqlQuery,
                setSqlQuery,
                tables,
                setTables,
                responseData,
                setResponseData,
                relatedDatasetNames,
                setRelatedDatasetNames,
                selectRelatedDataset,
                setSelectRelatedDataset,
                inputMessage,
                setInputMessage,
                chatHistory,
                setChatHistory,
                historyResult,
                setHistoryResult,
                displayData,
                setDisplayData
            }}
        >
            {children}
        </AiChatContext.Provider>
    );
};

export const useAiChatContext = () => {
    const context = useContext(AiChatContext);
    if (!context) {
        throw new Error("useSegment must be used within a AiChatProvider");
    }
    return context;
};

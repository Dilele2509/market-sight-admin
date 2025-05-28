import { useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import axios, { axiosPrivate } from "@/API/axios";
import { ArrowLeft, Code, EllipsisVertical, Section } from "lucide-react";
import { SegmentBuilderProps } from "@/types/segmentTypes"
import { generateSQLPreview } from "@/utils/segmentFunctionHelper";
import RenderDefinition from "./DefinitionTab/RenderDefinition";
import { useSegmentToggle } from "@/context/SegmentToggleContext";
import { useSegmentData } from "@/context/SegmentDataContext";
import AuthContext from "@/context/AuthContext";
import RenderSync from "./DefinitionTab/RenderSync";


export default function SegmentBuilder({ onBack, editSegment }: SegmentBuilderProps) {
    const {
        segmentName,
        setSegmentName,
        setSegmentId,
        selectedDataset,
        conditions,
        attributes,
        rootOperator,
        setPreviewData,
        segmentId,
        description,
        estimatedSize,
        conditionGroups,
        setEditableSql,
        setSqlError,
        CONNECTION_STORAGE_KEY,
        initialConditions,
        initialConditionGroups,
        initialRootOperator,
        initialSegmentName,
        initialDescription,
        setEditSegment,
        setConditionGroups,
        setConditions } = useSegmentData();
    const { token, user } = useContext(AuthContext);
    const {
        setSqlDialogOpen,
        setPreviewLoading,
        setPreviewOpen,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        previewLoading,
        setDiscardConfirmOpen } = useSegmentToggle();

    useEffect(() => {
        setEditSegment(editSegment)
        setPreviewData([])
    }, [])

    //dùng để set trạng thái unchange
    useEffect(() => {
        const hasChanged = [
            [conditions, initialConditions],
            [conditionGroups, initialConditionGroups]
        ].some(([a, b]) => JSON.stringify(a) !== JSON.stringify(b)) ||
            rootOperator !== initialRootOperator ||
            segmentName !== initialSegmentName ||
            description !== initialDescription;

        setHasUnsavedChanges(hasChanged);
    }, [
        conditions, conditionGroups, rootOperator, segmentName, description,
        initialConditions, initialConditionGroups, initialRootOperator, initialSegmentName, initialDescription
    ]);


    //SQL Preview
    const generateSQL = () => {
        return generateSQLPreview(selectedDataset, conditions, conditionGroups, rootOperator)
    }
    // Function to open SQL dialog
    const handleOpenSqlDialog = () => {
        setEditableSql(generateSQL);
        setSqlError(null);
        setSqlDialogOpen(true);
    };

    // Function to fetch preview data based on current conditions
    const fetchPreviewData = async () => {
        setPreviewLoading(true);
        setPreviewOpen(true); // Open dialog immediately to show loading state

        try {
            const sqlQuery = generateSQLPreview(selectedDataset, conditions, conditionGroups, rootOperator);

            const connectionUrl = localStorage.getItem(CONNECTION_STORAGE_KEY)

            if (!connectionUrl) {
                toast.error("Connection URL not configured. Please set the connection URL first.");
                setPreviewLoading(false);
                return;
            }

            // console.log("Executing SQL query for preview:", sqlQuery);

            try {
                const url = new URL(connectionUrl);
                const username = url.username;
                const password = url.password; 
                const host = url.hostname;
                const port = url.port;
                const database = url.pathname.replace('/', '');

                // Format request data to match what the API expects
                const requestData = {
                    table: selectedDataset.name,
                    query: sqlQuery,
                    connection_details: {
                        url,
                        host,
                        port,
                        database,
                        username,
                        password
                    }
                };

                // Log request WITHOUT showing password
                // console.log("Sending request to API with connection details:", {
                //     table: requestData.table,
                //     query: requestData.query,
                //     connection_details: {
                //         url: requestData.connection_details.url,
                //         host: requestData.connection_details.host,
                //         port: requestData.connection_details.port,
                //         database: requestData.connection_details.database,
                //         username: requestData.connection_details.username,
                //         password: "********" // Mask password in logs
                //     }
                // });

                // Call the API endpoint
                const response = await axiosPrivate.post(`/data/query`, requestData, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Only log the success status, not the full response which might contain sensitive data
                console.log(`Query executed successfully. Status: ${response}, Records: ${response.data?.data?.length || 0}`);

                // Process the response as before
                if (response.data && response.data.success) {
                    setPreviewData(response.data.data || []);

                    if (response.data.data && response.data.data.length > 0) {
                        toast.success(`Retrieved ${response.data.data.length} records`);
                    } else {
                        toast.warning("Query executed successfully but returned no records");
                    }
                } else {
                    toast.warning("No results returned. Your query may be too restrictive or there's no matching data.");
                    setPreviewData([]);
                }
            } catch (error) {
                // Ensure any error messages are sanitized before logging
                const sanitizedError = error.message?.replace(/postgresql:\/\/[^:]+:[^@]+@/g, 'postgresql://****:****@');
                console.error('Error executing query:', sanitizedError);

                // Handle different error types without exposing sensitive information
                if (error.response) {
                    const errorDetail = error.response.data?.detail || "Unknown error occurred";
                    // Sanitize the error message
                    const sanitizedDetail = errorDetail.replace(/postgresql:\/\/[^:]+:[^@]+@/g, 'postgresql://****:****@');
                    toast.error(`Query error: ${sanitizedDetail}`);
                } else if (error.request) {
                    toast.error("No response from server. Check your network connection.");
                } else {
                    toast.error(`Error: ${sanitizedError}`);
                }

                setPreviewData([]);
            }
        } catch (error) {
            // Sanitize any unexpected errors
            const sanitizedError = error.message?.replace(/postgresql:\/\/[^:]+:[^@]+@/g, 'postgresql://****:****@');
            console.error('Unexpected error:', sanitizedError);
            toast.error(`Unexpected error: ${sanitizedError}`);
            setPreviewData([]);
        } finally {
            setPreviewLoading(false);
        }
    };

    // Add function to handle discarding changes
    const handleDiscardChanges = () => {
        // If there are no unsaved changes, just go back
        if (!hasUnsavedChanges) {
            onBack();
            return;
        }

        // Otherwise, open confirmation dialog
        setDiscardConfirmOpen(true);
    };

    const handleSaveSegment = async () => {
        try {
            //console.log('id: ', editSegment ? editSegment.segment_id : segmentId);

            const segment = {
                segment_id: editSegment ? editSegment.segment_id : segmentId,
                segment_name: segmentName,
                created_by_user_id: user.user_id,
                dataset: selectedDataset.name,
                description: description,
                created_at: editSegment ? editSegment.created_at : new Date().toISOString(),
                updated_at: new Date().toISOString(),
                status: editSegment ? editSegment.status : 'active',
                filter_criteria: {
                    conditions: conditions,
                    conditionGroups: conditionGroups,
                    rootOperator: rootOperator
                }
            };

            console.log('[SegmentBuilder] Sending segment to API:', segment);

            await axiosPrivate.post('/segment/save-segment', segment, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then(() => {
                toast.success(`Segment ${editSegment ? 'updated' : 'created'} successfully!`);
                setHasUnsavedChanges(false);
                setConditionGroups([]);
                setConditions([])

                if (onBack) {
                    onBack(segment);
                } else {
                    console.warn('[SegmentBuilder] onBack function is not provided');
                }
            }).catch((err) => {
                toast.error('Failed to save segment: ', err);
            });

        } catch (error) {
            console.error('[SegmentBuilder] Error saving segment:', error);
            toast.error('Không lưu được phân đoạn. Vui lòng thử lại.');
        }
    };


    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <Button variant="ghost" onClick={() => onBack()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    {/* <h1 className="text-xl font-semibold">Segment Builder</h1> */}
                    <Input className="w-auto border-b-2 border-t-0 border-l-0 border-r-0 rounded-none border-primary-dark" value={segmentName} onChange={(e) => setSegmentName(e.target.value)} placeholder="Segment Name" />

                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        variant="outline"
                        className="mx-1 flex items-center"
                        onClick={handleOpenSqlDialog}
                    >
                        <Code className="mr-2 h-4 w-4" />
                        Xem truy vấn SQL
                    </Button>

                    <Button
                        variant="outline"
                        className="mx-1"
                        onClick={fetchPreviewData}
                        disabled={previewLoading}
                    >
                        {previewLoading ? 'Đang tải...' : 'Kết quả xem trước'}
                    </Button>

                    <Button
                        variant="outline"
                        className="mx-1"
                        onClick={handleDiscardChanges}
                        disabled={!hasUnsavedChanges}
                    >
                        Huỷ thay đổi
                    </Button>

                    <Button
                        variant="default"
                        className="mx-1"
                        onClick={handleSaveSegment}
                        disabled={!hasUnsavedChanges}
                    >
                        Lưu
                    </Button>

                    <Button className="ml-1">
                        <EllipsisVertical className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="definition">
                <TabsList>
                    <TabsTrigger value="definition">Định nghĩa phân khúc</TabsTrigger>
                    <TabsTrigger value="syncs">Đồng bộ</TabsTrigger>
                </TabsList>

                {/* render definition UI */}
                <TabsContent value="definition">
                    <RenderDefinition
                        generateSQLPreview={generateSQL}
                    />
                </TabsContent>

                <TabsContent value="syncs">
                    <RenderSync />
                </TabsContent>
            </Tabs>
        </div>
    );
}

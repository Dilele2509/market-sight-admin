import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { ReactSortable } from "react-sortablejs";

import { Code, Check, Copy, Plus, RefreshCw, Calendar, Link, SlidersHorizontal, Group } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { OPERATORS } from "@/types/constant";

import { ConditionGroup, AttributeCondition } from "./ConditionState";
import { InclusionExclusion, SegmentSelectorDialog } from "./InclusionExclusionState";
import { SQLDialog, SQLPreview } from "./SQLState";
import { DiscardConfirmDialog, PreviewDialog } from "./InforSetupState";
import { useSegmentToggle } from "@/context/SegmentToggleContext";
import { useSegmentData } from "@/context/SegmentDataContext";
import { defineDatasetName } from "@/utils/segmentFunctionHelper";
import { Skeleton } from "@/components/ui/skeleton";
import EventCondition, { EventConditionType } from "./ConditionState/EventCondition";


interface SegmentDefinitionProps {
    generateSQLPreview?: () => string;
}


const RenderDefinition: React.FC<SegmentDefinitionProps> = ({
    generateSQLPreview,
}) => {
    const {
        editSegment,
        datasets,
        segmentName,
        setSegmentName,
        setSegmentId,
        selectedDataset,
        conditions,
        attributes,
        rootOperator,
        segmentId,
        description,
        conditionGroups,
        previewData,
        setSelectedDataset,
        setDescription,
        setAttributes,
        setConditions,
        setRootOperator,
        setConditionGroups } = useSegmentData();

    const { setLoading,
        loading,
        setCopySuccess,
        copySuccess,
        showDescriptionField,
        setShowDescriptionField } = useSegmentToggle();


    useEffect(() => {
        fetchAttributes(selectedDataset)
    }, [selectedDataset])
    // useEffect(()=>{
    //     console.log('check condition: ', conditions, ' check condition group: ', conditionGroups);
    // },[conditions, conditionGroups])

    const fetchAttributes = async (dataset: any, showToast = true) => {
        try {
            setLoading(true);
            //console.log('run fetch attributes with: ', dataset);

            if (!dataset) {
                if (showToast) {
                    toast.error(`Table information for ${dataset.name} not found`);
                }
                setLoading(false);
                return;
            }
            //console.log('dataset field: ', dataset.fields);
            // If we already have fields from the initial fetch AND we're not forcing a refresh, use those
            if (dataset.fields && Array.isArray(dataset.fields) && dataset.fields.length > 0) {
                const formattedAttributes = dataset.fields.map(field => ({
                    name: field,
                    type: determineFieldType(field)
                }));

                setAttributes(formattedAttributes);
                setLoading(false);
                return;
            } else {
                toast.error('can not fetch attribute, please check database connection')
            }

            setAttributes(dataset.field)
            return dataset.fields;
        } catch {
            toast.error('can not run fetch attribute function')
        }
    };

    //function define type
    const determineFieldType = (fieldName: string, dataType = null) => {
        // If we have the actual data type from PostgreSQL, use it
        if (dataType) {
            // Convert PostgreSQL data types to our field types
            if (dataType.includes('timestamp') || dataType.includes('date') || dataType.includes('time')) {
                return 'datetime';
            } else if (dataType.includes('int') || dataType.includes('float') || dataType.includes('numeric') || dataType.includes('decimal') || dataType.includes('double')) {
                return 'number';
            } else if (dataType === 'boolean') {
                return 'boolean';
            } else if (dataType.includes('array') || dataType.includes('json') || dataType.includes('jsonb')) {
                return 'array';
            } else {
                return 'text';
            }
        }

        // Fallback to field name heuristics
        const lowerField = fieldName.toLowerCase();

        if (lowerField.includes('date') || lowerField.includes('time') || lowerField.includes('_at')) {
            return 'datetime';
        } else if (
            lowerField.includes('id') ||
            lowerField.includes('amount') ||
            lowerField.includes('price') ||
            lowerField.includes('cost') ||
            lowerField.includes('quantity') ||
            lowerField.includes('number')
        ) {
            return 'number';
        } else if (lowerField.includes('is_') || lowerField.includes('has_')) {
            return 'boolean';
        } else if (lowerField.includes('tags') || lowerField.includes('categories') || lowerField.includes('array')) {
            return 'array';
        } else {
            return 'text';
        }
    };

    useEffect(() => {
        if (!editSegment) {
            const slug = segmentName
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-");
            setSegmentId(`segment:${slug}`);
        }
    }, [segmentName, editSegment]);


    //handle changes
    const handleDatasetChange = (value: string) => {
        const datasetName = defineDatasetName(value)
        console.log("Dataset changed to:", datasetName);
        setSelectedDataset(datasets[datasetName]);
    };
    const handleRootOperatorChange = (newValue: 'AND' | 'OR' | string) => {
        if (newValue !== null) {
            setRootOperator(newValue);
        }
    };


    //handle onclick
    const handleCopySegmentId = () => {
        navigator.clipboard.writeText(segmentId)
            .then(() => {
                setCopySuccess(true);
                toast.success('Segment ID copied to clipboard');

                setTimeout(() => {
                    setCopySuccess(false);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                toast.error('Failed to copy to clipboard');
            });
    };
    const handleAttributeClick = (attribute) => {
        const newId = Math.max(...conditions.map(c => c.id), ...conditionGroups.map(g => g.id), 0) + 1;

        setConditions([
            ...conditions,
            {
                id: newId,
                type: 'attribute',
                field: attribute.name,
                operator: getDefaultOperatorForType(attribute.type),
                value: null
            }
        ]);
        toast.info(`Added condition for "${attribute.name}"`);
    };
    const getDefaultOperatorForType = (type) => {
        switch (type) {
            case 'text': return 'equals';
            case 'number': return 'equals';
            case 'datetime': return 'after';
            case 'boolean': return 'equals';
            case 'array': return 'contains';
            default: return 'equals';
        }
    };

    //for condition state
    const handleAddCondition = (type = 'attribute') => {
        const newId = Math.max(...conditions.map(c => c.id), ...conditionGroups.map(g => g.id), 0) + 1;

        if (type === 'attribute') {
            setConditions([
                ...conditions,
                {
                    id: newId,
                    type: 'attribute',
                    field: '',
                    operator: "AND",
                    value: null
                }
            ]);
        } else if (type === 'event') {
            setConditions([
                ...conditions,
                {
                    id: newId,
                    columnKey: selectedDataset.fields[0],
                    relatedColKey: selectedDataset.fields[0],
                    type: 'event',
                    eventType: 'performed',
                    frequency: 'at_least',
                    count: 1,
                    timePeriod: 'days',
                    timeValue: 30,
                    attributeOperator: 'AND',
                    operator: 'AND',
                    attributeConditions: [],
                    relatedConditions: []
                }
            ]);
        }
    };
    const handleAddConditionGroup = () => {
        const newId = Math.max(...conditions.map(c => c.id), ...conditionGroups.map(g => g.id), 0) + 1;

        setConditionGroups([
            ...conditionGroups,
            {
                id: newId,
                type: 'group',
                operator: 'AND',
                conditions: []
            }
        ]);
    };
    const handleUpdateGroupCondition = (groupId, conditionId, field, value) => {
        setConditionGroups(conditionGroups.map(group => {
            if (group.id === groupId) {
                const updatedConditions = group.conditions.map(condition => {
                    if (condition.id === conditionId) {
                        return { ...condition, [field]: value };
                    }
                    return condition;
                });

                return { ...group, conditions: updatedConditions };
            }
            return group;
        }));
    };
    const handleRemoveGroupCondition = (groupId, conditionId) => {
        setConditionGroups(conditionGroups.map(group => {
            if (group.id === groupId) {
                return {
                    ...group,
                    conditions: group.conditions.filter(condition => condition.id !== conditionId)
                };
            }
            return group;
        }));
    };
    const handleRemoveCondition = (id) => {
        setConditions(conditions.filter(condition => condition.id !== id));
    };
    const handleUpdateCondition = (id, field, value) => {
        setConditions(prevConditions =>
            prevConditions.map(condition => {
                if (condition.id === id) {
                    return { ...condition, [field]: value };
                }
                return condition;
            })
        );
    };

    //render function
    const renderAttributeCondition = (condition, isInGroup = false, groupId = null) => {
        const attribute = attributes.find((attr) => attr.name === condition.field);
        const attributeType = attribute ? attribute.type : "text";
        const operators = OPERATORS[attributeType] || OPERATORS.text;

        return (
            <div key={condition.id}>
                <AttributeCondition
                    condition={condition}
                    attributes={attributes}
                    operators={operators}
                    isInGroup={isInGroup}
                    groupId={groupId}
                    handleUpdateCondition={handleUpdateCondition}
                    handleUpdateGroupCondition={handleUpdateGroupCondition}
                    handleRemoveCondition={handleRemoveCondition}
                    handleRemoveGroupCondition={handleRemoveGroupCondition}
                />
            </div>
        );
    };
    const renderEventCondition = (condition: EventConditionType, isInGroup = false, groupId = null) => {
        return (
            <div key={condition.id}>
                <EventCondition
                    condition={condition}
                    isInGroup={isInGroup}
                    groupId={groupId}
                    handleUpdateCondition={handleUpdateCondition}
                    handleRemoveCondition={handleRemoveCondition}
                    handleUpdateGroupCondition={handleUpdateGroupCondition}
                    handleRemoveGroupCondition={handleRemoveGroupCondition}
                />
            </div>
        )
    }

    const renderConditionGroup = (group) => {
        return (
            <div key={group.id}>
                <ConditionGroup
                    group={group}
                    renderAttributeCondition={renderAttributeCondition}
                    renderEventCondition={renderEventCondition}
                />
            </div>
        );
    };
    const renderPreviewDialog = () => {
        // Determine columns based on the first result row
        const columns = previewData.length > 0
            ? Object.keys(previewData[0]).filter(col => col !== '__rowid__')
            : [];

        return (
            <PreviewDialog
                columns={columns}
                generateSQLPreview={generateSQLPreview}
            />
        );
    };

    return (
        // segmentName && segmentId && selectedDataset && rootOperator && conditions && conditionGroups && description && estimatedSize ? (
        <div className="grid grid-cols-10 gap-4">

            <div className="col-span-7 p-4 space-y-4">
                <Card className="p-4">
                    <CardContent className="space-y-5">
                        {/* Segment Name */}
                        <div className="space-y-1">
                            <label className="font-medium">Tên phân khúc</label>
                            <Input value={segmentName} onChange={(e) => setSegmentName(e.target.value)} className="mt-1" />
                        </div>

                        {/* Segment Resource ID */}
                        <div className="space-y-1">
                            <label className="font-medium">ID phân khúc</label>
                            <div className="relative">
                                <Input value={segmentId} readOnly className="bg-background cursor-default" />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                    onClick={handleCopySegmentId}
                                >
                                    {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>

                        {/* Segment of */}
                        <div className="space-y-1">
                            <label className="font-medium">Phân khúc</label>
                            <Select value={defineDatasetName(selectedDataset.name)} onValueChange={handleDatasetChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select dataset" />
                                </SelectTrigger>
                                <SelectContent className="z-[9999] bg-card border border-card-foreground shadow-lg rounded-md">
                                    {Object.entries(datasets)
                                        .filter(([name]) => name === "Customer Profile")
                                        .map(([name, info]) => (
                                            <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" key={name} value={name}>
                                                <div className="flex items-center gap-2">
                                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 rounded-md text-gray-600">
                                                        {name.charAt(0)}
                                                    </span>
                                                    <div>
                                                        {name}
                                                        {info.schema && info.schema !== "public" && (
                                                            <span className="text-sm text-gray-500"> ({info.schema})</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Description */}
                        <div className="flex flex-col space-y-1">
                            <label className="font-medium">Mô tả phân khúc</label>
                            {showDescriptionField || description ? (
                                <Textarea
                                    rows={2}
                                    placeholder="Nhập mô tả cho phân khúc của bạn..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            ) : (
                                <Button className="w-40" variant="outline" onClick={() => setShowDescriptionField(true)}>
                                    <Plus className="w-4 h-4 mr-2" /> Thêm mô tả
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-4 p-4">
                    <CardContent>
                        {/* Condition builder header */}
                        <div className="flex items-center justify-between mb-2 py-2">
                            <h2 className="text-lg font-semibold">Điều kiện phân khúc</h2>
                        </div>

                        {/* Individual conditions */}
                        <div className="relative">
                            {conditions.length > 1 && (<div className={`border-2 ${rootOperator === "AND" ? 'border-primary-dark' : 'border-red-400'} pl-2 w-6 border-r-0 rounded-xl rounded-r-none top-8 bottom-5 -left-6 absolute transition-colors duration-300`}>
                                <Select
                                    value={rootOperator}
                                    onValueChange={handleRootOperatorChange}
                                    defaultValue="AND"
                                >
                                    <SelectTrigger className={`z-10 absolute top-1/2 -left-6 min-w-fit transform -translate-y-1/2 text-white text-[10px] px-1.5 py-0.5 rounded-md shadow-sm border transition-colors duration-300 ${rootOperator === "AND" ? "bg-primary-dark" : "bg-red-500"}`}>
                                        {rootOperator}
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                                        <SelectItem value="AND" className="hover:bg-background hover:rounded-md cursor-pointer">AND</SelectItem>
                                        <SelectItem value="OR" className="hover:bg-background hover:rounded-md cursor-pointer">OR</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>)}
                            <div className="space-y-4">
                                <ReactSortable list={conditions} setList={setConditions} animation={200} className="space-y-2">
                                    {conditions.map((condition) => {
                                        if (condition.type === "attribute") return renderAttributeCondition(condition);
                                        if (condition.type === "event") return renderEventCondition(condition);
                                        return null;
                                    })}
                                </ReactSortable>
                            </div>


                            {/* Condition groups */}
                            <div className="relative">
                                {conditionGroups.length > 1 && (<div className={`border-2 ${rootOperator === "AND" ? 'border-primary-dark' : 'border-red-400'} pl-2 w-6 border-r-0 rounded-xl rounded-r-none top-8 bottom-5 -left-6 absolute transition-colors duration-300`}>
                                    <Select
                                        value={rootOperator}
                                        onValueChange={handleRootOperatorChange}
                                        defaultValue="AND"
                                    >
                                        <SelectTrigger className={`z-10 absolute top-1/2 -left-6 min-w-fit transform -translate-y-1/2 text-white text-[10px] px-1.5 py-0.5 rounded-md shadow-sm border transition-colors duration-300 ${rootOperator === "AND" ? "bg-primary-dark" : "bg-red-500"}`}>
                                            {rootOperator}
                                        </SelectTrigger>
                                        <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                                            <SelectItem value="AND" className="hover:bg-background hover:rounded-md cursor-pointer">AND</SelectItem>
                                            <SelectItem value="OR" className="hover:bg-background hover:rounded-md cursor-pointer">OR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>)}
                                {conditionGroups.map((group) => renderConditionGroup(group))}
                            </div>

                            {/* Add buttons */}
                            <div className="flex gap-2 mt-3 flex-wrap">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="px-2 py-1 text-xs w-auto"
                                    onClick={() => handleAddCondition("attribute")}
                                >
                                    <SlidersHorizontal className="w-3 h-3 mr-1" /> Thêm điều kiện thuộc tính
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="px-2 py-1 text-xs w-auto"
                                    onClick={() => handleAddCondition("event")}
                                >
                                    <Calendar className="w-3 h-3 mr-1" /> Thêm sự kiện bán lẻ
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="px-2 py-1 text-xs w-auto"
                                    onClick={handleAddConditionGroup}
                                >
                                    <Group className="w-3 h-3 mr-1" /> Thêm nhóm điều kiện
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-4 p-4 bg-card rounded-md font-mono whitespace-pre-wrap">
                    <CardContent>
                        <SQLPreview />
                    </CardContent>
                </Card>

                {/* Preview results dialog */}
                {renderPreviewDialog()}

                {/* SQL Editor dialog */}
                <SQLDialog />

                {/* Discard confirmation dialog */}
                <DiscardConfirmDialog />

            </div >
            <div className="mt-4 col-span-3 space-y-4">
                {/* Estimate */}
                {/* <Card className="p-4">
                    <CardContent>
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600 flex items-center font-medium">
                                ESTIMATED SIZE
                                <Tooltip>
                                    <TooltipTrigger>
                                        <span className="ml-1 bg-gray-300 text-xs flex items-center justify-center w-5 h-5 rounded-full font-bold text-gray-700">
                                            i
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Estimated number of records in this segment based on your current conditions
                                    </TooltipContent>
                                </Tooltip>
                            </p>
                        </div>

                        <div className="mt-3 space-y-2">
                            <h4 className="text-2xl font-bold">{estimatedSize.count}</h4>
                            <p className="text-gray-600 text-lg">{estimatedSize.percentage}%</p>
                        </div>

                        <div className="mt-1 flex items-center">
                            <div className="flex-grow bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-red-500 h-full rounded-full transition-all"
                                    style={{ width: `${estimatedSize.percentage}%` }}
                                />
                            </div>
                            <p className="ml-3 text-sm font-medium text-red-500">-54%</p>
                        </div>
                    </CardContent>
                </Card> */}

                {/* Details List Card */}
                <Card className="border border-gray-300 rounded-lg relative">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <h5 className="text-md font-semibold">Danh sách chi tiết</h5>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => fetchAttributes(selectedDataset, true)}
                                disabled={loading}
                            >
                                <RefreshCw size={16} />
                            </Button>
                        </div>
                        {loading && (
                            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                                <p className="text-sm text-gray-600">Đang tải thuộc tính...</p>
                            </div>
                        )}
                        <div className="border border-gray-300 rounded-md overflow-hidden mt-2">
                            <div className="p-2 bg-gray-100 border-b border-gray-300">
                                <div className="flex items-center mb-1">
                                    <span className="w-6 h-6 flex items-center justify-center bg-gray-300 text-sm font-semibold text-gray-700 rounded-md mr-2">
                                        {selectedDataset.name ? selectedDataset.name.charAt(0) : 'U'}
                                    </span>
                                    <span className="flex-grow flex justify-between items-center text-sm font-medium text-gray-900">
                                        {selectedDataset.name}
                                        <span className="w-6 h-6 flex items-center justify-center bg-gray-300 text-sm font-semibold text-gray-700 rounded-md">
                                            {attributes.length}
                                        </span>
                                    </span>
                                </div>

                                <p className="text-xs text-gray-500">Điều kiện trên một thuộc tính của {selectedDataset.name}</p>
                            </div>
                            <ScrollArea className="max-h-[350px] overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 text-center text-sm text-gray-600">Đang tải thuộc tính...</div>
                                ) : attributes.length > 0 ? (
                                    <>
                                        {attributes.map((attr, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center p-2 border-b last:border-b-0 cursor-pointer hover:bg-background"
                                                onClick={() => handleAttributeClick(attr)}
                                            >
                                                <span className="w-5 text-gray-500 text-sm">
                                                    {attr.type === "number" ? "#" :
                                                        attr.type === "datetime" ? "⏱" :
                                                            attr.type === "boolean" ? "✓" :
                                                                attr.type === "array" ? "[]" : "T"}
                                                </span>
                                                <p className="text-sm text-card-foreground">{attr.name}</p>
                                            </div>
                                        ))}
                                        <div className="flex items-center p-2 border-t cursor-pointer hover:bg-gray-100">
                                            <span className="w-5 text-gray-500 flex items-center justify-center">
                                                <Code size={16} />
                                            </span>
                                            <p className="text-sm text-gray-600">Điều kiện SQL</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="p-4 text-center text-sm text-gray-600">Không có thuộc tính nào có sẵn cho bảng này</div>
                                )}
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
        // ) : (
        //     <div className="p-6 space-y-6 animate-pulse">
        //         <Skeleton className="h-10 w-1/6 rounded-md" /> 
        //     </div>
        // )
    );
};

export default RenderDefinition;

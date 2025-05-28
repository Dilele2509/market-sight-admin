import { Select, SelectTrigger, SelectItem, SelectContent } from "@/components/ui/select";
import { ReactSortable } from "react-sortablejs";
import { Button } from "@/components/ui/button";
import { useSegmentData } from "@/context/SegmentDataContext";
import { SlidersHorizontal, Group, Calendar, Table } from "lucide-react";
import { OPERATORS } from "@/types/constant";
import { AttributeCondition, EventCondition, ConditionGroup } from "./ConditionState";
import { EventConditionType } from "../segmentation/DefinitionTab/ConditionState/EventCondition";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useSegmentToggle } from "@/context/SegmentToggleContext";
import { Condition, generateSQLPreview } from "@/utils/segmentFunctionHelper";
import { LoadingCircles } from "./loading-circles";
import { ResponseData } from "@/types/aichat";
import { useAiChatContext } from "@/context/AiChatContext";

interface ModelEditorProps {
}

export function ModelEditor({ }: ModelEditorProps) {
    const { selectedDataset, responseData } = useAiChatContext();
    const { setLoading } = useSegmentToggle();
    const { conditions, setConditions, conditionGroups, setConditionGroups, rootOperator, setRootOperator, setSqlQuery, attributes, setAttributes } = useAiChatContext();


    useEffect(() => {
        fetchAttributes(selectedDataset)
    }, [selectedDataset])

    useEffect(() => {
        console.log('update data conditions: ', conditions);
        console.log('update data conditionGroups: ', conditionGroups);
        console.log('update data rootOperator: ', rootOperator);
    }, [conditions || conditionGroups || rootOperator])

    useEffect(() => {
        setSqlQuery(generateSQLPreview(selectedDataset, conditions, conditionGroups, rootOperator))
    }, [conditions || conditionGroups || rootOperator])

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
    //handle changes
    const handleRootOperatorChange = (newValue) => {
        if (newValue !== null) {
            setRootOperator(newValue);
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
        setConditions(prevConditions => {
            const updatedConditions = prevConditions.map(condition => {
                if (condition.id === id) {
                    return { ...condition, [field]: value };
                }
                return condition;
            });

            // 👉 Log hoặc kiểm tra ở đây trước khi cập nhật:
            console.log("[DEBUG] New conditions before set:", updatedConditions);

            // Ví dụ kiểm tra nếu relatedConditions bị mất
            const updated = updatedConditions.find(c => c.id === id);
            if (updated.relatedConditions?.length === 0 && field !== 'relatedConditions') {
                console.warn("[WARNING] relatedConditions bị mất!", updated);
            }

            return updatedConditions;
        });
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

    return (
        <div className="h-[calc(100%-2rem)] overflow-auto text-muted-foreground bg-muted/30 rounded-xl border border-dashed py-8 px-12">
            {responseData ? (conditions.length !== 0 || conditionGroups.length !== 0 ?
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
                            <SlidersHorizontal className="w-3 h-3 mr-1" /> Thêm điều kiện cho cột dữ liệu
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="px-2 py-1 text-xs w-auto"
                            onClick={() => handleAddCondition("event")}
                        >
                            <Calendar className="w-3 h-3 mr-1" /> Thêm sự kiện mua hàng
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="px-2 py-1 text-xs w-auto"
                            onClick={handleAddConditionGroup}
                        >
                            <Group className="w-3 h-3 mr-1" /> Nhóm điều kiện
                        </Button>
                    </div>
                </div> :
                <div className="h-[calc(100%-2rem)] flex flex-col items-center justify-center">
                    <LoadingCircles />
                    <p className="mt-5 text-sm font-medium">Đang tạo dữ liệu phân khúc...</p>
                    <p className="text-xs text-muted-foreground mt-1">Quá trình này có thể mất vài giây</p>
                </div>) : (
                <>
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/30 rounded-xl p-8">
                        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                            <Table className="h-8 w-8 text-muted-foreground/70" />
                        </div>
                        <p className="text-center font-medium">Không có dữ liệu</p>
                        <p className="text-center text-sm mt-1">Gửi truy vấn để tạo dữ liệu phân khúc</p>
                    </div>
                </>
            )}
        </div>
    )
}

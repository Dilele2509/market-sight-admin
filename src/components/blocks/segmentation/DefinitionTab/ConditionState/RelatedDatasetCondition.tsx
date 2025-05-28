import { GripVertical, Link, Trash, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSegmentData } from "@/context/SegmentDataContext";
import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Card, CardContent } from "@/components/ui/card";
import { useSegmentToggle } from "@/context/SegmentToggleContext";
import { toast } from "sonner";
import { OPERATORS } from "@/types/constant";
import { ReactSortable } from "react-sortablejs";
import { defineDatasetName, translateLabelToVietnamese } from "@/utils/segmentFunctionHelper";

type RelatedAttributeCondition = {
    id: number,
    field: string,
    operator: string,
    value: string,
    value2: string
}

interface Condition {
    id: number,
    type: string,
    relatedDataset: string,
    joinWithKey: string
    fields: any
    operator: 'AND' | 'OR'
    relatedAttributeConditions: RelatedAttributeCondition[]
};

interface RelatedDatasetConditionProps {
    condition: Condition;
    relatedConditionsState: any;
    setRelatedConditionsState: React.Dispatch<React.SetStateAction<any[]>>
}

const RelatedDatasetCondition: React.FC<RelatedDatasetConditionProps> = ({ condition, relatedConditionsState, setRelatedConditionsState }) => {
    const { setLoading, setIsDisableRelatedAdd } = useSegmentToggle();
    const { datasets, relatedDatasetNames, conditions, setConditions } = useSegmentData();
    const [attributes, setAttributes] = useState<any[]>([]);

    const attribute = attributes.find((attr) => attr.name === condition.fields?.[0]);
    const attributeType = attribute ? attribute.type : "text";
    const operators = OPERATORS[attributeType] || OPERATORS.text;

    useEffect(() => {
        fetchAttributes({
            name: condition.relatedDataset,
            fields: condition.fields,
        });
    }, [condition.relatedDataset, condition.fields]);

    useEffect(() => {
        if (relatedConditionsState) {
            setConditions(prevConditions => {
                return prevConditions.map(cond => {
                    if (cond.type === 'event') {
                        return {
                            ...cond,
                            relatedConditions: relatedConditionsState
                        };
                    }
                    return cond;
                });
            });
        }
    }, [relatedConditionsState]);

    const fetchAttributes = async (dataset: any, showToast = true) => {
        try {
            setLoading(true);
            if (!dataset) {
                if (showToast) {
                    toast.error(`Table information for ${dataset?.name} not found`);
                }
                setLoading(false);
                return;
            }

            if (dataset.fields && Array.isArray(dataset.fields) && dataset.fields.length > 0) {
                const formattedAttributes = dataset.fields.map((field) => ({
                    name: field,
                    type: determineFieldType(field),
                }));

                setAttributes(formattedAttributes);
                setLoading(false);
                return;
            } else {
                toast.error("Cannot fetch attribute, please check database connection");
            }

            setAttributes(dataset.fields);
        } catch {
            toast.error("Cannot run fetch attribute function");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log('from related: ', condition);
    }, [condition])

    const determineFieldType = (fieldName: string, dataType = null) => {
        if (dataType) {
            if (dataType.includes("timestamp") || dataType.includes("date") || dataType.includes("time")) return "datetime";
            if (dataType.includes("int") || dataType.includes("float") || dataType.includes("numeric") || dataType.includes("decimal") || dataType.includes("double")) return "number";
            if (dataType === "boolean") return "boolean";
            if (dataType.includes("array") || dataType.includes("json") || dataType.includes("jsonb")) return "array";
            return "text";
        }

        const lowerField = fieldName.toLowerCase();
        if (lowerField.includes("date") || lowerField.includes("time") || lowerField.includes("_at")) return "datetime";
        if (["id", "amount", "price", "cost", "quantity", "number"].some((keyword) => lowerField.includes(keyword))) return "number";
        if (["is_", "has_"].some((prefix) => lowerField.includes(prefix))) return "boolean";
        if (["tags", "categories", "array"].some((val) => lowerField.includes(val))) return "array";
        return "text";
    };


    //access function
    const updateCondition = (key: string, value: any) => {
        handleUpdateCondition(condition.id, key, value);
    };

    const handleUpdateCondition = (id: number, field: string, value: any) => {
        setRelatedConditionsState(prevConditions =>
            prevConditions.map(condition => {
                if (condition.id === id) {
                    return { ...condition, [field]: value };
                }
                return condition;
            })
        );
    };

    const updateRelatedAttributeCondition = (key: string, value: string, index: number) => {
        handleUpdateAttributeCondition(condition.id, key, value, index);
    };

    const handleUpdateAttributeCondition = (id: number, field: string, value: string, index: number) => {
        setRelatedConditionsState(prevConditions => {
            const updatedConditions = prevConditions.map(condition => {
                if (condition.id === id) {
                    const updatedRelatedAttCons = [...(condition.relatedAttributeConditions || [])];

                    if (!updatedRelatedAttCons[index]) {
                        updatedRelatedAttCons[index] = {
                            id: Math.max(0, ...updatedRelatedAttCons.map(c => c.id)) + 1,
                            field: '',
                            operator: '',
                            value: '',
                            value2: ''
                        };
                    }

                    updatedRelatedAttCons[index] = {
                        ...updatedRelatedAttCons[index],
                        [field]: value
                    };

                    return {
                        ...condition,
                        relatedAttributeConditions: updatedRelatedAttCons
                    };
                }
                return condition;
            });

            return updatedConditions;
        });
    };

    const handleRemoveCondition = (id: number) => {
        setRelatedConditionsState(relatedConditionsState.filter((condition) => condition.id !== id));
        setIsDisableRelatedAdd(false);
    };

    const handleRootOperatorChange = (newValue) => {
        if (newValue !== null) {
            updateCondition('operator', newValue);
        }
    };

    const removeCondition = () => {
        handleRemoveCondition(condition.id);
    };

    const handleRemoveAttributeCondition = (conditionId: number, index: number) => {
        setRelatedConditionsState(prevConditions =>
            prevConditions.map(condition => {
                if (condition.id === conditionId) {
                    const updatedRelated = [...condition.relatedAttributeConditions];
                    updatedRelated.splice(index, 1);
                    return {
                        ...condition,
                        relatedAttributeConditions: updatedRelated,
                    };
                }
                return condition;
            })
        );
    };

    const removeAttributeCondition = (index: number) => {
        handleRemoveAttributeCondition(condition.id, index);
    };

    const handleAddRelatedAttCon = () => {
        const existingRelated = condition.relatedAttributeConditions || [];
        const newId = Math.max(0, ...existingRelated.map((c: any) => c.id), 0) + 1;

        const newCondition = {
            id: newId,
            field: '',
            operator: '',
            value: '',
            value2: '',
            chosen: false,
            selected: false
        };

        setRelatedConditionsState(prevConditions =>
            prevConditions.map(cond => {
                if (cond.id === condition.id) {
                    return {
                        ...cond,
                        relatedAttributeConditions: [...existingRelated, newCondition]
                    };
                }
                return cond;
            })
        );
    };

    //rendering function
    const renderRelatedAttributeConditions = (relatedCondition: any, index: any) => {
        return (
            <Card key={index} className="flex items-center justify-between min-w-fit p-2">
                <div className="flex items-center space-x-4 w-full">
                    <GripVertical className="mr-2 text-gray-400 cursor-grab" size={20} />
                    <div className="flex flex-col items-start gap-2 w-full">
                        <div className="flex items-center w-full">
                            {/* Field select */}
                            {condition.fields.length > 0 && (
                                <Select
                                    value={relatedCondition.field || ""}
                                    onValueChange={(value) => { updateRelatedAttributeCondition('field', value, index) }}
                                >
                                    <SelectTrigger className="w-1/2">
                                        <SelectValue placeholder="Chọn trường dữ liệu">
                                            {relatedCondition.field
                                                ? attributes.find((attr) => attr.name === relatedCondition.field)?.name || "Chọn trường dữ liệu"
                                                : "Không có thuộc tính"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                                        {attributes.length > 0 ? (
                                            attributes.map((attr) => (
                                                <SelectItem
                                                    key={attr.name}
                                                    value={attr.name}
                                                    className="hover:bg-background hover:rounded-md cursor-pointer"
                                                >
                                                    <div className="flex items-center">
                                                        <span className="mr-2 w-5 text-gray-500">
                                                            {attr.type === "number"
                                                                ? "#"
                                                                : attr.type === "datetime"
                                                                    ? "⏱"
                                                                    : attr.type === "boolean"
                                                                        ? "✓"
                                                                        : attr.type === "array"
                                                                            ? "[]"
                                                                            : "T"}
                                                        </span>
                                                        {attr.name}
                                                    </div>
                                                </SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem
                                                value="no attribute"
                                                disabled
                                                className="text-gray-400"
                                            >
                                                Không có thuộc tính khả dụng
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            )}

                            {/* Operator select */}
                            <Select
                                value={relatedCondition.operator || ""}
                                onValueChange={(newValue) => updateRelatedAttributeCondition("operator", newValue, index)}
                                disabled={!condition.fields}
                            >
                                <SelectTrigger className="w-1/2 ml-2">
                                    <SelectValue placeholder="Select operator" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                                    {operators.map((op) => (
                                        <SelectItem
                                            key={op.value}
                                            value={op.value}
                                            className="hover:bg-background hover:rounded-md cursor-pointer"
                                        >
                                            {translateLabelToVietnamese(op.label)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Value input */}
                        {relatedCondition.operator &&
                            !["is_null", "is_not_null", "is_empty", "is_not_empty"].includes(relatedCondition.operator) && (
                                <div className="flex items-center w-full">
                                    <Input
                                        placeholder="Value"
                                        value={relatedCondition.value || ""}
                                        onChange={(e) => updateRelatedAttributeCondition("value", e.target.value, index)}
                                        className={`${relatedCondition.operator !== "between" && 'w-full'}`}
                                    />
                                    {/* Additional value input for "between" operator */}
                                    {relatedCondition.operator === "between" && (
                                        <>
                                            <span className="mx-2 text-sm">và</span>
                                            <Input
                                                placeholder="End value"
                                                value={relatedCondition.value2 || ""}
                                                onChange={(e) => updateRelatedAttributeCondition("value2", e.target.value, index)}
                                                className={`'w-1/2'`}
                                            />
                                        </>
                                    )}
                                </div>
                            )}
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="ml-2" onClick={() => removeAttributeCondition(index)}>
                    <Trash className="w-4 h-4" color={"#E11D48"} />
                </Button>
            </Card>
        );
    };

    return (
        <div className="flex items-center space-x-4">
            <GripVertical className="mr-2 text-gray-400 cursor-grab border-r" size={20} />
            <div className="flex flex-col w-full p-2 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link className="mr-2 text-primary" size={18} />
                        <Label className="text-base font-medium">Điều kiện liên kết</Label>
                    </div>
                    <Button variant="ghost" size="icon" className="ml-2" onClick={removeCondition}>
                        <Trash className="w-4 h-4" color={"#E11D48"} />
                    </Button>
                </div>

                {relatedConditionsState && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 w-full">
                            <Label className="text-sm font-medium text-card-foreground">Dữ liệu liên kết</Label>
                            <Select
                                value={condition.relatedDataset}
                                onValueChange={(value) => {
                                    const dataset = datasets[defineDatasetName(value)];
                                    ["relatedDataset", "fields", "joinWithKey"].forEach((key, i) =>
                                        updateCondition(key, [value, dataset.fields, dataset.fields[0]][i])
                                    );
                                }}
                            >
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Chọn trường dữ liệu" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                                    {relatedDatasetNames.map((dataset: string, index: number) => {
                                        if (dataset !== "customers")
                                            return (
                                                <SelectItem key={index} value={dataset} className="hover:bg-background hover:rounded-md cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 rounded-md text-gray-600">
                                                            {defineDatasetName(dataset).charAt(0)}
                                                        </span>
                                                        {defineDatasetName(dataset)}
                                                    </div>
                                                </SelectItem>
                                            );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center space-x-4 w-full">
                            <Label className="text-sm font-medium text-card-foreground">Liên kết với</Label>
                            <Select
                                value={condition.joinWithKey}
                                onValueChange={(value) => {
                                    updateCondition("joinWithKey", value);
                                }}
                            >
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Chọn trường dữ liệu" />
                                </SelectTrigger>
                                <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                                    {condition.fields?.map((field: string, index: number) => (
                                        <SelectItem key={index} value={field} className="hover:bg-background hover:rounded-md cursor-pointer">
                                            {field}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-10  gap-4">
                    <Label className="text-sm font-medium col-span-2">Điều kiện lọc</Label>
                    <div className="relative col-span-8">
                        {condition.relatedAttributeConditions.length > 1 && (<div className={`border-2 ${condition.operator === "AND" ? 'border-primary' : 'border-yellow-400'} pl-2 w-6 border-l-0 rounded-xl rounded-l-none top-1/4 bottom-[20%] -right-6 absolute transition-colors duration-300`}>
                            <Select
                                value={condition.operator}
                                onValueChange={handleRootOperatorChange}
                                defaultValue="AND"
                            >
                                <SelectTrigger className={`absolute top-1/2 -right-6 min-w-fit transform -translate-y-1/2 text-white text-[10px] px-1.5 py-0.5 rounded-md shadow-sm border transition-colors duration-300 ${condition.operator === "AND" ? "bg-primary" : "bg-yellow-500"}`}>
                                    {condition.operator}
                                </SelectTrigger>
                                <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                                    <SelectItem value="AND" className="hover:bg-background hover:rounded-md cursor-pointer">AND</SelectItem>
                                    <SelectItem value="OR" className="hover:bg-background hover:rounded-md cursor-pointer">OR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>)}
                        {condition.relatedAttributeConditions.length > 0 ? (
                            <ReactSortable
                                list={condition.relatedAttributeConditions}
                                setList={(newList) => updateCondition("relatedAttributeConditions", newList)}
                                animation={200}
                                className="space-y-2 w-full pl-4"
                            >
                                {condition.relatedAttributeConditions.map((relatedAttCon, index) => (renderRelatedAttributeConditions(relatedAttCon, index)))}
                            </ReactSortable>) :
                            (
                                <Card className="flex items-center justify-center p-2">
                                    <p className="text-sm">Không có điều kiện thuộc tính liên kết</p>
                                </Card>
                            )}
                    </div>
                </div>

                <div className="flex gap-2 mt-8 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        className="px-2 py-1 text-xs w-auto"
                        onClick={handleAddRelatedAttCon}
                    >
                        <SlidersHorizontal className="w-3 h-3 mr-1" /> Thêm điều kiện thuộc tính liên kết
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RelatedDatasetCondition;

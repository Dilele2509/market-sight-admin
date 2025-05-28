import { Trash, SlidersHorizontal, Calendar, Link, Group } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSegmentData } from "@/context/SegmentDataContext";
import { EventConditionType } from "./EventCondition";
import { Condition } from "@/utils/segmentFunctionHelper";

interface ConditionGroupProps {
    group: {
        id: string;
        operator: "AND" | "OR";
        conditions: Condition[];
    };
    renderAttributeCondition: (condition: Condition, isInGroup: boolean, groupId: string) => JSX.Element | null;
    renderEventCondition: (condition: EventConditionType, isInGroup: boolean, groupId: string) => JSX.Element | null;
}

const ConditionGroup: React.FC<ConditionGroupProps> = ({
    group,
    renderAttributeCondition,
    renderEventCondition,
}) => {
    const { selectedDataset } = useSegmentData()
    const { setConditionGroups, conditionGroups, conditions } = useSegmentData()

    const handleAddConditionToGroup = (groupId, type = 'attribute') => {
        setConditionGroups(conditionGroups.map(group => {
            if (group.id === groupId) {
                const newId = Math.max(
                    ...conditions.map(c => c.id),
                    ...conditionGroups.map(g => g.id),
                    ...group.conditions.map(c => c.id),
                    0
                ) + 1;

                let newCondition;

                if (type === 'attribute') {
                    newCondition = {
                        id: newId,
                        type: 'attribute',
                        field: '',
                        operator: '',
                        value: null
                    };
                } else if (type === 'event') {
                    newCondition = {
                        id: newId,
                        columnKey: selectedDataset.fields[0],
                        relatedColKey: selectedDataset.fields[0],
                        type: 'event',
                        eventType: 'performed',
                        frequency: 'at_least',
                        count: 1,
                        timePeriod: 'days',
                        timeValue: 30,
                        operator: 'AND',
                        attributeConditions: [],
                        relatedConditions: []
                    };
                }

                return {
                    ...group,
                    conditions: [...group.conditions, newCondition]
                };
            }
            return group;
        }));
    };

    const handleRemoveConditionGroup = (groupId) => {
        setConditionGroups(conditionGroups.filter(group => group.id !== groupId));
    };

    const handleUpdateGroupOperator = (groupId, newOperator) => {
        setConditionGroups(conditionGroups.map(group => {
            if (group.id === groupId) {
                return { ...group, operator: newOperator };
            }
            return group;
        }));
    };

    return (
        <div className="mb-3 mt-2 border border-gray-300 rounded p-2">
            <div className="flex items-center justify-between mb-2 px-6 py-2">
                <div className="flex items-center">
                    <Group className="w-5 h-5 mr-2 text-primary"/>
                    <span className="font-medium text-base min-w-fit">Nhóm điều kiện</span>
                </div>
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemoveConditionGroup(group.id)}
                >
                    <Trash className="w-4 h-4" color={'#E11D48'} />
                </Button>
            </div>

            {/* Group conditions */}
            <div className="pl-10">
                <div className="relative">
                    {group.conditions.length > 1 && (<div className={`border-2 ${group.operator === "AND" ? 'border-primary' : 'border-yellow-400'} pl-2 w-5 border-r-0 rounded-xl rounded-r-none top-8 bottom-4 -left-5 absolute transition-colors duration-300`}>
                        <Select
                            value={group.operator}
                            onValueChange={(newValue) => {
                                if (newValue) {
                                    handleUpdateGroupOperator(group.id, newValue as "AND" | "OR");
                                }
                            }}
                            defaultValue="AND"
                        >
                            <SelectTrigger
                                className={`absolute min-w-fit top-1/2 -left-6 transform -translate-y-1/2 text-white text-[10px] px-1.5 py-0.5 rounded-md shadow-sm transition-colors duration-300 ${group.operator === "AND" ? 'bg-primary' : 'bg-yellow-400'}`}>
                                {group.operator}
                            </SelectTrigger>
                            <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                                <SelectItem value="AND" className="hover:bg-background hover:rounded-md cursor-pointer">AND</SelectItem>
                                <SelectItem value="OR" className="hover:bg-background hover:rounded-md cursor-pointer">OR</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>)}
                    {group.conditions.map((condition) => {
                        if (condition.type === "attribute") {
                            return renderAttributeCondition(condition, true, group.id);
                        } else if (condition.type === "event") {
                            return renderEventCondition(condition, true, group.id);
                        }
                        return null;
                    })}

                    {group.conditions.length === 0 && (
                        <p className="italic text-gray-500 text-sm mb-2">
                            Không có điều kiện trong nhóm
                        </p>
                    )}

                    <div className="flex gap-2 mt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="px-2 py-1 text-xs w-auto"
                            onClick={() => handleAddConditionToGroup(group.id, "attribute")}
                        >
                            <SlidersHorizontal className="w-3 h-3 mr-1" /> Thêm điều kiện thuộc tính
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="px-2 py-1 text-xs w-auto"
                            onClick={() => handleAddConditionToGroup(group.id, "event")}
                        >
                            <Calendar className="w-3 h-3 mr-1" /> Thêm sự kiện bán lẻ
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConditionGroup;

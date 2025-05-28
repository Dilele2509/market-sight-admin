import { Card } from "@/components/ui/card";
import { useSegmentData } from "@/context/SegmentDataContext";
import { generateSQLPreview, highlightSQLWithTailwind } from "@/utils/segmentFunctionHelper";
import { useMemo } from "react";

const SQLPreview = () => {
  const { selectedDataset, conditions, attributes, rootOperator, conditionGroups } = useSegmentData();

  const sql = useMemo(() => {
    const rawSQL = generateSQLPreview(selectedDataset, conditions, conditionGroups, rootOperator);
    return highlightSQLWithTailwind(rawSQL);
  }, [selectedDataset, conditions, conditionGroups, attributes, rootOperator]);

  return (
    <>
      <h5 className="text-lg font-semibold mb-2 py-2">Xem trước truy vấn SQL</h5>
      <Card className="border border-gray-300 bg-background p-4 rounded-md font-mono whitespace-pre-wrap overflow-x-auto text-sm">
        <div dangerouslySetInnerHTML={{ __html: sql }} />
      </Card>
    </>
  );
};

export default SQLPreview;

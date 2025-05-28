import { useState } from "react";
import SegmentsList from "@/components/blocks/segmentation/SegmentsList";
import SegmentBuilder from "@/components/blocks/segmentation/SegmentBuilder";
import { Segment } from "@/types/segmentTypes";
import { useSegmentData } from "@/context/SegmentDataContext";
import { useSegmentToggle } from "@/context/SegmentToggleContext";

export default function UserCreate() {
  const { setConditions, editSegment, setEditSegment, setPreviewData } = useSegmentData();
  const { setHasUnsavedChanges, hasUnsavedChanges } = useSegmentToggle();
  const [showSegmentBuilder, setShowSegmentBuilder] = useState<boolean>(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);

  const handleEditSegment = (segment: Segment) => {
    console.log("🖊️ [App] Editing segment:", segment);
    setSelectedSegment(segment);
    setEditSegment(segment);
    setShowSegmentBuilder(true);
  };

  const handleBackFromBuilder = () => {
    setConditions([]);
    if(editSegment) setEditSegment(null)
    if (hasUnsavedChanges) setHasUnsavedChanges(!hasUnsavedChanges);
    setSelectedSegment(null);
    setShowSegmentBuilder(false);
    setPreviewData([])
  };

  return (
    <>
      {showSegmentBuilder ? (
        <SegmentBuilder onBack={handleBackFromBuilder} editSegment={selectedSegment} />
      ) : (
        <SegmentsList
          segments={segments}
          onCreateSegment={() => {
            setSelectedSegment(null);
            setShowSegmentBuilder(true);
          }}
          onEditSegment={handleEditSegment}
        />
      )}
    </>
  );
}

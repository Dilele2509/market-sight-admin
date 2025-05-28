// src/types/segmentTypes.ts

/** Định nghĩa kiểu dữ liệu cho một segment */
export interface Segment {
    segment_id: string;
    segment_name: string;
    created_by_user_id: string;
    dataset: string;
    description: string;
    created_at: string;
    updated_at: string;
    status: string;
    filter_criteria: {
        conditions: any[];
        conditionGroups: any[];
        rootOperator: string;
    };
}

/** Props của component SegmentBuilder */
export interface SegmentBuilderProps {
    onBack: (updatedSegment?: Segment) => void;
    editSegment?: Segment;
}

/** Props của component SegmentsList */
export interface SegmentsListProps {
    segments?: Segment[];
    onCreateSegment?: () => void;
    onEditSegment?: (segment: Segment) => void;
}

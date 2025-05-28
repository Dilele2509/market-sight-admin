import { AttributeCondition } from "@/components/blocks/segmentation/DefinitionTab/ConditionState/AttributeCondition";

export type Condition = {
    id: number;
    type: "attribute" | "event" | "group";
    eventType?: string;
    frequency?: string;
    count?: number;
    timePeriod?: string;
    timeValue?: number;
    field?: string;
    operator?: 'AND' | 'OR' | string;
    attributeOperator?: 'AND' | 'OR';
    value?: any;
    value2?: any;
    columnKey?: string;
    relatedColKey?: string;
    relatedDataset?: string;
    joinWithKey?: string;
    attributeConditions?: AttributeCondition[]
    relatedConditions?: relatedConditions[];
};

type RelatedAttributeCondition = {
    id: number,
    field: string,
    operator: string,
    value: string,
    value2: string
}

export type relatedConditions = {
    id: number,
    type: string,
    relatedDataset: string,
    joinWithKey: string
    fields: any
    operator: 'AND' | 'OR' | string
    relatedAttributeConditions: RelatedAttributeCondition[]
}

type GroupCondition = {
    id: number;
    type: "group";
    operator: "AND" | "OR";
    conditions: Condition[];
};

function escapeValue(val: any): string {
    if (typeof val === 'string') {
        return `'${val.replace(/'/g, "''")}'`; // escape dấu '
    }
    return String(val);
}

function getClause(tableName: string, condition: any): string {
    const { field, operator, value, value2 } = condition;

    switch (operator) {
        // Text & Boolean & Number
        case "equals":
            return `${tableName}.${field} = ${escapeValue(value)}`;
        case "not_equals":
            return `${tableName}.${field} != ${escapeValue(value)}`;

        // Text
        case "contains":
            return `${tableName}.${field} LIKE ${escapeValue(`%${value}%`)}`;
        case "not_contains":
            return `${tableName}.${field} NOT LIKE ${escapeValue(`%${value}%`)}`;
        case "starts_with":
            return `${tableName}.${field} LIKE ${escapeValue(`${value}%`)}`;
        case "ends_with":
            return `${tableName}.${field} LIKE ${escapeValue(`%${value}`)}`;

        // Number
        case "greater_than":
            return `${tableName}.${field} > ${escapeValue(value)}`;
        case "less_than":
            return `${tableName}.${field} < ${escapeValue(value)}`;
        case "between":
            return `${tableName}.${field} BETWEEN ${escapeValue(value)} AND ${escapeValue(value2)}`;

        // Datetime
        case "after":
            return `${tableName}.${field} > ${escapeValue(value)}`;
        case "before":
            return `${tableName}.${field} < ${escapeValue(value)}`;
        case "on":
            return `${tableName}.${field} = ${escapeValue(value)}`;
        case "not_on":
            return `${tableName}.${field} != ${escapeValue(value)}`;
        case "relative_days_ago":
            // Assumes value = number of days ago, translated to SQL interval
            return `${tableName}.${field} >= DATE_SUB(CURRENT_DATE, INTERVAL ${escapeValue(value)} DAY)`;

        // Null checks
        case "is_null":
            return `${tableName}.${field} IS NULL`;
        case "is_not_null":
            return `${tableName}.${field} IS NOT NULL`;

        // Array
        case "contains_all":
            // For JSON arrays, ensure all values are present
            return value.map((v: any) => `${tableName}.${field} LIKE ${escapeValue(`%${v}%`)}`).join(" AND ");
        case "is_empty":
            return `JSON_LENGTH(${tableName}.${field}) = 0`;
        case "is_not_empty":
            return `JSON_LENGTH(${tableName}.${field}) > 0`;

        default:
            return "";
    }
}

function getClauseEvent(parentTable: string, eventCondition: any): string {
    const {
        relatedColKey,
        columnKey,
        count,
        frequency,
        timeValue,
        timePeriod,
        relatedConditions,
        attributeConditions,
        eventType,
    } = eventCondition;

    const baseTable = "transactions";
    const whereClauses: string[] = [`${baseTable}.${columnKey} = ${parentTable}.${relatedColKey}`];

    // Time condition
    if (timeValue && timePeriod) {
        const timeColumn = `${baseTable}.transaction_date`;
        const unit = timePeriod.toLowerCase(); // 'days', 'hours', etc.
        whereClauses.push(`${timeColumn} >= NOW() - INTERVAL '${timeValue} ${unit}'`);
    }

    if (attributeConditions && attributeConditions.length > 0) {
        const attrClauses = attributeConditions.map(attr => getClause(baseTable, attr)).filter(Boolean);
        const attrOperator = eventCondition.attributeOperator || "AND"; // fallback nếu thiếu
        const joinedAttrClause = buildClauses(attrClauses, attrOperator);
        if (joinedAttrClause) {
            whereClauses.push(joinedAttrClause);
        }
    }

    const joins: string[] = [];
    const relatedWhere: string[] = [];

    for (const rel of relatedConditions || []) {
        const relTable = rel.relatedDataset;
        const joinKey = rel.joinWithKey;
        joins.push(`INNER JOIN ${relTable} ON ${baseTable}.${joinKey} = ${relTable}.${joinKey}`);

        const relAttrClauses = (rel.relatedAttributeConditions || [])
            .map((attr: RelatedAttributeCondition) => getClause(relTable, attr))
            .filter(Boolean);

        const relOperator = rel.operator || 'AND'; // fallback
        const joinedRelAttrs = buildClauses(relAttrClauses, relOperator);

        if (joinedRelAttrs) {
            relatedWhere.push(joinedRelAttrs);
        }
    }

    const allWhere = [...whereClauses, ...relatedWhere].map(w => `(${w})`).join(" AND ");
    const joinSQL = joins.join(" ");

    if (eventType === "performed") {
        let countCondition = "";
        switch (frequency) {
            case "at_least":
                countCondition = `HAVING COUNT(*) >= ${count}`;
                break;
            case "exactly":
                countCondition = `HAVING COUNT(*) = ${count}`;
                break;
            case "at_most":
                countCondition = `HAVING COUNT(*) <= ${count}`;
                break;
        }

        return `
EXISTS (
  SELECT 1
  FROM ${baseTable}
  ${joinSQL}
  WHERE ${allWhere}
  GROUP BY ${baseTable}.${columnKey}
  ${countCondition}
)`.trim();
    }

    if (eventType === "not_performed") {
        return `
NOT EXISTS (
  SELECT 1
  FROM ${baseTable}
  ${joinSQL}
  WHERE ${allWhere}
)`.trim();
    }

    if (eventType === "first_time" || eventType === "last_time") {
        const timeAgg = eventType === "first_time" ? "MIN" : "MAX";

        return `
EXISTS (
  SELECT 1
  FROM ${baseTable}
  ${joinSQL}
  WHERE ${allWhere}
  GROUP BY ${baseTable}.${columnKey}
  HAVING ${timeAgg}(${baseTable}.transaction_date) >= NOW() - INTERVAL '${timeValue} ${timePeriod.toLowerCase()}'
)`.trim();
    }

    return ""; // fallback
}

function buildClauses(conditions: (string | null)[], operator: string): string {
    const valid = conditions.filter(Boolean);
    if (!valid.length) return "";
    // Check how the clauses look
    //console.log("Clauses to join with", operator, valid);

    return valid.map((c) => `(${c})`).join(` ${operator} `);
}

function isGroupCondition(cond: Condition): cond is GroupCondition {
    return cond.type === "group" && Array.isArray((cond as any).conditions);
}

function buildGroupClause(group: GroupCondition, tableName: string): string {
    const clauses = group.conditions.map((cond) => {
        if (isGroupCondition(cond)) {
            return buildGroupClause(cond, tableName);
        } else if (cond.type === "attribute") {
            return getClause(tableName, cond);
        } else if (cond.type === "event") {
            return getClauseEvent(tableName, cond);
        }
        return null;
    });

    return buildClauses(clauses, group.operator);
}

function generateSQLPreview(
    selectedDataset: any,
    conditions: Condition[],
    conditionGroups: GroupCondition[],
    rootOperator: string
): string {
    const tableName = selectedDataset.name;
    const whereClauses: string[] = [];

    console.log('check root in generate: ', rootOperator);

    for (const condition of conditions) {
        if (condition.type === "attribute") {
            whereClauses.push(getClause(tableName, condition));
        } else if (condition.type === "event") {
            // tao bỏ JOIN
            whereClauses.push(getClauseEvent(tableName, condition));
        }
    }

    for (const group of conditionGroups) {
        const groupClause = buildGroupClause(group, tableName);
        if (groupClause) {
            whereClauses.push(groupClause);
        }
    }

    const whereClause = buildClauses(whereClauses, rootOperator) || "1=1";

    return `
SELECT *
FROM ${tableName}
WHERE ${whereClause};
    `.trim();
}


const highlightSQLWithTailwind = (sql: string): string => {
    const keywords = [
        "SELECT", "FROM", "WHERE", "INNER JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "GROUP BY",
        "HAVING", "ORDER BY", "NOT EXISTS", "EXISTS", "AND", "OR", "ON", "AS", "IN", "BETWEEN"
    ];

    let highlighted = sql;
    for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        highlighted = highlighted.replace(
            regex,
            match => `<span class="text-blue-500 font-semibold">${match.toUpperCase()}</span>`
        );
    }

    return highlighted;
}

function translateLabelToVietnamese(label: string): string {
    const translations: Record<string, string> = {
        // Text operators
        'is': 'là',
        'is not': 'không là',
        'contains': 'chứa',
        'does not contain': 'không chứa',
        'starts with': 'bắt đầu với',
        'ends with': 'kết thúc với',
        'is blank': 'rỗng',
        'is not blank': 'không rỗng',

        // Number operators
        'equals': 'bằng',
        'does not equal': 'không bằng',
        'more than': 'lớn hơn',
        'less than': 'nhỏ hơn',
        'between': 'trong khoảng',

        // Datetime operators
        'after': 'sau',
        'before': 'trước',
        'on': 'vào ngày',
        'not on': 'không vào ngày',
        'in the last...': 'lần cuối vào...',

        // Boolean
        // 'is' and 'is not' are already mapped above

        // Array operators
        'contains all of': 'chứa tất cả',
        'is empty': 'rỗng',
        'is not empty': 'không rỗng',

        // Event condition types
        'Performed': 'Đã thực hiện',
        'Not Performed': 'Chưa thực hiện',
        'First Time': 'Lần đầu',
        'Last Time': 'Lần cuối',

        // Frequency options
        'at least': 'ít nhất',
        'at most': 'nhiều nhất',
        'exactly': 'chính xác',

        // Time period
        'days': 'ngày',
        'weeks': 'tuần',
        'months': 'tháng'
    }

    return translations[label] || label
}


export { generateSQLPreview, highlightSQLWithTailwind, translateLabelToVietnamese };

export const defineDatasetName = (value: string) => {
    switch (value.toLowerCase()) {
        case 'customers':
            return 'Customer Profile';
        case 'transactions':
            return 'Transactions';
        case 'stores':
            return 'Stores';
        case 'product_lines':
            return 'Product Line';
        default:
            return 'Customer Profile';
    }
};

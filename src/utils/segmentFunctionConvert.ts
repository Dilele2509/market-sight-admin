import { Condition } from './segmentFunctionHelper';

interface GroupCondition extends Condition {
    conditions: Condition[];
}

interface SQLParseResult {
    conditions: Condition[];
    groupConditions: GroupCondition[];
    rootOperator: string;
}

export function convertSQLToSegment(sqlQuery: string): SQLParseResult {
    console.log('Input SQL:', sqlQuery);

    // Remove any leading/trailing whitespace and ensure the query ends with a semicolon
    sqlQuery = sqlQuery.trim();
    if (!sqlQuery.endsWith(';')) {
        sqlQuery += ';';
    }

    // Initialize the result object
    const result: SQLParseResult = {
        conditions: [],
        groupConditions: [],
        rootOperator: 'AND' // Default root operator
    };

    // Extract the WHERE clause - using [\s\S] to match any character including newlines
    const whereMatch = sqlQuery.match(/WHERE\s+([\s\S]*?);$/i);
    if (!whereMatch) {
        console.log('No WHERE clause found');
        return result; // Return empty result if no WHERE clause found
    }

    const whereClause = whereMatch[1].trim();
    console.log('WHERE clause:', whereClause);

    // Determine the root operator by looking at top-level conditions
    if (whereClause.includes(')) OR ((')) {
        result.rootOperator = 'OR';
    } else {
        result.rootOperator = 'AND';
    }
    console.log('Root operator:', result.rootOperator);

    // Parse the conditions
    let nextId = 1;
    const parsedGroups = parseNestedConditions(whereClause, nextId);
    console.log('Parsed groups:', parsedGroups);

    if (parsedGroups.length > 0) {
        result.groupConditions = parsedGroups;
    }

    console.log('Final result:', result);
    return result;
}

function parseNestedConditions(whereClause: string, nextId: number): GroupCondition[] {
    const groups: GroupCondition[] = [];

    // Split by top-level OR, handling the specific format with double parentheses
    const normalizedClause = whereClause.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    const orParts = normalizedClause.split(/\)\)\s*OR\s*\(\(/i);

    console.log('OR parts:', orParts);

    orParts.forEach((orPart, index) => {
        // Clean up the part
        let cleanPart = orPart.trim();

        // For first part, remove leading ((, for last part, remove trailing ))
        if (index === 0) cleanPart = cleanPart.replace(/^\(\(+/, '').trim();
        if (index === orParts.length - 1) cleanPart = cleanPart.replace(/\)+$/, '').trim();

        console.log('Clean part:', cleanPart);

        const currentGroup: GroupCondition = {
            id: nextId++,
            type: 'group',
            operator: 'AND',
            conditions: []
        } as GroupCondition;

        // Split by AND, handling parentheses
        const andParts = cleanPart.split(/\)\s*AND\s*\(/);
        console.log('AND parts:', andParts);

        andParts.forEach(part => {
            let cleanedPart = part.trim()
                .replace(/^\(/, '')
                .replace(/\)$/, '');
            console.log('Processing part:', cleanedPart);

            if (cleanedPart.includes('EXISTS')) {
                const eventCondition = parseEventCondition(cleanedPart, nextId++);
                if (eventCondition) {
                    console.log('Added event condition:', eventCondition);
                    currentGroup.conditions.push(eventCondition);
                }
            } else {
                const attributeCondition = parseAttributeCondition(cleanedPart, nextId++);
                if (attributeCondition) {
                    console.log('Added attribute condition:', attributeCondition);
                    currentGroup.conditions.push(attributeCondition);
                }
            }
        });

        if (currentGroup.conditions.length > 0) {
            groups.push(currentGroup);
        }
    });

    return groups;
}

function parseEventCondition(condition: string, id: number): Condition | null {
    console.log('Parsing event condition:', condition);
    // Extract subquery content
    const subqueryMatch = condition.match(/EXISTS\s*\(\s*SELECT.*?FROM\s+(\w+).*?WHERE(.*?)(?:GROUP BY|$)/is);
    if (!subqueryMatch) {
        console.log('No subquery match found');
        return null;
    }

    const [, table, whereClause] = subqueryMatch;
    console.log('Event condition parts:', { table, whereClause });

    // Extract time period from WHERE clause if it exists
    const timeMatch = whereClause.match(/transaction_date\s*>=\s*NOW\(\)\s*-\s*INTERVAL\s*'(\d+)\s*(\w+)'/i);
    const timeValue = timeMatch ? parseInt(timeMatch[1]) : 30;
    const timePeriod = timeMatch ? timeMatch[2].toLowerCase() : 'days';

    // Extract frequency information from HAVING clause
    const havingMatch = condition.match(/HAVING\s+COUNT\(\*\)\s*(>=|=|<=)\s*(\d+)/i);
    const count = havingMatch ? parseInt(havingMatch[2]) : 1;

    const eventCondition: Condition = {
        id,
        type: 'event',
        columnKey: 'customer_id',
        relatedColKey: 'customer_id',
        eventType: 'performed',
        frequency: 'at_least',
        count,
        timePeriod,
        timeValue,
        operator: 'AND',
        attributeConditions: [],
        relatedConditions: []
    };

    console.log('Created event condition:', eventCondition);
    return eventCondition;
}

function parseAttributeCondition(condition: string, id: number): Condition | null {
    console.log('Parsing attribute condition:', condition);
    // Clean up the condition and remove table prefix if exists
    condition = condition.trim();

    // Handle BETWEEN operator
    if (condition.includes('BETWEEN')) {
        const match = condition.match(/(\w+)\.(\w+)\s+BETWEEN\s+'([^']+)'\s+AND\s+'([^']+)'/i);
        if (match) {
            const [, , field, value1, value2] = match;
            const result: Condition = {
                id,
                type: 'attribute',
                field,
                operator: 'between',
                value: value1,
                value2: value2
            };
            console.log('Created BETWEEN condition:', result);
            return result;
        }
    }

    // Handle regular operators
    const match = condition.match(/(\w+)\.(\w+)\s*=\s*'([^']+)'/);
    if (!match) {
        console.log('No regular operator match found');
        return null;
    }

    const [, , field, value] = match;
    const result: Condition = {
        id,
        type: 'attribute',
        field,
        operator: 'equals',
        value
    };
    console.log('Created attribute condition:', result);
    return result;
}


// Chat message interface
export interface ChatMessage {
    user: string
    ai?: string
}

export interface HistoryResult {
    version: string
    result: dataDetailResponse
}

export interface dataDetailResponse {
    query: string
    explanation: {
        query_intent: string
        key_conditions: string[]
    }
    filter_criteria: {
        conditions: any[]
        conditionGroups: any[]
        rootOperator: string
    }
}

// Response data interface
export interface ResponseData {
    success: boolean
    data: dataDetailResponse
}

// Customer data interface for the table
export interface CustomerData {
    customer_id: number,
    first_name: string,
    last_name: string,
    gender: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    birth_date: string,
    registration_date: string
}

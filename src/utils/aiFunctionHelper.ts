import { ChatMessage, dataDetailResponse, HistoryResult } from "@/types/aichat";

export const updateChatHistory = (
    newDataList: dataDetailResponse[],
    setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
    if (newDataList.length === 0) {
        setChatHistory([
            {
                user: "",
                ai: "Xin chào! Tôi là trợ lý AI của bạn. Tôi có thể giúp bạn tạo phân khúc khách hàng dựa trên dữ liệu của bạn. Bạn muốn phân khúc khách hàng như thế nào?",
            },
        ]);
        return;
    }

    setChatHistory((prevHistory) => {
        const existingUserQueries = new Set(prevHistory.map((msg) => msg.user));

        const newMessages: ChatMessage[] = newDataList
            .filter((data) => !existingUserQueries.has(data.query))
            .map((data) => ({
                user: data.query,
                ai: `📌 ${data.explanation.query_intent}\n${data.explanation.key_conditions.map(item => `• ${item}`).join("\n")}\n\n`,
            }));

        return [...prevHistory, ...newMessages];
    });
};

export const updateHistoryResult = (
    newDataList: dataDetailResponse[],
    setHistoryResult: React.Dispatch<React.SetStateAction<HistoryResult[]>>
) => {
    if (newDataList.length === 0) {
        setHistoryResult([]); // hoặc giữ nguyên nếu không muốn reset
        return;
    }

    setHistoryResult((prev) => {
        const existingQueries = new Set(prev.map((entry) => entry.result.query));
        const createVersion = [...prev];

        const newEntries: HistoryResult[] = newDataList
            .filter((data) => !existingQueries.has(data.query))
            .map((data, index) => ({
                version: `version ${createVersion.length + index + 1}`,
                result: data,
            }));

        return [...createVersion, ...newEntries];
    });
};

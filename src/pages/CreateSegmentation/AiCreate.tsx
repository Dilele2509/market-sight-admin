"use client"

import { useContext, useEffect, useState } from "react"
import { ChatInterface } from "@/components/blocks/AIChat/chat-interface"
import { PreviewPanel } from "@/components/blocks/AIChat/preview-panel"
import type { ChatMessage, dataDetailResponse, HistoryResult, ResponseData } from "@/types/aichat"
import { generateSQLPreview } from "@/utils/segmentFunctionHelper"
import { useSegmentData } from "@/context/SegmentDataContext"
import { useAiChatContext } from "@/context/AiChatContext"
import AuthContext from "@/context/AuthContext"
import { toast } from "sonner"
import { axiosPrivate } from "@/API/axios"
import { headers } from "next/headers"
import { updateChatHistory, updateHistoryResult } from "@/utils/aiFunctionHelper"

export default function AiCreate() {
    const [activeTab, setActiveTab] = useState("sql")
    const [isLoading, setIsLoading] = useState(false)
    const { token } = useContext(AuthContext);
    const [isModification, setIsModification] = useState(true)
    const { setResponseData, responseData, setInputMessage, chatHistory, setChatHistory, setHistoryResult } = useAiChatContext()

    const getHistoryConversation = async () => {
        try {
            await axiosPrivate.get('/segment/ai/history', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (res.status === 200) {
                        const dataHistoryConversation = res.data?.data[0]?.conversation?.history as dataDetailResponse[];
                        if (dataHistoryConversation.length > 0) {
                            const responseData: ResponseData = {
                                success: true,
                                data: dataHistoryConversation[dataHistoryConversation.length - 1]
                            };
                            // Only update chat history if it's empty
                            if (chatHistory.length <= 1) {  // 1 because of initial greeting message
                                updateChatHistory(dataHistoryConversation, setChatHistory);
                                updateHistoryResult(dataHistoryConversation, setHistoryResult);
                            }
                        }
                    }
                })
        } catch (error) {
            toast.error("Có lỗi xảy ra: ", error.message)
        }
    }

    const setDefaultForResponse = async () => {
        try {
            await axiosPrivate.get('/segment/ai/history', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((res) => {
                    if (res.status === 200) {
                        const dataHistoryConversation = res.data?.data[0]?.conversation?.history as dataDetailResponse[];
                        if (dataHistoryConversation.length > 0) {
                            const responseData: ResponseData = {
                                success: true,
                                data: dataHistoryConversation[dataHistoryConversation.length - 1]
                            };
                            setResponseData(responseData);
                        }
                    }
                })
        } catch (error) {
            toast.error("Có lỗi xảy ra: ", error.message)
        }
    }
    useEffect(() => {
        console.log('responseData changed:', responseData);
        if (responseData) {  // Only call if responseData exists
            getHistoryConversation();
        }
    }, [responseData, token]); // Add token as dependency since it's used in getHistoryConversation

    useEffect(() => {
        setDefaultForResponse()
    }, [])

    const handleSendMessage = async (message: string) => {
        if (!message.trim()) return;

        // Add user message to chat history
        const newMessage: ChatMessage = { user: message };
        setChatHistory(prev => [...prev, newMessage]);

        setIsLoading(true);

        try {
            const res = await axiosPrivate.post('/segment/nlp/chatbot', { nlpQuery: message, isModification: isModification }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200 && res.data?.success) {
                const dataRes: ResponseData = res.data;
                console.log('Previous responseData:', responseData);
                console.log('New responseData:', dataRes);

                // Update response data with a new reference
                setResponseData(prevData => {
                    if (JSON.stringify(prevData) === JSON.stringify(dataRes)) {
                        // If the data is the same, create a new reference to force update
                        return { ...dataRes };
                    }
                    return dataRes;
                });

                // Add AI response to chat history immediately
                if (dataRes.data) {
                    const aiMessage: ChatMessage = {
                        user: message,
                        ai: `📌 ${dataRes.data.explanation.query_intent}\n${dataRes.data.explanation.key_conditions.map(item => `• ${item}`).join("\n")}\n\n`
                    };
                    setChatHistory(prev => [...prev.slice(0, -1), aiMessage]);

                    // Update history result with new version
                    setHistoryResult(prev => {
                        const newVersion = `version ${prev.length + 1}`;
                        return [...prev, {
                            version: newVersion,
                            result: dataRes.data
                        }];
                    });
                }

                const filter = dataRes?.data?.filter_criteria;
                if (filter) {
                    toast.success('AI response success');
                }
            } else if (res.status === 200 && !res.data.success) {
                const dataRes: ResponseData = res.data;
                console.log('New responseData:', dataRes);
                if (dataRes.data) {
                    const aiMessage: ChatMessage = {
                        user: message,
                        ai: `📌 ${dataRes.data.explanation.query_intent}\n${dataRes.data.explanation.key_conditions.map(item => `• ${item}`).join("\n")}\n\n`
                    };
                    setChatHistory(prev => [...prev.slice(0, -1), aiMessage]);
                }
            }
        } catch (err: any) {
            const message = err?.message || 'Không xác định được lỗi';
            toast.error(`Có lỗi xảy ra với AI: ${message}`);
        } finally {
            setIsLoading(false);
            setIsModification(true);
            setInputMessage("")
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-2rem)] gap-2 bg-background from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
            <ChatInterface chatHistory={chatHistory} isLoading={isLoading} onSendMessage={handleSendMessage} setIsModification={setIsModification} />
            <PreviewPanel
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isLoading={isLoading}
                responseData={responseData}
            />
        </div>
    )
}

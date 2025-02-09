'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComboboxForm } from "@/components/input-crypto";
import { TextareaWithButton } from "./text-box";
import { useState } from "react";


export function OptionTab(){
    const [activeTab, setActiveTab] = useState("ai") // Active tab state
    const [aiResponse, setAiResponse] = useState<{ inputToken: string; outputToken: string; amount: number } | null>(null);

    // useEffect(() => {
    //     if (aiResponse) {
    //       setActiveTab("manual"); // Switch to the "manual" tab when there is an AI response
    //     }
    //   }, [aiResponse]);

    const handleAiResponse = (response: { inputToken: string; outputToken: string; amount: number; slippage?: number }) => {
        setAiResponse(response);  // Set AI response
        setActiveTab("manual");   // Switch to manual tab
    };

    return (
        <div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}  defaultValue="account" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ai">AI</TabsTrigger>
                    <TabsTrigger value="manual">Manual</TabsTrigger>
                </TabsList>
                <TabsContent value="ai">
                    <TextareaWithButton onAiResponse={handleAiResponse} />
                </TabsContent>
                <TabsContent value="manual">
                    <ComboboxForm aiResponse={aiResponse} />
                </TabsContent>
            </Tabs>

            
        </div>
    )
}
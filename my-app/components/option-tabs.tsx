'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComboboxForm } from "@/components/input-crypto";
import { TextareaWithButton } from "./text-box";
import { useState } from "react";


export function OptionTab(){
    const [activeTab, setActiveTab] = useState("ai") // Active tab state

    return (
        <div>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}  defaultValue="account" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ai">AI</TabsTrigger>
                    <TabsTrigger value="manual">Manual</TabsTrigger>
                </TabsList>
                <TabsContent value="ai">
                    <TextareaWithButton></TextareaWithButton>
                </TabsContent>
                <TabsContent value="manual">
                    <ComboboxForm></ComboboxForm>
                </TabsContent>
            </Tabs>

            
        </div>
    )
}
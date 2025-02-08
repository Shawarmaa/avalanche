import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComboboxForm } from "@/components/input-crypto";
import { TextareaWithButton } from "./text-box";



export function OptionTab(){
    return (
        <div>
            <Tabs defaultValue="account" className="w-[400px]">
                <TabsList>
                    <TabsTrigger value="ai">Account</TabsTrigger>
                    <TabsTrigger value="manual">Password</TabsTrigger>
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
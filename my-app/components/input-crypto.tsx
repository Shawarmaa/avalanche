"use client"
import React, { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { getTradeQuote, executeQuotedTrade } from "@/lib/trader_joe" // Import functions

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Chart from "./chart"


const source = [
    { label: "AVAX", value: "AVAX" },
    { label: "wBTC", value: "wBTC" },
    { label: "wETH", value: "wETH" },
    { label: "MATIC", value: "MATIC" },
    { label: "SOL", value: "SOL" },
    { label: "USDC", value: "USDC" },
    { label: "USDT", value: "USDT" },
    { label: "USDC.e", value: "USDC.e" },
    { label: "FRAX", value: "FRAX" },
    { label: "sAVAX", value: "sAVAX" },
    { label: "yyAVAX", value: "yyAVAX" },
    { label: "BTC.b", value: "BTC.b" },
    { label: "GMX", value: "GMX" },
    { label: "JOE", value: "JOE" }
  ] as const;



const FormSchema = z.object({
  inputToken: z.string({ required_error: "Please select an input token." }),
  outputToken: z.string({ required_error: "Please select an output token." }),
  amount: z
    .number({ required_error: "Please enter an amount." })
    .positive("Amount must be greater than zero."),
})


interface ComboboxFormProps {
    aiResponse: { tokenIn: string; tokenOut: string; amount: number } | null;
}


export function ComboboxForm({ aiResponse }: ComboboxFormProps) {
    console.log("11111")
    const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { inputToken: "", outputToken: "", amount: 0 },
    
  })

  useEffect(() => {
    if (aiResponse) {
        console.log(aiResponse)
      form.reset({
        inputToken: aiResponse.tokenIn, // Map tokenIn to inputToken
        outputToken: aiResponse.tokenOut, // Map tokenOut
        amount: Number(aiResponse.amount),
      });
    }
  }, [aiResponse, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("Form data:", data);
    setSubmittedData(data); // Store submitted form data

    const quote = await getTradeQuote({
        tokenIn: data.inputToken,
        tokenOut: data.outputToken,
        amount: data.amount.toString(),
        slippage: 0.1,
      });
      const route = quote.route;
      setTradeRoute(route)
      console.log("Trade Route:", route);
      console.log("Trade Quote:", quote);
  
    const tradeResult = await executeQuotedTrade(quote);
    console.log("Trade Result:",tradeResult);
  };

  const [submittedData, setSubmittedData] = React.useState<z.infer<typeof FormSchema> | null>(null);
  const [inputOpen, setInputOpen] = React.useState(false)
  const [outputOpen, setOutputOpen] = React.useState(false)
  const [tradeRoute, setTradeRoute] = React.useState<string[] | null>(null);

  return (
    <div className="flex flex-col ">

        {submittedData && (
        <div className="m-6 w-full">
            <Chart
            inputToken={submittedData.inputToken}
            targetToken={submittedData.outputToken}
            amount={String(submittedData.amount)}
            />
        </div>
        )}

        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="inputToken"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Source Token</FormLabel>
                <Popover open={inputOpen} onOpenChange={setInputOpen}>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            " justify-between",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value
                            ? source.find(
                                (source) => source.value === field.value
                            )?.label
                            : "Select source"}
                        <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className=" p-0" >
                    <Command>
                        <CommandInput
                        placeholder="Search framework..."
                        className="h-9"
                        />
                        <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {source.map((source) => (
                            <CommandItem
                                value={source.label}
                                key={source.value}
                                onSelect={() => {
                                form.setValue("inputToken", source.value)
                                setInputOpen(false)
                                }}
                            >
                                {source.label}
                                <Check
                                className={cn(
                                    "ml-auto",
                                    source.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                                />
                            </CommandItem>
                            ))}
                        </CommandGroup>
                        </CommandList>
                    </Command>
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="outputToken"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Target Token</FormLabel>
                <Popover open={outputOpen} onOpenChange={setOutputOpen}>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            " justify-between",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value
                            ? source.find(
                                (source) => source.value === field.value
                            )?.label
                            : "Select token"}
                        <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className=" p-0">
                    <Command>
                        <CommandInput
                        placeholder="Search framework..."
                        className="h-9"
                        />
                        <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {source.map((source) => (
                            <CommandItem
                                value={source.label}
                                key={source.value}
                                onSelect={() => {
                                form.setValue("outputToken", source.value)
                                setOutputOpen(false)
                                }}
                            >
                                {source.label}
                                <Check
                                className={cn(
                                    "ml-auto",
                                    source.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                                />
                            </CommandItem>
                            ))}
                        </CommandGroup>
                        </CommandList>
                    </Command>
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )}
            />
           <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Amount</FormLabel>
                <FormControl>
                    <input
                    type="number"
                    placeholder="Enter amount"
                    className={cn(
                        "block w-full rounded-md border bg-white px-4 py-2 text-left shadow-sm focus:border-black focus:ring focus:ring-black/20 sm:text-sm",
                        field.value === 0 && "text-muted-foreground" // Add conditional class for placeholder styling
                    )}
                    {...field}
                    value={field.value === 0 ? "" : field.value} // Show empty string instead of 0
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)} // Convert back to 0 when empty
                    min={0}
                    step={0.01}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <Button type="submit" className="w-full">Submit</Button>
        </form>
        </Form>

        {tradeRoute && (
        <div className="mt-6 rounded-md border border-border bg-background p-4 shadow-sm">
            <h3 className="text-base font-medium text-foreground mb-3">Best Trade Route</h3>
            <div className="flex items-center space-x-1">
            {tradeRoute.map((token, index) => (
                <React.Fragment key={index}>
                <span className="rounded-md border border-border bg-muted px-2 py-1 text-sm text-foreground">
                    {token}
                </span>
                {index < tradeRoute.length - 1 && <span className="text-muted-foreground">→</span>}
                </React.Fragment>
            ))}
            </div>
        </div>
        )}

    


    </div>
  )
}

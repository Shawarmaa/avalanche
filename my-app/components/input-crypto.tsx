"use client"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
  { label: "FLR", value: "FLR" },
  { label: "SGB", value: "SGB" },
  { label: "BTC", value: "BTC" },
  { label: "XRP", value: "XRP" },
  { label: "LTC", value: "LTC" },
  { label: "XLM", value: "XLM" },
  { label: "DOGE", value: "DOGE" },
  { label: "ADA", value: "ADA" },
  { label: "ALGO", value: "ALGO" },
  { label: "ETH", value: "ETH" },
  { label: "FIL", value: "FIL" },
  { label: "ARB", value: "ARB" },
  { label: "AVAX", value: "AVAX" },
  { label: "BNB", value: "BNB" },
  { label: "POL", value: "POL" },
  { label: "SOL", value: "SOL" },
  { label: "USDC", value: "USDC" },
  { label: "USDT", value: "USDT" },
  { label: "XDC", value: "XDC" },
  { label: "TRX", value: "TRX" },
  { label: "LINK", value: "LINK" },
  { label: "ATOM", value: "ATOM" },
  { label: "DOT", value: "DOT" },
  { label: "TON", value: "TON" },
  { label: "ICP", value: "ICP" },
  { label: "SHIB", value: "SHIB" },
  { label: "DAI", value: "DAI" },
  { label: "BCH", value: "BCH" },
  { label: "NEAR", value: "NEAR" },
  { label: "LEO", value: "LEO" },
  { label: "UNI", value: "UNI" },
  { label: "ETC", value: "ETC" },
  { label: "WIF", value: "WIF" },
  { label: "BONK", value: "BONK" },
  { label: "JUP", value: "JUP" },
  { label: "ETHFI", value: "ETHFI" },
  { label: "ENA", value: "ENA" },
  { label: "PYTH", value: "PYTH" },
  { label: "HNT", value: "HNT" },
  { label: "SUI", value: "SUI" },
  { label: "PEPE", value: "PEPE" },
  { label: "QNT", value: "QNT" },
  { label: "AAVE", value: "AAVE" },
  { label: "FTM", value: "FTM" },
  { label: "ONDO", value: "ONDO" },
  { label: "TAO", value: "TAO" },
  { label: "FET", value: "FET" },
  { label: "RENDER", value: "RENDER" },
  { label: "NOT", value: "NOT" },
  { label: "RUNE", value: "RUNE" },
  { label: "TRUMP", value: "TRUMP" }
] as const;

// const source = [
//     { label: "Avalanche", value: "AVAX" },
//     { label: "ETH", value: "ETH" },
//     { label: "Polygon", value: "POL" },
//     { label: "Solana", value: "SOL" },
//     { label: "Arbitrum", value: "ARB" },
//     { label: "Optimism", value: "OP" },
//   ] as const;


const FormSchema = z.object({
  inputToken: z.string({ required_error: "Please select an input token." }),
  outputToken: z.string({ required_error: "Please select an output token." }),
  amount: z
    .number({ required_error: "Please enter an amount." })
    .positive("Amount must be greater than zero."),
})

   


export function ComboboxForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {amount : 0}
    
  })


  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log("Form data:", data);
    setSubmittedData(data); // Store submitted form data
  };

  const [submittedData, setSubmittedData] = React.useState<z.infer<typeof FormSchema> | null>(null);
  const [inputOpen, setInputOpen] = React.useState(false)
  const [outputOpen, setOutputOpen] = React.useState(false)

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

    


    </div>
  )
}

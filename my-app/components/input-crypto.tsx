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
  FormDescription,
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

const tokens = [
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

const FormSchema = z.object({
  inputToken: z.string({ required_error: "Please select an input token." }),
  outputToken: z.string({ required_error: "Please select an output token." }),
})

   


export function ComboboxForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    
    console.log(data)
  }

  const [inputOpen, setInputOpen] = React.useState(false)
  const [outputOpen, setOutputOpen] = React.useState(false)

  return (
    <div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="inputToken"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <FormLabel>Tokens</FormLabel>
                <Popover open={inputOpen} onOpenChange={setInputOpen}>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value
                            ? tokens.find(
                                (token) => token.value === field.value
                            )?.label
                            : "Select token"}
                        <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput
                        placeholder="Search framework..."
                        className="h-9"
                        />
                        <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {tokens.map((token) => (
                            <CommandItem
                                value={token.label}
                                key={token.value}
                                onSelect={() => {
                                form.setValue("inputToken", token.value)
                                setInputOpen(false)
                                }}
                            >
                                {token.label}
                                <Check
                                className={cn(
                                    "ml-auto",
                                    token.value === field.value
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
                <FormDescription>
                    This is the token that will be used as the input.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="outputToken"
            render={({ field }) => (
                <FormItem className="flex flex-col">
                <Popover open={outputOpen} onOpenChange={setOutputOpen}>
                    <PopoverTrigger asChild>
                    <FormControl>
                        <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                        )}
                        >
                        {field.value
                            ? tokens.find(
                                (token) => token.value === field.value
                            )?.label
                            : "Select token"}
                        <ChevronsUpDown className="opacity-50" />
                        </Button>
                    </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput
                        placeholder="Search framework..."
                        className="h-9"
                        />
                        <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {tokens.map((token) => (
                            <CommandItem
                                value={token.label}
                                key={token.value}
                                onSelect={() => {
                                form.setValue("outputToken", token.value)
                                setOutputOpen(false)
                                }}
                            >
                                {token.label}
                                <Check
                                className={cn(
                                    "ml-auto",
                                    token.value === field.value
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
                <FormDescription>
                    This is the token that will be used as the output.
                </FormDescription>
                <FormMessage />
                </FormItem>
            )}
            />
            
            <Button type="submit">Submit</Button>
        </form>
        </Form>

    


    </div>
  )
}

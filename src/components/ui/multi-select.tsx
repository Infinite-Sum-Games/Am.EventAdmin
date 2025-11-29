"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export function MultiSelect({
    data,
    name,
    selected,
    setSelected,
}: {
    data: {
        value: string;
        label: string;
    }[];
    name: string;
    selected: string[];
    setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}) {
    const [open, setOpen] = React.useState(false);

    const handleSetValue = (val: string) => {
        if (selected.includes(val)) {
            selected.splice(selected.indexOf(val), 1);
            setSelected(selected.filter((item) => item !== val));
        } else {
            setSelected((prevValue) => [...prevValue, val]);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-fit justify-between px-1 bg-transparent"
                >
                    <div className="flex flex-wrap gap-1 justify-start items-center">
                        {selected?.length ? (
                            selected.map((val, i) => (
                                <div
                                    key={i}
                                    className="px-2 py-1 rounded-xl border bg-background text-xs font-medium"
                                >
                                    {
                                        data.find((item) => item.value === val)
                                            ?.label
                                    }
                                </div>
                            ))
                        ) : (
                            <p className="px-1">{`Select ${name}...`}</p>
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder={`Search ${name}...`} />
                    <CommandEmpty>No items found.</CommandEmpty>
                    <CommandList>
                        <CommandGroup>
                            <CommandList>
                                {data.map((item) => (
                                    <CommandItem
                                        key={item.value}
                                        value={item.value}
                                        onSelect={() => {
                                            handleSetValue(item.value);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selected.includes(item.value)
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                            )}
                                        />
                                        {item.label}
                                    </CommandItem>
                                ))}
                            </CommandList>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

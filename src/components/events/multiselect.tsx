import { Label } from "@/components/ui/label";

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
import { ChevronsUpDown } from "lucide-react";
export function MultiSelectBlock<T extends { id: string }>({
  label,
  items,
  selected,
  onChange,
  getLabel,
}: {
  label: string;
  items: T[];
  selected: string[];
  onChange: (ids: string[]) => void;
  getLabel: (item: T) => string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={`select-${label}`} className="font-medium">
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={`select-${label}`}
            variant="outline"
            role="combobox"
            className="w-full justify-between bg-background hover:bg-muted/50 h-auto py-2.5"
          >
            <span className="truncate text-left text-sm flex-1">
              {selected.length
                ? items
                    .filter((i) => selected.includes(i.id))
                    .map(getLabel)
                    .join(", ")
                : `Select ${label.toLowerCase()}...`}
            </span>
            <ChevronsUpDown className="ml-2 opacity-50 shrink-0 h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {items.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() =>
                      onChange(
                        selected.includes(item.id)
                          ? selected.filter((id) => id !== item.id)
                          : [...selected, item.id]
                      )
                    }
                  >
                    <span>{getLabel(item)}</span>
                    {selected.includes(item.id) && (
                      <span className="ml-auto">✔️</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

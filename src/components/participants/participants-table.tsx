import { useState, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { participantsColumns } from "./participants-table-columns";
import type { Participant } from "@/types/participants";

const searchFields = [
  { value: "student_name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "college", label: "College" },
  { value: "city", label: "City" },
  { value: "phone_number", label: "Phone" },
  { value: "team_name", label: "Team" },
];

interface ParticipantsTableProps {
  data: Participant[];
  loading?: boolean;
  onSortChange?: (column: keyof Participant, direction: "asc" | "desc") => void;
  sortColumn?: keyof Participant | null;
  sortDirection?: "asc" | "desc";
  onRowClick?: (participant: Participant) => void;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  className?: string;
  defaultPageSize?: number;
}

export function ParticipantsTable({
  data,
  loading = false,
  onSortChange,
  sortColumn,
  sortDirection,
  onRowClick,
  selectedIds = [],
  onSelectionChange,
  className,
  defaultPageSize = 25,
}: ParticipantsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("student_name");
  const [columnVisibility, setColumnVisibility] = useState(() => {
    const defaults: Record<string, boolean> = {};
    participantsColumns.forEach((col) => {
      defaults[col.key] = !col.hideOnMobile;
    });
    return defaults;
  });
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });

  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys: [searchField],
        threshold: 0.3,
        includeScore: true,
      }),
    [data, searchField]
  );

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return fuse.search(searchQuery).map((result) => result.item);
  }, [data, searchField, searchQuery, fuse]);

  const visibleColumns = useMemo(() => {
    return participantsColumns.filter((col) => columnVisibility[col.key]);
  }, [columnVisibility]);

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let comparison = 0;
      if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal);
      } else {
        comparison = (aVal as any) > (bVal as any) ? 1 : -1;
      }

      return sortDirection === "desc" ? -comparison : comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const pageCount = useMemo(() => {
    return Math.ceil(filteredData.length / pagination.pageSize);
  }, [filteredData.length, pagination.pageSize]);

  const paginatedData = useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination.pageIndex, pagination.pageSize]);

  const handleSort = (column: keyof Participant) => {
    if (!onSortChange) return;

    const newDirection =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    onSortChange(column, newDirection);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPagination((prev) => ({...prev, pageIndex: 0}));
  };
  
  const handleSearchFieldChange = (value: string) => {
    setSearchField(value);
    setPagination((prev) => ({...prev, pageIndex: 0}));
  }

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;

    const selectableIds = sortedData.map((p) => p.email);
    onSelectionChange(checked ? selectableIds : []);
  };

  const handleSelectRow = (participant: Participant, checked: boolean) => {
    if (!onSelectionChange) return;

    const id = participant.email;
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const allSelected =
    sortedData.length > 0 &&
    sortedData.every((p) => selectedIds.includes(p.email));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Select value={searchField} onValueChange={handleSearchFieldChange}>
            <SelectTrigger className="w-[140px] bg-background">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                <SelectValue placeholder="Field" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {searchFields.map((field) => (
                <SelectItem key={field.value} value={field.value}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search by ${
                searchFields.find((f) => f.value === searchField)?.label || "Name"
              }...`}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 bg-background"
            />
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto hidden h-9 lg:flex"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {participantsColumns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.key}
                className="capitalize"
                checked={columnVisibility[column.key]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    [column.key]: !!value,
                  }))
                }
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table className={className}>
          <TableHeader>
            <TableRow>
              {onSelectionChange && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
              )}
              {visibleColumns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.width ? `w-[${column.width}]` : ""}
                >
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 px-2 font-semibold w-full flex items-center ${
                        column.align === "center"
                          ? "justify-center"
                          : column.align === "right"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                      onClick={() => handleSort(column.key as keyof Participant)}
                    >
                      {column.label}
                      {sortColumn === column.key &&
                        (sortDirection === "asc" ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        ))}
                    </Button>
                  ) : (
                    <div
                      className={`px-2 font-semibold flex items-center ${
                        column.align === "center"
                          ? "justify-center"
                          : column.align === "right"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {column.label}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  {onSelectionChange && (
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  )}
                  {visibleColumns.map((column) => (
                    <TableCell key={column.key}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumns.length + (onSelectionChange ? 1 : 0)}
                  className="h-24 text-center"
                >
                  {searchQuery ? (
                    <div>
                      <p className="text-lg font-medium">No participants found</p>
                      <p className="text-sm text-muted-foreground">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-medium">No participants</p>
                      <p className="text-sm text-muted-foreground">
                        No participants have been registered yet
                      </p>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((participant) => (
                <TableRow
                  key={participant.email}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onRowClick?.(participant)}
                >
                  {onSelectionChange && (
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(participant.email)}
                        onCheckedChange={(checked) =>
                          handleSelectRow(participant, !!checked)
                        }
                        aria-label="Select row"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                  )}
                  {visibleColumns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render(participant, 0)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-6 lg:space-x-8">
          {/* Rows per page dropdown */}
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(value),
                  pageIndex: 0,
                }));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            {onSelectionChange &&
              `${selectedIds.length} of ${filteredData.length} row(s) selected.`}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* First & Previous buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => setPagination((prev) => ({ ...prev, pageIndex: 0 }))}
              disabled={pagination.pageIndex === 0}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex - 1,
                }))
              }
              disabled={pagination.pageIndex === 0}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {pageCount > 0 ? pagination.pageIndex + 1 : 0} of {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex + 1,
                }))
              }
              disabled={pagination.pageIndex >= pageCount - 1}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: Math.max(0, pageCount - 1),
                }))
              }
              disabled={pagination.pageIndex >= pageCount - 1}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

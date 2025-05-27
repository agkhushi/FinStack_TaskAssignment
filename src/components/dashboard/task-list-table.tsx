
"use client";

import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task, TaskStatus, taskTypeOptions, TaskType } from "@/lib/schemas";
import {
  ArrowUpDown,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  Filter,
  ArrowUp,
  ArrowDown,
  CalendarIcon,
  Phone,
  Mail,
  Users,
  Reply,
  Bell,
  ClipboardList,
  XIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TaskListTableProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
}

type SortableColumn = keyof Pick<Task, "date_created" | "entity_name" | "task_type" | "status">;

const taskTypeIconMap: Record<TaskType, React.ElementType> = {
  "Call": Phone,
  "Email": Mail,
  "Meeting": Users,
  "Follow-up": Reply,
  "Reminder": Bell,
  "Other": ClipboardList,
};

interface FiltersState {
  date: Date | null;
  entity_name: string;
  task_type: TaskType | "all";
  contact_person: string;
  status: TaskStatus | "all";
}

export function TaskListTable({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
}: TaskListTableProps) {
  const [filters, setFilters] = useState<FiltersState>({
    date: null,
    entity_name: "",
    task_type: "all",
    contact_person: "",
    status: "all",
  });

  const [sortConfig, setSortConfig] = useState<{
    key: SortableColumn;
    direction: "ascending" | "descending";
  } | null>({ key: "date_created", direction: "descending" });

  const handleFilterChange = (filterName: keyof FiltersState, value: string | Date | null) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const clearFilter = (filterName: keyof FiltersState) => {
    let defaultValue: string | Date | null = null;
    if (filterName === 'task_type' || filterName === 'status') {
      defaultValue = 'all';
    } else if (typeof filters[filterName] === 'string') {
      defaultValue = '';
    }
    handleFilterChange(filterName, defaultValue);
  };

  const requestSort = (key: SortableColumn) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  
  const SortIndicator = ({ columnKey }: { columnKey: SortableColumn }) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
    }
    return sortConfig.direction === 'ascending' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  };


  const filteredAndSortedTasks = useMemo(() => {
    let sortableTasks = [...tasks];

    // Filtering
    sortableTasks = sortableTasks.filter((task) => {
      const filterDate = filters.date ? format(filters.date, "yyyy-MM-dd") : null;
      const taskDate = format(new Date(task.date_created), "yyyy-MM-dd");

      return (
        (!filterDate || taskDate === filterDate) &&
        task.entity_name.toLowerCase().includes(filters.entity_name.toLowerCase()) &&
        (filters.task_type === "all" || task.task_type === filters.task_type) &&
        task.contact_person.toLowerCase().includes(filters.contact_person.toLowerCase()) &&
        (filters.status === "all" || task.status === filters.status)
      );
    });

    // Sorting
    if (sortConfig !== null) {
      sortableTasks.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];

        let comparison = 0;
        if (sortConfig.key === "date_created") {
          comparison = new Date(valA).getTime() - new Date(valB).getTime();
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          comparison = valA.localeCompare(valB);
        } else if (valA > valB) {
          comparison = 1;
        } else if (valA < valB) {
          comparison = -1;
        }
        
        return sortConfig.direction === "ascending" ? comparison : comparison * -1;
      });
    }

    return sortableTasks;
  }, [tasks, filters, sortConfig]);
  
  const activeFilterItems = useMemo(() => {
    const items = [];
    if (filters.date) {
      items.push({ name: "Date", value: format(filters.date, "PPP"), key: "date" as keyof FiltersState });
    }
    if (filters.entity_name) {
      items.push({ name: "Entity", value: filters.entity_name, key: "entity_name" as keyof FiltersState });
    }
    if (filters.task_type !== "all") {
      const typeLabel = taskTypeOptions.find(opt => opt.value === filters.task_type)?.label || filters.task_type;
      items.push({ name: "Type", value: typeLabel, key: "task_type" as keyof FiltersState });
    }
    if (filters.contact_person) {
      items.push({ name: "Contact", value: filters.contact_person, key: "contact_person" as keyof FiltersState });
    }
    if (filters.status !== "all") {
      items.push({ name: "Status", value: filters.status, key: "status" as keyof FiltersState });
    }
    return items;
  }, [filters]);

  return (
    <Card className="shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="border-b p-4 bg-card">
        <CardTitle className="text-xl font-semibold flex items-center text-primary">
            <Filter className="mr-2 h-5 w-5" /> Filters & Sorting
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 border rounded-lg bg-background shadow-sm">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal h-10",
                  !filters.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.date ? format(filters.date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.date}
                onSelect={(date) => handleFilterChange("date", date || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Input
            placeholder="Entity Name"
            value={filters.entity_name}
            onChange={(e) => handleFilterChange("entity_name", e.target.value)}
            className="h-10"
          />
           <Select
            value={filters.task_type}
            onValueChange={(value) => handleFilterChange("task_type", value as TaskType | "all")}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Task Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {taskTypeOptions.map((option) => {
                const Icon = taskTypeIconMap[option.value as TaskType];
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      {Icon && <Icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Input
            placeholder="Contact Person"
            value={filters.contact_person}
            onChange={(e) => handleFilterChange("contact_person", e.target.value)}
            className="h-10"
          />
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value as TaskStatus | "all")}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {activeFilterItems.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-muted/50 shadow-inner">
            <span className="text-sm font-medium text-muted-foreground self-center mr-2">Active Filters:</span>
            {activeFilterItems.map(filter => (
              <Badge key={filter.key} variant="secondary" className="py-1 px-2 text-sm shadow-sm">
                <span className="font-semibold mr-1">{filter.name}:</span> {filter.value}
                <button
                  type="button"
                  onClick={() => clearFilter(filter.key)}
                  className="ml-1.5 p-0.5 rounded-full hover:bg-muted-foreground/20"
                  aria-label={`Clear ${filter.name} filter`}
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="overflow-x-auto rounded-md border shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead onClick={() => requestSort("date_created")} className="cursor-pointer hover:bg-muted/80 transition-colors p-3">
                  <div className="flex items-center font-semibold">Date Created <SortIndicator columnKey="date_created" /></div>
                </TableHead>
                <TableHead onClick={() => requestSort("entity_name")} className="cursor-pointer hover:bg-muted/80 transition-colors p-3">
                  <div className="flex items-center font-semibold">Entity Name <SortIndicator columnKey="entity_name" /></div>
                </TableHead>
                <TableHead onClick={() => requestSort("task_type")} className="cursor-pointer hover:bg-muted/80 transition-colors p-3">
                  <div className="flex items-center font-semibold">Task Type <SortIndicator columnKey="task_type" /></div>
                </TableHead>
                <TableHead className="p-3 font-semibold">Task Time</TableHead>
                <TableHead className="p-3 font-semibold">Contact Person</TableHead>
                <TableHead onClick={() => requestSort("status")} className="cursor-pointer hover:bg-muted/80 transition-colors p-3">
                   <div className="flex items-center font-semibold">Status <SortIndicator columnKey="status" /></div>
                </TableHead>
                <TableHead className="p-3 font-semibold">Tags</TableHead>
                <TableHead className="text-right p-3 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTasks.length > 0 ? (
                filteredAndSortedTasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="p-3">{format(new Date(task.date_created), "MMM d, yyyy")}</TableCell>
                    <TableCell className="font-medium p-3">{task.entity_name}</TableCell>
                    <TableCell className="p-3">
                      <div className="flex items-center">
                        {React.createElement(taskTypeIconMap[task.task_type as TaskType] || ClipboardList, { className: "mr-2 h-4 w-4 text-muted-foreground" })}
                        {task.task_type}
                      </div>
                    </TableCell>
                    <TableCell className="p-3">{task.task_time}</TableCell>
                    <TableCell className="p-3">{task.contact_person}</TableCell>
                    <TableCell className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleStatus(task.id)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-muted"
                        aria-label={`Toggle status for ${task.entity_name}, current status ${task.status}`}
                      >
                        {task.status === "open" ? (
                          <Circle className="h-3.5 w-3.5 text-green-600 fill-green-600" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 text-red-600" />
                        )}
                        <span className="capitalize text-sm font-medium">{task.status}</span>
                      </Button>
                    </TableCell>
                    <TableCell className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {task.tags.slice(0,3).map((tag) => ( 
                          <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5 shadow-sm rounded-md">{tag}</Badge>
                        ))}
                        {task.tags.length > 3 && <Badge variant="outline" className="text-xs px-1.5 py-0.5 shadow-sm rounded-md">+{task.tags.length - 3}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-1 p-3">
                      <Button variant="outline" size="icon" onClick={() => onEditTask(task)} className="h-8 w-8 hover:bg-accent hover:text-accent-foreground rounded-md border-border" aria-label={`Edit task ${task.entity_name}`}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => onDeleteTask(task.id)} className="h-8 w-8 rounded-md" aria-label={`Delete task ${task.entity_name}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground p-3">
                    No tasks found. Try adjusting your filters or creating a new task!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

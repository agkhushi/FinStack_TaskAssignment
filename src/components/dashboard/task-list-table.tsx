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
import { Task, TaskStatus } from "@/lib/schemas";
import {
  ArrowUpDown,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
  Filter,
  ArrowUp,
  ArrowDown
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

interface TaskListTableProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
}

type SortableColumn = keyof Pick<Task, "date_created" | "entity_name" | "task_type" | "status">;

export function TaskListTable({
  tasks,
  onEditTask,
  onDeleteTask,
  onToggleStatus,
}: TaskListTableProps) {
  const [filters, setFilters] = useState({
    date: null as Date | null,
    entity_name: "",
    task_type: "",
    contact_person: "",
    status: "all",
  });

  const [sortConfig, setSortConfig] = useState<{
    key: SortableColumn;
    direction: "ascending" | "descending";
  } | null>({ key: "date_created", direction: "descending" });

  const handleFilterChange = (filterName: keyof typeof filters, value: string | Date | null) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
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
        task.task_type.toLowerCase().includes(filters.task_type.toLowerCase()) &&
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
        if (typeof valA === 'string' && typeof valB === 'string') {
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

  return (
    <Card className="shadow-lg rounded-xl">
      <CardHeader className="border-b p-4">
        <CardTitle className="text-xl font-semibold flex items-center">
            <Filter className="mr-2 h-5 w-5 text-primary" /> Filters & Sorting
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 p-4 border rounded-lg bg-card shadow">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full justify-start text-left font-normal">
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
          <Input
            placeholder="Task Type"
            value={filters.task_type}
            onChange={(e) => handleFilterChange("task_type", e.target.value)}
            className="h-10"
          />
          <Input
            placeholder="Contact Person"
            value={filters.contact_person}
            onChange={(e) => handleFilterChange("contact_person", e.target.value)}
            className="h-10"
          />
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
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

        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead onClick={() => requestSort("date_created")} className="cursor-pointer hover:bg-muted transition-colors">
                  <div className="flex items-center">Date Created <SortIndicator columnKey="date_created" /></div>
                </TableHead>
                <TableHead onClick={() => requestSort("entity_name")} className="cursor-pointer hover:bg-muted transition-colors">
                  <div className="flex items-center">Entity Name <SortIndicator columnKey="entity_name" /></div>
                </TableHead>
                <TableHead onClick={() => requestSort("task_type")} className="cursor-pointer hover:bg-muted transition-colors">
                  <div className="flex items-center">Task Type <SortIndicator columnKey="task_type" /></div>
                </TableHead>
                <TableHead>Task Time</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead onClick={() => requestSort("status")} className="cursor-pointer hover:bg-muted transition-colors">
                   <div className="flex items-center">Status <SortIndicator columnKey="status" /></div>
                </TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedTasks.length > 0 ? (
                filteredAndSortedTasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>{format(new Date(task.date_created), "MMM d, yyyy")}</TableCell>
                    <TableCell className="font-medium">{task.entity_name}</TableCell>
                    <TableCell>{task.task_type}</TableCell>
                    <TableCell>{task.task_time}</TableCell>
                    <TableCell>{task.contact_person}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onToggleStatus(task.id)}
                        className="flex items-center gap-1 px-2 py-1"
                        aria-label={`Toggle status for ${task.entity_name}, current status ${task.status}`}
                      >
                        {task.status === "open" ? (
                          <Circle className="h-4 w-4 text-green-500" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-red-500" />
                        )}
                        <span className="capitalize">{task.status}</span>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {task.tags.slice(0,3).map((tag) => ( // Show max 3 tags for brevity
                          <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0.5 shadow-sm">{tag}</Badge>
                        ))}
                        {task.tags.length > 3 && <Badge variant="outline" className="text-xs px-1.5 py-0.5 shadow-sm">+{task.tags.length - 3}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => onEditTask(task)} className="h-8 w-8 hover:bg-accent hover:text-accent-foreground" aria-label={`Edit task ${task.entity_name}`}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => onDeleteTask(task.id)} className="h-8 w-8" aria-label={`Delete task ${task.entity_name}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
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

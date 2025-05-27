
"use client";

import type { ReactNode } from "react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Task, TaskFormInput, TaskFormInputSchema, taskTypeOptions, TaskTypeEnum, TaskType } from "@/lib/schemas";
import { suggestTaskTagsAction } from "@/lib/actions";
import { AlertCircle, Loader2, Sparkles, XIcon, CalendarIcon, Phone, Mail, Users, Reply, Bell, ClipboardList } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TaskFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitTask: (task: Task) => void;
  initialData?: Task | null;
}

const taskTypeIconMap: Record<TaskType, React.ElementType> = {
  "Call": Phone,
  "Email": Mail,
  "Meeting": Users,
  "Follow-up": Reply,
  "Reminder": Bell,
  "Other": ClipboardList,
};


export function TaskFormDialog({
  isOpen,
  onOpenChange,
  onSubmitTask,
  initialData,
}: TaskFormDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<TaskFormInput>({
    resolver: zodResolver(TaskFormInputSchema),
    defaultValues: initialData
      ? {
          entity_name: initialData.entity_name,
          date_created: new Date(initialData.date_created),
          task_type: initialData.task_type,
          task_time: initialData.task_time,
          contact_person: initialData.contact_person,
          phone_number: initialData.phone_number || "",
          note: initialData.note || "",
        }
      : {
          entity_name: "",
          date_created: new Date(),
          task_type: taskTypeOptions[0].value, // Default to "Call"
          task_time: "",
          contact_person: "",
          phone_number: "",
          note: "",
        },
  });

  const [currentTags, setCurrentTags] = useState<string[]>(initialData?.tags || []);
  const [suggestedAiTags, setSuggestedAiTags] = useState<string[]>([]);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);
  const [tagSuggestionError, setTagSuggestionError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) { // Reset form only when dialog opens
      if (initialData) {
        form.reset({
          entity_name: initialData.entity_name,
          date_created: new Date(initialData.date_created),
          task_type: initialData.task_type,
          task_time: initialData.task_time,
          contact_person: initialData.contact_person,
          phone_number: initialData.phone_number || "",
          note: initialData.note || "",
        });
        setCurrentTags(initialData.tags || []);
      } else {
        form.reset({
          entity_name: "",
          date_created: new Date(),
          task_type: taskTypeOptions[0].value,
          task_time: "",
          contact_person: "",
          phone_number: "",
          note: "",
        });
        setCurrentTags([]);
      }
      setSuggestedAiTags([]);
      setTagSuggestionError(null);
    }
  }, [initialData, form, isOpen]);


  const handleSuggestTags = async () => {
    const noteValue = form.getValues("note");
    if (!noteValue || noteValue.trim() === "") {
      toast({
        title: "Note Required",
        description: "Please enter a note/description to suggest tags.",
        variant: "destructive",
      });
      return;
    }
    setIsSuggestingTags(true);
    setTagSuggestionError(null);
    try {
      const result = await suggestTaskTagsAction({ taskDescription: noteValue });
      setSuggestedAiTags(result.tags);
      setCurrentTags(prevTags => Array.from(new Set([...prevTags, ...result.tags])));
      toast({
        title: "Tags Suggested",
        description: "AI has suggested tags based on your note.",
      });
    } catch (error) {
      console.error("Failed to suggest tags:", error);
      setTagSuggestionError(error instanceof Error ? error.message : "An unknown error occurred.");
      toast({
        title: "Error Suggesting Tags",
        description: "Could not suggest tags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSuggestingTags(false);
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter(tag => tag !== tagToRemove));
  };

  const onSubmit = (data: TaskFormInput) => {
    const taskToSubmit: Task = {
      id: initialData?.id || uuidv4(),
      date_created: data.date_created.toISOString(),
      status: initialData?.status || "open",
      entity_name: data.entity_name,
      task_type: data.task_type,
      task_time: data.task_time,
      contact_person: data.contact_person,
      phone_number: data.phone_number,
      note: data.note,
      tags: currentTags,
    };
    onSubmitTask(taskToSubmit);
    toast({
      title: initialData ? "Task Updated" : "Task Created",
      description: `Task "${data.entity_name}" has been successfully ${initialData ? 'updated' : 'saved'}.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-card shadow-xl rounded-lg max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {initialData ? "Edit Task" : "Create New Task"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-grow overflow-y-auto pr-4 pt-1 pb-1 mt-4 mb-4">
            <FormField
              control={form.control}
              name="entity_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entity Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Alpha Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date_created"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="task_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time (HH:MM)</FormLabel>
                    <FormControl>
                      <Input type="time" placeholder="e.g., 14:30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="task_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a task type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., +1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note / Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add a note or description for the task..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Tags</FormLabel>
                <Button
                  type="button"
                  onClick={handleSuggestTags}
                  variant="outline"
                  size="sm"
                  disabled={isSuggestingTags}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isSuggestingTags ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Suggest Tags
                </Button>
              </div>
              {tagSuggestionError && (
                 <Alert variant="destructive">
                   <AlertCircle className="h-4 w-4" />
                   <AlertTitle>Error</AlertTitle>
                   <AlertDescription>{tagSuggestionError}</AlertDescription>
                 </Alert>
              )}
              <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border rounded-md bg-background">
                {currentTags.length > 0 ? (
                  currentTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="py-1 px-2 text-sm shadow-sm">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1.5 p-0.5 rounded-full hover:bg-muted-foreground/20"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <XIcon className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No tags added yet. Use "Suggest Tags".</p>
                )}
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form={form.control.name} className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={form.handleSubmit(onSubmit)} // Ensure submit is triggered
          >
            {initialData ? "Save Changes" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

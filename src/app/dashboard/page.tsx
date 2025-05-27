
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TaskFormDialog } from "@/components/dashboard/task-form-dialog";
import { TaskListTable } from "@/components/dashboard/task-list-table";
import useLocalStorage from "@/hooks/use-local-storage";
import { Task, TaskStatus, TaskType } from "@/lib/schemas";
import { PlusCircle, ListChecks } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const initialTasks: Task[] = [
  {
    id: 'aa2c69a3-9269-4a68-9196-11b509c9ef8a',
    date_created: new Date(Date.UTC(2023, 10, 15, 10, 0)).toISOString(), 
    entity_name: 'Alpha Corp',
    task_type: 'Call' as TaskType, // Updated
    task_time: '14:30',
    contact_person: 'John Doe',
    phone_number: '+1-555-0101',
    note: 'Discuss Q4 proposal and new service offerings. Emphasize cost-saving benefits and scalability of our platform. Prepare answers for potential questions regarding integration with their existing CRM.',
    status: 'open',
    tags: ['sales', 'q4', 'proposal', 'crm integration'],
  },
  {
    id: 'bbd8e7a2-3e7e-4f9f-8e2c-5a8d9a2e1f7b',
    date_created: new Date(Date.UTC(2023, 10, 16, 11, 30)).toISOString(),
    entity_name: 'Beta Inc',
    task_type: 'Meeting' as TaskType, // Updated
    task_time: '09:00',
    contact_person: 'Jane Smith',
    phone_number: '+1-555-0102',
    note: 'Prepare presentation slides for the new project kickoff. Include timeline, key deliverables, and team member roles. Double-check budget allocation figures.',
    status: 'open',
    tags: ['project kickoff', 'presentation', 'budget'],
  },
  {
    id: 'ccf0c3b5-1d8a-4a9a-9c3a-3b5e7f1a9e2d',
    date_created: new Date(Date.UTC(2023, 10, 14, 15, 0)).toISOString(),
    entity_name: 'Gamma LLC',
    task_type: 'Other' as TaskType, // Updated
    task_time: '16:00',
    contact_person: 'Peter Jones',
    // No phone number for this one to show optionality
    note: 'Review the updated terms and conditions in the client contract. Pay close attention to liability clauses and payment schedules. Consult legal if any ambiguity.',
    status: 'closed',
    tags: ['legal', 'contract', 'terms'],
  },
];


export default function DashboardPage() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", initialTasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);


  const handleOpenFormForCreate = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleOpenFormForEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleSubmitTask = (taskData: Task) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === taskData.id ? taskData : t)));
    } else {
      setTasks([taskData, ...tasks]);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDeleteId(taskId);
  };

  const confirmDeleteTask = () => {
    if (taskToDeleteId) {
      setTasks(tasks.filter((t) => t.id !== taskToDeleteId));
      toast({
        title: "Task Deleted",
        description: "The task has been successfully deleted.",
      });
      setTaskToDeleteId(null);
    }
  };

  const handleToggleStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "open" ? "closed" : ("open" as TaskStatus) }
          : task
      )
    );
    toast({
      title: "Status Updated",
      description: "Task status has been toggled.",
    });
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <ListChecks className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-background min-h-screen">
      <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-bold text-primary flex items-center">
          <ListChecks className="mr-3 h-10 w-10" />
          TaskBoard
        </h1>
        <Button onClick={handleOpenFormForCreate} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md px-6 py-3 text-lg rounded-lg">
          <PlusCircle className="mr-2 h-5 w-5" /> Create New Task
        </Button>
      </header>

      <main>
        <TaskListTable
          tasks={tasks}
          onEditTask={handleOpenFormForEdit}
          onDeleteTask={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
        />
      </main>

      <TaskFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmitTask={handleSubmitTask}
        initialData={editingTask}
      />

      <AlertDialog open={!!taskToDeleteId} onOpenChange={() => setTaskToDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this task?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTaskToDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

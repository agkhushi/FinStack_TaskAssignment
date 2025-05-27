import { z } from 'zod';

export const TaskStatusEnum = z.enum(["open", "closed"]);
export type TaskStatus = z.infer<typeof TaskStatusEnum>;

export const TaskSchema = z.object({
  id: z.string().uuid(),
  date_created: z.string(), // Storing as ISO string from new Date().toISOString()
  entity_name: z.string().min(1, "Entity name is required"),
  task_type: z.string().min(1, "Task type is required"),
  task_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM) e.g., 14:30"),
  contact_person: z.string().min(1, "Contact person is required"),
  note: z.string().optional(),
  status: TaskStatusEnum,
  tags: z.array(z.string()),
});

export type Task = z.infer<typeof TaskSchema>;

// Schema for the form data when creating/editing a task
export const TaskFormInputSchema = z.object({
  entity_name: z.string().min(1, "Entity name is required").max(100, "Entity name too long"),
  task_type: z.string().min(1, "Task type is required").max(50, "Task type too long"),
  task_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM) e.g., 14:30"),
  contact_person: z.string().min(1, "Contact person is required").max(100, "Contact person too long"),
  note: z.string().max(500, "Note is too long").optional(),
});

export type TaskFormInput = z.infer<typeof TaskFormInputSchema>;

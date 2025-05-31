import { z } from 'zod';

export const TaskStatusEnum = z.enum(["open", "closed"]);
export type TaskStatus = z.infer<typeof TaskStatusEnum>;

export const taskTypeOptions = [
  { value: "Call", label: "Call" },
  { value: "Email", label: "Email" },
  { value: "Meeting", label: "Meeting" },
  { value: "Follow-up", label: "Follow-up" },
  { value: "Reminder", label: "Reminder" },
  { value: "Other", label: "Other" },
] as const;

const taskTypeValues = taskTypeOptions.map(opt => opt.value) as [string, ...string[]];
export const TaskTypeEnum = z.enum(taskTypeValues);
export type TaskType = z.infer<typeof TaskTypeEnum>;

export const TaskSchema = z.object({
  id: z.string().uuid(),
  date_created: z.string(), // Storing as ISO string
  entity_name: z.string().min(1, "Entity name is required"),
  task_type: TaskTypeEnum,
  task_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM) e.g., 14:30"),
  contact_person: z.string().min(1, "Contact person is required"),
  phone_number: z.string().max(20, "Phone number too long").optional(),
  note: z.string().optional(),
  status: TaskStatusEnum,
  tags: z.array(z.string()),
});

export type Task = z.infer<typeof TaskSchema>;

// Schema for the form data when creating/editing a task
export const TaskFormInputSchema = z.object({
  entity_name: z.string().min(1, "Entity name is required").max(100, "Entity name too long"),
  date_created: z.date({ required_error: "Task date is required." }),
  task_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM) e.g., 14:30"),
  task_type: TaskTypeEnum,
  contact_person: z.string().min(1, "Contact person is required").max(100, "Contact person too long"),
  phone_number: z.string().max(20, "Phone number too long").optional().default(""),
  note: z.string().max(500, "Note is too long").optional().default(""),
});

export type TaskFormInput = z.infer<typeof TaskFormInputSchema>;

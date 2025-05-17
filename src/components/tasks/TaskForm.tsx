
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { useTasks } from "@/contexts/TaskContext";
import { Task } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const weekdays = [
  { label: "Sunday", value: 0 },
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
];

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z.enum(["low", "medium", "high"]),
  category: z.string().min(1, { message: "Category is required" }),
  isRoutine: z.boolean().default(false),
  routineFrequency: z.enum(["daily", "weekly", "monthly", "custom"]).optional(),
  routineDays: z.array(z.number()).optional(),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TaskFormProps {
  onSubmit: () => void;
  taskToEdit?: Task;
}

export function TaskForm({ onSubmit, taskToEdit }: TaskFormProps) {
  const { addTask, updateTask } = useTasks();
  const isEditing = !!taskToEdit;
  const [isRoutine, setIsRoutine] = useState(taskToEdit?.isRoutine || false);
  
  const defaultValues: Partial<FormData> = {
    title: taskToEdit?.title || "",
    description: taskToEdit?.description || "",
    dueDate: taskToEdit?.dueDate ? new Date(taskToEdit.dueDate) : undefined,
    priority: taskToEdit?.priority || "medium",
    category: taskToEdit?.category || "Personal",
    isRoutine: taskToEdit?.isRoutine || false,
    routineFrequency: taskToEdit?.routineFrequency || "daily",
    routineDays: taskToEdit?.routineDays || [],
    tags: taskToEdit?.tags?.join(", ") || "",
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: FormData) => {
    const tags = data.tags
      ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean)
      : [];

    const taskData = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      category: data.category,
      completed: taskToEdit?.completed || false,
      isRoutine: data.isRoutine,
      routineFrequency: data.isRoutine ? data.routineFrequency : undefined,
      routineDays: data.isRoutine && data.routineFrequency === "weekly" ? data.routineDays : undefined,
      tags,
    };

    if (isEditing && taskToEdit) {
      updateTask(taskToEdit.id, taskData);
    } else {
      addTask(taskData);
    }

    onSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Add details about this task" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date (Optional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
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
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Family">Family</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isRoutine"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Routine Task</FormLabel>
                <FormDescription>
                  Mark if this is a repeating task
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    setIsRoutine(checked);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {isRoutine && (
          <>
            <FormField
              control={form.control}
              name="routineFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("routineFrequency") === "weekly" && (
              <FormField
                control={form.control}
                name="routineDays"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Repeat on days</FormLabel>
                      <FormDescription>
                        Select the days when this task should repeat
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {weekdays.map((day) => (
                        <FormField
                          key={day.value}
                          control={form.control}
                          name="routineDays"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={day.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(day.value)}
                                    onCheckedChange={(checked) => {
                                      const updatedDays = checked
                                        ? [...(field.value || []), day.value]
                                        : (field.value || []).filter(
                                            (value) => value !== day.value
                                          );
                                      field.onChange(updatedDays);
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {day.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </>
        )}

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter tags separated by commas" {...field} />
              </FormControl>
              <FormDescription>
                E.g. "work, meeting, client"
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onSubmit}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

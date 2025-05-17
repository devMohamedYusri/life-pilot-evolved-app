
import { useState } from "react";
import { format } from "date-fns";
import { Task } from "@/types";
import { useTasks } from "@/contexts/TaskContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Edit,
  Trash2,
  MoreVertical,
  Repeat,
  Tag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "./TaskForm";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { completeTask, deleteTask } = useTasks();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const priorityClass = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const handleComplete = () => {
    completeTask(task.id);
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className={`border rounded-lg p-4 ${task.completed ? 'bg-muted/30' : 'bg-card'}`}>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 rounded border-gray-300 focus:ring-2 focus:ring-primary"
            checked={task.completed}
            onChange={handleComplete}
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`font-medium truncate ${
                task.completed ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.title}
            </h3>
          </div>
          
          <Badge className={priorityClass[task.priority]}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {task.description && (
          <p className={`mt-2 text-sm ${task.completed ? "text-muted-foreground" : "text-foreground"}`}>
            {task.description}
          </p>
        )}
        
        <div className="mt-3 flex flex-wrap gap-2 items-center text-xs text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
            </div>
          )}
          
          {task.isRoutine && (
            <div className="flex items-center gap-1">
              <Repeat className="h-3 w-3" />
              <span>
                {task.routineFrequency === "daily"
                  ? "Daily"
                  : task.routineFrequency === "weekly"
                  ? "Weekly"
                  : task.routineFrequency === "monthly"
                  ? "Monthly"
                  : "Custom"}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="px-2 py-0 h-5">
              {task.category}
            </Badge>
          </div>
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <Tag className="h-3 w-3" />
              {task.tags.map((tag) => (
                <span key={tag} className="bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded text-[10px]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            onSubmit={() => setIsEditDialogOpen(false)}
            taskToEdit={task}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

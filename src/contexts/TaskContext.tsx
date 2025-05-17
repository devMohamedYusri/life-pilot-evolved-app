
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '@/types';
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string) => void;
  getTodaysTasks: () => Task[];
  getTasksByCategory: (category: string) => Task[];
  getRoutineTasks: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize with some sample tasks
  useEffect(() => {
    // Check for tasks in localStorage
    const storedTasks = localStorage.getItem('lifepilot_tasks');
    
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        // Convert string dates back to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error('Failed to parse stored tasks:', error);
        localStorage.removeItem('lifepilot_tasks');
        initializeWithSampleTasks();
      }
    } else {
      initializeWithSampleTasks();
    }
    
    setIsLoading(false);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0 && !isLoading) {
      localStorage.setItem('lifepilot_tasks', JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  const initializeWithSampleTasks = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    const sampleTasks: Task[] = [
      {
        id: uuidv4(),
        title: 'Complete project proposal',
        description: 'Finish the draft and send for review',
        dueDate: today,
        completed: false,
        createdAt: new Date(today.setHours(today.getHours() - 2)),
        priority: 'high',
        category: 'Work',
        tags: ['project', 'urgent']
      },
      {
        id: uuidv4(),
        title: 'Morning meditation',
        description: '10 minute mindfulness session',
        completed: false,
        createdAt: new Date(today.setHours(today.getHours() - 5)),
        priority: 'medium',
        category: 'Health',
        isRoutine: true,
        routineFrequency: 'daily'
      },
      {
        id: uuidv4(),
        title: 'Grocery shopping',
        description: 'Buy ingredients for the week',
        dueDate: tomorrow,
        completed: false,
        createdAt: new Date(today.setHours(today.getHours() - 1)),
        priority: 'low',
        category: 'Personal'
      }
    ];
    
    setTasks(sampleTasks);
    localStorage.setItem('lifepilot_tasks', JSON.stringify(sampleTasks));
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    
    toast({
      title: "Task created",
      description: `${newTask.title} has been added to your tasks.`,
    });
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );
    
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: "Your task has been deleted.",
    });
  };

  const completeTask = (id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
    
    toast({
      title: "Task completed",
      description: "Great job completing your task!",
    });
  };

  const getTodaysTasks = (): Task[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return tasks.filter(task => {
      // Include routine daily tasks
      if (task.isRoutine && task.routineFrequency === 'daily') {
        return true;
      }
      
      // Include weekly routines that match today's day of week
      if (
        task.isRoutine && 
        task.routineFrequency === 'weekly' && 
        task.routineDays?.includes(today.getDay())
      ) {
        return true;
      }
      
      // Include tasks due today
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate.getTime() === today.getTime();
      }
      
      return false;
    });
  };

  const getTasksByCategory = (category: string): Task[] => {
    return tasks.filter(task => task.category === category);
  };

  const getRoutineTasks = (): Task[] => {
    return tasks.filter(task => task.isRoutine);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        getTodaysTasks,
        getTasksByCategory,
        getRoutineTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};


import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Filter } from "lucide-react";
import { useTasks } from "@/contexts/TaskContext";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskForm } from "@/components/tasks/TaskForm";

export default function Tasks() {
  const { tasks, getTodaysTasks, getRoutineTasks } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const todaysTasks = getTodaysTasks();
  const routineTasks = getRoutineTasks();
  const allTasks = tasks;

  const getFilteredTasks = (taskList: typeof tasks) => {
    return taskList
      .filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      )
      .filter(task =>
        filterCategory === "all" || task.category === filterCategory
      )
      .filter(task =>
        filterPriority === "all" || task.priority === filterPriority
      );
  };

  const filteredToday = getFilteredTasks(todaysTasks);
  const filteredRoutines = getFilteredTasks(routineTasks);
  const filteredAll = getFilteredTasks(allTasks);

  const categories = ["all", ...Array.from(new Set(tasks.map(task => task.category)))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">
              Manage and organize your tasks
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
              </DialogHeader>
              <TaskForm onSubmit={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tasks..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[160px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>{filterCategory === "all" ? "All Categories" : filterCategory}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[160px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>{filterPriority === "all" ? "All Priorities" : filterPriority}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">Today ({filteredToday.length})</TabsTrigger>
            <TabsTrigger value="routines">Routines ({filteredRoutines.length})</TabsTrigger>
            <TabsTrigger value="all">All Tasks ({filteredAll.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            {filteredToday.length > 0 ? (
              <>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold">Incomplete</h2>
                  <div className="space-y-2">
                    {filteredToday
                      .filter(task => !task.completed)
                      .map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                  </div>
                </div>
                
                {filteredToday.some(task => task.completed) && (
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Completed</h2>
                    <div className="space-y-2">
                      {filteredToday
                        .filter(task => task.completed)
                        .map(task => (
                          <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tasks found for today</p>
                <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Task
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="routines" className="space-y-4">
            {filteredRoutines.length > 0 ? (
              <div className="space-y-2">
                {filteredRoutines.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No routine tasks found</p>
                <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Routine
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {filteredAll.length > 0 ? (
              <div className="space-y-2">
                {filteredAll.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No tasks found</p>
                <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Task
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

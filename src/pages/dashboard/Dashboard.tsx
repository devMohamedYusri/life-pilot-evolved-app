
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, BarChart, BookOpen, Calendar, Plus, ArrowRight } from "lucide-react";
import { useTasks } from "@/contexts/TaskContext";
import { useJournal } from "@/contexts/JournalContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, getTodaysTasks } = useTasks();
  const { entries } = useJournal();
  const navigate = useNavigate();

  const todaysTasks = getTodaysTasks();
  const completedTasks = todaysTasks.filter(task => task.completed);
  const completionRate = todaysTasks.length > 0
    ? Math.round((completedTasks.length / todaysTasks.length) * 100)
    : 0;

  const todaysDate = format(new Date(), "EEEE, MMMM d, yyyy");
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  const recentJournalEntries = [...entries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{greeting()}, {user?.firstName}</h1>
          <p className="text-muted-foreground">{todaysDate}</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedTasks.length}/{todaysTasks.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {completionRate}% completion rate
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/dashboard/tasks")}
                >
                  View Tasks
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Journaling Streak</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 days</div>
              <p className="text-xs text-muted-foreground">
                Last entry: {entries.length > 0 ? format(new Date(entries[0].createdAt), "MMM d") : "No entries yet"}
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/dashboard/journal")}
                >
                  Open Journal
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 events</div>
              <p className="text-xs text-muted-foreground">
                In the next 7 days
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/dashboard/planning")}
                >
                  View Calendar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Weekly Stats</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
              <p className="text-xs text-muted-foreground">
                Productivity score
              </p>
              <div className="mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => navigate("/dashboard/stats")}
                >
                  View Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Today's Tasks ({todaysTasks.length})</CardTitle>
              <CardDescription>Your tasks for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {todaysTasks.length > 0 ? (
                todaysTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded-sm border border-primary"
                        checked={task.completed}
                        readOnly
                      />
                    </div>
                    <span className={task.completed ? "line-through text-muted-foreground" : ""}>{task.title}</span>
                    {task.priority === 'high' && (
                      <span className="ml-auto rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-500">
                        High
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No tasks for today</p>
                  <Button 
                    className="mt-2" 
                    size="sm"
                    onClick={() => navigate("/dashboard/tasks")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                  </Button>
                </div>
              )}
              
              {todaysTasks.length > 5 && (
                <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/dashboard/tasks")}>
                  View all tasks <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Journal Entries</CardTitle>
              <CardDescription>Your latest reflections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentJournalEntries.length > 0 ? (
                recentJournalEntries.map(entry => (
                  <div key={entry.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{entry.title}</h3>
                      {entry.mood && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          Mood: {entry.mood}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {entry.content.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(entry.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No journal entries yet</p>
                  <Button 
                    className="mt-2" 
                    size="sm"
                    onClick={() => navigate("/dashboard/journal")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Write Entry
                  </Button>
                </div>
              )}
              
              <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/dashboard/journal")}>
                View all entries <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
